import { SITE_CONFIG } from '../config.js';
import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml, safeJsonLd } from '../data/i18n.js';
import { MARKETPLACES } from '../data/marketplaces.js';
import { getMarketPriority, sortByKeyOrder } from '../data/market-priority.js';
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

export function renderMarketplacePage(lang, marketplace = null) {
  const t = getI18n(lang);
  const market = getMarketPriority(lang);
  const orderedMarketplaces = sortByKeyOrder(MARKETPLACES, market.marketplaceOrder);
  const pageKey = marketplace ? `marketplace:${marketplace.key}` : 'marketplace';
  const seo = marketplace ? marketplace.seo[lang] : t.marketplace;

  const fallbackPreset = orderedMarketplaces[0];
  const activePreset = marketplace ? marketplace.presets : fallbackPreset.presets;
  const defaultCurrency = marketplace
    ? marketplace.defaultCurrency
    : SITE_CONFIG.defaultCurrencyByLang[lang];

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.marketplace, href: getRoutePath('marketplace', lang), url: getAbsoluteUrl('marketplace', lang) },
  ];
  if (marketplace) {
    breadcrumbs.push({
      label: marketplace.name,
      href: getRoutePath(pageKey, lang),
      url: getAbsoluteUrl(pageKey, lang),
    });
  }

  const presetMap = {};
  const presetOrder = orderedMarketplaces.map((m) => m.key);
  for (const m of orderedMarketplaces) {
    presetMap[m.key] = { ...m.presets, name: m.name, currency: m.defaultCurrency };
  }

  const presetOptions = orderedMarketplaces
    .map(
      (m) =>
        `<option value="${m.key}"${marketplace && m.key === marketplace.key ? ' selected' : ''}>${escapeHtml(m.name)}</option>`
    )
    .join('');

  const topMpStripHtml = orderedMarketplaces
    .map((m) => {
      const isCurrent = marketplace && m.key === marketplace.key;
      return `<a class="quick-link${isCurrent ? ' is-current' : ''}" href="${escapeHtml(getRoutePath(`marketplace:${m.key}`, lang))}"${isCurrent ? ' aria-current="page"' : ''}>${escapeHtml(m.name)}</a>`;
    })
    .join('');

  const mpLinksHtml = orderedMarketplaces
    .map((m) => {
      const isCurrent = marketplace && m.key === marketplace.key;
      return `<a class="chip-card chip-card--mp${isCurrent ? ' is-current' : ''}" href="${escapeHtml(getRoutePath(`marketplace:${m.key}`, lang))}"${isCurrent ? ' aria-current="page"' : ''}>
      <span class="chip-card__name">${escapeHtml(m.name)}</span>
      <span class="chip-card__desc">${escapeHtml(m.feeSummary[lang])}</span>
    </a>`;
    })
    .join('');

  const tipsSection = marketplace
    ? `<section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.marketplace.tipsHeading)} — ${escapeHtml(marketplace.name)}</h2>
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
        <nav class="quick-strip" aria-label="${escapeHtml(t.common.marketplaceGuides)}">${topMpStripHtml}</nav>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="marketplace" data-default-currency="${defaultCurrency}" data-default-preset="${marketplace ? marketplace.key : ''}">
        <div class="calc-inputs">
          ${renderCurrencyControl('mp', defaultCurrency, t)}

          <div class="field">
            <label class="field__label" for="mp-preset">${escapeHtml(t.marketplace.presetLabel)}</label>
            <select class="input" id="mp-preset">
              <option value="custom"${!marketplace ? ' selected' : ''}>${escapeHtml(t.marketplace.customPreset)}</option>
              ${presetOptions}
            </select>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="mp-price">${escapeHtml(t.marketplace.priceLabel)}</label>
              <input class="input num" type="number" id="mp-price" inputmode="decimal" step="any" min="0" value="${activePreset.price}">
            </div>
            <div class="field">
              <label class="field__label" for="mp-buyer-ship">${escapeHtml(t.marketplace.buyerShippingLabel)}</label>
              <input class="input num" type="number" id="mp-buyer-ship" inputmode="decimal" step="any" min="0" value="${activePreset.buyerShipping}">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="mp-cogs">${escapeHtml(t.marketplace.cogsLabel)}</label>
              <input class="input num" type="number" id="mp-cogs" inputmode="decimal" step="any" min="0" value="${activePreset.cogs}">
            </div>
            <div class="field">
              <label class="field__label" for="mp-seller-ship">${escapeHtml(t.marketplace.sellerShippingLabel)}</label>
              <input class="input num" type="number" id="mp-seller-ship" inputmode="decimal" step="any" min="0" value="${activePreset.sellerShipping}">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="mp-comm">${escapeHtml(t.marketplace.commissionLabel)}</label>
              <input class="input num" type="number" id="mp-comm" inputmode="decimal" step="0.1" min="0" max="100" value="${activePreset.commissionPct}">
            </div>
            <div class="field">
              <label class="field__label" for="mp-pay-pct">${escapeHtml(t.marketplace.paymentPctLabel)}</label>
              <input class="input num" type="number" id="mp-pay-pct" inputmode="decimal" step="0.1" min="0" max="100" value="${activePreset.paymentPct}">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="mp-fixed-fee">${escapeHtml(t.marketplace.fixedFeeLabel)}</label>
              <input class="input num" type="number" id="mp-fixed-fee" inputmode="decimal" step="0.05" min="0" value="${activePreset.fixedFee}">
            </div>
            <div class="field">
              <label class="field__label" for="mp-acos">${escapeHtml(t.marketplace.acosLabel)}</label>
              <input class="input num" type="number" id="mp-acos" inputmode="decimal" step="0.5" min="0" max="100" value="${activePreset.acosPct}">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="mp-returns">${escapeHtml(t.marketplace.returnsLabel)}</label>
              <input class="input num" type="number" id="mp-returns" inputmode="decimal" step="0.5" min="0" max="60" value="0">
            </div>
            <div class="field">
              <label class="field__label" for="mp-orders">${escapeHtml(t.marketplace.monthlyOrdersLabel)}</label>
              <input class="input num" type="number" id="mp-orders" inputmode="numeric" step="10" min="1" value="50">
            </div>
          </div>

          <div class="field">
            <span class="field__label">${escapeHtml(t.marketplace.targetMarginLabel)}</span>
            <div class="pill-row">
              <button type="button" class="pill-btn" data-mp-target-margin="15">15%</button>
              <button type="button" class="pill-btn is-active" data-mp-target-margin="25">25%</button>
              <button type="button" class="pill-btn" data-mp-target-margin="35">35%</button>
            </div>
          </div>

          <div class="field field--checkbox">
            <label class="check-row">
              <input type="checkbox" id="mp-vat-enabled"${activePreset.vatRegistered ? ' checked' : ''}>
              <span>${escapeHtml(t.marketplace.vatRegisteredLabel)}</span>
            </label>
          </div>

          <div class="field" id="mp-vat-rate-wrap">
            <label class="field__label" for="mp-vat-rate">${escapeHtml(t.marketplace.vatRateLabel)}</label>
            <input class="input num" type="number" id="mp-vat-rate" inputmode="decimal" step="0.1" min="0" max="100" value="${activePreset.vatPct || (lang === 'pl' ? 23 : lang === 'de' ? 19 : 20)}">
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero-pair">
            <div class="result-hero" id="mp-hero-box">
              <span class="result-hero__label">${escapeHtml(t.marketplace.outNetProfit)}</span>
              <strong class="result-hero__value num" id="mp-out-profit">—</strong>
            </div>
            <div class="result-hero result-hero--alt" id="mp-monthly-box">
              <span class="result-hero__label">${escapeHtml(t.marketplace.outMonthlyProfit)}</span>
              <strong class="result-hero__value num" id="mp-out-monthly">—</strong>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.marketplace.outMargin)}</span>
              <strong class="kpi__value num" id="mp-out-margin">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.marketplace.outRoi)}</span>
              <strong class="kpi__value num" id="mp-out-roi">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.marketplace.outTotalFees)}</span>
              <strong class="kpi__value num" id="mp-out-fees">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.marketplace.outAdCost)}</span>
              <strong class="kpi__value num" id="mp-out-ads">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.marketplace.outVatPayable)}</span>
              <strong class="kpi__value num" id="mp-out-vat">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.marketplace.outBreakEvenPrice)}</span>
              <strong class="kpi__value num" id="mp-out-be-price">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label" id="mp-target-price-label">${escapeHtml(t.marketplace.outTargetPrice.replace('{pct}', '25'))}</span>
              <strong class="kpi__value num" id="mp-out-target-price">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.marketplace.outBreakEvenAcos)}</span>
              <strong class="kpi__value num" id="mp-out-be-acos">—</strong>
            </div>
          </div>

          <div class="split-bar-block">
            <div class="split-bar-title">${escapeHtml(t.marketplace.barTitle)}</div>
            <div class="split-bar" id="mp-bar" role="img" aria-label="${escapeHtml(t.marketplace.barTitle)}">
              <div class="split-bar__seg seg-navy" id="mp-seg-cogs" style="width:25%"></div>
              <div class="split-bar__seg seg-amber" id="mp-seg-fees" style="width:15%"></div>
              <div class="split-bar__seg seg-terra" id="mp-seg-ads" style="width:15%"></div>
              <div class="split-bar__seg seg-slate" id="mp-seg-vat" style="width:15%"></div>
              <div class="split-bar__seg seg-emerald" id="mp-seg-profit" style="width:30%"></div>
            </div>
            <div class="split-legend" id="mp-legend"></div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="mp-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="mp-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="mp-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <section class="content-section" aria-labelledby="mp-compare-title">
        <div class="section-head">
          <h2 id="mp-compare-title" class="section-heading">${escapeHtml(t.marketplace.compareHeading)}</h2>
          <p class="section-sub">${escapeHtml(t.marketplace.compareSub)}</p>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.marketplace.colPlatform)}</th>
                <th>${escapeHtml(t.marketplace.colFees)}</th>
                <th>${escapeHtml(t.marketplace.colProfitOrder)}</th>
                <th>${escapeHtml(t.marketplace.colMargin)}</th>
                <th>${escapeHtml(t.marketplace.colBeAcos)}</th>
                <th>${escapeHtml(t.marketplace.colMonthly)}</th>
              </tr>
            </thead>
            <tbody id="mp-compare-body"></tbody>
          </table>
        </div>
      </section>

      <script>window.CALCLEDGER_MP_PRESETS = ${safeJsonLd(presetMap)};window.CALCLEDGER_MP_ORDER = ${safeJsonLd(presetOrder)};</script>

      ${tipsSection}

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.marketplace.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.marketplace.guideIntro)}</p>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section" aria-labelledby="mp-list-heading">
        <h2 id="mp-list-heading" class="section-heading">${escapeHtml(t.common.marketplaceGuides)}</h2>
        <div class="mp-grid">${mpLinksHtml}</div>
      </section>

      ${renderFaqSection(seo.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('marketplace', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'marketplace',
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
          'Marketplace commission, payment fee, return rate, and monthly volume modeling',
          'ACOS advertising spend, break-even ACOS, break-even price, and target margin price',
          'Live side-by-side comparison across Allegro, Amazon FBA, Etsy, eBay, Shopify, and Upwork',
          'VAT deduction and visual revenue breakdown bar',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(seo.faqs),
    ],
  });
}
