import { getRoutePath } from '../data/routes.js';
import { getI18n, escapeHtml } from '../data/i18n.js';
import { VAT_COUNTRIES } from '../data/vat-countries.js';
import { MARKETPLACES } from '../data/marketplaces.js';
import { PAYMENT_PROVIDERS } from '../data/payment-providers.js';
import { COMPARISONS } from '../data/comparisons.js';
import { getMarketPriority, sortByKeyOrder } from '../data/market-priority.js';
import {
  renderLayout,
  renderAdSlot,
  renderFaqSection,
  buildWebSiteJsonLd,
  buildFaqJsonLd,
} from './layout.js';

export function renderHomePage(lang) {
  const t = getI18n(lang);
  const market = getMarketPriority(lang);

  const personalToolsAll = [
    { key: 'salary', title: t.salary.cardTitle, desc: t.salary.cardDesc },
    { key: 'loan', title: t.loan.cardTitle, desc: t.loan.cardDesc },
    { key: 'compound', title: t.compound.cardTitle, desc: t.compound.cardDesc },
    { key: 'percentage', title: t.percentage.cardTitle, desc: t.percentage.cardDesc },
  ];
  const businessToolsAll = [
    { key: 'vat', title: t.vat.cardTitle, desc: t.vat.cardDesc },
    { key: 'marketplace', title: t.marketplace.cardTitle, desc: t.marketplace.cardDesc },
    { key: 'margin', title: t.margin.cardTitle, desc: t.margin.cardDesc },
    { key: 'payment', title: t.payment.cardTitle, desc: t.payment.cardDesc },
    { key: 'freelance', title: t.freelance.cardTitle, desc: t.freelance.cardDesc },
    { key: 'roas', title: t.roas.cardTitle, desc: t.roas.cardDesc },
  ];

  const personalTools = sortByKeyOrder(personalToolsAll, market.personalToolOrder);
  const businessTools = sortByKeyOrder(businessToolsAll, market.businessToolOrder);
  const orderedVatCountries = sortByKeyOrder(VAT_COUNTRIES, market.vatCountryOrder);
  const orderedMarketplaces = sortByKeyOrder(MARKETPLACES, market.marketplaceOrder);
  const orderedPayments = sortByKeyOrder(PAYMENT_PROVIDERS, market.paymentOrder);

  const heroShortcutsHtml = market.heroQuickLinks
    .map(
      (link) =>
        `<a class="quick-link" href="${escapeHtml(getRoutePath(link.pageKey, lang))}">${escapeHtml(link.label)} &rarr;</a>`
    )
    .join('');

  const renderHubRows = (tools) =>
    tools
      .map(
        (tool, idx) => `<a class="hub-tool-item" href="${escapeHtml(getRoutePath(tool.key, lang))}">
          <span class="hub-tool-item__rank num">${idx + 1}</span>
          <span class="hub-tool-item__body">
            <strong class="hub-tool-item__title">${escapeHtml(tool.title)}</strong>
            <span class="hub-tool-item__desc">${escapeHtml(tool.desc)}</span>
          </span>
          <span class="hub-tool-item__arrow" aria-hidden="true">&rarr;</span>
        </a>`
      )
      .join('');

  const vatLinksHtml = orderedVatCountries
    .map(
      (c) => `<a class="chip-card" href="${escapeHtml(getRoutePath(`vat:${c.key}`, lang))}">
      <span class="chip-card__code">${escapeHtml(c.code)}</span>
      <span class="chip-card__name">${escapeHtml(c.names[lang])}</span>
      <span class="chip-card__meta">${c.standardRate}% · ${c.currency}</span>
    </a>`
    )
    .join('');

  const mpLinksHtml =
    orderedMarketplaces
      .map(
        (m) => `<a class="chip-card chip-card--mp" href="${escapeHtml(getRoutePath(`marketplace:${m.key}`, lang))}">
        <span class="chip-card__name">${escapeHtml(m.name)}</span>
        <span class="chip-card__desc">${escapeHtml(m.feeSummary[lang])}</span>
      </a>`
      )
      .join('') +
    orderedPayments
      .map(
        (p) => `<a class="chip-card chip-card--mp" href="${escapeHtml(getRoutePath(`payment:${p.key}`, lang))}">
        <span class="chip-card__name">${escapeHtml(p.name)}</span>
        <span class="chip-card__desc">${escapeHtml(p.feeSummary[lang])}</span>
      </a>`
      )
      .join('');

  const compareLinksHtml = COMPARISONS.map(
    (c) =>
      `<a class="quick-link" href="${escapeHtml(getRoutePath(`compare:${c.key}`, lang))}">${escapeHtml(c.sideA.name)} vs ${escapeHtml(c.sideB.name)} &rarr;</a>`
  ).join('');

  const whyHtml = t.home.whyItems
    .map(
      (item, idx) => `<article class="feature-item">
        <span class="feature-item__num">0${idx + 1}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>`
    )
    .join('');

  const bodyHtml = `
    <section class="hero">
      <div class="container hero__inner">
        <p class="hero__eyebrow">${escapeHtml(t.common.localBadge)}</p>
        <h1 class="hero__title">${escapeHtml(t.home.h1)}</h1>
        <p class="hero__subtitle">${escapeHtml(t.home.subtitle)}</p>
        <nav class="hero-shortcuts" aria-label="${escapeHtml(t.home.toolsHeading)}">
          ${heroShortcutsHtml}
        </nav>
      </div>
    </section>

    <div class="container">
      ${renderAdSlot('topBanner', t)}

      <section class="content-section" aria-labelledby="core-tools-title">
        <div class="section-head">
          <h2 id="core-tools-title" class="section-heading">${escapeHtml(t.home.toolsHeading)}</h2>
          <p class="section-sub">${escapeHtml(t.home.toolsSub)}</p>
        </div>

        <div class="hub-grid">
          <article class="hub-card hub-card--personal" aria-labelledby="hub-personal-title">
            <header class="hub-card__head">
              <div class="hub-card__top">
                <span class="hub-card__badge hub-card__badge--personal">${escapeHtml(t.home.personalHub.badge)}</span>
                <span class="hub-card__order">${escapeHtml(t.home.personalHub.orderNote)}</span>
              </div>
              <h3 id="hub-personal-title" class="hub-card__title">${escapeHtml(t.home.personalHub.title)}</h3>
              <p class="hub-card__sub">${escapeHtml(t.home.personalHub.subtitle)}</p>
            </header>
            <div class="hub-tool-list">
              ${renderHubRows(personalTools)}
            </div>
          </article>

          <article class="hub-card hub-card--business" aria-labelledby="hub-business-title">
            <header class="hub-card__head">
              <div class="hub-card__top">
                <span class="hub-card__badge hub-card__badge--business">${escapeHtml(t.home.businessHub.badge)}</span>
                <span class="hub-card__order">${escapeHtml(t.home.businessHub.orderNote)}</span>
              </div>
              <h3 id="hub-business-title" class="hub-card__title">${escapeHtml(t.home.businessHub.title)}</h3>
              <p class="hub-card__sub">${escapeHtml(t.home.businessHub.subtitle)}</p>
            </header>
            <div class="hub-tool-list">
              ${renderHubRows(businessTools)}
            </div>
          </article>
        </div>
      </section>

      <section class="content-section" aria-labelledby="vat-grid-title">
        <div class="section-head">
          <h2 id="vat-grid-title" class="section-heading">${escapeHtml(t.home.vatGridHeading)}</h2>
          <p class="section-sub">${escapeHtml(t.home.vatGridSub)}</p>
        </div>
        <div class="chip-grid">${vatLinksHtml}</div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section" aria-labelledby="mp-grid-title">
        <div class="section-head">
          <h2 id="mp-grid-title" class="section-heading">${escapeHtml(t.home.mpGridHeading)}</h2>
          <p class="section-sub">${escapeHtml(t.home.mpGridSub)}</p>
        </div>
        <div class="mp-grid">${mpLinksHtml}</div>
        <nav class="quick-strip" aria-label="${escapeHtml(t.compare.sectionHeading)}">${compareLinksHtml}</nav>
      </section>

      <section class="content-section" aria-labelledby="why-title">
        <h2 id="why-title" class="section-heading">${escapeHtml(t.home.whyHeading)}</h2>
        <div class="feature-grid">${whyHtml}</div>
      </section>

      ${renderFaqSection(t.home.faqs, t.common.faqHeading)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey: 'home',
    activeNav: '',
    title: t.home.title,
    description: t.home.description,
    bodyHtml,
    jsonLd: [
      buildWebSiteJsonLd(lang, t.home.description),
      buildFaqJsonLd(t.home.faqs),
    ],
  });
}

export function renderNotFoundPage(lang = 'en') {
  const t = getI18n(lang);
  const bodyHtml = `
    <div class="container page-narrow">
      <section class="empty-state">
        <p class="empty-state__code">404</p>
        <h1>${escapeHtml(t.notFound.h1)}</h1>
        <p>${escapeHtml(t.notFound.body)}</p>
        <div class="empty-state__actions">
          <a class="btn btn--primary" href="${escapeHtml(getRoutePath('home', lang))}">${escapeHtml(t.common.backHome)}</a>
          <a class="btn btn--secondary" href="${escapeHtml(getRoutePath('salary', lang))}">${escapeHtml(t.nav.salary)}</a>
          <a class="btn btn--secondary" href="${escapeHtml(getRoutePath('loan', lang))}">${escapeHtml(t.nav.loan)}</a>
          <a class="btn btn--secondary" href="${escapeHtml(getRoutePath('vat', lang))}">${escapeHtml(t.nav.vat)}</a>
        </div>
      </section>
    </div>
  `;

  return renderLayout({
    lang,
    pageKey: '',
    title: t.notFound.title,
    description: t.notFound.body,
    bodyHtml,
    robots: 'noindex, follow',
  });
}
