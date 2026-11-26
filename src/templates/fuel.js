import { SITE_CONFIG } from '../config.js';
import { getRoutePath, getAbsoluteUrl } from '../data/routes.js';
import { getI18n, escapeHtml } from '../data/i18n.js';
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

export function renderFuelPage(lang) {
  const t = getI18n(lang);
  const pageKey = 'fuel';
  const defaultCurrency = SITE_CONFIG.defaultCurrencyByLang[lang];

  const defaultsByLang = {
    en: {
      distance: 350,
      consumption: 7.5,
      price: 1.05, // USD per liter (~$4/gal)
      passengers: 2,
      days: 21,
      presets: {
        petrol: { cons: 7.5, price: 1.05, co2: 2.31 },
        diesel: { cons: 5.8, price: 1.12, co2: 2.68 },
        lpg: { cons: 9.5, price: 0.65, co2: 1.66 },
        ev: { cons: 18.0, price: 0.18, co2: 0.35 },
      },
    },
    de: {
      distance: 320,
      consumption: 7.2,
      price: 1.78,
      passengers: 2,
      days: 20,
      presets: {
        petrol: { cons: 7.2, price: 1.78, co2: 2.31 },
        diesel: { cons: 5.6, price: 1.66, co2: 2.68 },
        lpg: { cons: 9.2, price: 1.05, co2: 1.66 },
        ev: { cons: 18.0, price: 0.34, co2: 0.38 },
      },
    },
    pl: {
      distance: 300,
      consumption: 7.5,
      price: 6.40,
      passengers: 2,
      days: 21,
      presets: {
        petrol: { cons: 7.5, price: 6.40, co2: 2.31 },
        diesel: { cons: 5.8, price: 6.50, co2: 2.68 },
        lpg: { cons: 9.5, price: 2.95, co2: 1.66 },
        ev: { cons: 18.0, price: 1.15, co2: 0.65 },
      },
    },
  };
  const def = defaultsByLang[lang] || defaultsByLang.en;

  const breadcrumbs = [
    { label: t.common.home, href: getRoutePath('home', lang), url: getAbsoluteUrl('home', lang) },
    { label: t.nav.fuel, href: getRoutePath(pageKey, lang), url: getAbsoluteUrl(pageKey, lang) },
  ];

  const bodyHtml = `
    <div class="container">
      ${renderBreadcrumbs(breadcrumbs)}

      <header class="page-head">
        <div class="page-head__meta">
          <span class="status-tag">${escapeHtml(t.common.localBadge)}</span>
        </div>
        <h1>${escapeHtml(t.fuel.h1)}</h1>
        <p class="page-head__sub">${escapeHtml(t.fuel.subtitle)}</p>
      </header>

      ${renderAdSlot('topBanner', t)}

      <section class="calc-shell" data-calc="fuel" data-default-currency="${defaultCurrency}" data-fuel-presets="${escapeHtml(JSON.stringify(def.presets))}">
        <div class="calc-inputs">
          ${renderCurrencyControl('fuel', defaultCurrency, t)}

          <div class="field">
            <span class="field__label">${escapeHtml(t.fuel.modeLabel)}</span>
            <div class="seg-group seg-group--full" role="group" aria-label="${escapeHtml(t.fuel.modeLabel)}">
              <button type="button" class="seg-btn is-active" data-fuel-mode="trip" aria-pressed="true">${escapeHtml(t.fuel.modeTrip)}</button>
              <button type="button" class="seg-btn" data-fuel-mode="commute" aria-pressed="false">${escapeHtml(t.fuel.modeCommute)}</button>
            </div>
          </div>

          <div class="field">
            <span class="field__label">${escapeHtml(t.fuel.fuelTypeLabel)}</span>
            <div class="pill-row">
              <button type="button" class="pill-btn is-active" data-fuel-type="petrol">${escapeHtml(t.fuel.typePetrol)}</button>
              <button type="button" class="pill-btn" data-fuel-type="diesel">${escapeHtml(t.fuel.typeDiesel)}</button>
              <button type="button" class="pill-btn" data-fuel-type="lpg">${escapeHtml(t.fuel.typeLpg)}</button>
              <button type="button" class="pill-btn" data-fuel-type="ev">${escapeHtml(t.fuel.typeEv)}</button>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="fuel-dist" id="fuel-dist-label">${escapeHtml(t.fuel.distanceLabelTrip)}</label>
            <input class="input num" type="number" id="fuel-dist" inputmode="decimal" step="10" min="1" value="${def.distance}">
            <div class="pill-row">
              <button type="button" class="pill-btn" data-fuel-dist="25">25 km</button>
              <button type="button" class="pill-btn" data-fuel-dist="100">100 km</button>
              <button type="button" class="pill-btn" data-fuel-dist="300">300 km</button>
              <button type="button" class="pill-btn" data-fuel-dist="600">600 km</button>
            </div>
          </div>

          <label class="check-row" id="fuel-roundtrip-wrap">
            <input type="checkbox" id="fuel-roundtrip">
            <span>${escapeHtml(t.fuel.roundTripLabel)}</span>
          </label>

          <div class="field-row">
            <div class="field">
              <label class="field__label" for="fuel-cons" id="fuel-cons-label">${escapeHtml(t.fuel.consumptionLabelFuel)}${renderHint(t.hints.fuelEv)}</label>
              <input class="input num" type="number" id="fuel-cons" inputmode="decimal" step="0.1" min="0.5" max="60" value="${def.consumption}">
            </div>
            <div class="field">
              <label class="field__label" for="fuel-price" id="fuel-price-label">${escapeHtml(t.fuel.priceLabelFuel)}</label>
              <input class="input num" type="number" id="fuel-price" inputmode="decimal" step="0.05" min="0.01" value="${def.price}">
            </div>
          </div>

          <div class="field-row">
            <div class="field" id="fuel-passengers-wrap">
              <label class="field__label" for="fuel-passengers">${escapeHtml(t.fuel.passengersLabel)}</label>
              <input class="input num" type="number" id="fuel-passengers" inputmode="numeric" step="1" min="1" max="9" value="${def.passengers}">
              <div class="pill-row">
                <button type="button" class="pill-btn" data-fuel-pax="1">1</button>
                <button type="button" class="pill-btn" data-fuel-pax="2">2</button>
                <button type="button" class="pill-btn" data-fuel-pax="3">3</button>
                <button type="button" class="pill-btn" data-fuel-pax="4">4</button>
              </div>
            </div>
            <div class="field" id="fuel-days-wrap" hidden>
              <label class="field__label" for="fuel-days">${escapeHtml(t.fuel.daysLabel)}${renderHint(t.hints.fuelCommute)}</label>
              <input class="input num" type="number" id="fuel-days" inputmode="numeric" step="1" min="1" max="31" value="${def.days}">
            </div>
          </div>
        </div>

        <div class="calc-results" aria-live="polite">
          <div class="result-hero-pair">
            <div class="result-hero">
              <span class="result-hero__label" id="fuel-primary-label">${escapeHtml(t.fuel.outTripCost)}</span>
              <strong class="result-hero__value num" id="fuel-out-primary">—</strong>
            </div>
            <div class="result-hero result-hero--alt">
              <span class="result-hero__label" id="fuel-secondary-label">${escapeHtml(t.fuel.outPerPerson)}</span>
              <strong class="result-hero__value num" id="fuel-out-secondary">—</strong>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.fuel.outCostPer100)}</span>
              <strong class="kpi__value num" id="fuel-out-per100">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.fuel.outFuelNeeded)}</span>
              <strong class="kpi__value num" id="fuel-out-liters">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.fuel.outTotalDist)}</span>
              <strong class="kpi__value num" id="fuel-out-dist">—</strong>
            </div>
            <div class="kpi">
              <span class="kpi__label">${escapeHtml(t.fuel.outCo2)}</span>
              <strong class="kpi__value num" id="fuel-out-co2">—</strong>
            </div>
          </div>

          <div class="result-actions">
            <button type="button" class="btn btn--primary" id="fuel-copy-result">${escapeHtml(t.common.copyResult)}</button>
            <button type="button" class="btn btn--secondary" id="fuel-copy-link">${escapeHtml(t.common.copyLink)}</button>
            <button type="button" class="btn btn--ghost" id="fuel-reset">${escapeHtml(t.common.reset)}</button>
          </div>
        </div>
      </section>

      <section class="content-section" aria-labelledby="fuel-compare-title">
        <div class="section-head">
          <h2 id="fuel-compare-title" class="section-heading">${escapeHtml(t.fuel.compareHeading)}</h2>
          <p class="section-sub">${escapeHtml(t.fuel.compareSub)}</p>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${escapeHtml(t.fuel.colType)}</th>
                <th class="num">${escapeHtml(t.fuel.colUsage)}</th>
                <th class="num">${escapeHtml(t.fuel.colTripCost)}</th>
                <th class="num">${escapeHtml(t.fuel.colYearlyCost)}</th>
              </tr>
            </thead>
            <tbody id="fuel-compare-body"></tbody>
          </table>
        </div>
      </section>

      ${renderAdSlot('midContent', t)}

      <section class="content-section">
        <h2 class="section-heading">${escapeHtml(t.fuel.guideHeading)}</h2>
        <p class="prose">${escapeHtml(t.fuel.guideIntro)}</p>
        <div class="formula-grid">
          <div class="formula-box"><code>${escapeHtml(t.fuel.formulaTrip)}</code></div>
          <div class="formula-box"><code>${escapeHtml(t.fuel.formulaCommute)}</code></div>
        </div>
      </section>

      ${renderFaqSection(t.fuel.faqs, t.common.faqHeading)}
      ${renderRelatedCalculators('fuel', lang, t)}
      ${renderAdSlot('bottomBanner', t)}
    </div>
  `;

  return renderLayout({
    lang,
    pageKey,
    activeNav: 'fuel',
    title: t.fuel.title,
    description: t.fuel.description,
    bodyHtml,
    includeCalculatorScript: true,
    jsonLd: [
      buildSoftwareAppJsonLd({
        name: t.fuel.h1,
        description: t.fuel.description,
        url: getAbsoluteUrl(pageKey, lang),
        lang,
        featureList: [
          'Road trip fuel cost calculator with round-trip and per-passenger split',
          'Monthly and annual work commute cost simulator',
          'Live side-by-side comparison of Petrol, Diesel, LPG, and Electric (EV)',
          'Cost per 100 km, total liters/kWh, and estimated CO2 footprint',
          'Multi-currency support (EUR, USD, GBP, CHF, PLN)',
        ],
      }),
      buildBreadcrumbJsonLd(breadcrumbs),
      buildFaqJsonLd(t.fuel.faqs),
    ],
  });
}
