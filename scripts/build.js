import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_CONFIG, isAdsenseActive, getAdsensePublisherId } from '../src/config.js';
import { ROUTES, getRoutePath, getAbsoluteUrl, getHreflangAlternates } from '../src/data/routes.js';
import { VAT_COUNTRIES } from '../src/data/vat-countries.js';
import { MARKETPLACES } from '../src/data/marketplaces.js';
import { PAYMENT_PROVIDERS } from '../src/data/payment-providers.js';
import { COMPARISONS } from '../src/data/comparisons.js';
import { SALARY_PRESETS, LOAN_PRESETS } from '../src/data/personal-presets.js';

import { renderHomePage, renderNotFoundPage } from '../src/templates/home.js';
import { renderVatPage } from '../src/templates/vat.js';
import { renderMarketplacePage } from '../src/templates/marketplace.js';
import { renderPaymentPage } from '../src/templates/payment.js';
import { renderComparePage } from '../src/templates/compare.js';
import { renderRoasPage } from '../src/templates/roas.js';
import { renderMarginPage } from '../src/templates/margin.js';
import { renderFreelancePage } from '../src/templates/freelance.js';
import { renderCompoundPage } from '../src/templates/compound.js';
import { renderLoanPage } from '../src/templates/loan.js';
import { renderSalaryPage } from '../src/templates/salary.js';
import { renderPercentagePage } from '../src/templates/percentage.js';
import { renderFuelPage } from '../src/templates/fuel.js';
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
        : ['vat', 'marketplace', 'payment', 'roas', 'margin', 'freelance', 'compound', 'loan', 'salary', 'percentage', 'fuel'].includes(pageKey)
          ? '0.9'
          : pageKey.startsWith('vat:') ||
              pageKey.startsWith('marketplace:') ||
              pageKey.startsWith('payment:') ||
              pageKey.startsWith('compare:') ||
              pageKey.startsWith('salary:') ||
              pageKey.startsWith('loan:')
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
  return `# CalcLedger (${SITE_CONFIG.domain}) — Search Engine & AI Search Crawler Policy
User-agent: *
Allow: /

# Explicitly welcome AI search & answer engine crawlers (GEO)
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE_CONFIG.domain}/sitemap.xml
`;
}

function generateLlmsTxt() {
  const vatLines = VAT_COUNTRIES.map(
    (c) =>
      `- [${c.names.en} VAT (${c.standardRate}% ${c.localTaxName})](${getAbsoluteUrl(`vat:${c.key}`, 'en')}): Standard ${c.standardRate}%, reduced ${c.reducedRates.join('%, ')}% (${c.currency}). Also in [DE](${getAbsoluteUrl(`vat:${c.key}`, 'de')}) and [PL](${getAbsoluteUrl(`vat:${c.key}`, 'pl')}).`
  ).join('\n');

  const mpLines = MARKETPLACES.map(
    (m) =>
      `- [${m.name} Fee & Profit Calculator](${getAbsoluteUrl(`marketplace:${m.key}`, 'en')}): ${m.feeSummary.en} Also in [DE](${getAbsoluteUrl(`marketplace:${m.key}`, 'de')}) and [PL](${getAbsoluteUrl(`marketplace:${m.key}`, 'pl')}).`
  ).join('\n');

  const payLines = PAYMENT_PROVIDERS.map(
    (p) =>
      `- [${p.name} Fee Calculator (Net & Reverse)](${getAbsoluteUrl(`payment:${p.key}`, 'en')}): ${p.feeSummary.en} Also in [DE](${getAbsoluteUrl(`payment:${p.key}`, 'de')}) and [PL](${getAbsoluteUrl(`payment:${p.key}`, 'pl')}).`
  ).join('\n');

  const cmpLines = COMPARISONS.map(
    (c) =>
      `- [${c.sideA.name} vs ${c.sideB.name} Comparison](${getAbsoluteUrl(`compare:${c.key}`, 'en')}): ${c.seo.en.summary} Also in [DE](${getAbsoluteUrl(`compare:${c.key}`, 'de')}) and [PL](${getAbsoluteUrl(`compare:${c.key}`, 'pl')}).`
  ).join('\n');

  const salaryPresetLines = SALARY_PRESETS.map(
    (s) =>
      `- [${s.en.label} Hourly & 50/30/20 Budget](${getAbsoluteUrl(`salary:${s.key}`, 'en')}) · [DE (${s.de.label})](${getAbsoluteUrl(`salary:${s.key}`, 'de')}) · [PL (${s.pl.label})](${getAbsoluteUrl(`salary:${s.key}`, 'pl')})`
  ).join('\n');

  const loanPresetLines = LOAN_PRESETS.map(
    (l) =>
      `- [${l.en.label} Mortgage & Extra Payoff](${getAbsoluteUrl(`loan:${l.key}`, 'en')}) · [DE (${l.de.label})](${getAbsoluteUrl(`loan:${l.key}`, 'de')}) · [PL (${l.pl.label})](${getAbsoluteUrl(`loan:${l.key}`, 'pl')})`
  ).join('\n');

  return `# ${SITE_CONFIG.brandName}

> CalcLedger (${SITE_CONFIG.domain}) is a free, privacy-first suite of 11 browser-local financial calculators (Everyday Personal Finance & Business/E-Commerce) plus 1-on-1 platform comparisons and localized salary & mortgage guides available in English, German (Deutsch), and Polish (Polski), supporting EUR, USD, GBP, CHF, and PLN with shareable URL parameters and zero account or server tracking.

## Everyday & Personal Finance Calculators

- [Salary, Pay Raise & 50/30/20 Budget Calculator](${getAbsoluteUrl('salary', 'en')}): Net or Gross-to-Net salary conversion (monthly, yearly, daily, hourly), pay raise simulator, 50/30/20 budget planner, 6-month emergency fund, and purchase-cost-in-work-hours check. ([DE](${getAbsoluteUrl('salary', 'de')}) · [PL](${getAbsoluteUrl('salary', 'pl')}))
- [Loan, Mortgage & Extra Payment Calculator](${getAbsoluteUrl('loan', 'en')}): Monthly payment, total interest, monthly & one-time overpayment savings (years & money saved), remaining-balance SVG chart, and downloadable CSV amortization schedule. ([DE](${getAbsoluteUrl('loan', 'de')}) · [PL](${getAbsoluteUrl('loan', 'pl')}))
- [Fuel Cost, Road Trip & Commute Calculator](${getAbsoluteUrl('fuel', 'en')}): Trip fuel cost, per-passenger split, monthly & yearly work commute expenses, and live Petrol vs Diesel vs LPG vs Electric (EV) comparison. ([DE](${getAbsoluteUrl('fuel', 'de')}) · [PL](${getAbsoluteUrl('fuel', 'pl')}))
- [Savings, Compound Interest & ROI Calculator](${getAbsoluteUrl('compound', 'en')}): Portfolio growth & reverse savings-goal projection with interactive sliders, capital gains tax (0%, 19% PL Belka, 26.375% DE Abgeltungssteuer), inflation-adjusted real purchasing power, SVG chart, year-by-year table, and CSV export. ([DE](${getAbsoluteUrl('compound', 'de')}) · [PL](${getAbsoluteUrl('compound', 'pl')}))
- [Percentage, Discount & Change Calculator](${getAbsoluteUrl('percentage', 'en')}): Sale discounts with stacked extra promo codes, X% of a number, and percentage increase/decrease with clickable discount reference table. ([DE](${getAbsoluteUrl('percentage', 'de')}) · [PL](${getAbsoluteUrl('percentage', 'pl')}))

## Salary & Budget Guides (6 Tiers × 3 Languages)

${salaryPresetLines}

## Loan & Mortgage Early Payoff Guides (6 Tiers × 3 Languages)

${loanPresetLines}

## Business, E-Commerce & B2B Calculators

- [Profit Margin & Markup Calculator](${getAbsoluteUrl('margin', 'en')}): Cost, selling price, gross margin %, markup %, and clickable Margin-to-Markup reference table. ([DE](${getAbsoluteUrl('margin', 'de')}) · [PL](${getAbsoluteUrl('margin', 'pl')}))
- [VAT / MwSt Calculator (Net ↔ Gross)](${getAbsoluteUrl('vat', 'en')}): Add or reverse-calculate VAT across 15 European countries and custom rates. ([DE](${getAbsoluteUrl('vat', 'de')}) · [PL](${getAbsoluteUrl('vat', 'pl')}))
- [Marketplace Seller Profit & Fee Calculator](${getAbsoluteUrl('marketplace', 'en')}): Net profit per order & monthly volume, return rate modeling, margin, ROI, ad spend (ACOS), VAT deduction, Break-Even Price, Target Margin Price, Break-Even ACOS, and live 6-platform side-by-side comparison (Allegro, Amazon FBA, Etsy, eBay, Shopify, Upwork). ([DE](${getAbsoluteUrl('marketplace', 'de')}) · [PL](${getAbsoluteUrl('marketplace', 'pl')}))
- [PayPal & Stripe Payment Fee Calculator](${getAbsoluteUrl('payment', 'en')}): Forward payout and reverse invoice fee calculation including international FX spreads. ([DE](${getAbsoluteUrl('payment', 'de')}) · [PL](${getAbsoluteUrl('payment', 'pl')}))
- [ROAS ↔ ACOS & Break-Even Ads Calculator](${getAbsoluteUrl('roas', 'en')}): Convert ROAS to ACOS, find Break-Even ROAS from product margin, and model net profit after ad spend. ([DE](${getAbsoluteUrl('roas', 'de')}) · [PL](${getAbsoluteUrl('roas', 'pl')}))
- [Freelance Hourly & Day Rate Calculator (B2B)](${getAbsoluteUrl('freelance', 'en')}): Sustainable B2B hourly and day rate from target annual net income, overhead, taxes, vacation weeks, and billable utilization. ([DE](${getAbsoluteUrl('freelance', 'de')}) · [PL](${getAbsoluteUrl('freelance', 'pl')}))

## 1-on-1 Platform Comparisons

${cmpLines}

## European VAT Calculators (15 Countries)

${vatLines}

## Marketplace Seller Fee Calculators (6 Platforms)

${mpLines}

## Payment Gateway Calculators

${payLines}

## Full Reference & Policies

- [Full Machine-Readable Reference (Formulas & Tax Tables)](${SITE_CONFIG.domain}/llms-full.txt)
- [XML Sitemap (165 Localized Pages)](${SITE_CONFIG.domain}/sitemap.xml)
- [About CalcLedger](${getAbsoluteUrl('about', 'en')})
- [Privacy Policy](${getAbsoluteUrl('privacy', 'en')})
- [Terms & Disclaimer](${getAbsoluteUrl('terms', 'en')})
- [Contact](${getAbsoluteUrl('contact', 'en')}): ${SITE_CONFIG.contactEmail}
`;
}

function generateLlmsFullTxt() {
  const vatTable = VAT_COUNTRIES.map(
    (c) =>
      `| ${c.names.en} (${c.code}) | ${c.standardRate}% | ${c.reducedRates.join('%, ')}% | ${c.currency} | ${c.localTaxName} | ${c.vatIdFormat} | ${getAbsoluteUrl(`vat:${c.key}`, 'en')} |`
  ).join('\n');

  const mpTable = MARKETPLACES.map(
    (m) =>
      `| ${m.name} | ${m.defaultCurrency} | ${m.presets.commissionPct}% | ${m.presets.paymentPct}% | ${m.presets.fixedFee} | ${m.feeSummary.en} | ${getAbsoluteUrl(`marketplace:${m.key}`, 'en')} |`
  ).join('\n');

  return `# CalcLedger — Complete Reference Data & Formulas (${SITE_CONFIG.domain})

Updated: ${SITE_CONFIG.buildDate}
Brand: ${SITE_CONFIG.brandName}
Languages: English (EN), German (DE), Polish (PL)
Currencies: EUR, USD, GBP, CHF, PLN
Privacy: 100% client-side JavaScript execution in the browser; no financial inputs transmitted to servers.
Contact: ${SITE_CONFIG.contactEmail}

## Exact Mathematical Formulas Used by CalcLedger

1. **VAT Net to Gross:** Gross = Net * (1 + VAT% / 100)
2. **VAT Gross to Net (Reverse VAT):** Net = Gross / (1 + VAT% / 100); VAT = Gross - Net
3. **Profit Margin %:** Margin% = ((Selling Price - Cost) / Selling Price) * 100
4. **Markup %:** Markup% = ((Selling Price - Cost) / Cost) * 100
5. **Margin to Markup Conversion:** Markup = Margin / (1 - Margin)
6. **Reverse Payment Fee (PayPal / Stripe):** Gross Charge = (Desired Net + Fixed Fee) / (1 - (Fee% + FX%) / 100)
7. **ROAS & ACOS Conversion:** ROAS = Ad Revenue / Ad Spend = 100 / ACOS%; ACOS% = (Ad Spend / Ad Revenue) * 100 = 100 / ROAS
8. **Break-Even ROAS:** Break-Even ROAS = 100 / Gross Profit Margin Before Ads %
9. **Marketplace Break-Even Selling Price:** R_be = (COGS + Seller Shipping + Fixed Fee) / (1 - VAT_share_of_gross - Commission% - Payment% - ACOS%)
10. **Freelance B2B Hourly Rate:** Required Revenue = (Target Net Income / (1 - Tax%)) + Annual Overhead; Hourly Rate = Required Revenue / (Working Weeks * Hours/Week * Billable Utilization %)
11. **Compound Interest (with monthly contributions):** Compounded monthly-equivalent effective growth from nominal rate r and frequency n per year over t years.
12. **Loan / Mortgage Annuity Payment:** Monthly Payment = P * [r * (1 + r)^n] / [(1 + r)^n - 1], with monthly extra principal and lump-sum overpayment amortization.
13. **Salary Hourly Net & 50/30/20 Budget:** Hourly Net = Annual Net / (Hours/Week * 52); Purchase Work Hours = Purchase Price / Hourly Net.
14. **Stacked Discount & % Change:** Final Price = Price * (1 - d1) * (1 - d2); % Change = ((New - Old) / Old) * 100.
15. **Fuel, Trip & Commute Cost:** Trip Cost = (Distance / 100) * Consumption * Unit Price; Monthly Commute = One-Way km * 2 * Workdays * Cost/km.

## European VAT Rates Table (15 Jurisdictions)

| Country | Standard Rate | Reduced / Zero Rates | Default Currency | Local Tax Name | VAT ID Format | Calculator URL |
|---|---|---|---|---|---|---|
${vatTable}

## Marketplace Seller Fee Presets (6 Platforms)

| Platform | Default Currency | Default Commission % | Payment % | Fixed Fee | Summary | Calculator URL |
|---|---|---|---|---|---|---|
${mpTable}

## Language Roots

- English (EN, x-default): ${getAbsoluteUrl('home', 'en')}
- German (DE): ${getAbsoluteUrl('home', 'de')}
- Polish (PL): ${getAbsoluteUrl('home', 'pl')}
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

/llms.txt
  Content-Type: text/markdown; charset=utf-8
  Cache-Control: public, max-age=3600

/llms-full.txt
  Content-Type: text/markdown; charset=utf-8
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

    // 2. VAT Main + 15 Country Programmatic SEO Subpages
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

    // 4. Payment Fee Main + 2 Gateway Programmatic SEO Subpages (PayPal, Stripe)
    writeRouteHtml(getRoutePath('payment', lang), renderPaymentPage(lang, null));
    pageCount++;
    for (const provider of PAYMENT_PROVIDERS) {
      writeRouteHtml(getRoutePath(`payment:${provider.key}`, lang), renderPaymentPage(lang, provider));
      pageCount++;
    }

    // 4b. 1-on-1 Platform Comparison Pages (Allegro vs Amazon, Amazon vs eBay, Etsy vs Shopify, PayPal vs Stripe)
    for (const cmp of COMPARISONS) {
      writeRouteHtml(getRoutePath(`compare:${cmp.key}`, lang), renderComparePage(lang, cmp));
      pageCount++;
    }

    // 5. ROAS <-> ACOS Calculator
    writeRouteHtml(getRoutePath('roas', lang), renderRoasPage(lang));
    pageCount++;

    // 6. Margin & Markup
    writeRouteHtml(getRoutePath('margin', lang), renderMarginPage(lang));
    pageCount++;

    // 7. Freelance Rate (B2B)
    writeRouteHtml(getRoutePath('freelance', lang), renderFreelancePage(lang));
    pageCount++;

    // 8. Compound Interest & ROI
    writeRouteHtml(getRoutePath('compound', lang), renderCompoundPage(lang));
    pageCount++;

    // 8b. Everyday & Personal Finance Calculators (Loan + 6 tiers, Salary/Budget + 6 tiers, Fuel/Commute, Percentage/Discount)
    writeRouteHtml(getRoutePath('loan', lang), renderLoanPage(lang, null));
    pageCount++;
    for (const lp of LOAN_PRESETS) {
      writeRouteHtml(getRoutePath(`loan:${lp.key}`, lang), renderLoanPage(lang, lp));
      pageCount++;
    }

    writeRouteHtml(getRoutePath('salary', lang), renderSalaryPage(lang, null));
    pageCount++;
    for (const sp of SALARY_PRESETS) {
      writeRouteHtml(getRoutePath(`salary:${sp.key}`, lang), renderSalaryPage(lang, sp));
      pageCount++;
    }

    writeRouteHtml(getRoutePath('fuel', lang), renderFuelPage(lang));
    pageCount++;

    writeRouteHtml(getRoutePath('percentage', lang), renderPercentagePage(lang));
    pageCount++;

    // 9. Legal / AdSense Compliance Pages
    for (const legalType of ['about', 'privacy', 'terms', 'contact']) {
      writeRouteHtml(getRoutePath(legalType, lang), renderLegalPage(lang, legalType));
      pageCount++;
    }
  }

  // 404 Page
  fs.writeFileSync(path.join(DIST, '404.html'), renderNotFoundPage('en'), 'utf8');

  // Technical SEO, GEO (AI Search) & Cloudflare Files
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), generateSitemapXml(), 'utf8');
  fs.writeFileSync(path.join(DIST, 'robots.txt'), generateRobotsTxt(), 'utf8');
  fs.writeFileSync(path.join(DIST, 'ads.txt'), generateAdsTxt(), 'utf8');
  fs.writeFileSync(path.join(DIST, 'llms.txt'), generateLlmsTxt(), 'utf8');
  fs.writeFileSync(path.join(DIST, 'llms-full.txt'), generateLlmsFullTxt(), 'utf8');
  if (SITE_CONFIG.indexNowKey) {
    fs.writeFileSync(path.join(DIST, `${SITE_CONFIG.indexNowKey}.txt`), `${SITE_CONFIG.indexNowKey}\n`, 'utf8');
  }
  fs.writeFileSync(path.join(DIST, '_headers'), generateCloudflareHeaders(), 'utf8');
  fs.writeFileSync(path.join(DIST, 'site.webmanifest'), generateWebManifest(), 'utf8');

  const elapsed = Date.now() - startMs;
  console.log(`CalcLedger build complete: ${pageCount} localized HTML pages + 404 + SEO files generated in dist/ (${elapsed}ms).`);
}

build();
