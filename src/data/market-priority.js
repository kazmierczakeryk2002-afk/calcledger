/**
 * Market-specific demand ordering calibrated for Poland (PL), Germany/DACH (DE),
 * and United States/UK/Global (EN) across both Personal Finance and Business hubs.
 */

export const PERSONAL_TOOL_KEYS = ['salary', 'loan', 'compound', 'percentage'];
export const BUSINESS_TOOL_KEYS = ['vat', 'marketplace', 'margin', 'payment', 'freelance', 'roas'];

export const MARKET_PRIORITY = {
  en: {
    // US/UK/Global demand: Compound Interest (#1), Loan/Mortgage (#2), Salary & Budget (#3), Percentage/Discount (#4)
    personalToolOrder: ['compound', 'loan', 'salary', 'percentage'],
    // US/UK/Global business: Profit Margin, PayPal/Stripe, Marketplace (Etsy/FBA), ROAS, VAT, Freelance
    businessToolOrder: ['margin', 'payment', 'marketplace', 'roas', 'vat', 'freelance'],
    // Combined popularity order (used for Quick Finder & fallback lists)
    toolOrder: ['compound', 'loan', 'salary', 'percentage', 'margin', 'payment', 'marketplace', 'roas', 'vat', 'freelance'],
    // Top 3 direct links shown in desktop header alongside Personal/Business dropdowns
    quickNavOrder: ['compound', 'loan', 'margin'],
    heroQuickLinks: [
      { pageKey: 'compound', label: 'Compound Interest' },
      { pageKey: 'loan', label: 'Mortgage & Payoff' },
      { pageKey: 'salary', label: 'Salary & 50/30/20' },
      { pageKey: 'margin', label: 'Profit Margin' },
      { pageKey: 'payment:paypal', label: 'PayPal Fees' },
    ],
    vatCountryOrder: [
      'uk', 'ireland', 'germany', 'france', 'netherlands', 'spain', 'switzerland',
      'italy', 'poland', 'austria', 'belgium', 'sweden', 'portugal', 'czechia', 'denmark',
    ],
    marketplaceOrder: ['etsy', 'amazon-fba', 'ebay', 'shopify', 'upwork', 'allegro'],
    paymentOrder: ['paypal', 'stripe'],
  },
  de: {
    // DACH demand: Zinseszins (#1), Brutto/Netto Gehalt & Budget (#2), Kredit & Sondertilgung (#3), Prozent/Rabatt (#4)
    personalToolOrder: ['compound', 'salary', 'loan', 'percentage'],
    // DACH business: MwSt (19%/20%/8.1%), PayPal/Stripe, Marktplatz (eBay/FBA/Etsy), Marge, Stundensatz, ROAS
    businessToolOrder: ['vat', 'payment', 'marketplace', 'margin', 'freelance', 'roas'],
    toolOrder: ['compound', 'salary', 'loan', 'vat', 'percentage', 'payment', 'marketplace', 'margin', 'freelance', 'roas'],
    quickNavOrder: ['compound', 'salary', 'vat'],
    heroQuickLinks: [
      { pageKey: 'compound', label: 'Zinseszinsrechner' },
      { pageKey: 'salary', label: 'Gehalt & Budget' },
      { pageKey: 'loan', label: 'Kredit & Sondertilgung' },
      { pageKey: 'vat:germany', label: 'MwSt Deutschland (19 %)' },
      { pageKey: 'payment:paypal', label: 'PayPal Gebühren' },
    ],
    vatCountryOrder: [
      'germany', 'austria', 'switzerland', 'netherlands', 'france', 'italy', 'spain',
      'poland', 'belgium', 'czechia', 'uk', 'denmark', 'sweden', 'portugal', 'ireland',
    ],
    marketplaceOrder: ['ebay', 'amazon-fba', 'etsy', 'shopify', 'upwork', 'allegro'],
    paymentOrder: ['paypal', 'stripe'],
  },
  pl: {
    // Poland demand: Pensja/Budżet (#1), Kredyt i Nadpłata (#2), Oszczędności/Belka (#3), Procenty/Rabaty (#4)
    personalToolOrder: ['salary', 'loan', 'compound', 'percentage'],
    // Poland business: VAT (23%), Prowizja Allegro/Marketplace, Marża, Stawka B2B, ROAS, PayPal/Stripe
    businessToolOrder: ['vat', 'marketplace', 'margin', 'freelance', 'roas', 'payment'],
    toolOrder: ['salary', 'loan', 'vat', 'compound', 'percentage', 'marketplace', 'margin', 'freelance', 'roas', 'payment'],
    quickNavOrder: ['salary', 'loan', 'vat'],
    heroQuickLinks: [
      { pageKey: 'salary', label: 'Pensja i Budżet' },
      { pageKey: 'loan', label: 'Kredyt i Nadpłata' },
      { pageKey: 'vat:poland', label: 'Kalkulator VAT (23%)' },
      { pageKey: 'compound', label: 'Oszczędności i Belka' },
      { pageKey: 'marketplace:allegro', label: 'Prowizja Allegro' },
    ],
    vatCountryOrder: [
      'poland', 'germany', 'czechia', 'netherlands', 'uk', 'switzerland', 'austria',
      'france', 'italy', 'spain', 'belgium', 'sweden', 'ireland', 'denmark', 'portugal',
    ],
    marketplaceOrder: ['allegro', 'amazon-fba', 'etsy', 'shopify', 'ebay', 'upwork'],
    paymentOrder: ['paypal', 'stripe'],
  },
};

export function sortByKeyOrder(items, order) {
  const rank = new Map(order.map((k, idx) => [k, idx]));
  return [...items].sort((a, b) => {
    const ra = rank.has(a.key) ? rank.get(a.key) : 999;
    const rb = rank.has(b.key) ? rank.get(b.key) : 999;
    return ra - rb;
  });
}

export function getMarketPriority(lang) {
  return MARKET_PRIORITY[lang] || MARKET_PRIORITY.en;
}
