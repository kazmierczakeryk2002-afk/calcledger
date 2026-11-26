import { SITE_CONFIG } from '../config.js';
import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml } from '../data/i18n.js';
import {
  renderLayout,
  renderAdSlot,
  renderCurrencyControl,
  renderBreadcrumbs,
  renderHint,
  renderFaqSection,
  renderRelatedCalculators,
  buildBreadcrumbJsonLd,
  buildSoftwareAppJsonLd,
  buildFaqJsonLd,
} from './layout.js';

const DISCOUNT_TABLE_RATES = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 75];

export function renderPercentagePage(lang) {
  const t = getI18n(lang);
  const pageKey = 'percentage';
  const defaultCurrency = SITE_CONFIG.defaultCurrencyByLang[lang];

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.percentage, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
  ];

  const tableRowsHtml = DISCOUNT_TABLE_RATES.map((d) => {
    const payShare = 100 - d;
    const on100 = (100 * payShare) / 100;
    const on500 = (500 * payShare) / 100;
    return `<tr class="clickable-row" data-apply-disc="${d}" tabindex="0" role="button">
      <td class="num"><strong>&minus;${d}%</strong></td>
      <td class="num">${payShare}%</td>
      <td class="num">${on100.toFixed(2)}</td>
      <td class="num">${on500.toFixed(2)}</td>
    </tr>`;
  }).join('');

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(t.percentage.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(t.percentage.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="percentage" data-default-currency="${defaultCurrency}">
        <div class="calc-inputs">
          ${renderCurrencyControl('pct', defaultCurrency, t)}

          <div class="field">
            <span class="field__label">${escapeHtml(t.percentage.modeLabel)}</span>
            <div class="seg-group seg-group--full" role="group" aria-label="${escapeHtml(t.percentage.modeLabel)}">
              <button type="button" class="seg-btn is-active" data-pct-mode="discount" aria-pressed="true">${escapeHtml(t.percentage.modeDiscount)}</button>
              <button type="button" class="seg-btn" data-pct-mode="of" aria-pressed="false">${escapeHtml(t.percentage.modeOf)}</button>
              <button type="button" class="seg-btn" data-pct-mode="change" aria-pressed="false">${escapeHtml(t.percentage.modeChange)}</button>
            </div>
          </div>

          <div id="pct-panel-discount">
            <div class="field">
              <label class="field__label" for="pct-orig-price">${escapeHtml(t.percentage.origPriceLabel)}</label>
              <input class="input num" type="number" id="pct-orig-price" inputmode="decimal" step="any" min="0" value="250">
            </div>
            <div class="field-row">
              <div class="field">
                <label class="field__label" for="pct-disc">${escapeHtml(t.percentage.discPctLabel)}</label>
                <input class="input num" type="number" id="pct-disc" inputmode="decimal" step="1" min="0" max="100" value="25">
                <div class="pill-row">
                  <button type="button" class="pill-btn" data-pct-disc="10">10%</button>
                  <button type="button" class="pill-btn" data-pct-disc="20">20%</button>
                  <button type="button" class="pill-btn" data-pct-disc="30">30%</button>
                  <button type="button" class="pill-btn" data-pct-disc="50">50%</button>
                </div>
              </div>
              <div class="field">
                <label class="field__label" for="pct-extra-disc">${escapeHtml(t.percentage.extraDiscLabel)}${renderHint(t.hints.pctExtraDisc)}</label>
                <input class="input num" type="number" id="pct-extra-disc" inputmode="decimal" step="1" min="0" max="100" value="0">
                <div class="pill-row">
                  <button type="button" class="pill-btn" data-pct-extra="0">0%</button>
                  <button type="button" class="pill-btn" data-pct-extra="5">+5%</button>
                  <button type="button" class="pill-btn" data-pct-extra="10">+10%</button>
                  <button type="button" class="pill-btn" data-pct-extra="15">+15%</button>
                </div>
              </div>
            </div>
          </div>

          <div id="pct-panel-of" hidden>
            <div class="field-row">
              <div class="field">
                <label class="field__label" for="pct-part-rate">${escapeHtml(t.percentage.partPctLabel)}</label>
                <input class="input num" type="number" id="pct-part-rate" inputmode="decimal" step="any" min="0" value="20">
              </div>
              <div class="field">
                <label class="field__label" for="pct-base-num">${escapeHtml(t.percentage.baseNumLabel)}</label>
                <input class="input num" type="number" id="pct-base-num" inputmode="decimal" step="any" value="1500">
              </div>
            </div>
          </div>

          <div id="pct-panel-change" hidden>
            <div class="field-row">
              <div class="field">
                <label class="field__label" for="pct-from">${escapeHtml(t.percentage.fromValLabel)}</label>
                <input class="input num" type="number" id="pct-from" inputmode="decimal" step="any" value="2500">
              </div>
              <div class="field">
                <label class="field__label" for="pct-to">${escapeHtml(t.percentage.toValLabel)}</label>
                <input class="input num" type="number" id="pct-to" inputmode="decimal" step="any" value="2850">
              </div>
            </div>
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero" id="pct-hero-box">
            <span class="result-hero__label" id="pct-out-primary-label">${escapeHtml(t.percentage.outFinalPrice)}</span>
            <strong class="result-hero__value num" id="pct-out-primary">—</strong>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label" id="pct-k1-label">${escapeHtml(t.percentage.outYouSave)}</span>
              <strong class="kpi__value num" id="pct-k1-val">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label" id="pct-k2-label">${escapeHtml(t.percentage.outEffDiscount)}</span>
              <strong class="kpi__value num" id="pct-k2-val">—</strong>
            </div>
          </div>

          <div class="split-bar-block" id="pct-bar-wrap">
            <div class="split-bar" role="img" aria-label="Percentage split">
              <div class="split-bar__seg seg-navy" id="pct-bar-a" style="width:75%"></div>
              <div class="split-bar__seg seg-emerald" id="pct-bar-b" style="width:25%"></div>
            </div>
            <div class="split-legend" id="pct-legend"></div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="pct-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="pct-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="pct-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <section class="content-section" aria-labelledby="pct-table-title">
        <div class="section-head">
          <h2 id="pct-table-title" class="section-heading">${escapeHtml(t.percentage.tableHeading)}</h2>
          <p class="section-sub">${escapeHtml(t.percentage.tableSub)}</p>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.percentage.colDisc)}</th>
                <th class="num">${escapeHtml(t.percentage.colPayShare)}</th>
                <th class="num">${escapeHtml(t.percentage.colOn100)}</th>
                <th class="num">${escapeHtml(t.percentage.colOn500)}</th>
              </tr>
            </thead>
            <tbody>${tableRowsHtml}</tbody>
          </table>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.percentage.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.percentage.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.percentage.formulaDiscount)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.percentage.formulaChange)}</code></div>
        </div>
      </section>

      ${renderFaqSection(t.percentage.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('percentage', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'percentage',
    title: t.percentage.title,
    description: t.percentage.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: t.percentage.h1,
        description: t.percentage.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'Sale discount calculator with stacked extra promo code support',
          'Instant X% of a number calculator with remainder and +X% total',
          'Percentage increase and decrease calculator with absolute difference and multiplier',
          'Clickable discount reference table',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(t.percentage.faqs),
    ],
  });
}
