import { SITE_CONFIG } from '../config.js';

/**
 * Canonical route map across EN, DE, and PL.
 * Every pageKey maps 1-to-1 across all three languages for complete
 * bi-directional hreflang matrices and language switcher navigation.
 */

export const VAT_COUNTRY_KEYS = [
  'germany',
  'austria',
  'switzerland',
  'uk',
  'poland',
  'france',
  'netherlands',
  'spain',
  'italy',
];

export const MARKETPLACE_KEYS = [
  'etsy',
  'amazon-fba',
  'ebay',
  'shopify',
  'upwork',
  'allegro',
];

const COUNTRY_SLUGS = {
  germany: { en: 'germany', de: 'deutschland', pl: 'niemcy' },
  austria: { en: 'austria', de: 'oesterreich', pl: 'austria' },
  switzerland: { en: 'switzerland', de: 'schweiz', pl: 'szwajcaria' },
  uk: { en: 'uk', de: 'grossbritannien', pl: 'wielka-brytania' },
  poland: { en: 'poland', de: 'polen', pl: 'polska' },
  france: { en: 'france', de: 'frankreich', pl: 'francja' },
  netherlands: { en: 'netherlands', de: 'niederlande', pl: 'holandia' },
  spain: { en: 'spain', de: 'spanien', pl: 'hiszpania' },
  italy: { en: 'italy', de: 'italien', pl: 'wlochy' },
};

const MARKETPLACE_SLUGS = {
  etsy: { en: 'etsy', de: 'etsy', pl: 'etsy' },
  'amazon-fba': { en: 'amazon-fba', de: 'amazon-fba', pl: 'amazon-fba' },
  ebay: { en: 'ebay', de: 'ebay', pl: 'ebay' },
  shopify: { en: 'shopify', de: 'shopify', pl: 'shopify' },
  upwork: { en: 'upwork', de: 'upwork', pl: 'upwork' },
  allegro: { en: 'allegro', de: 'allegro', pl: 'allegro' },
};

export const ROUTES = {
  home: {
    en: '/',
    de: '/de/',
    pl: '/pl/',
  },
  vat: {
    en: '/vat-calculator/',
    de: '/de/mwst-rechner/',
    pl: '/pl/kalkulator-vat/',
  },
  marketplace: {
    en: '/marketplace-fee-calculator/',
    de: '/de/marktplatz-gebuehren-rechner/',
    pl: '/pl/kalkulator-prowizji-marketplace/',
  },
  margin: {
    en: '/profit-margin-calculator/',
    de: '/de/marge-aufschlag-rechner/',
    pl: '/pl/kalkulator-marzy-i-narzutu/',
  },
  freelance: {
    en: '/freelance-rate-calculator/',
    de: '/de/freelance-stundensatz-rechner/',
    pl: '/pl/kalkulator-stawki-freelancera/',
  },
  compound: {
    en: '/compound-interest-calculator/',
    de: '/de/zinseszins-rechner/',
    pl: '/pl/kalkulator-procentu-skladanego/',
  },
  about: {
    en: '/about/',
    de: '/de/ueber-uns/',
    pl: '/pl/o-nas/',
  },
  privacy: {
    en: '/privacy-policy/',
    de: '/de/datenschutz/',
    pl: '/pl/polityka-prywatnosci/',
  },
  terms: {
    en: '/terms/',
    de: '/de/impressum/',
    pl: '/pl/regulamin/',
  },
  contact: {
    en: '/contact/',
    de: '/de/kontakt/',
    pl: '/pl/kontakt/',
  },
};

for (const key of VAT_COUNTRY_KEYS) {
  ROUTES[`vat:${key}`] = {
    en: `/vat-calculator/${COUNTRY_SLUGS[key].en}/`,
    de: `/de/mwst-rechner/${COUNTRY_SLUGS[key].de}/`,
    pl: `/pl/kalkulator-vat/${COUNTRY_SLUGS[key].pl}/`,
  };
}

for (const key of MARKETPLACE_KEYS) {
  ROUTES[`marketplace:${key}`] = {
    en: `/marketplace-fee-calculator/${MARKETPLACE_SLUGS[key].en}/`,
    de: `/de/marktplatz-gebuehren-rechner/${MARKETPLACE_SLUGS[key].de}/`,
    pl: `/pl/kalkulator-prowizji-marketplace/${MARKETPLACE_SLUGS[key].pl}/`,
  };
}

export function getRoutePath(pageKey, lang) {
  const entry = ROUTES[pageKey];
  if (!entry || !entry[lang]) {
    throw new Error(`Unknown route for pageKey="${pageKey}" lang="${lang}"`);
  }
  return entry[lang];
}

export function getAbsoluteUrl(pageKey, lang) {
  return `${SITE_CONFIG.domain}${getRoutePath(pageKey, lang)}`;
}

export function getHreflangAlternates(pageKey) {
  return [
    { hreflang: 'en', href: getAbsoluteUrl(pageKey, 'en') },
    { hreflang: 'de', href: getAbsoluteUrl(pageKey, 'de') },
    { hreflang: 'pl', href: getAbsoluteUrl(pageKey, 'pl') },
    { hreflang: 'x-default', href: getAbsoluteUrl(pageKey, 'en') },
  ];
}
