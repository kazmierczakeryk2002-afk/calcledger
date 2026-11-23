import { SITE_CONFIG } from '../config.js';
import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml } from '../data/i18n.js';
import { VAT_COUNTRIES } from '../data/vat-countries.js';
import {
  renderLayout,
  renderAdSlot,
  renderCurrencyControl,
  renderBreadcrumbs,
  renderFaqSection,
  renderRelatedCalculators,
  buildBreadcrumbJsonLd,
  buildSoftwareAppJsonLd,
  buildFaqJsonLd,
} from './layout.js';

export function renderVatPage(lang, country = null) {
  const t = getI18n(lang);
  const pageKey = country ? `vat:${country.key}` : 'vat';
  const seo = country ? country.seo[lang] : t.vat;
  const defaultCurrency = country ? country.currency : SITE_CONFIG.defaultCurrencyByLang[lang];
  const defaultRate = country ? country.standardRate : lang === 'pl' ? 23 : lang === 'de' ? 19 : 20;
  const quickRates = country
    ? [country.standardRate, ...country.reducedRates]
    : [23, 22, 21, 20, 19, 8.1, 7, 5];

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.vat, href: getRoutePath('vat', lang), url: getAbsoluteUrl('vat', lang) },
  ];
  if (country) {
    breadcrumbs.push({
      label: `${country.names[lang]} (${country.standardRate}%)`,
      href: getRoutePath(pageKey, lang),
      url: getAbsoluteUrl(pageKey, lang),
    });
  }

  const rateChipsHtml = quickRates
    .map(
      (r) =>
        `<button type="button" class="pill-btn${r === defaultRate ? ' is-active' : ''}" data-vat-rate="${r}">${r}%</button>`
    )
    .join('');

  const amountChipsHtml = [100, 250, 500, 1000, 5000]
    .map((amt) => `<button type="button" class="pill-btn" data-vat-amount="${amt}">${amt}</button>`)
    .join('');

  const countryLinksHtml = VAT_COUNTRIES.map((c) => {
    const isCurrent = country && c.key === country.key;
    return `<a class="chip-card${isCurrent ? ' is-current' : ''}" href="${escapeHtml(getRoutePath(`vat:${c.key}`, lang))}"${isCurrent ? ' aria-current="page"' : ''}>
      <span class="chip-card__code">${escapeHtml(c.code)}</span>
      <span class="chip-card__name">${escapeHtml(c.names[lang])}</span>
      <span class="chip-card__meta">${c.standardRate}% · ${c.currency}</span>
    </a>`;
  }).join('');

  const countryTableHtml = country
    ? `<section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.vat.rateTableHeading)} — ${escapeHtml(country.names[lang])}</h2>
        <p class="prose">${escapeHtml(seo.intro)}</p>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.vat.colRate)}</th>
                <th>${escapeHtml(t.vat.colCategory)}</th>
                <th>${escapeHtml(t.vat.colExamples)}</th>
              </tr>
            </thead>
            <tbody>
              ${seo.rateNotes
                .map(
                  (row) => `<tr>
                    <td class="num"><strong>${escapeHtml(row.rate)}</strong></td>
                    <td>${escapeHtml(row.label)}</td>
                    <td>${escapeHtml(row.examples)}</td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
        <p class="meta-note"><strong>${escapeHtml(country.localTaxName)}</strong> · VAT ID: <code>${escapeHtml(country.vatIdFormat)}</code></p>
      </section>`
    : '';

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(seo.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(seo.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="vat" data-default-currency="${defaultCurrency}" data-default-rate="${defaultRate}">
        <div class="calc-inputs">
          ${renderCurrencyControl('vat', defaultCurrency, t)}

          <div class="field">
            <span class="field__label">${escapeHtml(t.vat.modeLabel)}</span>
            <div class="seg-group seg-group--full" role="group" aria-label="${escapeHtml(t.vat.modeLabel)}">
              <button type="button" class="seg-btn is-active" id="vat-mode-add" data-vat-mode="add" aria-pressed="true">${escapeHtml(t.vat.modeNetToGross)}</button>
              <button type="button" class="seg-btn" id="vat-mode-remove" data-vat-mode="remove" aria-pressed="false">${escapeHtml(t.vat.modeGrossToNet)}</button>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="vat-amount" id="vat-amount-label">${escapeHtml(t.vat.amountLabelNet)}</label>
            <input class="input num" type="number" id="vat-amount" inputmode="decimal" step="any" min="0" value="1000">
            <div class="pill-row" aria-label="${escapeHtml(t.vat.quickAmounts)}">${amountChipsHtml}</div>
          </div>

          <div class="field">
            <label class="field__label" for="vat-rate">${escapeHtml(t.vat.rateLabel)}</label>
            <input class="input num" type="number" id="vat-rate" inputmode="decimal" step="0.1" min="0" max="100" value="${defaultRate}">
            <div class="pill-row" aria-label="${escapeHtml(t.vat.quickRates)}">${rateChipsHtml}</div>
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero">
            <span class="result-hero__label" id="vat-primary-label">${escapeHtml(t.vat.resultGross)}</span>
            <strong class="result-hero__value num" id="vat-out-primary">—</strong>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.vat.resultNet)}</span>
              <strong class="kpi__value num" id="vat-out-net">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.vat.resultVat)}</span>
              <strong class="kpi__value num" id="vat-out-vat">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.vat.resultGross)}</span>
              <strong class="kpi__value num" id="vat-out-gross">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.vat.resultEffective)}</span>
              <strong class="kpi__value num" id="vat-out-share">—</strong>
            </div>
          </div>

          <div class="split-bar-block">
            <div class="split-bar" role="img" aria-label="Net vs VAT split">
              <div class="split-bar__seg seg-navy" id="vat-bar-net" style="width:80%"></div>
              <div class="split-bar__seg seg-amber" id="vat-bar-vat" style="width:20%"></div>
            </div>
            <div class="split-legend">
              <span><i class="dot seg-navy"></i>${escapeHtml(t.vat.barNet)} <strong class="num" id="vat-legend-net">80%</strong></span>
              <span><i class="dot seg-amber"></i>${escapeHtml(t.vat.barVat)} <strong class="num" id="vat-legend-vat">20%</strong></span>
            </div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="vat-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="vat-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="vat-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      ${countryTableHtml}

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.vat.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.vat.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.vat.formulaNetToGross)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.vat.formulaGrossToNet)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.vat.formulaVatOnly)}</code></div>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section" aria-labelledby="vat-countries-heading">
        <h2 id="vat-countries-heading" class="section-heading">${escapeHtml(t.common.countryGuides)}</h2>
        <div class="chip-grid">${countryLinksHtml}</div>
      </section>

      ${renderFaqSection(seo.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('vat', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'vat',
    title: seo.title,
    description: seo.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: seo.h1,
        description: seo.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'Net to Gross VAT calculation',
          'Gross to Net reverse VAT calculation',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
          'Shareable URL parameters',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(seo.faqs),
    ],
  });
}
