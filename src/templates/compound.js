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

export function renderCompoundPage(lang) {
  const t = getI18n(lang);
  const pageKey = 'compound';
  const defaultCurrency = SITE_CONFIG.defaultCurrencyByLang[lang];

  const defaultsByLang = {
    en: { principal: 10000, monthly: 500, rate: 8, years: 15 },
    de: { principal: 10000, monthly: 400, rate: 7, years: 15 },
    pl: { principal: 20000, monthly: 1500, rate: 8, years: 15 },
  };
  const def = defaultsByLang[lang] || defaultsByLang.en;

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.compound, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
  ];

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(t.compound.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(t.compound.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="compound" data-default-currency="${defaultCurrency}">
        <div class="calc-inputs">
          ${renderCurrencyControl('cmp', defaultCurrency, t)}

          <div class="field">
            <label class="field__label" for="cmp-principal">${escapeHtml(t.compound.principalLabel)}</label>
            <input class="input num" type="number" id="cmp-principal" inputmode="decimal" step="500" min="0" value="${def.principal}">
          </div>

          <div class="field">
            <label class="field__label" for="cmp-monthly">${escapeHtml(t.compound.monthlyLabel)}</label>
            <input class="input num" type="number" id="cmp-monthly" inputmode="decimal" step="50" min="0" value="${def.monthly}">
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="cmp-rate">${escapeHtml(t.compound.rateLabel)}</label>
              <input class="input num" type="number" id="cmp-rate" inputmode="decimal" step="0.25" min="0" max="100" value="${def.rate}">
            </div>
            <div class="field">
              <label class="field__label" for="cmp-years">${escapeHtml(t.compound.yearsLabel)}</label>
              <input class="input num" type="number" id="cmp-years" inputmode="numeric" step="1" min="1" max="50" value="${def.years}">
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="cmp-freq">${escapeHtml(t.compound.freqLabel)}</label>
            <select class="input" id="cmp-freq">
              <option value="12" selected>${escapeHtml(t.compound.freqMonthly)}</option>
              <option value="4">${escapeHtml(t.compound.freqQuarterly)}</option>
              <option value="2">${escapeHtml(t.compound.freqSemiannual)}</option>
              <option value="1">${escapeHtml(t.compound.freqAnnual)}</option>
            </select>
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero">
            <span class="result-hero__label">${escapeHtml(t.compound.outFutureValue)}</span>
            <strong class="result-hero__value num" id="cmp-out-fv">—</strong>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.compound.outTotalContrib)}</span>
              <strong class="kpi__value num" id="cmp-out-contrib">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.compound.outTotalInterest)}</span>
              <strong class="kpi__value num" id="cmp-out-interest">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.compound.outTotalRoi)}</span>
              <strong class="kpi__value num" id="cmp-out-roi">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.compound.outMultiple)}</span>
              <strong class="kpi__value num" id="cmp-out-mult">—</strong>
            </div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="cmp-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="cmp-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="cmp-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <section class="content-section" aria-labelledby="cmp-chart-title">
        <div class="chart-card">
          <div class="chart-card__head">
            <h2 id="cmp-chart-title" class="section-heading section-heading--sm">${escapeHtml(t.compound.chartHeading)}</h2>
            <div class="split-legend">
              <span><i class="dot seg-navy"></i>${escapeHtml(t.compound.legendPrincipal)}</span>
              <span><i class="dot seg-amber"></i>${escapeHtml(t.compound.legendContrib)}</span>
              <span><i class="dot seg-emerald"></i>${escapeHtml(t.compound.legendInterest)}</span>
            </div>
          </div>
          <div class="svg-chart-wrap" id="cmp-chart-wrap">
            <svg id="cmp-svg-chart" class="svg-chart" viewBox="0 0 760 300" role="img" aria-label="${escapeHtml(t.compound.chartHeading)}"></svg>
          </div>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section" aria-labelledby="cmp-table-title">
        <h2 id="cmp-table-title" class="section-heading">${escapeHtml(t.compound.tableHeading)}</h2>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.compound.colYear)}</th>
                <th>${escapeHtml(t.compound.colStart)}</th>
                <th>${escapeHtml(t.compound.colAdded)}</th>
                <th>${escapeHtml(t.compound.colInterest)}</th>
                <th>${escapeHtml(t.compound.colEnd)}</th>
                <th>${escapeHtml(t.compound.colRoi)}</th>
              </tr>
            </thead>
            <tbody id="cmp-table-body"></tbody>
          </table>
        </div>
      </section>

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.compound.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.compound.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.compound.formulaCompound)}</code></div>
        </div>
      </section>

      ${renderFaqSection(t.compound.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('compound', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'compound',
    title: t.compound.title,
    description: t.compound.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: t.compound.h1,
        description: t.compound.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'Compound interest and ROI projection with monthly contributions',
          'Dynamic responsive SVG portfolio growth chart',
          'Year-by-year amortization and growth schedule table',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(t.compound.faqs),
    ],
  });
}
