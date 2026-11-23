/**
 * Market-specific demand ordering calibrated directly from 12-month Google Trends
 * comparisons for Poland (PL), Germany/DACH (DE), and United States/Global (EN).
 */

export const MARKET_PRIORITY = {
  en: {
    // Google Trends US (12m): Compound Interest (#1 by wide margin), then Profit Margin, PayPal/Stripe, Etsy/Amazon/eBay, ROAS, UK VAT, Freelance
    toolOrder: ['compound', 'margin', 'payment', 'marketplace', 'roas', 'vat', 'freelance'],
    heroQuickLinks: [
      { pageKey: 'compound', label: 'Compound Interest & ROI' },
      { pageKey: 'margin', label: 'Profit Margin & Markup' },
      { pageKey: 'payment:paypal', label: 'PayPal Fee Calculator' },
      { pageKey: 'marketplace:etsy', label: 'Etsy Fee Calculator' },
      { pageKey: 'vat:uk', label: 'UK VAT (20%)' },
    ],
    vatCountryOrder: [
      'uk', 'ireland', 'germany', 'france', 'netherlands', 'spain', 'switzerland',
      'italy', 'poland', 'austria', 'belgium', 'sweden', 'portugal', 'czechia', 'denmark',
    ],
    marketplaceOrder: ['etsy', 'amazon-fba', 'ebay', 'shopify', 'upwork', 'allegro'],
    paymentOrder: ['paypal', 'stripe'],
  },
  de: {
    // Google Trends DE (12m): Zinseszinsrechner (#1, 60-100), MwSt-Rechner (#2, 35-60), PayPal Gebühren (#3, 28-60), then Marktplatz, Marge, Stundensatz, ROAS
    toolOrder: ['compound', 'vat', 'payment', 'marketplace', 'margin', 'freelance', 'roas'],
    heroQuickLinks: [
      { pageKey: 'compound', label: 'Zinseszinsrechner' },
      { pageKey: 'vat:germany', label: 'MwSt Deutschland (19 %)' },
      { pageKey: 'payment:paypal', label: 'PayPal Gebührenrechner' },
      { pageKey: 'vat:switzerland', label: 'MWST Schweiz (8,1 %)' },
      { pageKey: 'marketplace:ebay', label: 'eBay / Amazon FBA' },
    ],
    vatCountryOrder: [
      'germany', 'austria', 'switzerland', 'netherlands', 'france', 'italy', 'spain',
      'poland', 'belgium', 'czechia', 'uk', 'denmark', 'sweden', 'portugal', 'ireland',
    ],
    marketplaceOrder: ['ebay', 'amazon-fba', 'etsy', 'shopify', 'upwork', 'allegro'],
    paymentOrder: ['paypal', 'stripe'],
  },
  pl: {
    // Google Trends PL (12m): Kalkulator VAT (#1, 50-100), Procent składany & Prowizja Allegro (tied #2/#3), then Marża, Stawka B2B, ROAS, PayPal/Stripe
    toolOrder: ['vat', 'compound', 'marketplace', 'margin', 'freelance', 'roas', 'payment'],
    heroQuickLinks: [
      { pageKey: 'vat:poland', label: 'Kalkulator VAT (23%)' },
      { pageKey: 'compound', label: 'Procent Składany i ROI' },
      { pageKey: 'marketplace:allegro', label: 'Prowizja Allegro' },
      { pageKey: 'margin', label: 'Marża i Narzut' },
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
