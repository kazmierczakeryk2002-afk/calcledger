import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_CONFIG } from '../src/config.js';
import { ROUTES, getRoutePath, getAbsoluteUrl } from '../src/data/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function routeToFile(routePath) {
  const clean = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  return clean ? path.join(DIST, clean, 'index.html') : path.join(DIST, 'index.html');
}

function extractTag(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}

function extractAllMatches(html, regex) {
  const out = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    out.push(m);
  }
  return out;
}

function checkInternalHref(href, sourceLabel) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http://') || href.startsWith('https://')) {
    return;
  }
  const cleanPath = href.split('?')[0].split('#')[0];
  if (!cleanPath.startsWith('/')) return;

  const trimmed = cleanPath.replace(/^\/+/, '');
  if (!trimmed) {
    if (!fs.existsSync(path.join(DIST, 'index.html'))) {
      fail(`${sourceLabel}: broken internal link "${href}"`);
    }
    return;
  }

  const directFile = path.join(DIST, trimmed);
  const indexFile = path.join(DIST, trimmed.replace(/\/+$/, ''), 'index.html');
  if (!fs.existsSync(directFile) && !fs.existsSync(indexFile)) {
    fail(`${sourceLabel}: broken internal link "${href}"`);
  }
}

function runAudit() {
  if (!fs.existsSync(DIST)) {
    console.error('ERROR: dist/ directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // 1. Required technical SEO & GEO files
  const requiredFiles = [
    'sitemap.xml',
    'robots.txt',
    'ads.txt',
    'llms.txt',
    'llms-full.txt',
    '_headers',
    '404.html',
    'site.webmanifest',
    'assets/css/styles.css',
    'assets/js/app.js',
    'assets/js/calculators.js',
    'assets/img/favicon.svg',
  ];

  for (const rel of requiredFiles) {
    if (!fs.existsSync(path.join(DIST, rel))) {
      fail(`Missing required output file: dist/${rel}`);
    }
  }

  const seenTitles = new Map();
  const seenDescs = new Map();
  const hreflangGraph = new Map();
  const expectedCanonicals = new Set();

  let auditedPages = 0;
  let totalJsonLdBlocks = 0;

  for (const pageKey of Object.keys(ROUTES)) {
    for (const lang of SITE_CONFIG.languages) {
      const routePath = getRoutePath(pageKey, lang);
      const expectedCanonical = getAbsoluteUrl(pageKey, lang);
      expectedCanonicals.add(expectedCanonical);

      const filePath = routeToFile(routePath);
      const label = `${lang}:${routePath}`;

      if (!fs.existsSync(filePath)) {
        fail(`${label}: HTML file not generated at ${filePath}`);
        continue;
      }

      const html = fs.readFileSync(filePath, 'utf8');
      auditedPages++;

      // html lang
      const htmlLang = extractTag(html, /<html\s+lang="([^"]+)"/i);
      if (htmlLang !== lang) {
        fail(`${label}: <html lang="${htmlLang}"> does not match expected "${lang}"`);
      }

      // title
      const rawTitle = extractTag(html, /<title>([^<]+)<\/title>/i);
      const title = rawTitle.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      if (!title) {
        fail(`${label}: missing <title>`);
      } else {
        if (title.length < 25 || title.length > 70) {
          warn(`${label}: <title> length ${title.length} chars ("${title}")`);
        }
        if (seenTitles.has(title)) {
          fail(`${label}: duplicate <title> also used on ${seenTitles.get(title)}`);
        } else {
          seenTitles.set(title, label);
        }
      }

      // meta description
      const rawDesc = extractTag(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
      const desc = rawDesc.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      if (!desc) {
        fail(`${label}: missing <meta name="description">`);
      } else {
        if (desc.length < 70 || desc.length > 165) {
          warn(`${label}: meta description length ${desc.length} chars`);
        }
        if (seenDescs.has(desc)) {
          fail(`${label}: duplicate meta description also used on ${seenDescs.get(desc)}`);
        } else {
          seenDescs.set(desc, label);
        }
      }

      // Exactly 1 <h1>
      const h1Count = extractAllMatches(html, /<h1[\s>]/gi).length;
      if (h1Count !== 1) {
        fail(`${label}: expected exactly 1 <h1>, found ${h1Count}`);
      }

      // Canonical
      const canonical = extractTag(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
      if (canonical !== expectedCanonical) {
        fail(`${label}: canonical "${canonical}" !== expected "${expectedCanonical}"`);
      }

      // Full hreflang matrix
      const alternates = {};
      for (const m of extractAllMatches(html, /<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)) {
        alternates[m[1]] = m[2];
      }
      for (const reqLang of ['en', 'de', 'pl', 'x-default']) {
        if (!alternates[reqLang]) {
          fail(`${label}: missing hreflang="${reqLang}"`);
        }
      }
      if (alternates[lang] !== expectedCanonical) {
        fail(`${label}: self hreflang="${lang}" (${alternates[lang]}) !== canonical (${expectedCanonical})`);
      }
      if (alternates['x-default'] !== getAbsoluteUrl(pageKey, 'en')) {
        fail(`${label}: x-default (${alternates['x-default']}) !== EN URL`);
      }
      hreflangGraph.set(expectedCanonical, alternates);

      // Consent Mode v2 default script
      if (!html.includes("gtag('consent', 'default'")) {
        fail(`${label}: missing Google Consent Mode v2 default script in <head>`);
      }

      // JSON-LD parsing & schema verification
      const jsonLdMatches = extractAllMatches(
        html,
        /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi
      );
      const typesFound = new Set();
      for (const m of jsonLdMatches) {
        totalJsonLdBlocks++;
        try {
          const parsed = JSON.parse(m[1]);
          if (parsed['@type']) typesFound.add(parsed['@type']);
        } catch (err) {
          fail(`${label}: invalid JSON-LD block (${err.message})`);
        }
      }

      const isHome = pageKey === 'home';
      const isLegal = ['about', 'privacy', 'terms', 'contact'].includes(pageKey);
      const isCalc = !isHome && !isLegal;

      if (isHome) {
        if (!typesFound.has('WebSite')) fail(`${label}: missing WebSite JSON-LD`);
        if (!typesFound.has('FAQPage')) fail(`${label}: missing FAQPage JSON-LD`);
      } else if (isCalc) {
        if (!typesFound.has('SoftwareApplication')) fail(`${label}: missing SoftwareApplication JSON-LD`);
        if (!typesFound.has('FAQPage')) fail(`${label}: missing FAQPage JSON-LD`);
        if (!typesFound.has('BreadcrumbList')) fail(`${label}: missing BreadcrumbList JSON-LD`);
      } else if (isLegal) {
        if (!typesFound.has('BreadcrumbList')) fail(`${label}: missing BreadcrumbList JSON-LD`);
      }

      // Check internal links
      for (const m of extractAllMatches(html, /href="([^"]+)"/gi)) {
        checkInternalHref(m[1], label);
      }
    }
  }

  // Verify bi-directional hreflang symmetry
  for (const [url, alts] of hreflangGraph.entries()) {
    for (const targetLang of ['en', 'de', 'pl']) {
      const targetUrl = alts[targetLang];
      const backAlts = hreflangGraph.get(targetUrl);
      if (!backAlts) {
        fail(`Hreflang target not found in generated pages: ${targetUrl} (referenced by ${url})`);
        continue;
      }
      const backHasSelf = Object.values(backAlts).includes(url);
      if (!backHasSelf) {
        fail(`Non-reciprocal hreflang: ${url} links to ${targetUrl}, but target does not link back`);
      }
    }
  }

  // Validate sitemap.xml
  const sitemapPath = path.join(DIST, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
      fail('sitemap.xml: missing xmlns:xhtml namespace');
    }
    const locs = extractAllMatches(sitemap, /<loc>([^<]+)<\/loc>/g).map((m) => m[1]);
    if (locs.length !== expectedCanonicals.size) {
      fail(`sitemap.xml: expected ${expectedCanonicals.size} <loc> entries, found ${locs.length}`);
    }
    for (const url of expectedCanonicals) {
      if (!locs.includes(url)) {
        fail(`sitemap.xml: missing canonical URL ${url}`);
      }
    }
    const xhtmlCount = extractAllMatches(sitemap, /<xhtml:link\s+rel="alternate"/g).length;
    if (xhtmlCount !== expectedCanonicals.size * 4) {
      fail(`sitemap.xml: expected ${expectedCanonicals.size * 4} xhtml:link entries, found ${xhtmlCount}`);
    }
  }

  // Validate robots.txt & _headers
  const robotsPath = path.join(DIST, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    if (!robots.includes(`Sitemap: ${SITE_CONFIG.domain}/sitemap.xml`)) {
      fail('robots.txt: missing Sitemap directive');
    }
  }

  const headersPath = path.join(DIST, '_headers');
  if (fs.existsSync(headersPath)) {
    const headers = fs.readFileSync(headersPath, 'utf8');
    if (!headers.includes('X-Content-Type-Options: nosniff')) {
      fail('_headers: missing security headers');
    }
  }

  // Report
  console.log('============================================================');
  console.log('CalcLedger SEO & Technical Audit Report');
  console.log('============================================================');
  console.log(`Audited HTML pages : ${auditedPages}`);
  console.log(`Unique titles      : ${seenTitles.size}/${auditedPages}`);
  console.log(`Unique descriptions: ${seenDescs.size}/${auditedPages}`);
  console.log(`JSON-LD blocks     : ${totalJsonLdBlocks} (all parsed & validated)`);
  console.log(`Warnings           : ${warnings.length}`);
  console.log(`Errors             : ${errors.length}`);
  console.log('============================================================');

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    for (const w of warnings) console.log(`  [WARN] ${w}`);
  }

  if (errors.length > 0) {
    console.error('\nErrors:');
    for (const e of errors) console.error(`  [FAIL] ${e}`);
    process.exit(1);
  }

  console.log('\nPASS: All technical SEO, hreflang, JSON-LD, link, and AdSense/Consent checks succeeded.');
}

runAudit();
