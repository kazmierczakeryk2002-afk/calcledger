import { SITE_CONFIG } from '../config.js';
import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml } from '../data/i18n.js';
import {
  LOAN_PRESETS,
  formatMoneyStatic,
  formatMoneyRoundedStatic,
  computeLoanScenario,
} from '../data/personal-presets.js';
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

function formatMonthsLabel(months, t) {
  const m = Math.max(0, Math.round(months));
  if (m === 0) return t.loan.noSavings;
  const yrs = Math.floor(m / 12);
  const rem = m % 12;
  if (yrs > 0 && rem > 0) return `${yrs} ${t.loan.unitYears} ${rem} ${t.loan.unitMonths}`;
  if (yrs > 0) return `${yrs} ${t.loan.unitYears}`;
  return `${rem} ${t.loan.unitMonths}`;
}

export function renderLoanPage(lang, preset = null) {
  const t = getI18n(lang);
  const pageKey = preset ? `loan:${preset.key}` : 'loan';

  const defaultsByLang = {
    en: { amount: 300000, rate: 6.5, years: 30, extra: 250, lump: 0, amtPills: [150000, 300000, 500000, 750000], extraPills: [0, 100, 250, 500] },
    de: { amount: 250000, rate: 3.8, years: 25, extra: 200, lump: 0, amtPills: [150000, 250000, 400000, 500000], extraPills: [0, 100, 200, 500] },
    pl: { amount: 400000, rate: 7.5, years: 25, extra: 500, lump: 0, amtPills: [200000, 400000, 600000, 800000], extraPills: [0, 250, 500, 1000] },
  };
  const baseDef = defaultsByLang[lang] || defaultsByLang.en;
  const p = preset ? preset[lang] : null;
  const defaultCurrency = p ? p.currency : SITE_CONFIG.defaultCurrencyByLang[lang];
  const def = p
    ? {
        amount: p.amount,
        rate: p.rate,
        years: p.years,
        extra: p.extra,
        lump: 0,
        amtPills: baseDef.amtPills,
        extraPills: p.extras,
      }
    : baseDef;

  // Compute exact SSR overpayment scenarios for this preset (or default)
  const scenarioExtras = p ? p.extras : def.extraPills;
  const scenarios = scenarioExtras.map((ext) => ({
    extra: ext,
    ...computeLoanScenario(def.amount, def.rate, def.years, ext),
  }));
  const featured = scenarios[Math.min(2, scenarios.length - 1)];

  const locale = t.locale;
  const fmtMoney = (v) => formatMoneyStatic(v, defaultCurrency, locale);
  const fmtRound = (v) => formatMoneyRoundedStatic(v, defaultCurrency, locale);

  let title = t.loan.title;
  let description = t.loan.description;
  let h1 = t.loan.h1;
  let subtitle = t.loan.subtitle;
  let faqs = t.loan.faqs;

  if (p) {
    const basePayStr = fmtMoney(featured.baseMonthly);
    const savedIntStr = fmtRound(featured.interestSaved);
    const savedTimeStr = formatMonthsLabel(featured.monthsSaved, t);
    const extraStr = fmtRound(featured.extra);

    if (lang === 'pl') {
      title = `Kredyt ${p.label} — Rata i Nadpłata (+${extraStr}) | CalcLedger`;
      description = `Kredyt ${p.label} na ${p.years} lat (${p.rate}%): rata ${basePayStr}. Nadpłata ${extraStr}/mies. oszczędza ${savedIntStr} odsetek i skraca spłatę o ${savedTimeStr}.`;
      h1 = `Kredyt ${p.label} — Kalkulator Raty i Nadpłaty`;
      subtitle = `Dla kredytu ${p.label} na ${p.years} lat (${p.rate}%) rata wynosi ${basePayStr}. Regularna nadpłata ${extraStr} miesięcznie skraca kredyt o ${savedTimeStr} i oszczędza ${savedIntStr} odsetek.`;
      faqs = [
        {
          q: `Ile wynosi rata kredytu ${p.label} na ${p.years} lat?`,
          a: `Przy oprocentowaniu ${p.rate}% rocznie i ratach równych miesięczna rata kredytu ${p.label} na ${p.years} lat wynosi dokładnie ${basePayStr}, a łączne odsetki bez nadpłat to ${fmtRound(featured.baseInterest)}.`,
        },
        {
          q: `Ile zaoszczędzę, nadpłacając kredyt ${p.label} o ${extraStr} miesięcznie?`,
          a: `Dopłacając ${extraStr} miesięcznie do kredytu ${p.label} (${p.rate}%), skrócisz okres spłaty o ${savedTimeStr} i zaoszczędzisz ${savedIntStr} na odsetkach dla banku.`,
        },
        ...t.loan.faqs.slice(1),
      ];
    } else if (lang === 'de') {
      title = `Kredit ${p.label} — Rate & Sondertilgung Rechner | CalcLedger`;
      description = `Kredit ${p.label} (${p.years} Jahre, ${p.rate}%): Monatsrate ${basePayStr}. Mit ${extraStr}/Mon. Sondertilgung sparen Sie ${savedIntStr} Zinsen und ${savedTimeStr}.`;
      h1 = `Kredit ${p.label} — Raten- & Sondertilgungsrechner`;
      subtitle = `Bei ${p.label} über ${p.years} Jahre (${p.rate} %) liegt die Monatsrate bei ${basePayStr}. Mit ${extraStr} monatlicher Sondertilgung sparen Sie ${savedIntStr} Zinsen (${savedTimeStr} kürzer).`;
      faqs = [
        {
          q: `Wie hoch ist die monatliche Rate für einen ${p.label} Kredit?`,
          a: `Bei ${p.rate} % Sollzins und ${p.years} Jahren Laufzeit beträgt die Annuitätenrate für ${p.label} exakt ${basePayStr} pro Monat (Gesamtzinsen ohne Sondertilgung: ${fmtRound(featured.baseInterest)}).`,
        },
        {
          q: `Was bringt eine monatliche Sondertilgung von ${extraStr} bei ${p.label}?`,
          a: `Mit ${extraStr} extra pro Monat verkürzt sich die Rückzahlung um ${savedTimeStr} und Sie sparen ${savedIntStr} an Zinskosten.`,
        },
        ...t.loan.faqs.slice(1),
      ];
    } else {
      title = `${p.label} Mortgage & Extra Payment Calculator | CalcLedger`;
      description = `${p.label} loan at ${p.rate}% for ${p.years} yrs: ${basePayStr}/mo. Paying ${extraStr} extra monthly saves ${savedIntStr} in interest and cuts ${savedTimeStr} off payoff.`;
      h1 = `${p.label} Mortgage & Early Payoff Calculator`;
      subtitle = `A ${p.label} mortgage at ${p.rate}% over ${p.years} years costs ${basePayStr}/month. Adding ${extraStr}/month in extra principal saves ${savedIntStr} in interest and cuts ${savedTimeStr}.`;
      faqs = [
        {
          q: `What is the monthly payment on a ${p.label} mortgage?`,
          a: `At ${p.rate}% APR over ${p.years} years, principal and interest on a ${p.label} loan is ${basePayStr} per month (${fmtRound(featured.baseInterest)} total interest without extra payments).`,
        },
        {
          q: `How much does paying ${extraStr} extra per month save on a ${p.label} loan?`,
          a: `Adding ${extraStr} monthly toward principal cuts ${savedTimeStr} off your ${p.years}-year term and saves ${savedIntStr} in total interest.`,
        },
        ...t.loan.faqs.slice(1),
      ];
    }
  }

  const breadcrumbs = preset
    ? [
        { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
        { label: t.nav.loan, href: getRoutePath('loan', lang), url: getAbsoluteUrl('loan', lang) },
        { label: p.label, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
      ]
    : [
        { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
        { label: t.nav.loan, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
      ];

  const amtPillsHtml = def.amtPills
    .map((v) => `<button type="button" class="pill-btn" data-loan-amt="${v}">${v >= 1000 ? `${v / 1000}k` : v}</button>`)
    .join('');

  const extraPillsHtml = def.extraPills
    .map((v) => `<button type="button" class="pill-btn" data-loan-extra="${v}">${v === 0 ? '0' : `+${v}`}</button>`)
    .join('');

  const matrixHeading =
    lang === 'pl'
      ? `Porównanie wariantów nadpłaty dla kredytu ${p ? p.label : fmtRound(def.amount)} (${def.rate}%, ${def.years} lat)`
      : lang === 'de'
        ? `Sondertilgungs-Vergleich für ${p ? p.label : fmtRound(def.amount)} (${def.rate} %, ${def.years} Jahre)`
        : `Extra Payment Scenarios for a ${p ? p.label : fmtRound(def.amount)} Loan (${def.rate}%, ${def.years} yrs)`;

  const matrixRowsHtml = scenarios
    .map(
      (s) => `<tr class="clickable-row" data-loan-extra="${s.extra}" tabindex="0" role="button">
        <td class="num"><strong>${s.extra === 0 ? '0' : `+${fmtRound(s.extra)}`}</strong></td>
        <td class="num">${fmtMoney(s.totalMonthly)}</td>
        <td class="num"><strong>${fmtRound(s.interestSaved)}</strong></td>
        <td class="num">${formatMonthsLabel(s.monthsSaved, t)}</td>
        <td class="num">${formatMonthsLabel(s.months, t)}</td>
      </tr>`
    )
    .join('');

  const presetsHeading =
    lang === 'pl'
      ? 'Gotowe kalkulatory dla popularnych kwot kredytu'
      : lang === 'de'
        ? 'Kreditrechner für beliebte Darlehensbeträge'
        : 'Popular Mortgage & Loan Amount Calculators';

  const presetChipsHtml = LOAN_PRESETS.map((item) => {
    const it = item[lang];
    const isCurrent = preset && preset.key === item.key;
    const sc = computeLoanScenario(it.amount, it.rate, it.years, 0);
    return `<a class="chip-card${isCurrent ? ' is-current' : ''}" href="${escapeHtml(getRoutePath(`loan:${item.key}`, lang))}">
      <span class="chip-card__code">${it.years} ${t.loan.unitYears} · ${it.rate}%</span>
      <span class="chip-card__name">${escapeHtml(it.label)}</span>
      <span class="chip-card__meta">${escapeHtml(fmtMoney(sc.baseMonthly))}/m</span>
    </a>`;
  }).join('');

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(h1)}</h1>
        <p class="page-head__sub">${escapeHtml(subtitle)}</p>
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

      <section class="content-section" aria-labelledby="loan-matrix-title">
        <div class="section-head">
          <h2 id="loan-matrix-title" class="section-heading">${escapeHtml(matrixHeading)}</h2>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.loan.extraMonthlyLabel)}</th>
                <th class="num">${escapeHtml(t.loan.outMonthlyTotal)}</th>
                <th class="num">${escapeHtml(t.loan.outInterestSaved)}</th>
                <th class="num">${escapeHtml(t.loan.outTimeSaved)}</th>
                <th class="num">${escapeHtml(t.loan.outPayoffTime)}</th>
              </tr>
            </thead>
            <tbody>${matrixRowsHtml}</tbody>
          </table>
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

      <section class="content-section" aria-labelledby="loan-presets-title">
        <h2 id="loan-presets-title" class="section-heading">${escapeHtml(presetsHeading)}</h2>
        <div class="chip-grid">${presetChipsHtml}</div>
      </section>

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.loan.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.loan.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.loan.formulaPayment)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.loan.formulaMonthlyRate)}</code></div>
        </div>
      </section>

      ${renderFaqSection(faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('loan', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'loan',
    title,
    description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: h1,
        description,
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
      buildFaqJsonLd(faqs),
    ],
  });
}
