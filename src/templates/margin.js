import { SITE_CONFIG } from '../config.js';
import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml } from '../data/i18n.js';
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

const REFERENCE_MARGINS = [5, 10, 15, 20, 25, 30, 33.33, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

export function renderMarginPage(lang) {
  const t = getI18n(lang);
  const pageKey = 'margin';
  const defaultCurrency = SITE_CONFIG.defaultCurrencyByLang[lang];

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.margin, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
  ];

  const refRowsHtml = REFERENCE_MARGINS.map((m) => {
    const markup = (m / (100 - m)) * 100;
    const mult = 1 / (1 - m / 100);
    const examplePrice = 100 * mult;
    return `<tr class="clickable-row" data-apply-margin="${m}" tabindex="0" role="button">
      <td class="num"><strong>${m.toFixed(m % 1 === 0 ? 0 : 2)}%</strong></td>
      <td class="num">${markup.toFixed(2)}%</td>
      <td class="num">${mult.toFixed(3)}×</td>
      <td class="num">100 &rarr; ${examplePrice.toFixed(2)}</td>
    </tr>`;
  }).join('');

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(t.margin.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(t.margin.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="margin" data-default-currency="${defaultCurrency}">
        <div class="calc-inputs">
          ${renderCurrencyControl('margin', defaultCurrency, t)}

          <div class="field">
            <label class="field__label" for="margin-mode">${escapeHtml(t.margin.modeLabel)}</label>
            <select class="input" id="margin-mode">
              <option value="cost-price" selected>${escapeHtml(t.margin.modeCostPrice)}</option>
              <option value="cost-margin">${escapeHtml(t.margin.modeCostMargin)}</option>
              <option value="cost-markup">${escapeHtml(t.margin.modeCostMarkup)}</option>
            </select>
          </div>

          <div class="field">
            <label class="field__label" for="margin-cost">${escapeHtml(t.margin.costLabel)}</label>
            <input class="input num" type="number" id="margin-cost" inputmode="decimal" step="any" min="0" value="60">
          </div>

          <div class="field" id="margin-price-wrap">
            <label class="field__label" for="margin-price">${escapeHtml(t.margin.priceLabel)}</label>
            <input class="input num" type="number" id="margin-price" inputmode="decimal" step="any" min="0" value="100">
          </div>

          <div class="field" id="margin-target-margin-wrap" hidden>
            <label class="field__label" for="margin-target-margin">${escapeHtml(t.margin.targetMarginLabel)}</label>
            <input class="input num" type="number" id="margin-target-margin" inputmode="decimal" step="0.5" min="0" max="99.9" value="40">
          </div>

          <div class="field" id="margin-target-markup-wrap" hidden>
            <label class="field__label" for="margin-target-markup">${escapeHtml(t.margin.targetMarkupLabel)}</label>
            <input class="input num" type="number" id="margin-target-markup" inputmode="decimal" step="1" min="0" value="66.67">
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero">
            <span class="result-hero__label">${escapeHtml(t.margin.outMargin)}</span>
            <strong class="result-hero__value num" id="margin-out-margin">—</strong>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.margin.outMarkup)}</span>
              <strong class="kpi__value num" id="margin-out-markup">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.margin.outProfit)}</span>
              <strong class="kpi__value num" id="margin-out-profit">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.margin.outPrice)}</span>
              <strong class="kpi__value num" id="margin-out-price">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.margin.outMultiplier)}</span>
              <strong class="kpi__value num" id="margin-out-mult">—</strong>
            </div>
          </div>

          <div class="split-bar-block">
            <div class="split-bar" role="img" aria-label="Cost vs Gross Profit">
              <div class="split-bar__seg seg-navy" id="margin-bar-cost" style="width:60%"></div>
              <div class="split-bar__seg seg-emerald" id="margin-bar-profit" style="width:40%"></div>
            </div>
            <div class="split-legend">
              <span><i class="dot seg-navy"></i>${escapeHtml(t.margin.barCost)} <strong class="num" id="margin-legend-cost">60%</strong></span>
              <span><i class="dot seg-emerald"></i>${escapeHtml(t.margin.barProfit)} <strong class="num" id="margin-legend-profit">40%</strong></span>
            </div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="margin-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="margin-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="margin-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <section class="content-section" aria-labelledby="ref-table-heading">
        <div class="section-head">
          <h2 id="ref-table-heading" class="section-heading">${escapeHtml(t.margin.tableHeading)}</h2>
          <p class="section-sub">${escapeHtml(t.margin.tableSub)}</p>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.margin.colMargin)}</th>
                <th class="num">${escapeHtml(t.margin.colMarkup)}</th>
                <th class="num">${escapeHtml(t.margin.colMultiplier)}</th>
                <th class="num">${escapeHtml(t.margin.colExample)}</th>
              </tr>
            </thead>
            <tbody>${refRowsHtml}</tbody>
          </table>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.margin.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.margin.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.margin.formulaMargin)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.margin.formulaMarkup)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.margin.formulaPriceFromMargin)}</code></div>
        </div>
      </section>

      ${renderFaqSection(t.margin.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('margin', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'margin',
    title: t.margin.title,
    description: t.margin.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: t.margin.h1,
        description: t.margin.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'Profit margin and markup conversion',
          'Target selling price calculation from cost and target margin',
          'Interactive Margin to Markup reference table',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(t.margin.faqs),
    ],
  });
}
