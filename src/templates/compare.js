import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml, safeJsonLd } from '../data/i18n.js';
import { COMPARISONS } from '../data/comparisons.js';
import {
  renderLayout,
  renderAdSlot,
  renderCurrencyControl,
  renderBreadcrumbs,
  renderHint,
  renderFaqSection,
  renderRelatedCalculators,
  buildBreadcrumbJsonLd,
  buildSoftwareAppJsonLd,
  buildFaqJsonLd,
} from './layout.js';

export function renderComparePage(lang, cmp) {
  const t = getI18n(lang);
  const seo = cmp.seo[lang];
  const pageKey = `compare:${cmp.key}`;
  const isPayment = cmp.kind === 'payment';
  const parentKey = isPayment ? 'payment' : 'marketplace';
  const defaultCurrency = cmp.defaultCurrencyByLang[lang] || 'EUR';
  const def = cmp.defaultsByLang[lang] || cmp.defaultsByLang.en;

  const fixedA = cmp.sideA.fixedFeeByCur[defaultCurrency] ?? 0;
  const fixedB = cmp.sideB.fixedFeeByCur[defaultCurrency] ?? 0;

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav[parentKey], href: getRoutePath(parentKey, lang), url: getAbsoluteUrl(parentKey, lang) },
    { label: `${cmp.sideA.name} vs ${cmp.sideB.name}`, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
  ];

  const topStripHtml = COMPARISONS.map((item) => {
    const isCurrent = item.key === cmp.key;
    return `<a class="quick-link${isCurrent ? ' is-current' : ''}" href="${escapeHtml(getRoutePath(`compare:${item.key}`, lang))}"${isCurrent ? ' aria-current="page"' : ''}>${escapeHtml(item.sideA.name)} vs ${escapeHtml(item.sideB.name)}</a>`;
  }).join('');

  const otherCardsHtml = COMPARISONS.filter((item) => item.key !== cmp.key)
    .map(
      (item) => `<a class="chip-card chip-card--mp" href="${escapeHtml(getRoutePath(`compare:${item.key}`, lang))}">
        <span class="chip-card__name">${escapeHtml(item.sideA.name)} vs ${escapeHtml(item.sideB.name)}</span>
        <span class="chip-card__desc">${escapeHtml(item.seo[lang].summary)}</span>
      </a>`
    )
    .join('');

  const configPayload = {
    kind: cmp.kind,
    sideA: cmp.sideA,
    sideB: cmp.sideB,
  };

  const inputsHtml = isPayment
    ? `
          <div class="field-group-title">${escapeHtml(t.compare.sharedPaymentInputs)}</div>
          <div class="field-row">
            <div class="field">
              <label class="field__label" for="vs-amount">${escapeHtml(t.compare.amountLabel)}</label>
              <input class="input num" type="number" id="vs-amount" inputmode="decimal" step="any" min="0" value="${def.amount}">
            </div>
            <div class="field">
              <label class="field__label" for="vs-orders">${escapeHtml(t.compare.txCountLabel)}</label>
              <input class="input num" type="number" id="vs-orders" inputmode="numeric" step="10" min="1" value="${def.txCount}">
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="vs-fx">${escapeHtml(t.compare.fxLabel)}${renderHint(t.hints.fxSpread)}</label>
            <input class="input num" type="number" id="vs-fx" inputmode="decimal" step="0.5" min="0" max="20" value="${def.fxPct}">
          </div>

          <div class="field-group-title">${escapeHtml(t.compare.feesHeading)}</div>
          <div class="vs-fee-grid">
            <div class="vs-fee-col">
              <strong class="vs-fee-col__title">${escapeHtml(cmp.sideA.name)}</strong>
              <div class="field">
                <label class="field__label" for="vs-a-pct">${escapeHtml(t.compare.feePctLabel)}</label>
                <input class="input num" type="number" id="vs-a-pct" inputmode="decimal" step="0.05" min="0" max="50" value="${cmp.sideA.feePct}">
              </div>
              <div class="field">
                <label class="field__label" for="vs-a-fix">${escapeHtml(t.compare.fixedLabel)}</label>
                <input class="input num" type="number" id="vs-a-fix" inputmode="decimal" step="0.05" min="0" value="${fixedA}">
              </div>
            </div>
            <div class="vs-fee-col">
              <strong class="vs-fee-col__title">${escapeHtml(cmp.sideB.name)}</strong>
              <div class="field">
                <label class="field__label" for="vs-b-pct">${escapeHtml(t.compare.feePctLabel)}</label>
                <input class="input num" type="number" id="vs-b-pct" inputmode="decimal" step="0.05" min="0" max="50" value="${cmp.sideB.feePct}">
              </div>
              <div class="field">
                <label class="field__label" for="vs-b-fix">${escapeHtml(t.compare.fixedLabel)}</label>
                <input class="input num" type="number" id="vs-b-fix" inputmode="decimal" step="0.05" min="0" value="${fixedB}">
              </div>
            </div>
          </div>
    `
    : `
          <div class="field-group-title">${escapeHtml(t.compare.sharedInputs)}</div>
          <div class="field-row">
            <div class="field">
              <label class="field__label" for="vs-price">${escapeHtml(t.compare.priceLabel)}</label>
              <input class="input num" type="number" id="vs-price" inputmode="decimal" step="any" min="0" value="${def.price}">
            </div>
            <div class="field">
              <label class="field__label" for="vs-cogs">${escapeHtml(t.compare.cogsLabel)}${renderHint(t.hints.cogs)}</label>
              <input class="input num" type="number" id="vs-cogs" inputmode="decimal" step="any" min="0" value="${def.cogs}">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="vs-ship">${escapeHtml(t.compare.shippingLabel)}</label>
              <input class="input num" type="number" id="vs-ship" inputmode="decimal" step="any" min="0" value="${def.shipping}">
            </div>
            <div class="field">
              <label class="field__label" for="vs-acos">${escapeHtml(t.compare.acosLabel)}${renderHint(t.hints.acos)}</label>
              <input class="input num" type="number" id="vs-acos" inputmode="decimal" step="0.5" min="0" max="100" value="${def.acos}">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="vs-returns">${escapeHtml(t.compare.returnsLabel)}${renderHint(t.hints.returns)}</label>
              <input class="input num" type="number" id="vs-returns" inputmode="decimal" step="0.5" min="0" max="60" value="${def.returns}">
            </div>
            <div class="field">
              <label class="field__label" for="vs-orders">${escapeHtml(t.compare.ordersLabel)}</label>
              <input class="input num" type="number" id="vs-orders" inputmode="numeric" step="10" min="1" value="${def.orders}">
            </div>
          </div>

          <div class="field field--checkbox">
            <label class="check-row">
              <input type="checkbox" id="vs-vat-on"${def.vatOn ? ' checked' : ''}>
              <span>${escapeHtml(t.marketplace.vatRegisteredLabel)}${renderHint(t.hints.vatRegistered)}</span>
            </label>
          </div>
          <div class="field" id="vs-vat-wrap">
            <label class="field__label" for="vs-vat-rate">${escapeHtml(t.marketplace.vatRateLabel)}</label>
            <input class="input num" type="number" id="vs-vat-rate" inputmode="decimal" step="0.1" min="0" max="100" value="${def.vatRate}">
          </div>

          <div class="field-group-title">${escapeHtml(t.compare.feesHeading)}</div>
          <div class="vs-fee-grid">
            <div class="vs-fee-col">
              <strong class="vs-fee-col__title">${escapeHtml(cmp.sideA.name)}</strong>
              <div class="field">
                <label class="field__label" for="vs-a-comm">${escapeHtml(t.compare.commLabel)}</label>
                <input class="input num" type="number" id="vs-a-comm" inputmode="decimal" step="0.1" min="0" max="100" value="${cmp.sideA.commPct}">
              </div>
              <div class="field">
                <label class="field__label" for="vs-a-pay">${escapeHtml(t.compare.payPctLabel)}</label>
                <input class="input num" type="number" id="vs-a-pay" inputmode="decimal" step="0.1" min="0" max="100" value="${cmp.sideA.payPct}">
              </div>
              <div class="field">
                <label class="field__label" for="vs-a-fix">${escapeHtml(t.compare.fixedLabel)}</label>
                <input class="input num" type="number" id="vs-a-fix" inputmode="decimal" step="0.1" min="0" value="${fixedA}">
              </div>
            </div>
            <div class="vs-fee-col">
              <strong class="vs-fee-col__title">${escapeHtml(cmp.sideB.name)}</strong>
              <div class="field">
                <label class="field__label" for="vs-b-comm">${escapeHtml(t.compare.commLabel)}</label>
                <input class="input num" type="number" id="vs-b-comm" inputmode="decimal" step="0.1" min="0" max="100" value="${cmp.sideB.commPct}">
              </div>
              <div class="field">
                <label class="field__label" for="vs-b-pay">${escapeHtml(t.compare.payPctLabel)}</label>
                <input class="input num" type="number" id="vs-b-pay" inputmode="decimal" step="0.1" min="0" max="100" value="${cmp.sideB.payPct}">
              </div>
              <div class="field">
                <label class="field__label" for="vs-b-fix">${escapeHtml(t.compare.fixedLabel)}</label>
                <input class="input num" type="number" id="vs-b-fix" inputmode="decimal" step="0.1" min="0" value="${fixedB}">
              </div>
            </div>
          </div>
    `;

  const cardsHtml = isPayment
    ? `
          <div class="vs-cards">
            <div class="vs-card" id="vs-card-a">
              <div class="vs-card__head">
                <strong>${escapeHtml(cmp.sideA.name)}</strong>
                <span class="badge-best" id="vs-badge-a" hidden>${escapeHtml(t.compare.winnerBadge)}</span>
              </div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.netPayout)}</span><strong class="num" id="vs-a-m1">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.feeTx)}</span><strong class="num" id="vs-a-m2">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.effFee)}</span><strong class="num" id="vs-a-m3">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.monthlyFees)}</span><strong class="num" id="vs-a-m4">—</strong></div>
              <div class="vs-metric vs-metric--em"><span>${escapeHtml(t.compare.yearlyFees)}</span><strong class="num" id="vs-a-m5">—</strong></div>
              <a class="vs-card__link" href="${escapeHtml(getRoutePath(cmp.sideA.pageKey, lang))}">${escapeHtml(t.compare.openSingle.replace('{name}', cmp.sideA.name))} &rarr;</a>
            </div>
            <div class="vs-card" id="vs-card-b">
              <div class="vs-card__head">
                <strong>${escapeHtml(cmp.sideB.name)}</strong>
                <span class="badge-best" id="vs-badge-b" hidden>${escapeHtml(t.compare.winnerBadge)}</span>
              </div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.netPayout)}</span><strong class="num" id="vs-b-m1">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.feeTx)}</span><strong class="num" id="vs-b-m2">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.effFee)}</span><strong class="num" id="vs-b-m3">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.monthlyFees)}</span><strong class="num" id="vs-b-m4">—</strong></div>
              <div class="vs-metric vs-metric--em"><span>${escapeHtml(t.compare.yearlyFees)}</span><strong class="num" id="vs-b-m5">—</strong></div>
              <a class="vs-card__link" href="${escapeHtml(getRoutePath(cmp.sideB.pageKey, lang))}">${escapeHtml(t.compare.openSingle.replace('{name}', cmp.sideB.name))} &rarr;</a>
            </div>
          </div>
    `
    : `
          <div class="vs-cards">
            <div class="vs-card" id="vs-card-a">
              <div class="vs-card__head">
                <strong>${escapeHtml(cmp.sideA.name)}</strong>
                <span class="badge-best" id="vs-badge-a" hidden>${escapeHtml(t.compare.winnerBadge)}</span>
              </div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.netOrder)}</span><strong class="num" id="vs-a-m1">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.margin)}</span><strong class="num" id="vs-a-m2">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.feesOrder)}</span><strong class="num" id="vs-a-m3">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.beAcos)}</span><strong class="num" id="vs-a-m4">—</strong></div>
              <div class="vs-metric vs-metric--em"><span>${escapeHtml(t.compare.monthlyProfit)}</span><strong class="num" id="vs-a-m5">—</strong></div>
              <a class="vs-card__link" href="${escapeHtml(getRoutePath(cmp.sideA.pageKey, lang))}">${escapeHtml(t.compare.openSingle.replace('{name}', cmp.sideA.name))} &rarr;</a>
            </div>
            <div class="vs-card" id="vs-card-b">
              <div class="vs-card__head">
                <strong>${escapeHtml(cmp.sideB.name)}</strong>
                <span class="badge-best" id="vs-badge-b" hidden>${escapeHtml(t.compare.winnerBadge)}</span>
              </div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.netOrder)}</span><strong class="num" id="vs-b-m1">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.margin)}</span><strong class="num" id="vs-b-m2">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.feesOrder)}</span><strong class="num" id="vs-b-m3">—</strong></div>
              <div class="vs-metric"><span>${escapeHtml(t.compare.beAcos)}</span><strong class="num" id="vs-b-m4">—</strong></div>
              <div class="vs-metric vs-metric--em"><span>${escapeHtml(t.compare.monthlyProfit)}</span><strong class="num" id="vs-b-m5">—</strong></div>
              <a class="vs-card__link" href="${escapeHtml(getRoutePath(cmp.sideB.pageKey, lang))}">${escapeHtml(t.compare.openSingle.replace('{name}', cmp.sideB.name))} &rarr;</a>
            </div>
          </div>
    `;

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(seo.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(seo.subtitle)}</p>
        <nav class="quick-strip" aria-label="${escapeHtml(t.compare.otherComparisons)}">${topStripHtml}</nav>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="compare" data-default-currency="${defaultCurrency}">
        <div class="calc-inputs">
          ${renderCurrencyControl('vs', defaultCurrency, t)}
          ${inputsHtml}
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero" id="vs-winner-box">
            <span class="result-hero__label" id="vs-winner-label">${escapeHtml(cmp.sideA.name)} vs ${escapeHtml(cmp.sideB.name)}</span>
            <strong class="result-hero__value num" id="vs-winner-delta">—</strong>
            <span class="vs-winner-sub" id="vs-winner-sub"></span>
          </div>

          ${cardsHtml}

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="vs-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="vs-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="vs-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <script>window.CALCLEDGER_COMPARE = ${safeJsonLd(configPayload)};</script>

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(cmp.sideA.name)} vs ${escapeHtml(cmp.sideB.name)}</h2>
        <p class="prose">${escapeHtml(seo.summary)}</p>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section" aria-labelledby="vs-others-title">
        <h2 id="vs-others-title" class="section-heading">${escapeHtml(t.compare.otherComparisons)}</h2>
        <div class="mp-grid">${otherCardsHtml}</div>
      </section>

      ${renderFaqSection(seo.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators(parentKey, lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: parentKey,
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
          `Live 1-on-1 comparison: ${cmp.sideA.name} vs ${cmp.sideB.name}`,
          'Editable platform commissions, fixed fees, and monthly volume',
          'Instant monthly and annual savings difference calculation',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN) and shareable URLs',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(seo.faqs),
    ],
  });
}
