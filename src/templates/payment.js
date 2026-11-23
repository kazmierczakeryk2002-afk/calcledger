import { SITE_CONFIG } from '../config.js';
import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml, safeJsonLd } from '../data/i18n.js';
import { PAYMENT_PROVIDERS } from '../data/payment-providers.js';
import {
  renderLayout,
  renderAdSlot,
  renderCurrencyControl,
  renderBreadcrumbs,
  renderFaqSection,
  renderRelatedCalculators,
  buildBreadcrumbJsonLd,
  buildSoftwareAppJsonLd,
  buildFaqJsonLd,
} from './layout.js';

export function renderPaymentPage(lang, provider = null) {
  const t = getI18n(lang);
  const pageKey = provider ? `payment:${provider.key}` : 'payment';
  const seo = provider ? provider.seo[lang] : t.payment;

  const allPresets = PAYMENT_PROVIDERS.flatMap((p) => p.presets);
  const defaultPresetId = provider
    ? provider.defaultPresetByLang[lang]
    : lang === 'en'
      ? 'stripe-us'
      : 'paypal-eu';
  const activePreset = allPresets.find((p) => p.id === defaultPresetId) || allPresets[0];
  const defaultCurrency = provider
    ? provider.defaultCurrencyByLang[lang]
    : SITE_CONFIG.defaultCurrencyByLang[lang];

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.payment, href: getRoutePath('payment', lang), url: getAbsoluteUrl('payment', lang) },
  ];
  if (provider) {
    breadcrumbs.push({
      label: provider.name,
      href: getRoutePath(pageKey, lang),
      url: getAbsoluteUrl(pageKey, lang),
    });
  }

  const presetMap = {};
  for (const p of allPresets) {
    presetMap[p.id] = { pct: p.pct, fixed: p.fixed, fxPct: p.fxPct };
  }

  const presetOptions = allPresets
    .map(
      (p) =>
        `<option value="${p.id}"${p.id === activePreset.id ? ' selected' : ''}>${escapeHtml(p.labels[lang])}</option>`
    )
    .join('');

  const providerLinksHtml = PAYMENT_PROVIDERS.map((p) => {
    const isCurrent = provider && p.key === provider.key;
    return `<a class="chip-card chip-card--mp${isCurrent ? ' is-current' : ''}" href="${escapeHtml(getRoutePath(`payment:${p.key}`, lang))}"${isCurrent ? ' aria-current="page"' : ''}>
      <span class="chip-card__name">${escapeHtml(p.name)}</span>
      <span class="chip-card__desc">${escapeHtml(p.feeSummary[lang])}</span>
    </a>`;
  }).join('');

  const tipsSection = provider
    ? `<section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.payment.tipsHeading)} — ${escapeHtml(provider.name)}</h2>
        <p class="prose">${escapeHtml(seo.intro)}</p>
        <ul class="bullet-list">
          ${seo.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join('')}
        </ul>
      </section>`
    : '';

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(seo.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(seo.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="payment" data-default-currency="${defaultCurrency}" data-default-preset="${activePreset.id}">
        <div class="calc-inputs">
          ${renderCurrencyControl('pay', defaultCurrency, t)}

          <div class="field">
            <span class="field__label">${escapeHtml(t.payment.modeLabel)}</span>
            <div class="seg-group seg-group--full" role="group" aria-label="${escapeHtml(t.payment.modeLabel)}">
              <button type="button" class="seg-btn is-active" data-pay-mode="forward" aria-pressed="true">${escapeHtml(t.payment.modeForward)}</button>
              <button type="button" class="seg-btn" data-pay-mode="reverse" aria-pressed="false">${escapeHtml(t.payment.modeReverse)}</button>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="pay-preset">${escapeHtml(t.payment.presetLabel)}</label>
            <select class="input" id="pay-preset">
              <option value="custom">${escapeHtml(t.payment.customPreset)}</option>
              ${presetOptions}
            </select>
          </div>

          <div class="field">
            <label class="field__label" for="pay-amount" id="pay-amount-label">${escapeHtml(t.payment.amountLabelForward)}</label>
            <input class="input num" type="number" id="pay-amount" inputmode="decimal" step="any" min="0" value="250">
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="pay-pct">${escapeHtml(t.payment.feePctLabel)}</label>
              <input class="input num" type="number" id="pay-pct" inputmode="decimal" step="0.05" min="0" max="50" value="${activePreset.pct}">
            </div>
            <div class="field">
              <label class="field__label" for="pay-fixed">${escapeHtml(t.payment.fixedFeeLabel)}</label>
              <input class="input num" type="number" id="pay-fixed" inputmode="decimal" step="0.05" min="0" value="${activePreset.fixed}">
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="pay-fx">${escapeHtml(t.payment.fxPctLabel)}</label>
            <input class="input num" type="number" id="pay-fx" inputmode="decimal" step="0.1" min="0" max="25" value="${activePreset.fxPct}">
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero">
            <span class="result-hero__label" id="pay-primary-label">${escapeHtml(t.payment.outPrimaryForward)}</span>
            <strong class="result-hero__value num" id="pay-out-primary">—</strong>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.payment.outGross)}</span>
              <strong class="kpi__value num" id="pay-out-gross">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.payment.outTotalFee)}</span>
              <strong class="kpi__value num" id="pay-out-fee">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.payment.outNet)}</span>
              <strong class="kpi__value num" id="pay-out-net">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.payment.outEffRate)}</span>
              <strong class="kpi__value num" id="pay-out-eff">—</strong>
            </div>
          </div>

          <div class="split-bar-block">
            <div class="split-bar" role="img" aria-label="Net payout vs payment fees">
              <div class="split-bar__seg seg-emerald" id="pay-bar-net" style="width:95%"></div>
              <div class="split-bar__seg seg-terra" id="pay-bar-fee" style="width:5%"></div>
            </div>
            <div class="split-legend">
              <span><i class="dot seg-emerald"></i>${escapeHtml(t.payment.barNet)} <strong class="num" id="pay-leg-net">—</strong></span>
              <span><i class="dot seg-terra"></i>${escapeHtml(t.payment.barFee)} <strong class="num" id="pay-leg-fee">—</strong></span>
            </div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="pay-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="pay-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="pay-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <script>window.CALCLEDGER_PAY_PRESETS = ${safeJsonLd(presetMap)};</script>

      ${tipsSection}

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.payment.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.payment.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.payment.formulaForward)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.payment.formulaReverse)}</code></div>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section" aria-labelledby="pay-providers-heading">
        <h2 id="pay-providers-heading" class="section-heading">${escapeHtml(t.common.paymentGuides)}</h2>
        <div class="mp-grid">${providerLinksHtml}</div>
      </section>

      ${renderFaqSection(seo.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('payment', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'payment',
    title: seo.title,
    description: seo.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: seo.h1,
        description: seo.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'PayPal and Stripe domestic & international fee calculation',
          'Reverse fee calculation to invoice exact gross totals',
          'FX currency conversion spread modeling',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(seo.faqs),
    ],
  });
}
