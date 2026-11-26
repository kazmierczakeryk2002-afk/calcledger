/**
 * Programmatic SEO long-tail datasets for Personal Finance:
 * - 6 Salary & 50/30/20 Budget tiers (localized per EN / DE / PL market)
 * - 6 Loan & Mortgage Early Payoff tiers (localized per EN / DE / PL market)
 */

export const SALARY_PRESETS = [
  {
    key: 'tier-1',
    slugs: { en: '50k-salary', de: '2500-euro', pl: '5000-zl' },
    en: { amount: 50000, period: 'yearly', currency: 'USD', label: '$50,000 / year', short: '$50k/yr', taxPct: 22 },
    de: { amount: 2500, period: 'monthly', currency: 'EUR', label: '2.500 € Netto', short: '2.500 €/Mon.', taxPct: 35 },
    pl: { amount: 5000, period: 'monthly', currency: 'PLN', label: '5 000 zł netto', short: '5 000 zł/mies.', taxPct: 28 },
  },
  {
    key: 'tier-2',
    slugs: { en: '60k-salary', de: '3000-euro', pl: '6000-zl' },
    en: { amount: 60000, period: 'yearly', currency: 'USD', label: '$60,000 / year', short: '$60k/yr', taxPct: 24 },
    de: { amount: 3000, period: 'monthly', currency: 'EUR', label: '3.000 € Netto', short: '3.000 €/Mon.', taxPct: 38 },
    pl: { amount: 6000, period: 'monthly', currency: 'PLN', label: '6 000 zł netto', short: '6 000 zł/mies.', taxPct: 29 },
  },
  {
    key: 'tier-3',
    slugs: { en: '75k-salary', de: '3500-euro', pl: '8000-zl' },
    en: { amount: 75000, period: 'yearly', currency: 'USD', label: '$75,000 / year', short: '$75k/yr', taxPct: 25 },
    de: { amount: 3500, period: 'monthly', currency: 'EUR', label: '3.500 € Netto', short: '3.500 €/Mon.', taxPct: 40 },
    pl: { amount: 8000, period: 'monthly', currency: 'PLN', label: '8 000 zł netto', short: '8 000 zł/mies.', taxPct: 30 },
  },
  {
    key: 'tier-4',
    slugs: { en: '90k-salary', de: '4000-euro', pl: '10000-zl' },
    en: { amount: 90000, period: 'yearly', currency: 'USD', label: '$90,000 / year', short: '$90k/yr', taxPct: 27 },
    de: { amount: 4000, period: 'monthly', currency: 'EUR', label: '4.000 € Netto', short: '4.000 €/Mon.', taxPct: 41 },
    pl: { amount: 10000, period: 'monthly', currency: 'PLN', label: '10 000 zł netto', short: '10 000 zł/mies.', taxPct: 31 },
  },
  {
    key: 'tier-5',
    slugs: { en: '100k-salary', de: '5000-euro', pl: '12000-zl' },
    en: { amount: 100000, period: 'yearly', currency: 'USD', label: '$100,000 / year', short: '$100k/yr', taxPct: 28 },
    de: { amount: 5000, period: 'monthly', currency: 'EUR', label: '5.000 € Netto', short: '5.000 €/Mon.', taxPct: 43 },
    pl: { amount: 12000, period: 'monthly', currency: 'PLN', label: '12 000 zł netto', short: '12 000 zł/mies.', taxPct: 32 },
  },
  {
    key: 'tier-6',
    slugs: { en: '120k-salary', de: '6000-euro', pl: '15000-zl' },
    en: { amount: 120000, period: 'yearly', currency: 'USD', label: '$120,000 / year', short: '$120k/yr', taxPct: 30 },
    de: { amount: 6000, period: 'monthly', currency: 'EUR', label: '6.000 € Netto', short: '6.000 €/Mon.', taxPct: 44 },
    pl: { amount: 15000, period: 'monthly', currency: 'PLN', label: '15 000 zł netto', short: '15 000 zł/mies.', taxPct: 34 },
  },
];

export const LOAN_PRESETS = [
  {
    key: 'tier-1',
    slugs: { en: '150k-mortgage', de: '150000-euro', pl: '200-tys' },
    en: { amount: 150000, rate: 6.5, years: 30, extra: 200, currency: 'USD', label: '$150,000', extras: [0, 100, 200, 500] },
    de: { amount: 150000, rate: 3.8, years: 20, extra: 200, currency: 'EUR', label: '150.000 €', extras: [0, 100, 200, 400] },
    pl: { amount: 200000, rate: 7.5, years: 20, extra: 300, currency: 'PLN', label: '200 000 zł', extras: [0, 200, 300, 600] },
  },
  {
    key: 'tier-2',
    slugs: { en: '200k-mortgage', de: '200000-euro', pl: '300-tys' },
    en: { amount: 200000, rate: 6.5, years: 30, extra: 250, currency: 'USD', label: '$200,000', extras: [0, 150, 250, 500] },
    de: { amount: 200000, rate: 3.8, years: 25, extra: 200, currency: 'EUR', label: '200.000 €', extras: [0, 100, 200, 500] },
    pl: { amount: 300000, rate: 7.5, years: 25, extra: 400, currency: 'PLN', label: '300 000 zł', extras: [0, 250, 400, 800] },
  },
  {
    key: 'tier-3',
    slugs: { en: '300k-mortgage', de: '250000-euro', pl: '400-tys' },
    en: { amount: 300000, rate: 6.5, years: 30, extra: 300, currency: 'USD', label: '$300,000', extras: [0, 200, 300, 600] },
    de: { amount: 250000, rate: 3.8, years: 25, extra: 250, currency: 'EUR', label: '250.000 €', extras: [0, 150, 250, 500] },
    pl: { amount: 400000, rate: 7.5, years: 25, extra: 500, currency: 'PLN', label: '400 000 zł', extras: [0, 300, 500, 1000] },
  },
  {
    key: 'tier-4',
    slugs: { en: '400k-mortgage', de: '300000-euro', pl: '500-tys' },
    en: { amount: 400000, rate: 6.5, years: 30, extra: 400, currency: 'USD', label: '$400,000', extras: [0, 250, 400, 800] },
    de: { amount: 300000, rate: 3.8, years: 25, extra: 300, currency: 'EUR', label: '300.000 €', extras: [0, 150, 300, 600] },
    pl: { amount: 500000, rate: 7.5, years: 25, extra: 500, currency: 'PLN', label: '500 000 zł', extras: [0, 300, 500, 1000] },
  },
  {
    key: 'tier-5',
    slugs: { en: '500k-mortgage', de: '400000-euro', pl: '600-tys' },
    en: { amount: 500000, rate: 6.5, years: 30, extra: 500, currency: 'USD', label: '$500,000', extras: [0, 300, 500, 1000] },
    de: { amount: 400000, rate: 3.8, years: 30, extra: 350, currency: 'EUR', label: '400.000 €', extras: [0, 200, 350, 750] },
    pl: { amount: 600000, rate: 7.5, years: 30, extra: 600, currency: 'PLN', label: '600 000 zł', extras: [0, 400, 600, 1200] },
  },
  {
    key: 'tier-6',
    slugs: { en: '750k-mortgage', de: '500000-euro', pl: '800-tys' },
    en: { amount: 750000, rate: 6.5, years: 30, extra: 750, currency: 'USD', label: '$750,000', extras: [0, 400, 750, 1500] },
    de: { amount: 500000, rate: 3.8, years: 30, extra: 500, currency: 'EUR', label: '500.000 €', extras: [0, 250, 500, 1000] },
    pl: { amount: 800000, rate: 7.5, years: 30, extra: 1000, currency: 'PLN', label: '800 000 zł', extras: [0, 500, 1000, 2000] },
  },
];

export function formatMoneyStatic(value, currency, locale) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function formatMoneyRoundedStatic(value, currency, locale) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  } catch {
    return `${Math.round(value)} ${currency}`;
  }
}

export function computeLoanScenario(principal, annualRate, years, extraMonthly) {
  const n = years * 12;
  const r = annualRate / 100 / 12;
  const baseMonthly =
    r > 1e-9
      ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : principal / n;

  const run = (extra) => {
    let bal = principal;
    let totalInterest = 0;
    let months = 0;
    while (bal > 0.01 && months < n + 12) {
      months++;
      const interest = bal * r;
      const schedPrincipal = Math.max(0, baseMonthly - interest);
      const paidPrincipal = Math.min(bal, schedPrincipal + extra);
      bal = Math.max(0, bal - paidPrincipal);
      totalInterest += interest;
    }
    return { months, totalInterest };
  };

  const base = run(0);
  const withExtra = run(extraMonthly);
  return {
    baseMonthly,
    totalMonthly: baseMonthly + extraMonthly,
    baseMonths: base.months,
    baseInterest: base.totalInterest,
    months: withExtra.months,
    totalInterest: withExtra.totalInterest,
    interestSaved: Math.max(0, base.totalInterest - withExtra.totalInterest),
    monthsSaved: Math.max(0, base.months - withExtra.months),
  };
}
