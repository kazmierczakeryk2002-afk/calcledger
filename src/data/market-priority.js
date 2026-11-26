/**
 * Market-specific demand ordering calibrated for Poland (PL), Germany/DACH (DE),
 * and United States/UK/Global (EN) across both Personal Finance and Business hubs.
 */

export const PERSONAL_TOOL_KEYS = ['salary', 'loan', 'fuel', 'compound', 'percentage'];
export const BUSINESS_TOOL_KEYS = ['vat', 'marketplace', 'margin', 'payment', 'freelance', 'roas'];

export const MARKET_PRIORITY = {
  en: {
    // US/UK/Global demand: Compound Interest (#1), Loan/Mortgage (#2), Salary & Budget (#3), Fuel/Trip Cost (#4), Percentage/Discount (#5)
    personalToolOrder: ['compound', 'loan', 'salary', 'fuel', 'percentage'],
    // US/UK/Global business: Profit Margin, PayPal/Stripe, Marketplace (Etsy/FBA), ROAS, VAT, Freelance
    businessToolOrder: ['margin', 'payment', 'marketplace', 'roas', 'vat', 'freelance'],
    toolOrder: ['compound', 'loan', 'salary', 'fuel', 'percentage', 'margin', 'payment', 'marketplace', 'roas', 'vat', 'freelance'],
    quickNavOrder: ['compound', 'loan', 'margin'],
    heroQuickLinks: [
      { pageKey: 'compound', label: 'Compound Interest' },
      { pageKey: 'loan', label: 'Mortgage & Payoff' },
      { pageKey: 'salary', label: 'Salary & 50/30/20' },
      { pageKey: 'fuel', label: 'Fuel & Trip Cost' },
      { pageKey: 'margin', label: 'Profit Margin' },
    ],
    vatCountryOrder: [
      'uk', 'ireland', 'germany', 'france', 'netherlands', 'spain', 'switzerland',
      'italy', 'poland', 'austria', 'belgium', 'sweden', 'portugal', 'czechia', 'denmark',
    ],
    marketplaceOrder: ['etsy', 'amazon-fba', 'ebay', 'shopify', 'upwork', 'allegro'],
    paymentOrder: ['paypal', 'stripe'],
  },
  de: {
    // DACH demand: Zinseszins (#1), Gehalt & Budget (#2), Kredit & Sondertilgung (#3), Spritkosten & Pendeln (#4), Prozent/Rabatt (#5)
    personalToolOrder: ['compound', 'salary', 'loan', 'fuel', 'percentage'],
    // DACH business: MwSt (19%/20%/8.1%), PayPal/Stripe, Marktplatz (eBay/FBA/Etsy), Marge, Stundensatz, ROAS
    businessToolOrder: ['vat', 'payment', 'marketplace', 'margin', 'freelance', 'roas'],
    toolOrder: ['compound', 'salary', 'loan', 'fuel', 'vat', 'percentage', 'payment', 'marketplace', 'margin', 'freelance', 'roas'],
    quickNavOrder: ['compound', 'salary', 'vat'],
    heroQuickLinks: [
      { pageKey: 'compound', label: 'Zinseszinsrechner' },
      { pageKey: 'salary', label: 'Gehalt & Budget' },
      { pageKey: 'loan', label: 'Kredit & Sondertilgung' },
      { pageKey: 'fuel', label: 'Spritkostenrechner' },
      { pageKey: 'vat:germany', label: 'MwSt Deutschland (19 %)' },
    ],
    vatCountryOrder: [
      'germany', 'austria', 'switzerland', 'netherlands', 'france', 'italy', 'spain',
      'poland', 'belgium', 'czechia', 'uk', 'denmark', 'sweden', 'portugal', 'ireland',
    ],
    marketplaceOrder: ['ebay', 'amazon-fba', 'etsy', 'shopify', 'upwork', 'allegro'],
    paymentOrder: ['paypal', 'stripe'],
  },
  pl: {
    // Poland demand: Pensja/Budżet (#1), Kredyt i Nadpłata (#2), Paliwo i Dojazdy (#3), Oszczędności/Belka (#4), Procenty/Rabaty (#5)
    personalToolOrder: ['salary', 'loan', 'fuel', 'compound', 'percentage'],
    // Poland business: VAT (23%), Prowizja Allegro/Marketplace, Marża, Stawka B2B, ROAS, PayPal/Stripe
    businessToolOrder: ['vat', 'marketplace', 'margin', 'freelance', 'roas', 'payment'],
    toolOrder: ['salary', 'loan', 'fuel', 'vat', 'compound', 'percentage', 'marketplace', 'margin', 'freelance', 'roas', 'payment'],
    quickNavOrder: ['salary', 'loan', 'fuel'],
    heroQuickLinks: [
      { pageKey: 'salary', label: 'Pensja i Budżet' },
      { pageKey: 'loan', label: 'Kredyt i Nadpłata' },
      { pageKey: 'fuel', label: 'Koszt Paliwa i Dojazdów' },
      { pageKey: 'vat:poland', label: 'Kalkulator VAT (23%)' },
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
