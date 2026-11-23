/**
 * Market-specific demand ordering for EN (US/UK/Global), DE (DACH), and PL (Poland).
 * Controls hero quick-jump links, core tool card order, navigation order,
 * VAT country priority, and marketplace priority per language.
 */

export const MARKET_PRIORITY = {
  en: {
    // US/UK/Global demand: Marketplace (Etsy/FBA/eBay), PayPal/Stripe, Margin, Compound ROI, ROAS/ACOS, UK/EU VAT, Freelance
    toolOrder: ['marketplace', 'payment', 'margin', 'compound', 'roas', 'vat', 'freelance'],
    heroQuickLinks: [
      { pageKey: 'marketplace:etsy', label: 'Etsy Fee Calculator' },
      { pageKey: 'payment:paypal', label: 'PayPal Fee Calculator' },
      { pageKey: 'marketplace:amazon-fba', label: 'Amazon FBA Profit' },
      { pageKey: 'vat:uk', label: 'UK VAT (20%)' },
      { pageKey: 'roas', label: 'ROAS ↔ ACOS' },
    ],
    vatCountryOrder: [
      'uk', 'ireland', 'germany', 'france', 'netherlands', 'spain', 'switzerland',
      'italy', 'poland', 'austria', 'belgium', 'sweden', 'portugal', 'czechia', 'denmark',
    ],
    marketplaceOrder: ['etsy', 'amazon-fba', 'ebay', 'shopify', 'upwork', 'allegro'],
    paymentOrder: ['paypal', 'stripe'],
  },
  de: {
    // DACH demand: MwSt (DE/AT/CH 8.1%), Zinseszins (ETF), PayPal/Stripe, Amazon/eBay/Etsy, Marge, Stundensatz, ROAS
    toolOrder: ['vat', 'compound', 'payment', 'marketplace', 'margin', 'freelance', 'roas'],
    heroQuickLinks: [
      { pageKey: 'vat:germany', label: 'MwSt Deutschland (19 %)' },
      { pageKey: 'vat:switzerland', label: 'MWST Schweiz (8,1 %)' },
      { pageKey: 'compound', label: 'Zinseszinsrechner' },
      { pageKey: 'payment:paypal', label: 'PayPal Gebühren' },
      { pageKey: 'marketplace:ebay', label: 'eBay / Amazon FBA' },
    ],
    vatCountryOrder: [
      'germany', 'austria', 'switzerland', 'netherlands', 'france', 'italy', 'spain',
      'poland', 'belgium', 'czechia', 'uk', 'denmark', 'sweden', 'portugal', 'ireland',
    ],
    marketplaceOrder: ['amazon-fba', 'ebay', 'etsy', 'shopify', 'upwork', 'allegro'],
    paymentOrder: ['paypal', 'stripe'],
  },
  pl: {
    // Poland demand: VAT PL 23%, Allegro prowizje, Marża/Narzut, Procent składany, B2B Stawka, ROAS/ACOS, PayPal/Stripe
    toolOrder: ['vat', 'marketplace', 'margin', 'compound', 'freelance', 'roas', 'payment'],
    heroQuickLinks: [
      { pageKey: 'marketplace:allegro', label: 'Prowizja Allegro' },
      { pageKey: 'vat:poland', label: 'VAT Polska (23%)' },
      { pageKey: 'margin', label: 'Marża i Narzut' },
      { pageKey: 'compound', label: 'Procent Składany' },
      { pageKey: 'freelance', label: 'Stawka B2B' },
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
