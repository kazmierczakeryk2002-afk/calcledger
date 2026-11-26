import { SITE_CONFIG } from '../config.js';
import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml } from '../data/i18n.js';
import {
  SALARY_PRESETS,
  formatMoneyStatic,
  formatMoneyRoundedStatic,
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

export function renderSalaryPage(lang, preset = null) {
  const t = getI18n(lang);
  const pageKey = preset ? `salary:${preset.key}` : 'salary';

  const defaultsByLang = {
    en: {
      amount: 4500,
      period: 'monthly',
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
      period: 'monthly',
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
      period: 'monthly',
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
  const baseDef = defaultsByLang[lang] || defaultsByLang.en;
  const p = preset ? preset[lang] : null;
  const defaultCurrency = p ? p.currency : SITE_CONFIG.defaultCurrencyByLang[lang];
  const def = p
    ? {
        ...baseDef,
        amount: p.amount,
        period: p.period,
        tax: p.taxPct,
      }
    : baseDef;

  // SSR summary metrics for preset pages (40 h/wk = 2080 h/yr)
  const annualNetSsr = def.period === 'yearly' ? def.amount : def.amount * 12;
  const monthlyNetSsr = annualNetSsr / 12;
  const hourlyNetSsr = annualNetSsr / (def.hours * 52);
  const dailyNetSsr = hourlyNetSsr * 8;
  const needsMoSsr = monthlyNetSsr * 0.5;
  const wantsMoSsr = monthlyNetSsr * 0.3;
  const savingsMoSsr = monthlyNetSsr * 0.2;
  const emergencySsr = needsMoSsr * 6;

  const fmtMoney = (v) => formatMoneyStatic(v, defaultCurrency, t.locale);
  const fmtRound = (v) => formatMoneyRoundedStatic(v, defaultCurrency, t.locale);

  let title = t.salary.title;
  let description = t.salary.description;
  let h1 = t.salary.h1;
  let subtitle = t.salary.subtitle;
  let faqs = t.salary.faqs;

  if (p) {
    const hrStr = fmtMoney(hourlyNetSsr);
    const moStr = fmtRound(monthlyNetSsr);
    const yrStr = fmtRound(annualNetSsr);
    const savStr = fmtRound(savingsMoSsr);

    if (lang === 'pl') {
      title = `${p.label} — Stawka Godzinowa i Budżet 50/30/20 | CalcLedger`;
      description = `Zarobki ${p.label} miesięcznie to ${hrStr}/godz. (${yrStr}/rok). Zobacz gotowy podział budżetu 50/30/20 (odkładaj ${savStr}/mies.), podwyżkę i poduszkę 6 mies.`;
      h1 = `${p.label} — Ile to za godzinę i Plan Budżetu 50/30/20`;
      subtitle = `Przy wypłacie ${p.label} (40 h/tydz.) Twoja realna stawka wynosi ${hrStr} za godzinę (${fmtMoney(dailyNetSsr)} dziennie). W regule 50/30/20 odkładasz ${savStr} miesięcznie.`;
      faqs = [
        {
          q: `Ile to za godzinę przy pensji ${p.label} na pełen etat?`,
          a: `Przy 40 godzinach pracy tygodniowo (2 080 godz. rocznie) pensja ${p.label} miesięcznie daje ${yrStr} rocznie, czyli dokładnie ${hrStr} na rękę za każdą godzinę (${fmtMoney(dailyNetSsr)} za 8-godzinny dzień).`,
        },
        {
          q: `Jak podzielić ${p.label} według zasady 50/30/20?`,
          a: `Przeznacz ${fmtRound(needsMoSsr)} na stałe potrzeby i rachunki (50%), ${fmtRound(wantsMoSsr)} na przyjemności i styl życia (30%) oraz ${savStr} na oszczędności i inwestycje (20%). Poduszka 6-miesięczna to ${fmtRound(emergencySsr)}.`,
        },
        ...t.salary.faqs.slice(1),
      ];
    } else if (lang === 'de') {
      title = `${p.label} Gehalt — Stundenlohn & 50/30/20 Budget | CalcLedger`;
      description = `${p.label} im Monat entspricht ${hrStr}/Std. (${yrStr}/Jahr). Komplettes 50/30/20-Budget (${savStr}/Mon. sparen), Gehaltserhöhung & Notgroschen-Plan.`;
      h1 = `${p.label} Gehalt — Stundenlohn & 50/30/20 Budgetplan`;
      subtitle = `Bei ${p.label} monatlich (40 Std./Woche) liegt Ihr echter Stundenlohn bei ${hrStr} (${fmtMoney(dailyNetSsr)} pro Tag). Mit 50/30/20 sparen Sie ${savStr} jeden Monat.`;
      faqs = [
        {
          q: `Wie hoch ist der Stundenlohn bei ${p.label} im Monat?`,
          a: `Bei einer 40-Stunden-Woche (2.080 Stunden im Jahr) ergibt ${p.label} monatlich ein Jahresnetto von ${yrStr} — das entspricht ${hrStr} pro Stunde bzw. ${fmtMoney(dailyNetSsr)} pro Arbeitstag.`,
        },
        {
          q: `Wie teile ich ${p.label} nach der 50/30/20-Regel auf?`,
          a: `50 % (${fmtRound(needsMoSsr)}) für Fixkosten, 30 % (${fmtRound(wantsMoSsr)}) für Freizeit & Wünsche und 20 % (${savStr}) für Sparen & ETFs. Ihr 6-Monats-Notgroschen beträgt ${fmtRound(emergencySsr)}.`,
        },
        ...t.salary.faqs.slice(1),
      ];
    } else {
      title = `${p.label} Is How Much an Hour? + 50/30/20 Budget | CalcLedger`;
      description = `${p.label} equals ${hrStr}/hour (${moStr}/month). See your daily rate, complete 50/30/20 budget (${savStr}/mo savings), raise impact & 6-month emergency fund.`;
      h1 = `${p.label} Salary — Hourly Rate & 50/30/20 Budget`;
      subtitle = `At 40 hours per week, ${p.label} works out to ${hrStr} per hour (${fmtMoney(dailyNetSsr)}/day, ${moStr}/month). With 50/30/20 budgeting you save ${savStr} every month.`;
      faqs = [
        {
          q: `How much is ${p.label} per hour and per month?`,
          a: `Based on a standard 40-hour workweek (2,080 hours/year), ${p.label} equals ${hrStr} per hour, ${fmtMoney(dailyNetSsr)} per 8-hour day, and ${moStr} per month.`,
        },
        {
          q: `What is the 50/30/20 budget on ${p.label}?`,
          a: `Allocate ${fmtRound(needsMoSsr)}/month to essentials (50%), ${fmtRound(wantsMoSsr)}/month to wants (30%), and ${savStr}/month to savings & investing (20%). A 6-month emergency fund is ${fmtRound(emergencySsr)}.`,
        },
        ...t.salary.faqs.slice(1),
      ];
    }
  }

  const breadcrumbs = preset
    ? [
        { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
        { label: t.nav.salary, href: getRoutePath('salary', lang), url: getAbsoluteUrl('salary', lang) },
        { label: p.short, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
      ]
    : [
        { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
        { label: t.nav.salary, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
      ];

  const taxPillsHtml = def.taxPresets
    .map((tp) => `<button type="button" class="pill-btn" data-sal-tax="${tp.pct}">${escapeHtml(tp.label)}</button>`)
    .join('');

  const presetsHeading =
    lang === 'pl'
      ? 'Gotowe przeliczniki dla popularnych zarobków w Polsce'
      : lang === 'de'
        ? 'Gehalts- & Budgetrechner für beliebte Einkommen'
        : 'Popular Salary to Hourly & 50/30/20 Budget Guides';

  const presetChipsHtml = SALARY_PRESETS.map((item) => {
    const it = item[lang];
    const isCurrent = preset && preset.key === item.key;
    const yr = it.period === 'yearly' ? it.amount : it.amount * 12;
    const hr = yr / (40 * 52);
    return `<a class="chip-card${isCurrent ? ' is-current' : ''}" href="${escapeHtml(getRoutePath(`salary:${item.key}`, lang))}">
      <span class="chip-card__code">50 / 30 / 20</span>
      <span class="chip-card__name">${escapeHtml(it.label)}</span>
      <span class="chip-card__meta">${escapeHtml(formatMoneyStatic(hr, it.currency, t.locale))}/h</span>
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
                <option value="monthly"${def.period === 'monthly' ? ' selected' : ''}>${escapeHtml(t.salary.periodMonthly)}</option>
                <option value="yearly"${def.period === 'yearly' ? ' selected' : ''}>${escapeHtml(t.salary.periodYearly)}</option>
                <option value="hourly"${def.period === 'hourly' ? ' selected' : ''}>${escapeHtml(t.salary.periodHourly)}</option>
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
              <strong class="result-hero__value num" id="sal-out-monthly">${escapeHtml(fmtMoney(monthlyNetSsr))}</strong>
            </div>
            <div class="result-hero result-hero--alt">
              <span class="result-hero__label">${escapeHtml(t.salary.outHourlyNet)}</span>
              <strong class="result-hero__value num" id="sal-out-hourly">${escapeHtml(fmtMoney(hourlyNetSsr))}</strong>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.salary.outDailyNet)}</span>
              <strong class="kpi__value num" id="sal-out-daily">${escapeHtml(fmtMoney(dailyNetSsr))}</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.salary.outYearlyNet)}</span>
              <strong class="kpi__value num" id="sal-out-yearly">${escapeHtml(fmtMoney(annualNetSsr))}</strong>
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
              <strong class="kpi__value num" id="sal-out-emergency">${escapeHtml(fmtMoney(emergencySsr))}</strong>
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
                <td class="num"><strong id="sal-t-needs-mo">${escapeHtml(fmtMoney(needsMoSsr))}</strong></td>
                <td class="num" id="sal-t-needs-yr">${escapeHtml(fmtMoney(needsMoSsr * 12))}</td>
              </tr>
              <tr>
                <td><strong>${escapeHtml(t.salary.rowWants)}</strong></td>
                <td class="num" id="sal-t-wants-pct">30%</td>
                <td class="num"><strong id="sal-t-wants-mo">${escapeHtml(fmtMoney(wantsMoSsr))}</strong></td>
                <td class="num" id="sal-t-wants-yr">${escapeHtml(fmtMoney(wantsMoSsr * 12))}</td>
              </tr>
              <tr>
                <td><strong>${escapeHtml(t.salary.rowSavings)}</strong></td>
                <td class="num" id="sal-t-savings-pct">20%</td>
                <td class="num"><strong id="sal-t-savings-mo">${escapeHtml(fmtMoney(savingsMoSsr))}</strong></td>
                <td class="num" id="sal-t-savings-yr">${escapeHtml(fmtMoney(savingsMoSsr * 12))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="content-section" aria-labelledby="sal-presets-title">
        <h2 id="sal-presets-title" class="section-heading">${escapeHtml(presetsHeading)}</h2>
        <div class="chip-grid">${presetChipsHtml}</div>
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

      ${renderFaqSection(faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('salary', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'salary',
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
          'Net and Gross-to-Net salary converter (monthly, yearly, daily, hourly)',
          'Interactive pay raise simulator with annual gain breakdown',
          '50/30/20, 60/20/20, and 70/20/10 household budget planner + 6-month emergency fund',
          'Work-hours purchase cost converter',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(faqs),
    ],
  });
}
