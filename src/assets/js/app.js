/* ==========================================================================
   CalcLedger Core App Script — Navigation, Consent Mode v2, Formatting & URL
   ========================================================================== */

(function () {
  'use strict';

  const CONSENT_KEY = 'calcledger_consent_v2';
  const I18N = window.CALCLEDGER_I18N || { lang: 'en', locale: 'en-US' };

  const CURRENCY_META = {
    USD: { code: 'USD', symbol: '$' },
    EUR: { code: 'EUR', symbol: '€' },
    GBP: { code: 'GBP', symbol: '£' },
    CHF: { code: 'CHF', symbol: 'CHF' },
    PLN: { code: 'PLN', symbol: 'zł' },
  };

  function formatMoney(value, currencyCode) {
    const code = CURRENCY_META[currencyCode] ? currencyCode : 'EUR';
    const num = Number.isFinite(value) ? value : 0;
    try {
      return new Intl.NumberFormat(I18N.locale || 'en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    } catch (_) {
      return `${num.toFixed(2)} ${code}`;
    }
  }

  function formatCompactMoney(value, currencyCode) {
    const code = CURRENCY_META[currencyCode] ? currencyCode : 'EUR';
    const num = Number.isFinite(value) ? value : 0;
    try {
      return new Intl.NumberFormat(I18N.locale || 'en-US', {
        style: 'currency',
        currency: code,
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(num);
    } catch (_) {
      return `${Math.round(num)} ${code}`;
    }
  }

  function formatPercent(value, digits = 2) {
    const num = Number.isFinite(value) ? value : 0;
    try {
      return new Intl.NumberFormat(I18N.locale || 'en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(num) + '%';
    } catch (_) {
      return `${num.toFixed(digits)}%`;
    }
  }

  function formatNumber(value, digits = 0) {
    const num = Number.isFinite(value) ? value : 0;
    try {
      return new Intl.NumberFormat(I18N.locale || 'en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(num);
    } catch (_) {
      return num.toFixed(digits);
    }
  }

  function parseNum(input, fallback = 0) {
    if (typeof input === 'number') return Number.isFinite(input) ? input : fallback;
    const normalized = String(input ?? '').replace(',', '.').trim();
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  let toastTimer = null;
  function showToast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 2600);
  }

  async function copyText(text, successMsg) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast(successMsg);
    } catch (_) {
      showToast(successMsg);
    }
  }

  function buildShareUrl(params) {
    const url = new URL(window.location.href);
    url.search = '';
    Object.keys(params).forEach((key) => {
      const val = params[key];
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.set(key, String(val));
      }
    });
    return url.toString();
  }

  function syncUrlState(params) {
    try {
      const url = new URL(window.location.href);
      url.search = '';
      Object.keys(params).forEach((key) => {
        const val = params[key];
        if (val !== undefined && val !== null && val !== '') {
          url.searchParams.set(key, String(val));
        }
      });
      window.history.replaceState(null, '', url.pathname + url.search);
      // Keep language switcher links synchronized with current query parameters
      document.querySelectorAll('[data-lang-link]').forEach((a) => {
        const base = a.getAttribute('href').split('?')[0];
        a.setAttribute('href', base + url.search);
      });
    } catch (_) {}
  }

  function readParams() {
    return new URLSearchParams(window.location.search);
  }

  // Expose utilities for calculators.js
  window.CalcLedger = {
    I18N,
    CURRENCY_META,
    formatMoney,
    formatCompactMoney,
    formatPercent,
    formatNumber,
    parseNum,
    showToast,
    copyText,
    buildShareUrl,
    syncUrlState,
    readParams,
  };

  /* Mobile navigation drawer */
  function initMobileMenu() {
    const btn = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    if (!btn || !drawer) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      drawer.hidden = expanded;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hidden) {
        btn.setAttribute('aria-expanded', 'false');
        drawer.hidden = true;
      }
    });
  }

  /* Google Consent Mode v2 Banner */
  function initConsentBanner() {
    const banner = document.getElementById('consent-banner');
    if (!banner) return;

    const panel = document.getElementById('consent-custom-panel');
    const chkAds = document.getElementById('consent-toggle-ads');
    const chkAnalytics = document.getElementById('consent-toggle-analytics');
    const btnAccept = document.getElementById('consent-accept');
    const btnReject = document.getElementById('consent-reject');
    const btnCustomize = document.getElementById('consent-customize');
    const btnSave = document.getElementById('consent-save');

    function getSaved() {
      try {
        return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      } catch (_) {
        return null;
      }
    }

    function applyConsent(ads, analytics) {
      const payload = {
        ads: Boolean(ads),
        analytics: Boolean(analytics),
        updatedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
      } catch (_) {}

      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          ad_storage: payload.ads ? 'granted' : 'denied',
          ad_user_data: payload.ads ? 'granted' : 'denied',
          ad_personalization: payload.ads ? 'granted' : 'denied',
          analytics_storage: payload.analytics ? 'granted' : 'denied',
        });
      }
      banner.hidden = true;
    }

    function openBanner(showPanel) {
      const saved = getSaved();
      if (chkAds) chkAds.checked = saved ? Boolean(saved.ads) : false;
      if (chkAnalytics) chkAnalytics.checked = saved ? Boolean(saved.analytics) : false;
      if (panel) panel.hidden = !showPanel;
      if (btnSave) btnSave.hidden = !showPanel;
      if (btnCustomize) btnCustomize.hidden = Boolean(showPanel);
      banner.hidden = false;
    }

    if (!getSaved()) {
      openBanner(false);
    }

    if (btnAccept) btnAccept.addEventListener('click', () => applyConsent(true, true));
    if (btnReject) btnReject.addEventListener('click', () => applyConsent(false, false));
    if (btnCustomize) {
      btnCustomize.addEventListener('click', () => {
        if (panel) panel.hidden = false;
        if (btnSave) btnSave.hidden = false;
        btnCustomize.hidden = true;
      });
    }
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        applyConsent(chkAds && chkAds.checked, chkAnalytics && chkAnalytics.checked);
      });
    }

    document.querySelectorAll('[data-open-consent]').forEach((trigger) => {
      trigger.addEventListener('click', () => openBanner(true));
    });
  }

  /* Contact page utilities */
  function initContactPage() {
    document.querySelectorAll('[data-copy-email]').forEach((btn) => {
      btn.addEventListener('click', () => {
        copyText(btn.getAttribute('data-copy-email'), I18N.copiedEmail || 'Copied');
      });
    });

    const form = document.getElementById('contact-mailto-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.getAttribute('data-email') || 'contact@calcledger.org';
        const subject = (document.getElementById('contact-subject') || {}).value || 'CalcLedger';
        const body = (document.getElementById('contact-message') || {}).value || '';
        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initConsentBanner();
    initContactPage();
  });
})();
