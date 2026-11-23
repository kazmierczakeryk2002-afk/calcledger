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

const ROAS_REFERENCE = [1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10];

export function renderRoasPage(lang) {
  const t = getI18n(lang);
  const pageKey = 'roas';
  const defaultCurrency = SITE_CONFIG.defaultCurrencyByLang[lang];

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.roas, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
  ];

  const refRowsHtml = ROAS_REFERENCE.map((roas) => {
    const acos = 100 / roas;
    const revPer100 = 100 * roas;
    return `<tr class="clickable-row" data-apply-roas="${roas}" tabindex="0" role="button">
      <td class="num"><strong>${roas.toFixed(roas % 1 === 0 ? 1 : 2)}×</strong></td>
      <td class="num">${acos.toFixed(2)}%</td>
      <td class="num">${acos.toFixed(2)}%</td>
      <td class="num">${revPer100.toFixed(0)}</td>
    </tr>`;
  }).join('');

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(t.roas.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(t.roas.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="roas" data-default-currency="${defaultCurrency}">
        <div class="calc-inputs">
          ${renderCurrencyControl('roas', defaultCurrency, t)}

          <div class="field">
            <label class="field__label" for="roas-spend">${escapeHtml(t.roas.adSpendLabel)}</label>
            <input class="input num" type="number" id="roas-spend" inputmode="decimal" step="any" min="0" value="1000">
          </div>

          <div class="field">
            <label class="field__label" for="roas-rev">${escapeHtml(t.roas.adRevLabel)}</label>
            <input class="input num" type="number" id="roas-rev" inputmode="decimal" step="any" min="0" value="4000">
          </div>

          <div class="field">
            <label class="field__label" for="roas-margin">${escapeHtml(t.roas.marginBeforeAdsLabel)}</label>
            <input class="input num" type="number" id="roas-margin" inputmode="decimal" step="1" min="1" max="100" value="40">
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero-pair">
            <div class="result-hero" id="roas-hero-box">
              <span class="result-hero__label">${escapeHtml(t.roas.outRoas)}</span>
              <strong class="result-hero__value num" id="roas-out-roas">—</strong>
            </div>
            <div class="result-hero result-hero--alt">
              <span class="result-hero__label">${escapeHtml(t.roas.outAcos)}</span>
              <strong class="result-hero__value num" id="roas-out-acos">—</strong>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.roas.outBeRoas)}</span>
              <strong class="kpi__value num" id="roas-out-be-roas">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.roas.outBeAcos)}</span>
              <strong class="kpi__value num" id="roas-out-be-acos">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.roas.outNetProfit)}</span>
              <strong class="kpi__value num" id="roas-out-profit">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.roas.outNetMargin)}</span>
              <strong class="kpi__value num" id="roas-out-net-margin">—</strong>
            </div>
          </div>

          <div class="split-bar-block">
            <div class="split-bar" role="img" aria-label="Ad Revenue Breakdown">
              <div class="split-bar__seg seg-navy" id="roas-bar-cogs" style="width:60%"></div>
              <div class="split-bar__seg seg-terra" id="roas-bar-ads" style="width:25%"></div>
              <div class="split-bar__seg seg-emerald" id="roas-bar-profit" style="width:15%"></div>
            </div>
            <div class="split-legend" id="roas-legend"></div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="roas-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="roas-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="roas-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <section class="content-section" aria-labelledby="roas-table-title">
        <div class="section-head">
          <h2 id="roas-table-title" class="section-heading">${escapeHtml(t.roas.tableHeading)}</h2>
          <p class="section-sub">${escapeHtml(t.roas.tableSub)}</p>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.roas.colRoas)}</th>
                <th class="num">${escapeHtml(t.roas.colAcos)}</th>
                <th class="num">${escapeHtml(t.roas.colMinMargin)}</th>
                <th class="num">${escapeHtml(t.roas.colRevPer100)}</th>
              </tr>
            </thead>
            <tbody>${refRowsHtml}</tbody>
          </table>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.roas.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.roas.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.roas.formulaRoas)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.roas.formulaAcos)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.roas.formulaBeRoas)}</code></div>
        </div>
      </section>

      ${renderFaqSection(t.roas.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('roas', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'roas',
    title: t.roas.title,
    description: t.roas.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: t.roas.h1,
        description: t.roas.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'ROAS to ACOS and ACOS to ROAS instant conversion',
          'Break-Even ROAS and Break-Even ACOS calculation from product margin',
          'Net profit after ad spend and COGS',
          'Interactive clickable ROAS to ACOS reference table',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(t.roas.faqs),
    ],
  });
}
