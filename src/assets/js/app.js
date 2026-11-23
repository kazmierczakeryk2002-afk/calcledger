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

    const close = () => {
      btn.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
    };

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      drawer.hidden = expanded;
    });

    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

    document.addEventListener('click', (e) => {
      if (!drawer.hidden && !drawer.contains(e.target) && !btn.contains(e.target)) {
        close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hidden) close();
    });
  }

  /* Quick Finder Command Palette (Cmd/Ctrl+K or header search button) */
  function initQuickFinder() {
    const backdrop = document.getElementById('quick-finder');
    const openBtn = document.getElementById('finder-open');
    const closeBtn = document.getElementById('finder-close');
    const input = document.getElementById('finder-input');
    const list = document.getElementById('finder-list');
    const items = Array.isArray(window.CALCLEDGER_FINDER) ? window.CALCLEDGER_FINDER : [];
    if (!backdrop || !input || !list || !items.length) return;

    const norm = (s) =>
      String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ł/g, 'l');

    const indexed = items.map((it) => ({ ...it, _s: norm(`${it.t} ${it.c} ${it.k}`) }));
    let activeIdx = 0;
    let currentMatches = indexed;

    function render(query) {
      const q = norm(query).trim();
      currentMatches = q ? indexed.filter((it) => it._s.includes(q)) : indexed;
      activeIdx = 0;
      if (!currentMatches.length) {
        list.innerHTML = `<div class="finder-empty">${I18N.searchEmpty || 'No matching calculators found.'}</div>`;
        return;
      }
      list.innerHTML = currentMatches
        .slice(0, 14)
        .map(
          (it, idx) =>
            `<a class="finder-item${idx === 0 ? ' is-active' : ''}" href="${it.h}" role="option" data-finder-idx="${idx}">
              <span class="finder-item__title">${it.t}</span>
              <span class="finder-item__cat">${it.c}</span>
            </a>`
        )
        .join('');
    }

    function setActive(nextIdx) {
      const links = list.querySelectorAll('.finder-item');
      if (!links.length) return;
      activeIdx = (nextIdx + links.length) % links.length;
      links.forEach((el, i) => el.classList.toggle('is-active', i === activeIdx));
      links[activeIdx].scrollIntoView({ block: 'nearest' });
    }

    function open() {
      backdrop.hidden = false;
      input.value = '';
      render('');
      requestAnimationFrame(() => input.focus());
    }

    function close() {
      backdrop.hidden = true;
      if (openBtn) openBtn.focus();
    }

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(activeIdx + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(activeIdx - 1);
      } else if (e.key === 'Enter') {
        const activeEl = list.querySelector('.finder-item.is-active');
        if (activeEl) {
          e.preventDefault();
          window.location.href = activeEl.getAttribute('href');
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (backdrop.hidden) open();
        else close();
      } else if (e.key === 'Escape' && !backdrop.hidden) {
        close();
      }
    });
  }

  /* Input Craft: eliminate accidental scroll-wheel changes & polish mobile Done key */
  function initInputCraft() {
    document.querySelectorAll('.calc-shell input[type="number"]').forEach((input) => {
      input.setAttribute('enterkeyhint', 'done');
      input.addEventListener(
        'wheel',
        (e) => {
          if (document.activeElement === input) {
            e.preventDefault();
          }
        },
        { passive: false }
      );
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    });
  }

  /* Tap-to-copy on any Result Hero or KPI card */
  function initTapToCopyResults() {
    const cards = document.querySelectorAll('.calc-results .result-hero, .calc-results .kpi');
    if (!cards.length) return;
    const tip = I18N.clickToCopy || 'Click to copy';
    const prefix = I18N.copiedValue || 'Copied';

    cards.forEach((card) => {
      const valueEl = card.querySelector('.num');
      if (!valueEl) return;
      card.classList.add('is-copyable');
      card.setAttribute('title', tip);
      card.setAttribute('tabindex', '0');

      const doCopy = () => {
        const val = (valueEl.textContent || '').trim();
        if (!val || val === '—') return;
        copyText(val, `${prefix}: ${val}`);
      };

      card.addEventListener('click', doCopy);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          doCopy();
        }
      });
    });
  }

  /* Mobile Floating Live Result Dock (eliminates mobile scroll-blindness) */
  function initMobileResultDock() {
    const dock = document.getElementById('mobile-result-dock');
    const resultsPanel = document.querySelector('.calc-results');
    const primaryHero = document.querySelector('.calc-results .result-hero');
    if (!dock || !resultsPanel || !primaryHero) return;

    const heroLabel = primaryHero.querySelector('.result-hero__label');
    const heroValue = primaryHero.querySelector('.result-hero__value');
    const dockLabel = document.getElementById('dock-label');
    const dockValue = document.getElementById('dock-value');
    const consentBanner = document.getElementById('consent-banner');
    let heroVisible = true;

    function syncDock() {
      if (dockLabel && heroLabel) dockLabel.textContent = heroLabel.textContent;
      if (dockValue && heroValue) dockValue.textContent = heroValue.textContent;
      dock.classList.toggle('is-loss', primaryHero.classList.contains('is-loss'));
      const isMobile = window.innerWidth < 840;
      const consentOpen = consentBanner && !consentBanner.hidden;
      dock.hidden = !isMobile || heroVisible || consentOpen;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          heroVisible = Boolean(entries[0] && entries[0].isIntersecting);
          syncDock();
        },
        { threshold: 0.1 }
      );
      observer.observe(primaryHero);
    }

    if ('MutationObserver' in window) {
      const mo = new MutationObserver(syncDock);
      mo.observe(primaryHero, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class'],
      });
      if (consentBanner) {
        mo.observe(consentBanner, { attributes: true, attributeFilter: ['hidden'] });
      }
    }

    window.addEventListener('resize', syncDock, { passive: true });
    dock.addEventListener('click', () => {
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    syncDock();
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

  /* Discreet ? info-hint popover (tap/click friendly & clamped inside mobile viewport) */
  function initHints() {
    const triggers = document.querySelectorAll('.hint-btn[data-hint]');
    if (!triggers.length) return;

    const pop = document.createElement('div');
    pop.className = 'hint-popover';
    pop.setAttribute('role', 'tooltip');
    pop.hidden = true;
    document.body.appendChild(pop);

    let activeBtn = null;

    function close() {
      pop.hidden = true;
      if (activeBtn) {
        activeBtn.setAttribute('aria-expanded', 'false');
        activeBtn = null;
      }
    }

    function open(btn) {
      const text = btn.getAttribute('data-hint');
      if (!text) return;
      pop.textContent = text;
      pop.hidden = false;
      pop.style.left = '0px';
      pop.style.top = '0px';

      const rect = btn.getBoundingClientRect();
      const popW = Math.min(pop.offsetWidth || 260, window.innerWidth - 24);
      const popH = pop.offsetHeight || 64;
      const left = Math.max(12, Math.min(rect.left + rect.width / 2 - popW / 2, window.innerWidth - popW - 12));
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow > popH + 14 ? rect.bottom + 8 : Math.max(12, rect.top - popH - 8);

      pop.style.left = `${Math.round(left)}px`;
      pop.style.top = `${Math.round(top)}px`;

      if (activeBtn && activeBtn !== btn) activeBtn.setAttribute('aria-expanded', 'false');
      activeBtn = btn;
      btn.setAttribute('aria-expanded', 'true');
    }

    triggers.forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeBtn === btn && !pop.hidden) close();
        else open(btn);
      });
    });

    document.addEventListener('click', (e) => {
      if (!pop.hidden && !pop.contains(e.target) && (!activeBtn || !activeBtn.contains(e.target))) {
        close();
      }
    });
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close, { passive: true });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !pop.hidden) close();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initQuickFinder();
    initHints();
    initInputCraft();
    initTapToCopyResults();
    initMobileResultDock();
    initConsentBanner();
    initContactPage();
  });
})();
