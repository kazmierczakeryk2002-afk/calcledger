import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_CONFIG, isAdsenseActive } from '../config.js';
import { getRoutePath, getAbsoluteUrl, getHreflangAlternates } from '../data/routes.js';
import { getI18n, escapeHtml, safeJsonLd } from '../data/i18n.js';
import { VAT_COUNTRIES } from '../data/vat-countries.js';
import { MARKETPLACES } from '../data/marketplaces.js';
import { PAYMENT_PROVIDERS } from '../data/payment-providers.js';
import { COMPARISONS } from '../data/comparisons.js';
import {
  PERSONAL_TOOL_KEYS,
  BUSINESS_TOOL_KEYS,
  getMarketPriority,
  sortByKeyOrder,
} from '../data/market-priority.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
function hashAsset(relPath) {
  try {
    const content = fs.readFileSync(path.resolve(__dirname, '..', relPath));
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
  } catch {
    return '1';
  }
}

const ASSET_V = {
  css: hashAsset('assets/css/styles.css'),
  app: hashAsset('assets/js/app.js'),
  calc: hashAsset('assets/js/calculators.js'),
};

export function renderHint(text) {
  if (!text) return '';
  return ` <button type="button" class="hint-btn" data-hint="${escapeHtml(text)}" aria-label="${escapeHtml(text)}">?</button>`;
}

export function renderAdSlot(slotKey, t) {
  const active = isAdsenseActive();
  const slotId = SITE_CONFIG.adsenseSlots[slotKey] || '';
  const sizeClass = slotKey === 'midContent' ? 'ad-slot--rect' : 'ad-slot--banner';

  if (!active || !slotId) {
    return `<div class="ad-slot ${sizeClass} ad-slot--inactive" data-ad-slot="${escapeHtml(slotKey)}" aria-hidden="true"></div>`;
  }

  return `<aside class="ad-slot ${sizeClass}" aria-label="${escapeHtml(t.common.advertisement)}" data-ad-slot="${escapeHtml(slotKey)}">
    <span class="ad-slot__label">${escapeHtml(t.common.advertisement)}</span>
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="${escapeHtml(SITE_CONFIG.adsenseClientId)}"
      ${slotId ? `data-ad-slot="${escapeHtml(slotId)}"` : ''}
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </aside>`;
}

export function renderCurrencyControl(idPrefix, defaultCurrency, t) {
  const buttons = SITE_CONFIG.currencies
    .map(
      (c) =>
        `<button type="button" class="seg-btn${c.code === defaultCurrency ? ' is-active' : ''}" data-currency-btn="${c.code}" aria-pressed="${c.code === defaultCurrency ? 'true' : 'false'}" title="${escapeHtml(c.name)}">${c.code}</button>`
    )
    .join('');

  return `<div class="currency-bar" role="group" aria-label="${escapeHtml(t.common.currency)}">
    <span class="currency-bar__label">${escapeHtml(t.common.currency)}</span>
    <div class="seg-group" id="${escapeHtml(idPrefix)}-currency">${buttons}</div>
  </div>`;
}

export function renderBreadcrumbs(items) {
  if (!items || items.length === 0) return '';
  const listHtml = items
    .map((item, idx) => {
      const isLast = idx === items.length - 1;
      if (isLast) {
        return `<li class="breadcrumbs__item" aria-current="page"><span>${escapeHtml(item.label)}</span></li>`;
      }
      return `<li class="breadcrumbs__item"><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`;
    })
    .join('');

  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol class="breadcrumbs__list">${listHtml}</ol></nav>`;
}

export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: item.url,
    })),
  };
}

export function buildSoftwareAppJsonLd({ name, description, url, lang, featureList = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    inLanguage: lang,
    dateModified: SITE_CONFIG.buildDate,
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Financial & E-Commerce Calculator',
    operatingSystem: 'Any (Web Browser)',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.brandName,
      url: SITE_CONFIG.domain,
      email: SITE_CONFIG.contactEmail,
    },
    ...(featureList.length > 0 ? { featureList } : {}),
  };
}

export function buildFaqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function buildWebSiteJsonLd(lang, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.brandName,
    url: getAbsoluteUrl('home', lang),
    inLanguage: lang,
    description,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.brandName,
      url: SITE_CONFIG.domain,
      email: SITE_CONFIG.contactEmail,
      knowsAbout: [
        'Salary, Pay Raise, and 50/30/20 Household Budgeting',
        'Mortgage, Loan Payments, and Early Overpayment Amortization',
        'Compound Interest, Savings Goals, Capital Gains Tax, and Inflation',
        'Everyday Percentages, Stacked Discounts, and Percentage Change',
        'European Value-Added Tax (VAT / MwSt / TVA / BTW / IVA)',
        'Marketplace Seller Fees (Etsy, Amazon FBA, eBay, Shopify, Upwork, Allegro)',
        'Payment Gateway Fees (PayPal, Stripe)',
        'ROAS, ACOS, and Break-Even Advertising',
        'Profit Margin and Markup Pricing',
        'B2B Freelance Hourly and Day Rates',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE_CONFIG.contactEmail,
        availableLanguage: ['en', 'de', 'pl'],
      },
    },
  };
}

export function renderFaqSection(faqs, heading) {
  if (!faqs || faqs.length === 0) return '';
  const items = faqs
    .map(
      (f, idx) => `<details class="faq-item"${idx === 0 ? ' open' : ''}>
      <summary class="faq-item__q"><span>${escapeHtml(f.q)}</span><span class="faq-item__icon" aria-hidden="true"></span></summary>
      <div class="faq-item__a"><p>${escapeHtml(f.a)}</p></div>
    </details>`
    )
    .join('');

  return `<section class="content-section" aria-labelledby="faq-title">
    <h2 id="faq-title" class="section-heading">${escapeHtml(heading)}</h2>
    <div class="faq-list">${items}</div>
  </section>`;
}

export function renderRelatedCalculators(currentTool, lang, t) {
  const market = getMarketPriority(lang);
  const allCards = [
    { key: 'salary', title: t.salary.cardTitle, desc: t.salary.cardDesc, badge: t.nav.personal },
    { key: 'loan', title: t.loan.cardTitle, desc: t.loan.cardDesc, badge: t.nav.personal },
    { key: 'compound', title: t.compound.cardTitle, desc: t.compound.cardDesc, badge: t.nav.personal },
    { key: 'percentage', title: t.percentage.cardTitle, desc: t.percentage.cardDesc, badge: t.nav.personal },
    { key: 'vat', title: t.vat.cardTitle, desc: t.vat.cardDesc, badge: 'VAT / MwSt' },
    { key: 'marketplace', title: t.marketplace.cardTitle, desc: t.marketplace.cardDesc, badge: 'E-Commerce' },
    { key: 'payment', title: t.payment.cardTitle, desc: t.payment.cardDesc, badge: 'Payments' },
    { key: 'roas', title: t.roas.cardTitle, desc: t.roas.cardDesc, badge: 'Ads & ROAS' },
    { key: 'margin', title: t.margin.cardTitle, desc: t.margin.cardDesc, badge: 'Pricing' },
    { key: 'freelance', title: t.freelance.cardTitle, desc: t.freelance.cardDesc, badge: 'B2B' },
  ];

  const isPersonal = PERSONAL_TOOL_KEYS.includes(currentTool);
  const preferredOrder = isPersonal
    ? [...market.personalToolOrder, ...market.businessToolOrder]
    : [...market.businessToolOrder, ...market.personalToolOrder];

  const cards = sortByKeyOrder(allCards, preferredOrder)
    .filter((c) => c.key !== currentTool)
    .slice(0, 4);

  const html = cards
    .map(
      (c) => `<a class="tool-card tool-card--compact" href="${escapeHtml(getRoutePath(c.key, lang))}">
      <span class="tool-card__tag">${escapeHtml(c.badge)}</span>
      <h3 class="tool-card__title">${escapeHtml(c.title)}</h3>
      <p class="tool-card__desc">${escapeHtml(c.desc)}</p>
    </a>`
    )
    .join('');

  return `<section class="content-section" aria-labelledby="related-tools-title">
    <h2 id="related-tools-title" class="section-heading">${escapeHtml(t.common.relatedTools)}</h2>
    <div class="tool-grid tool-grid--4">${html}</div>
  </section>`;
}

export function renderLayout({
  lang,
  pageKey,
  activeNav = '',
  title,
  description,
  bodyHtml,
  jsonLd = [],
  includeCalculatorScript = false,
  robots = 'index, follow',
}) {
  const t = getI18n(lang);
  const market = getMarketPriority(lang);
  const canonical = pageKey ? getAbsoluteUrl(pageKey, lang) : '';
  const alternates = pageKey ? getHreflangAlternates(pageKey) : [];
  const ogLocale = SITE_CONFIG.locales[lang] || 'en_US';
  const altLocales = SITE_CONFIG.languages
    .filter((l) => l !== lang)
    .map((l) => `<meta property="og:locale:alternate" content="${SITE_CONFIG.locales[l]}">`)
    .join('\n  ');

  const hreflangTags = alternates
    .map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}">`)
    .join('\n  ');

  const jsonLdScripts = jsonLd
    .map((schema) => `<script type="application/ld+json">${safeJsonLd(schema)}</script>`)
    .join('\n  ');

  const adsenseHead = isAdsenseActive()
    ? `<meta name="google-adsense-account" content="${escapeHtml(SITE_CONFIG.adsenseClientId)}">\n  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${escapeHtml(SITE_CONFIG.adsenseClientId)}" crossorigin="anonymous"></script>`
    : '';

  const personalNavItems = sortByKeyOrder(
    [
      { key: 'salary', label: t.nav.salary, title: t.salary.cardTitle },
      { key: 'loan', label: t.nav.loan, title: t.loan.cardTitle },
      { key: 'compound', label: t.nav.compound, title: t.compound.cardTitle },
      { key: 'percentage', label: t.nav.percentage, title: t.percentage.cardTitle },
    ],
    market.personalToolOrder
  );

  const businessNavItems = sortByKeyOrder(
    [
      { key: 'vat', label: t.nav.vat, title: t.vat.cardTitle },
      { key: 'marketplace', label: t.nav.marketplace, title: t.marketplace.cardTitle },
      { key: 'margin', label: t.nav.margin, title: t.margin.cardTitle },
      { key: 'payment', label: t.nav.payment, title: t.payment.cardTitle },
      { key: 'freelance', label: t.nav.freelance, title: t.freelance.cardTitle },
      { key: 'roas', label: t.nav.roas, title: t.roas.cardTitle },
    ],
    market.businessToolOrder
  );

  const allNavMap = new Map([...personalNavItems, ...businessNavItems].map((i) => [i.key, i]));
  const quickNavItems = market.quickNavOrder.map((k) => allNavMap.get(k)).filter(Boolean);
  const allNavItems = sortByKeyOrder([...personalNavItems, ...businessNavItems], market.toolOrder);

  const personalActive = PERSONAL_TOOL_KEYS.includes(activeNav);
  const businessActive = BUSINESS_TOOL_KEYS.includes(activeNav);

  const renderDropdown = (groupLabel, items, isActive) => `
    <div class="nav-drop">
      <button type="button" class="site-nav__link nav-drop__trigger${isActive ? ' is-active' : ''}" aria-expanded="false">
        <span>${escapeHtml(groupLabel)}</span>
        <svg class="nav-drop__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="nav-drop__menu" hidden>
        ${items
          .map(
            (item) =>
              `<a class="nav-drop__item${activeNav === item.key ? ' is-active' : ''}" href="${escapeHtml(getRoutePath(item.key, lang))}">${escapeHtml(item.title)}</a>`
          )
          .join('')}
      </div>
    </div>`;

  const desktopNavHtml =
    renderDropdown(t.nav.personal, personalNavItems, personalActive) +
    renderDropdown(t.nav.business, businessNavItems, businessActive) +
    `<span class="site-nav__sep" aria-hidden="true"></span>` +
    quickNavItems
      .map(
        (item) =>
          `<a class="site-nav__link${activeNav === item.key ? ' is-active' : ''}" href="${escapeHtml(getRoutePath(item.key, lang))}">${escapeHtml(item.label)}</a>`
      )
      .join('');

  const mobileNavHtml = `
    <span class="mobile-nav__group">${escapeHtml(t.nav.personal)}</span>
    ${personalNavItems
      .map(
        (item) =>
          `<a class="site-nav__link${activeNav === item.key ? ' is-active' : ''}" href="${escapeHtml(getRoutePath(item.key, lang))}">${escapeHtml(item.title)}</a>`
      )
      .join('')}
    <span class="mobile-nav__group">${escapeHtml(t.nav.business)}</span>
    ${businessNavItems
      .map(
        (item) =>
          `<a class="site-nav__link${activeNav === item.key ? ' is-active' : ''}" href="${escapeHtml(getRoutePath(item.key, lang))}">${escapeHtml(item.title)}</a>`
      )
      .join('')}
    <span class="mobile-nav__group">${escapeHtml(t.footer.companyCol)}</span>
    <a class="site-nav__link" href="${escapeHtml(getRoutePath('about', lang))}">${escapeHtml(t.nav.about)}</a>
    <a class="site-nav__link" href="${escapeHtml(getRoutePath('contact', lang))}">${escapeHtml(t.footer.contact)}</a>
  `;

  const langSwitcherHtml = SITE_CONFIG.languages
    .map((l) => {
      const targetHref = pageKey ? getRoutePath(pageKey, l) : getRoutePath('home', l);
      const isCurrent = l === lang;
      return `<a class="lang-switch__item${isCurrent ? ' is-active' : ''}" href="${escapeHtml(targetHref)}" hreflang="${l}" data-lang-link="${l}"${isCurrent ? ' aria-current="true"' : ''}>${l.toUpperCase()}</a>`;
    })
    .join('');

  const vatFooterLinks = sortByKeyOrder(VAT_COUNTRIES, market.vatCountryOrder)
    .slice(0, 7)
    .map(
      (c) =>
        `<li><a href="${escapeHtml(getRoutePath(`vat:${c.key}`, lang))}">${escapeHtml(c.names[lang])} (${c.standardRate}%)</a></li>`
    )
    .join('');

  const mpFooterLinks =
    sortByKeyOrder(MARKETPLACES, market.marketplaceOrder)
      .map(
        (m) => `<li><a href="${escapeHtml(getRoutePath(`marketplace:${m.key}`, lang))}">${escapeHtml(m.name)}</a></li>`
      )
      .join('') +
    `<li><a href="${escapeHtml(getRoutePath('payment:paypal', lang))}">PayPal</a></li>` +
    `<li><a href="${escapeHtml(getRoutePath('payment:stripe', lang))}">Stripe</a></li>`;

  const finderIndex = [
    ...allNavItems.map((i) => ({
      t: t[i.key]?.cardTitle || i.label,
      c: PERSONAL_TOOL_KEYS.includes(i.key) ? t.nav.personal : t.nav.business,
      h: getRoutePath(i.key, lang),
      k: `${i.label} ${t[i.key]?.cardDesc || ''}`.toLowerCase(),
    })),
    ...sortByKeyOrder(VAT_COUNTRIES, market.vatCountryOrder).map((c) => ({
      t: `${c.names[lang]} VAT (${c.standardRate}%)`,
      c: 'VAT / MwSt',
      h: getRoutePath(`vat:${c.key}`, lang),
      k: `${c.names[lang]} ${c.code} ${c.standardRate}% ${c.currency} ${c.localTaxName} vat mwst`.toLowerCase(),
    })),
    ...sortByKeyOrder(MARKETPLACES, market.marketplaceOrder).map((m) => ({
      t: m.name,
      c: 'Marketplace',
      h: getRoutePath(`marketplace:${m.key}`, lang),
      k: `${m.name} ${m.feeSummary[lang]} fees prowizja`.toLowerCase(),
    })),
    ...sortByKeyOrder(PAYMENT_PROVIDERS, market.paymentOrder).map((p) => ({
      t: p.name,
      c: 'Payments',
      h: getRoutePath(`payment:${p.key}`, lang),
      k: `${p.name} ${p.feeSummary[lang]} fee prowizja`.toLowerCase(),
    })),
    ...COMPARISONS.map((cmp) => ({
      t: `${cmp.sideA.name} vs ${cmp.sideB.name}`,
      c: 'Compare',
      h: getRoutePath(`compare:${cmp.key}`, lang),
      k: `${cmp.sideA.name} ${cmp.sideB.name} vs compare porownanie vergleich`.toLowerCase(),
    })),
  ];

  const clientI18n = {
    lang,
    locale: t.locale,
    copiedResult: t.common.copiedResult,
    copiedLink: t.common.copiedLink,
    copiedValue: t.common.copiedValue,
    clickToCopy: t.common.clickToCopy,
    viewResults: t.common.viewResults,
    searchEmpty: t.common.searchEmpty,
    copiedEmail: t.legal.contact.copiedEmail,
    vat: {
      amountLabelNet: t.vat.amountLabelNet,
      amountLabelGross: t.vat.amountLabelGross,
      resultNet: t.vat.resultNet,
      resultVat: t.vat.resultVat,
      resultGross: t.vat.resultGross,
    },
    marketplace: {
      outNetProfit: t.marketplace.outNetProfit,
      outMonthlyProfit: t.marketplace.outMonthlyProfit,
      outTargetPrice: t.marketplace.outTargetPrice,
      outMargin: t.marketplace.outMargin,
      outRoi: t.marketplace.outRoi,
      outTotalFees: t.marketplace.outTotalFees,
      outBreakEvenPrice: t.marketplace.outBreakEvenPrice,
      outBreakEvenAcos: t.marketplace.outBreakEvenAcos,
      bestBadge: t.marketplace.bestBadge,
      segCogs: t.marketplace.segCogs,
      segFees: t.marketplace.segFees,
      segAds: t.marketplace.segAds,
      segVat: t.marketplace.segVat,
      segProfit: t.marketplace.segProfit,
      segLoss: t.marketplace.segLoss,
    },
    payment: {
      amountLabelForward: t.payment.amountLabelForward,
      amountLabelReverse: t.payment.amountLabelReverse,
      outPrimaryForward: t.payment.outPrimaryForward,
      outPrimaryReverse: t.payment.outPrimaryReverse,
      outGross: t.payment.outGross,
      outTotalFee: t.payment.outTotalFee,
      outNet: t.payment.outNet,
    },
    roas: {
      outRoas: t.roas.outRoas,
      outAcos: t.roas.outAcos,
      outBeRoas: t.roas.outBeRoas,
      outNetProfit: t.roas.outNetProfit,
      barCogs: t.roas.barCogs,
      barAds: t.roas.barAds,
      barProfit: t.roas.barProfit,
      barLoss: t.roas.barLoss,
    },
    margin: {
      outPrice: t.margin.outPrice,
      outProfit: t.margin.outProfit,
      outMargin: t.margin.outMargin,
      outMarkup: t.margin.outMarkup,
    },
    freelance: {
      outHourly: t.freelance.outHourly,
      outDayRate: t.freelance.outDayRate,
      outMonthlyRev: t.freelance.outMonthlyRev,
      outAnnualRev: t.freelance.outAnnualRev,
    },
    compound: {
      outFutureValue: t.compound.outFutureValue,
      outRequiredMonthly: t.compound.outRequiredMonthly,
      outAfterTax: t.compound.outAfterTax,
      outRealValue: t.compound.outRealValue,
      outTotalContrib: t.compound.outTotalContrib,
      outTotalInterest: t.compound.outTotalInterest,
      outTotalRoi: t.compound.outTotalRoi,
      downloadedCsv: t.compound.downloadedCsv,
      colYear: t.compound.colYear,
      colStart: t.compound.colStart,
      colAdded: t.compound.colAdded,
      colInterest: t.compound.colInterest,
      colEnd: t.compound.colEnd,
      colReal: t.compound.colReal,
      colRoi: t.compound.colRoi,
      legendPrincipal: t.compound.legendPrincipal,
      legendContrib: t.compound.legendContrib,
      legendInterest: t.compound.legendInterest,
    },
    compare: {
      tieText: t.compare.tieText,
      winnerSaves: t.compare.winnerSaves,
      winnerBadge: t.compare.winnerBadge,
    },
    loan: {
      outMonthly: t.loan.outMonthly,
      outInterestSaved: t.loan.outInterestSaved,
      outTimeSaved: t.loan.outTimeSaved,
      outTotalInterest: t.loan.outTotalInterest,
      downloadedCsv: t.loan.downloadedCsv,
      colYear: t.loan.colYear,
      colPayment: t.loan.colPayment,
      colPrincipal: t.loan.colPrincipal,
      colInterest: t.loan.colInterest,
      colBalance: t.loan.colBalance,
      colStdBalance: t.loan.colStdBalance,
      unitYears: t.loan.unitYears,
      unitMonths: t.loan.unitMonths,
      noSavings: t.loan.noSavings,
    },
    salary: {
      amountLabelNet: t.salary.amountLabelNet,
      amountLabelGross: t.salary.amountLabelGross,
      outMonthlyNet: t.salary.outMonthlyNet,
      outHourlyNet: t.salary.outHourlyNet,
      outYearlyNet: t.salary.outYearlyNet,
      workHoursFmt: t.salary.workHoursFmt,
    },
    percentage: {
      outFinalPrice: t.percentage.outFinalPrice,
      outYouSave: t.percentage.outYouSave,
      outEffDiscount: t.percentage.outEffDiscount,
      outOfResult: t.percentage.outOfResult,
      outRemainder: t.percentage.outRemainder,
      outPlusPct: t.percentage.outPlusPct,
      outChangePct: t.percentage.outChangePct,
      outChangeDiff: t.percentage.outChangeDiff,
      outMultiplier: t.percentage.outMultiplier,
    },
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${escapeHtml(robots)}">
  <meta name="theme-color" content="#0F5C48">
  ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
  ${hreflangTags}
  <link rel="alternate" type="text/markdown" title="LLMs Index" href="${SITE_CONFIG.domain}/llms.txt">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(SITE_CONFIG.brandName)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  ${canonical ? `<meta property="og:url" content="${canonical}">` : ''}
  <meta property="og:locale" content="${ogLocale}">
  ${altLocales}
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/styles.css?v=${ASSET_V.css}">
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500
    });
    try {
      var saved = JSON.parse(localStorage.getItem('calcledger_consent_v2') || 'null');
      if (saved && typeof saved === 'object') {
        gtag('consent', 'update', {
          ad_storage: saved.ads ? 'granted' : 'denied',
          ad_user_data: saved.ads ? 'granted' : 'denied',
          ad_personalization: saved.ads ? 'granted' : 'denied',
          analytics_storage: saved.analytics ? 'granted' : 'denied'
        });
      }
    } catch (e) {}
  </script>
  ${adsenseHead}
  ${jsonLdScripts}
</head>
<body>
  <a class="skip-link" href="#main-content">${escapeHtml(t.skipToContent)}</a>

  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="${escapeHtml(getRoutePath('home', lang))}">
        <span class="brand__mark" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="14" fill="#0F5C48"/>
            <rect x="13" y="13" width="38" height="38" rx="7" stroke="#F8F7F4" stroke-width="3.2"/>
            <line x1="21" y1="24" x2="43" y2="24" stroke="#F8F7F4" stroke-width="3.2" stroke-linecap="round"/>
            <rect x="21" y="32" width="8" height="8" rx="2" fill="#E6B655"/>
            <line x1="34" y1="34" x2="43" y2="34" stroke="#F8F7F4" stroke-width="3" stroke-linecap="round"/>
            <line x1="34" y1="40" x2="43" y2="40" stroke="#F8F7F4" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="brand__text">${escapeHtml(SITE_CONFIG.brandName)}</span>
      </a>

      <nav class="site-nav" aria-label="${escapeHtml(t.nav.tools)}">
        ${desktopNavHtml}
      </nav>

      <div class="site-header__actions">
        <button type="button" class="finder-trigger" id="finder-open" aria-label="${escapeHtml(t.common.searchLabel)}" title="${escapeHtml(t.common.searchLabel)}">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7.5"></circle>
            <line x1="20" y1="20" x2="16.4" y2="16.4"></line>
          </svg>
        </button>
        <div class="lang-switch" role="navigation" aria-label="${escapeHtml(t.nav.langLabel)}">
          ${langSwitcherHtml}
        </div>
        <button type="button" class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="mobile-drawer" aria-label="${escapeHtml(t.nav.menuLabel)}">
          <span class="menu-toggle__bar"></span>
          <span class="menu-toggle__bar"></span>
          <span class="menu-toggle__bar"></span>
        </button>
      </div>
    </div>

    <div class="mobile-drawer" id="mobile-drawer" hidden>
      <div class="container mobile-drawer__inner">
        <nav class="mobile-nav" aria-label="${escapeHtml(t.nav.tools)}">
          ${mobileNavHtml}
        </nav>
      </div>
    </div>
  </header>

  <main id="main-content" class="site-main">
    ${bodyHtml}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="${escapeHtml(getRoutePath('home', lang))}">
            <span class="brand__mark" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="14" fill="#0F5C48"/>
                <rect x="13" y="13" width="38" height="38" rx="7" stroke="#F8F7F4" stroke-width="3.2"/>
                <line x1="21" y1="24" x2="43" y2="24" stroke="#F8F7F4" stroke-width="3.2" stroke-linecap="round"/>
                <rect x="21" y="32" width="8" height="8" rx="2" fill="#E6B655"/>
                <line x1="34" y1="34" x2="43" y2="34" stroke="#F8F7F4" stroke-width="3" stroke-linecap="round"/>
                <line x1="34" y1="40" x2="43" y2="40" stroke="#F8F7F4" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="brand__text">${escapeHtml(SITE_CONFIG.brandName)}</span>
          </a>
          <p class="footer-brand__desc">${escapeHtml(t.footer.tagline)}</p>
          <p class="footer-brand__meta"><a href="mailto:${SITE_CONFIG.contactEmail}">${SITE_CONFIG.contactEmail}</a></p>
        </div>

        <div class="footer-col">
          <h3 class="footer-col__title">${escapeHtml(t.footer.personalCol)}</h3>
          <ul>
            ${personalNavItems.map((i) => `<li><a href="${escapeHtml(getRoutePath(i.key, lang))}">${escapeHtml(i.label)}</a></li>`).join('')}
          </ul>
          <h3 class="footer-col__title footer-col__title--sub">${escapeHtml(t.footer.businessCol)}</h3>
          <ul>
            ${businessNavItems.map((i) => `<li><a href="${escapeHtml(getRoutePath(i.key, lang))}">${escapeHtml(i.label)}</a></li>`).join('')}
          </ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-col__title">${escapeHtml(t.footer.vatCol)}</h3>
          <ul>${vatFooterLinks}</ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-col__title">${escapeHtml(t.footer.marketplacesCol)}</h3>
          <ul>${mpFooterLinks}</ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-col__title">${escapeHtml(t.footer.companyCol)}</h3>
          <ul>
            <li><a href="${escapeHtml(getRoutePath('about', lang))}">${escapeHtml(t.footer.about)}</a></li>
            <li><a href="${escapeHtml(getRoutePath('privacy', lang))}">${escapeHtml(t.footer.privacy)}</a></li>
            <li><a href="${escapeHtml(getRoutePath('terms', lang))}">${escapeHtml(t.footer.terms)}</a></li>
            <li><a href="${escapeHtml(getRoutePath('contact', lang))}">${escapeHtml(t.footer.contact)}</a></li>
            <li><button type="button" class="footer-link-btn" data-open-consent>${escapeHtml(t.footer.cookieSettings)}</button></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-disclaimer">${escapeHtml(t.footer.disclaimer)}</p>
        <p class="footer-copy">&copy; ${SITE_CONFIG.copyrightYear} ${escapeHtml(SITE_CONFIG.brandName)} (${SITE_CONFIG.host}). ${escapeHtml(t.footer.rights)}</p>
      </div>
    </div>
  </footer>

  <!-- Quick Finder Modal (Cmd/Ctrl+K) -->
  <div class="finder-backdrop" id="quick-finder" role="dialog" aria-modal="true" aria-label="${escapeHtml(t.common.searchLabel)}" hidden>
    <div class="finder-dialog">
      <div class="finder-head">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7.5"></circle>
          <line x1="20" y1="20" x2="16.4" y2="16.4"></line>
        </svg>
        <input type="search" class="finder-input" id="finder-input" autocomplete="off" spellcheck="false" placeholder="${escapeHtml(t.common.searchPlaceholder)}" aria-label="${escapeHtml(t.common.searchPlaceholder)}">
        <button type="button" class="finder-close" id="finder-close" aria-label="Close">Esc</button>
      </div>
      <div class="finder-list" id="finder-list" role="listbox"></div>
    </div>
  </div>

  ${
    includeCalculatorScript
      ? `<button type="button" class="mobile-result-dock" id="mobile-result-dock" hidden>
    <span class="mobile-result-dock__meta">
      <span class="mobile-result-dock__label" id="dock-label"></span>
      <strong class="mobile-result-dock__value num" id="dock-value">—</strong>
    </span>
    <span class="mobile-result-dock__cta">${escapeHtml(t.common.viewResults)} &darr;</span>
  </button>`
      : ''
  }

  <!-- Cookie Consent Banner (Google Consent Mode v2 / GDPR / RODO / DSGVO) -->
  <div class="consent-banner" id="consent-banner" role="dialog" aria-modal="false" aria-labelledby="consent-title" hidden>
    <div class="container consent-banner__inner">
      <div class="consent-banner__copy">
        <h2 id="consent-title" class="consent-banner__title">${escapeHtml(t.consent.title)}</h2>
        <p class="consent-banner__text">
          ${escapeHtml(t.consent.body)}
          <a href="${escapeHtml(getRoutePath('privacy', lang))}">${escapeHtml(t.consent.privacyLink)}</a>.
        </p>
      </div>
      <div class="consent-banner__panel" id="consent-custom-panel" hidden>
        <div class="consent-option">
          <div>
            <strong>${escapeHtml(t.consent.essentialTitle)}</strong>
            <p>${escapeHtml(t.consent.essentialDesc)}</p>
          </div>
          <input type="checkbox" checked disabled aria-label="${escapeHtml(t.consent.essentialTitle)}">
        </div>
        <label class="consent-option">
          <div>
            <strong>${escapeHtml(t.consent.adsTitle)}</strong>
            <p>${escapeHtml(t.consent.adsDesc)}</p>
          </div>
          <input type="checkbox" id="consent-toggle-ads">
        </label>
        <label class="consent-option">
          <div>
            <strong>${escapeHtml(t.consent.analyticsTitle)}</strong>
            <p>${escapeHtml(t.consent.analyticsDesc)}</p>
          </div>
          <input type="checkbox" id="consent-toggle-analytics">
        </label>
      </div>
      <div class="consent-banner__actions">
        <button type="button" class="btn btn--secondary" id="consent-reject">${escapeHtml(t.consent.rejectAll)}</button>
        <button type="button" class="btn btn--ghost" id="consent-customize">${escapeHtml(t.consent.customize)}</button>
        <button type="button" class="btn btn--primary" id="consent-save" hidden>${escapeHtml(t.consent.save)}</button>
        <button type="button" class="btn btn--primary" id="consent-accept">${escapeHtml(t.consent.acceptAll)}</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>

  <script>window.CALCLEDGER_I18N = ${safeJsonLd(clientI18n)};window.CALCLEDGER_FINDER = ${safeJsonLd(finderIndex)};</script>
  <script src="/assets/js/app.js?v=${ASSET_V.app}" defer></script>
  ${includeCalculatorScript ? `<script src="/assets/js/calculators.js?v=${ASSET_V.calc}" defer></script>` : ''}
</body>
</html>`;
}
