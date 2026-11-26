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

export function renderSalaryPage(lang) {
  const t = getI18n(lang);
  const pageKey = 'salary';
  const defaultCurrency = SITE_CONFIG.defaultCurrencyByLang[lang];

  const defaultsByLang = {
    en: {
      amount: 4500,
      tax: 25,
      hours: 40,
      raise: 10,
      purchase: 1200,
      taxPresets: [
        { label: 'US ~25%', pct: 25 },
        { label: 'UK ~24%', pct: 24 },
        { label: 'DE I ~38%', pct: 38 },
        { label: 'PL UoP ~29%', pct: 29 },
      ],
    },
    de: {
      amount: 3000,
      tax: 38,
      hours: 40,
      raise: 8,
      purchase: 999,
      taxPresets: [
        { label: 'StKl I ~38%', pct: 38 },
        { label: 'StKl III ~26%', pct: 26 },
        { label: 'AT ~33%', pct: 33 },
        { label: 'CH ~20%', pct: 20 },
      ],
    },
    pl: {
      amount: 6500,
      tax: 29,
      hours: 40,
      raise: 10,
      purchase: 3500,
      taxPresets: [
        { label: 'UoP ~29%', pct: 29 },
        { label: 'Zlecenie ~23%', pct: 23 },
        { label: 'PIT-0 (<26) ~14%', pct: 14 },
        { label: 'DE StKl I ~38%', pct: 38 },
      ],
    },
  };
  const def = defaultsByLang[lang] || defaultsByLang.en;

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.salary, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
  ];

  const taxPillsHtml = def.taxPresets
    .map((p) => `<button type="button" class="pill-btn" data-sal-tax="${p.pct}">${escapeHtml(p.label)}</button>`)
    .join('');

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(t.salary.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(t.salary.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="salary" data-default-currency="${defaultCurrency}">
        <div class="calc-inputs">
          ${renderCurrencyControl('sal', defaultCurrency, t)}

          <div class="field">
            <span class="field__label">${escapeHtml(t.salary.modeLabel)}</span>
            <div class="seg-group seg-group--full" role="group" aria-label="${escapeHtml(t.salary.modeLabel)}">
              <button type="button" class="seg-btn is-active" data-sal-mode="net" aria-pressed="true">${escapeHtml(t.salary.modeNet)}</button>
              <button type="button" class="seg-btn" data-sal-mode="gross" aria-pressed="false">${escapeHtml(t.salary.modeGross)}</button>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="sal-amount" id="sal-amount-label">${escapeHtml(t.salary.amountLabelNet)}</label>
              <input class="input num" type="number" id="sal-amount" inputmode="decimal" step="100" min="0" value="${def.amount}">
            </div>
            <div class="field">
              <label class="field__label" for="sal-period">${escapeHtml(t.salary.periodLabel)}</label>
              <select class="input" id="sal-period">
                <option value="monthly" selected>${escapeHtml(t.salary.periodMonthly)}</option>
                <option value="yearly">${escapeHtml(t.salary.periodYearly)}</option>
                <option value="hourly">${escapeHtml(t.salary.periodHourly)}</option>
              </select>
            </div>
          </div>

          <div class="field" id="sal-tax-wrap" hidden>
            <label class="field__label" for="sal-tax">${escapeHtml(t.salary.taxLabel)}${renderHint(t.hints.salaryTax)}</label>
            <input class="input num" type="number" id="sal-tax" inputmode="decimal" step="0.5" min="0" max="75" value="${def.tax}">
            <div class="pill-row">${taxPillsHtml}</div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="sal-hours">${escapeHtml(t.salary.hoursLabel)}</label>
              <input class="input num" type="number" id="sal-hours" inputmode="decimal" step="1" min="5" max="80" value="${def.hours}">
            </div>
            <div class="field">
              <label class="field__label" for="sal-raise">${escapeHtml(t.salary.raiseLabel)}</label>
              <input class="input num" type="number" id="sal-raise" inputmode="decimal" step="1" min="0" max="100" value="${def.raise}">
              <input class="range-input" type="range" id="sal-raise-slider" min="0" max="50" step="1" value="${def.raise}" aria-label="${escapeHtml(t.salary.raiseLabel)}">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="sal-rule">${escapeHtml(t.salary.budgetRuleLabel)}</label>
              <select class="input" id="sal-rule">
                <option value="50-30-20" selected>50 / 30 / 20</option>
                <option value="60-20-20">60 / 20 / 20</option>
                <option value="70-20-10">70 / 20 / 10</option>
                <option value="50-20-30">50 / 20 / 30</option>
              </select>
            </div>
            <div class="field">
              <label class="field__label" for="sal-purchase">${escapeHtml(t.salary.purchaseLabel)}${renderHint(t.hints.salaryPurchase)}</label>
              <input class="input num" type="number" id="sal-purchase" inputmode="decimal" step="50" min="0" value="${def.purchase}">
            </div>
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero-pair">
            <div class="result-hero">
              <span class="result-hero__label">${escapeHtml(t.salary.outMonthlyNet)}</span>
              <strong class="result-hero__value num" id="sal-out-monthly">—</strong>
            </div>
            <div class="result-hero result-hero--alt">
              <span class="result-hero__label">${escapeHtml(t.salary.outHourlyNet)}</span>
              <strong class="result-hero__value num" id="sal-out-hourly">—</strong>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.salary.outDailyNet)}</span>
              <strong class="kpi__value num" id="sal-out-daily">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.salary.outYearlyNet)}</span>
              <strong class="kpi__value num" id="sal-out-yearly">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.salary.outRaiseMonthly)}</span>
              <strong class="kpi__value num" id="sal-out-raise-mo">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.salary.outRaiseYearlyGain)}</span>
              <strong class="kpi__value num" id="sal-out-raise-yr">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.salary.outWorkHours)}</span>
              <strong class="kpi__value num" id="sal-out-workhours">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.salary.outEmergency)}</span>
              <strong class="kpi__value num" id="sal-out-emergency">—</strong>
            </div>
          </div>

          <div class="split-bar-block">
            <div class="split-bar" role="img" aria-label="${escapeHtml(t.salary.budgetRuleLabel)}">
              <div class="split-bar__seg seg-navy" id="sal-bar-needs" style="width:50%"></div>
              <div class="split-bar__seg seg-amber" id="sal-bar-wants" style="width:30%"></div>
              <div class="split-bar__seg seg-emerald" id="sal-bar-savings" style="width:20%"></div>
            </div>
            <div class="split-legend">
              <span><i class="dot seg-navy"></i>${escapeHtml(t.salary.barNeeds)} <strong class="num" id="sal-leg-needs">50%</strong></span>
              <span><i class="dot seg-amber"></i>${escapeHtml(t.salary.barWants)} <strong class="num" id="sal-leg-wants">30%</strong></span>
              <span><i class="dot seg-emerald"></i>${escapeHtml(t.salary.barSavings)} <strong class="num" id="sal-leg-savings">20%</strong></span>
            </div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="sal-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="sal-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="sal-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <section class="content-section" aria-labelledby="sal-budget-title">
        <h2 id="sal-budget-title" class="section-heading">${escapeHtml(t.salary.budgetHeading)}</h2>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.salary.colCategory)}</th>
                <th class="num">${escapeHtml(t.salary.colShare)}</th>
                <th class="num">${escapeHtml(t.salary.colMonthly)}</th>
                <th class="num">${escapeHtml(t.salary.colYearly)}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${escapeHtml(t.salary.rowNeeds)}</strong></td>
                <td class="num" id="sal-t-needs-pct">50%</td>
                <td class="num"><strong id="sal-t-needs-mo">—</strong></td>
                <td class="num" id="sal-t-needs-yr">—</td>
              </tr>
              <tr>
                <td><strong>${escapeHtml(t.salary.rowWants)}</strong></td>
                <td class="num" id="sal-t-wants-pct">30%</td>
                <td class="num"><strong id="sal-t-wants-mo">—</strong></td>
                <td class="num" id="sal-t-wants-yr">—</td>
              </tr>
              <tr>
                <td><strong>${escapeHtml(t.salary.rowSavings)}</strong></td>
                <td class="num" id="sal-t-savings-pct">20%</td>
                <td class="num"><strong id="sal-t-savings-mo">—</strong></td>
                <td class="num" id="sal-t-savings-yr">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.salary.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.salary.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.salary.formulaHourly)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.salary.formulaBudget)}</code></div>
        </div>
      </section>

      ${renderFaqSection(t.salary.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('salary', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'salary',
    title: t.salary.title,
    description: t.salary.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: t.salary.h1,
        description: t.salary.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'Net and Gross-to-Net salary converter (monthly, yearly, daily, hourly)',
          'Interactive pay raise simulator with annual gain breakdown',
          '50/30/20, 60/20/20, and 70/20/10 household budget planner + 6-month emergency fund',
          'Work-hours purchase cost converter',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(t.salary.faqs),
    ],
  });
}
