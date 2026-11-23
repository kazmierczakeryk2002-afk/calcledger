import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_CONFIG, isAdsenseActive, getAdsensePublisherId } from '../src/config.js';
import { ROUTES, getRoutePath, getAbsoluteUrl, getHreflangAlternates } from '../src/data/routes.js';
import { VAT_COUNTRIES } from '../src/data/vat-countries.js';
import { MARKETPLACES } from '../src/data/marketplaces.js';

import { renderHomePage, renderNotFoundPage } from '../src/templates/home.js';
import { renderVatPage } from '../src/templates/vat.js';
import { renderMarketplacePage } from '../src/templates/marketplace.js';
import { renderMarginPage } from '../src/templates/margin.js';
import { renderFreelancePage } from '../src/templates/freelance.js';
import { renderCompoundPage } from '../src/templates/compound.js';
import { renderLegalPage } from '../src/templates/legal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SRC_ASSETS = path.join(ROOT, 'src', 'assets');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDirRecursive(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function writeRouteHtml(routePath, html) {
  const clean = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  const outDir = clean ? path.join(DIST, clean) : DIST;
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
}

function generateSitemapXml() {
  const entries = [];
  const pageKeys = Object.keys(ROUTES);

  for (const pageKey of pageKeys) {
    const alternates = getHreflangAlternates(pageKey);
    const priority =
      pageKey === 'home'
        ? '1.0'
        : ['vat', 'marketplace', 'margin', 'freelance', 'compound'].includes(pageKey)
          ? '0.9'
          : pageKey.startsWith('vat:') || pageKey.startsWith('marketplace:')
            ? '0.8'
            : '0.5';

    for (const lang of SITE_CONFIG.languages) {
      const loc = getAbsoluteUrl(pageKey, lang);
      const xhtmlLinks = alternates
        .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`)
        .join('\n');

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${SITE_CONFIG.buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
${xhtmlLinks}
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_CONFIG.domain}/sitemap.xml
`;
}

function generateAdsTxt() {
  if (isAdsenseActive()) {
    return `# CalcLedger Authorized Digital Sellers (${SITE_CONFIG.host})
google.com, ${getAdsensePublisherId()}, DIRECT, f08c47fec0942fa0
`;
  }
  return `# CalcLedger Authorized Digital Sellers (${SITE_CONFIG.host})
# Configure adsenseClientId in src/config.js (e.g. 'ca-pub-1234567890123456') and run npm run build
# to automatically publish your live Google AdSense seller line below:
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
`;
}

function generateCloudflareHeaders() {
  return `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/sitemap.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600

/robots.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

/ads.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600
`;
}

function generateWebManifest() {
  return JSON.stringify(
    {
      name: 'CalcLedger — Financial & E-Commerce Calculators',
      short_name: 'CalcLedger',
      start_url: '/',
      display: 'standalone',
      background_color: '#F8F7F4',
      theme_color: '#0F5C48',
      icons: [
        {
          src: '/assets/img/favicon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
        },
      ],
    },
    null,
    2
  );
}

function build() {
  const startMs = Date.now();
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);

  // Copy static assets
  copyDirRecursive(SRC_ASSETS, path.join(DIST, 'assets'));

  let pageCount = 0;

  for (const lang of SITE_CONFIG.languages) {
    // 1. Home
    writeRouteHtml(getRoutePath('home', lang), renderHomePage(lang));
    pageCount++;

    // 2. VAT Main + 9 Country Programmatic SEO Subpages
    writeRouteHtml(getRoutePath('vat', lang), renderVatPage(lang, null));
    pageCount++;
    for (const country of VAT_COUNTRIES) {
      writeRouteHtml(getRoutePath(`vat:${country.key}`, lang), renderVatPage(lang, country));
      pageCount++;
    }

    // 3. Marketplace Main + 6 Platform Programmatic SEO Subpages
    writeRouteHtml(getRoutePath('marketplace', lang), renderMarketplacePage(lang, null));
    pageCount++;
    for (const mp of MARKETPLACES) {
      writeRouteHtml(getRoutePath(`marketplace:${mp.key}`, lang), renderMarketplacePage(lang, mp));
      pageCount++;
    }

    // 4. Margin & Markup
    writeRouteHtml(getRoutePath('margin', lang), renderMarginPage(lang));
    pageCount++;

    // 5. Freelance Rate (B2B)
    writeRouteHtml(getRoutePath('freelance', lang), renderFreelancePage(lang));
    pageCount++;

    // 6. Compound Interest & ROI
    writeRouteHtml(getRoutePath('compound', lang), renderCompoundPage(lang));
    pageCount++;

    // 7. Legal / AdSense Compliance Pages
    for (const legalType of ['about', 'privacy', 'terms', 'contact']) {
      writeRouteHtml(getRoutePath(legalType, lang), renderLegalPage(lang, legalType));
      pageCount++;
    }
  }

  // 404 Page
  fs.writeFileSync(path.join(DIST, '404.html'), renderNotFoundPage('en'), 'utf8');

  // Technical SEO & Cloudflare Pages Files
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), generateSitemapXml(), 'utf8');
  fs.writeFileSync(path.join(DIST, 'robots.txt'), generateRobotsTxt(), 'utf8');
  fs.writeFileSync(path.join(DIST, 'ads.txt'), generateAdsTxt(), 'utf8');
  fs.writeFileSync(path.join(DIST, '_headers'), generateCloudflareHeaders(), 'utf8');
  fs.writeFileSync(path.join(DIST, 'site.webmanifest'), generateWebManifest(), 'utf8');

  const elapsed = Date.now() - startMs;
  console.log(`CalcLedger build complete: ${pageCount} localized HTML pages + 404 + SEO files generated in dist/ (${elapsed}ms).`);
}

build();
