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

export function renderFreelancePage(lang) {
  const t = getI18n(lang);
  const pageKey = 'freelance';
  const defaultCurrency = SITE_CONFIG.defaultCurrencyByLang[lang];

  const defaultsByLang = {
    en: { income: 75000, overhead: 8000, tax: 32 },
    de: { income: 65000, overhead: 9000, tax: 42 },
    pl: { income: 180000, overhead: 24000, tax: 24 },
  };
  const def = defaultsByLang[lang] || defaultsByLang.en;

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.freelance, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
  ];

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(t.freelance.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(t.freelance.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="freelance" data-default-currency="${defaultCurrency}">
        <div class="calc-inputs">
          ${renderCurrencyControl('fl', defaultCurrency, t)}

          <div class="field">
            <label class="field__label" for="fl-income">${escapeHtml(t.freelance.targetIncomeLabel)}</label>
            <input class="input num" type="number" id="fl-income" inputmode="decimal" step="1000" min="0" value="${def.income}">
          </div>

          <div class="field">
            <label class="field__label" for="fl-overhead">${escapeHtml(t.freelance.overheadLabel)}</label>
            <input class="input num" type="number" id="fl-overhead" inputmode="decimal" step="500" min="0" value="${def.overhead}">
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="fl-tax">${escapeHtml(t.freelance.taxRateLabel)}</label>
              <input class="input num" type="number" id="fl-tax" inputmode="decimal" step="1" min="0" max="80" value="${def.tax}">
            </div>
            <div class="field">
              <label class="field__label" for="fl-weeks">${escapeHtml(t.freelance.workWeeksLabel)}</label>
              <input class="input num" type="number" id="fl-weeks" inputmode="decimal" step="1" min="1" max="52" value="44">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="fl-hours-week">${escapeHtml(t.freelance.hoursPerWeekLabel)}</label>
              <input class="input num" type="number" id="fl-hours-week" inputmode="decimal" step="1" min="1" max="80" value="40">
            </div>
            <div class="field">
              <label class="field__label" for="fl-billable-pct">${escapeHtml(t.freelance.billablePctLabel)}</label>
              <input class="input num" type="number" id="fl-billable-pct" inputmode="decimal" step="5" min="10" max="100" value="70">
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="fl-day-hours">${escapeHtml(t.freelance.dayHoursLabel)}</label>
            <input class="input num" type="number" id="fl-day-hours" inputmode="decimal" step="0.5" min="1" max="16" value="8">
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero-pair">
            <div class="result-hero">
              <span class="result-hero__label">${escapeHtml(t.freelance.outHourly)}</span>
              <strong class="result-hero__value num" id="fl-out-hourly">—</strong>
            </div>
            <div class="result-hero result-hero--alt">
              <span class="result-hero__label">${escapeHtml(t.freelance.outDayRate)}</span>
              <strong class="result-hero__value num" id="fl-out-day">—</strong>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.freelance.outMonthlyRev)}</span>
              <strong class="kpi__value num" id="fl-out-monthly">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.freelance.outAnnualRev)}</span>
              <strong class="kpi__value num" id="fl-out-annual">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.freelance.outBillableHours)}</span>
              <strong class="kpi__value num" id="fl-out-hours">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.freelance.outBillableDays)}</span>
              <strong class="kpi__value num" id="fl-out-days">—</strong>
            </div>
          </div>

          <div class="split-bar-block">
            <div class="split-bar" role="img" aria-label="Annual Revenue Breakdown">
              <div class="split-bar__seg seg-emerald" id="fl-bar-net" style="width:60%"></div>
              <div class="split-bar__seg seg-terra" id="fl-bar-tax" style="width:30%"></div>
              <div class="split-bar__seg seg-navy" id="fl-bar-overhead" style="width:10%"></div>
            </div>
            <div class="split-legend">
              <span><i class="dot seg-emerald"></i>${escapeHtml(t.freelance.barNetIncome)} <strong class="num" id="fl-leg-net">—</strong></span>
              <span><i class="dot seg-terra"></i>${escapeHtml(t.freelance.barTaxes)} <strong class="num" id="fl-leg-tax">—</strong></span>
              <span><i class="dot seg-navy"></i>${escapeHtml(t.freelance.barOverhead)} <strong class="num" id="fl-leg-overhead">—</strong></span>
            </div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="fl-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="fl-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="fl-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.freelance.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.freelance.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.freelance.formulaRev)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.freelance.formulaHourly)}</code></div>
        </div>
      </section>

      ${renderFaqSection(t.freelance.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('freelance', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'freelance',
    title: t.freelance.title,
    description: t.freelance.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: t.freelance.h1,
        description: t.freelance.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'B2B hourly rate and day rate calculation',
          'Overhead, taxes, vacation weeks, and billable utilization modeling',
          'Annual and monthly required revenue breakdown',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(t.freelance.faqs),
    ],
  });
}
