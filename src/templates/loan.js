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

export function renderLoanPage(lang) {
  const t = getI18n(lang);
  const pageKey = 'loan';
  const defaultCurrency = SITE_CONFIG.defaultCurrencyByLang[lang];

  const defaultsByLang = {
    en: { amount: 300000, rate: 6.5, years: 30, extra: 250, lump: 0, amtPills: [50000, 150000, 300000, 500000], extraPills: [0, 100, 250, 500] },
    de: { amount: 250000, rate: 3.8, years: 25, extra: 200, lump: 0, amtPills: [50000, 150000, 250000, 400000], extraPills: [0, 100, 200, 500] },
    pl: { amount: 400000, rate: 7.5, years: 25, extra: 500, lump: 0, amtPills: [50000, 200000, 400000, 600000], extraPills: [0, 250, 500, 1000] },
  };
  const def = defaultsByLang[lang] || defaultsByLang.en;

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.loan, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
  ];

  const amtPillsHtml = def.amtPills
    .map((v) => `<button type="button" class="pill-btn" data-loan-amt="${v}">${v >= 1000 ? `${v / 1000}k` : v}</button>`)
    .join('');

  const extraPillsHtml = def.extraPills
    .map((v) => `<button type="button" class="pill-btn" data-loan-extra="${v}">${v === 0 ? '0' : `+${v}`}</button>`)
    .join('');

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(t.loan.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(t.loan.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="loan" data-default-currency="${defaultCurrency}">
        <div class="calc-inputs">
          ${renderCurrencyControl('loan', defaultCurrency, t)}

          <div class="field">
            <label class="field__label" for="loan-amount">${escapeHtml(t.loan.amountLabel)}</label>
            <input class="input num" type="number" id="loan-amount" inputmode="decimal" step="1000" min="100" value="${def.amount}">
            <div class="pill-row">${amtPillsHtml}</div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="loan-rate">${escapeHtml(t.loan.rateLabel)}</label>
              <input class="input num" type="number" id="loan-rate" inputmode="decimal" step="0.1" min="0" max="40" value="${def.rate}">
              <input class="range-input" type="range" id="loan-rate-slider" min="0" max="18" step="0.1" value="${def.rate}" aria-label="${escapeHtml(t.loan.rateLabel)}">
            </div>
            <div class="field">
              <label class="field__label" for="loan-years">${escapeHtml(t.loan.yearsLabel)}</label>
              <input class="input num" type="number" id="loan-years" inputmode="numeric" step="1" min="1" max="40" value="${def.years}">
              <input class="range-input" type="range" id="loan-years-slider" min="1" max="40" step="1" value="${def.years}" aria-label="${escapeHtml(t.loan.yearsLabel)}">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="loan-extra">${escapeHtml(t.loan.extraMonthlyLabel)}${renderHint(t.hints.loanExtra)}</label>
              <input class="input num" type="number" id="loan-extra" inputmode="decimal" step="50" min="0" value="${def.extra}">
              <div class="pill-row">${extraPillsHtml}</div>
            </div>
            <div class="field">
              <label class="field__label" for="loan-lump">${escapeHtml(t.loan.lumpSumLabel)}${renderHint(t.hints.loanLump)}</label>
              <input class="input num" type="number" id="loan-lump" inputmode="decimal" step="1000" min="0" value="${def.lump}">
            </div>
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero-pair">
            <div class="result-hero">
              <span class="result-hero__label">${escapeHtml(t.loan.outMonthly)}</span>
              <strong class="result-hero__value num" id="loan-out-monthly">—</strong>
            </div>
            <div class="result-hero result-hero--alt">
              <span class="result-hero__label">${escapeHtml(t.loan.outInterestSaved)}</span>
              <strong class="result-hero__value num" id="loan-out-saved">—</strong>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.loan.outTimeSaved)}</span>
              <strong class="kpi__value num" id="loan-out-time-saved">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.loan.outPayoffTime)}</span>
              <strong class="kpi__value num" id="loan-out-payoff">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.loan.outTotalInterest)}</span>
              <strong class="kpi__value num" id="loan-out-interest">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.loan.outTotalCost)}</span>
              <strong class="kpi__value num" id="loan-out-total">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.loan.outBaseInterest)}</span>
              <strong class="kpi__value num" id="loan-out-base-int">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.loan.outMonthlyTotal)}</span>
              <strong class="kpi__value num" id="loan-out-monthly-total">—</strong>
            </div>
          </div>

          <div class="split-bar-block">
            <div class="split-bar" role="img" aria-label="${escapeHtml(t.loan.barPrincipal)} vs ${escapeHtml(t.loan.barInterest)}">
              <div class="split-bar__seg seg-navy" id="loan-bar-principal" style="width:50%"></div>
              <div class="split-bar__seg seg-terra" id="loan-bar-interest" style="width:35%"></div>
              <div class="split-bar__seg seg-emerald" id="loan-bar-saved" style="width:15%"></div>
            </div>
            <div class="split-legend">
              <span><i class="dot seg-navy"></i>${escapeHtml(t.loan.barPrincipal)} <strong class="num" id="loan-leg-principal">50%</strong></span>
              <span><i class="dot seg-terra"></i>${escapeHtml(t.loan.barInterest)} <strong class="num" id="loan-leg-interest">35%</strong></span>
              <span><i class="dot seg-emerald"></i>${escapeHtml(t.loan.barSaved)} <strong class="num" id="loan-leg-saved">15%</strong></span>
            </div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="loan-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="loan-download-csv">${escapeHtml(t.loan.downloadCsv)}</button>
            <button type="button" class="btn btn--secondary" id="loan-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="loan-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <section class="content-section" aria-labelledby="loan-chart-title">
        <div class="chart-card">
          <div class="chart-card__head">
            <h2 id="loan-chart-title" class="section-heading section-heading--sm">${escapeHtml(t.loan.chartHeading)}</h2>
            <div class="split-legend">
              <span><i class="dot seg-slate"></i>${escapeHtml(t.loan.legendStandard)}</span>
              <span><i class="dot seg-emerald"></i>${escapeHtml(t.loan.legendOverpay)}</span>
            </div>
          </div>
          <div class="svg-chart-wrap">
            <svg id="loan-svg-chart" class="svg-chart" viewBox="0 0 760 280" role="img" aria-label="${escapeHtml(t.loan.chartHeading)}"></svg>
          </div>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section" aria-labelledby="loan-table-title">
        <h2 id="loan-table-title" class="section-heading">${escapeHtml(t.loan.tableHeading)}</h2>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.loan.colYear)}</th>
                <th class="num">${escapeHtml(t.loan.colPayment)}</th>
                <th class="num">${escapeHtml(t.loan.colPrincipal)}</th>
                <th class="num">${escapeHtml(t.loan.colInterest)}</th>
                <th class="num">${escapeHtml(t.loan.colBalance)}</th>
                <th class="num">${escapeHtml(t.loan.colStdBalance)}</th>
              </tr>
            </thead>
            <tbody id="loan-table-body"></tbody>
          </table>
        </div>
      </section>

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.loan.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.loan.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.loan.formulaPayment)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.loan.formulaMonthlyRate)}</code></div>
        </div>
      </section>

      ${renderFaqSection(t.loan.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('loan', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'loan',
    title: t.loan.title,
    description: t.loan.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: t.loan.h1,
        description: t.loan.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'Monthly mortgage and loan payment calculation with interactive sliders',
          'Monthly overpayment and one-time lump-sum interest & time savings simulator',
          'Side-by-side SVG remaining balance chart comparing standard vs extra payments',
          'Full year-by-year amortization schedule with CSV download',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(t.loan.faqs),
    ],
  });
}
