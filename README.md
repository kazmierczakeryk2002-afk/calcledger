# CalcLedger

**Live site:** [https://calcledger.org](https://calcledger.org) · **Deutsch:** [calcledger.org/de/](https://calcledger.org/de/) · **Polski:** [calcledger.org/pl/](https://calcledger.org/pl/) · **LLMs Index:** [calcledger.org/llms.txt](https://calcledger.org/llms.txt)

Zero-dependency, privacy-first multilingual (**EN / DE / PL**) financial and e-commerce calculator suite built with pure HTML, Vanilla CSS, Vanilla JS, and a custom Node.js static site generator (**117 localized static HTML pages**, deployed on Cloudflare Workers Static Assets).

Every calculation runs **100% locally in the browser** — no accounts, no server-side input tracking, instant live updates, 5 currencies (`EUR`, `USD`, `GBP`, `CHF`, `PLN`), tap-to-copy KPIs, and shareable URL query state.

---

## Live Calculators & Comparisons

| Tool | What It Calculates | Live Links |
|---|---|---|
| **Compound Interest & ROI** | Portfolio growth & **reverse savings-goal mode**, interactive sliders, capital gains tax (`0%`, `19%` PL Belka, `26.375%` DE Abgeltungssteuer), inflation-adjusted real purchasing power, SVG chart, year-by-year table & UTF-8 CSV export | [EN](https://calcledger.org/compound-interest-calculator/) · [DE](https://calcledger.org/de/zinseszins-rechner/) · [PL](https://calcledger.org/pl/kalkulator-procentu-skladanego/) |
| **VAT / MwSt Calculator** | Net ↔ Gross VAT calculation with quick rates & **15 dedicated European country calculators** (DE, AT, CH, UK, PL, FR, NL, ES, IT, CZ, BE, SE, PT, IE, DK) | [EN](https://calcledger.org/vat-calculator/) · [DE](https://calcledger.org/de/mwst-rechner/) · [PL](https://calcledger.org/pl/kalkulator-vat/) |
| **Marketplace Profit & Fees** | Net profit/order & monthly profit, return rate %, ACOS ads, VAT, Break-Even Price, Target Margin Price, Break-Even ACOS & **live 6-platform comparison** (Allegro, Amazon FBA, Etsy, eBay, Shopify, Upwork) | [EN](https://calcledger.org/marketplace-fee-calculator/) · [DE](https://calcledger.org/de/marktplatz-gebuehren-rechner/) · [PL](https://calcledger.org/pl/kalkulator-prowizji-marketplace/) |
| **PayPal & Stripe Fees** | Net payout & reverse invoice charge calculation + international FX spreads | [EN](https://calcledger.org/payment-fee-calculator/) · [DE](https://calcledger.org/de/zahlungsgebuehren-rechner/) · [PL](https://calcledger.org/pl/kalkulator-prowizji-platniczych/) |
| **ROAS ↔ ACOS & Ads Profit** | Instant ROAS/ACOS conversion, Break-Even ROAS from margin, net profit after ads & clickable reference table | [EN](https://calcledger.org/roas-acos-calculator/) · [DE](https://calcledger.org/de/roas-acos-rechner/) · [PL](https://calcledger.org/pl/kalkulator-roas-acos/) |
| **Profit Margin & Markup** | Cost, selling price, margin %, markup %, price multiplier & clickable Margin ↔ Markup table | [EN](https://calcledger.org/profit-margin-calculator/) · [DE](https://calcledger.org/de/marge-aufschlag-rechner/) · [PL](https://calcledger.org/pl/kalkulator-marzy-i-narzutu/) |
| **Freelance B2B Rate** | Sustainable hourly & day rate from target net income, overhead, taxes, vacation weeks & billable utilization | [EN](https://calcledger.org/freelance-rate-calculator/) · [DE](https://calcledger.org/de/freelance-stundensatz-rechner/) · [PL](https://calcledger.org/pl/kalkulator-stawki-freelancera/) |

### 1-on-1 Platform Comparisons

- **Allegro vs Amazon FBA:** [EN](https://calcledger.org/compare/allegro-vs-amazon/) · [DE](https://calcledger.org/de/vergleich/allegro-vs-amazon/) · [PL](https://calcledger.org/pl/porownanie/allegro-vs-amazon/)
- **Amazon FBA vs eBay:** [EN](https://calcledger.org/compare/amazon-vs-ebay/) · [DE](https://calcledger.org/de/vergleich/amazon-vs-ebay/) · [PL](https://calcledger.org/pl/porownanie/amazon-vs-ebay/)
- **Etsy vs Shopify:** [EN](https://calcledger.org/compare/etsy-vs-shopify/) · [DE](https://calcledger.org/de/vergleich/etsy-vs-shopify/) · [PL](https://calcledger.org/pl/porownanie/etsy-vs-shopify/)
- **PayPal vs Stripe:** [EN](https://calcledger.org/compare/paypal-vs-stripe/) · [DE](https://calcledger.org/de/vergleich/paypal-vs-stripe/) · [PL](https://calcledger.org/pl/porownanie/paypal-vs-stripe/)

---

## Architecture & Highlights

- **Zero npm dependencies** — built using only Node.js built-in modules (`node:fs`, `node:path`, `node:crypto`, `node:http`, `node:url`).
- **117 localized HTML pages** with complete bi-directional `hreflang` matrices (`en`, `de`, `pl`, `x-default`), unique titles/descriptions, self-referencing canonicals, and **324 validated JSON-LD blocks** (`WebSite`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`).
- **GEO / AI-Search Ready** — machine-readable [`llms.txt`](https://calcledger.org/llms.txt) and [`llms-full.txt`](https://calcledger.org/llms-full.txt) with explicit formulas & European VAT tables.
- **UX Craft** — sticky desktop results, floating mobile live-result dock, instant Quick Finder (`Ctrl+K` / `⌘K`), tap-to-copy KPI cards, discreet `?` field hints, and automatic SHA-256 asset cache-busting.
- **GDPR / RODO / DSGVO Compliant** — Google Consent Mode v2 banner, 100% client-side computation, zero server storage of financial inputs.

---

## Local Development

```bash
npm run build      # Generate all 117 localized HTML pages + SEO/GEO files into dist/
npm run check-seo  # Audit titles, descriptions, hreflang symmetry, JSON-LD, and internal links
npm run verify     # Build + full technical SEO & GEO audit
npm run serve      # Local static preview on http://127.0.0.1:4173
```

## Deployment (Cloudflare Workers Static Assets)

Configured via [`wrangler.jsonc`](wrangler.jsonc):

- **Build command:** `npm run build`
- **Assets directory:** `./dist`
- **404 handling:** `404-page`

## Contact

- Website: [https://calcledger.org](https://calcledger.org)
- Email: `contact@calcledger.org`
