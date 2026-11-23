import { getRoutePath } from '../data/routes.js';
import { getI18n, escapeHtml } from '../data/i18n.js';
import { VAT_COUNTRIES } from '../data/vat-countries.js';
import { MARKETPLACES } from '../data/marketplaces.js';
import { PAYMENT_PROVIDERS } from '../data/payment-providers.js';
import {
  renderLayout,
  renderAdSlot,
  renderFaqSection,
  buildWebSiteJsonLd,
  buildFaqJsonLd,
} from './layout.js';

export function renderHomePage(lang) {
  const t = getI18n(lang);

  const coreTools = [
    { key: 'vat', tag: 'VAT / MwSt', title: t.vat.cardTitle, desc: t.vat.cardDesc },
    { key: 'marketplace', tag: 'E-Commerce', title: t.marketplace.cardTitle, desc: t.marketplace.cardDesc },
    { key: 'payment', tag: 'Payments', title: t.payment.cardTitle, desc: t.payment.cardDesc },
    { key: 'roas', tag: 'Ads & ROAS', title: t.roas.cardTitle, desc: t.roas.cardDesc },
    { key: 'margin', tag: 'Pricing', title: t.margin.cardTitle, desc: t.margin.cardDesc },
    { key: 'freelance', tag: 'B2B', title: t.freelance.cardTitle, desc: t.freelance.cardDesc },
    { key: 'compound', tag: 'ROI & Growth', title: t.compound.cardTitle, desc: t.compound.cardDesc },
  ];

  const toolsHtml = coreTools
    .map(
      (tool) => `<a class="tool-card" href="${escapeHtml(getRoutePath(tool.key, lang))}">
        <span class="tool-card__tag">${escapeHtml(tool.tag)}</span>
        <h3 class="tool-card__title">${escapeHtml(tool.title)}</h3>
        <p class="tool-card__desc">${escapeHtml(tool.desc)}</p>
        <span class="tool-card__cta">${escapeHtml(t.common.openCalculator)} &rarr;</span>
      </a>`
    )
    .join('');

  const vatLinksHtml = VAT_COUNTRIES.map(
    (c) => `<a class="chip-card" href="${escapeHtml(getRoutePath(`vat:${c.key}`, lang))}">
      <span class="chip-card__code">${escapeHtml(c.code)}</span>
      <span class="chip-card__name">${escapeHtml(c.names[lang])}</span>
      <span class="chip-card__meta">${c.standardRate}% · ${c.currency}</span>
    </a>`
  ).join('');

  const mpLinksHtml =
    MARKETPLACES.map(
      (m) => `<a class="chip-card chip-card--mp" href="${escapeHtml(getRoutePath(`marketplace:${m.key}`, lang))}">
        <span class="chip-card__name">${escapeHtml(m.name)}</span>
        <span class="chip-card__desc">${escapeHtml(m.feeSummary[lang])}</span>
      </a>`
    ).join('') +
    PAYMENT_PROVIDERS.map(
      (p) => `<a class="chip-card chip-card--mp" href="${escapeHtml(getRoutePath(`payment:${p.key}`, lang))}">
        <span class="chip-card__name">${escapeHtml(p.name)}</span>
        <span class="chip-card__desc">${escapeHtml(p.feeSummary[lang])}</span>
      </a>`
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
      </div>
    </section>

    <div class="container">
      ${renderAdSlot('topBanner', t)}

      <section class="content-section" aria-labelledby="core-tools-title">
        <div class="section-head">
          <h2 id="core-tools-title" class="section-heading">${escapeHtml(t.home.toolsHeading)}</h2>
          <p class="section-sub">${escapeHtml(t.home.toolsSub)}</p>
        </div>
        <div class="tool-grid">${toolsHtml}</div>
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
          <a class="btn btn--secondary" href="${escapeHtml(getRoutePath('vat', lang))}">${escapeHtml(t.nav.vat)}</a>
          <a class="btn btn--secondary" href="${escapeHtml(getRoutePath('marketplace', lang))}">${escapeHtml(t.nav.marketplace)}</a>
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
