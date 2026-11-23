import { I18N_EN } from './i18n-en.js';
import { I18N_DE } from './i18n-de.js';
import { I18N_PL } from './i18n-pl.js';

const DICTIONARIES = {
  en: I18N_EN,
  de: I18N_DE,
  pl: I18N_PL,
};

export function getI18n(lang) {
  const dict = DICTIONARIES[lang];
  if (!dict) {
    throw new Error(`Unsupported language: ${lang}`);
  }
  return dict;
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function safeJsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}
