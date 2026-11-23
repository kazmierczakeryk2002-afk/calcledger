/**
 * CalcLedger central site & monetization configuration.
 *
 * To activate Google AdSense after approval:
 * 1. Set `adsenseClientId` to your publisher ID, e.g. 'ca-pub-1234567890123456'
 * 2. Optionally fill in your ad unit slot IDs under `adsenseSlots`
 * 3. Run `npm run build` — ads.txt, AdSense script, and zero-CLS ad slots update automatically.
 */

export const SITE_CONFIG = {
  brandName: 'CalcLedger',
  domain: 'https://calcledger.org',
  host: 'calcledger.org',
  contactEmail: 'contact@calcledger.org',
  defaultLang: 'en',
  languages: ['en', 'de', 'pl'],
  locales: {
    en: 'en_US',
    de: 'de_DE',
    pl: 'pl_PL',
  },
  currencies: [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  ],
  defaultCurrencyByLang: {
    en: 'USD',
    de: 'EUR',
    pl: 'PLN',
  },

  // Google AdSense configuration
  adsenseClientId: 'ca-pub-7758756337402869',
  adsenseSlots: {
    topBanner: '',
    midContent: '',
    bottomBanner: '',
  },

  // Build metadata
  buildDate: new Date().toISOString().slice(0, 10),
  copyrightYear: 2026,
};

export function isAdsenseActive() {
  return typeof SITE_CONFIG.adsenseClientId === 'string' && /^ca-pub-\d{10,}$/.test(SITE_CONFIG.adsenseClientId.trim());
}

export function getAdsensePublisherId() {
  if (!isAdsenseActive()) return '';
  return SITE_CONFIG.adsenseClientId.trim().replace(/^ca-/, '');
}
