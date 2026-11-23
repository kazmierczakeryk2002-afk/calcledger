# CalcLedger (`https://calcledger.org`)

Static, zero-dependency, multilingual (EN / DE / PL) financial & e-commerce micro-tools platform built with pure HTML, Vanilla CSS, Vanilla JS, and a Node.js static site generator.

## Features

- **Zero npm dependencies** — uses only Node.js built-in modules (`fs`, `path`, `http`, `url`).
- **3 Languages (EN, DE, PL)** with localized slugs and a complete bi-directional `hreflang` matrix (`en`, `de`, `pl`, `x-default`).
- **5 Interactive Client-Side Calculators** (100% browser-local, live recalculation, USD/EUR/GBP/CHF/PLN switcher, copy result, shareable URL query state):
  1. **VAT / MwSt Calculator** (Net ↔ Gross) + **9 Programmatic SEO country pages** (Germany 19%, Austria 20%, Switzerland 8.1%, UK 20%, Poland 23%, France 20%, Netherlands 21%, Spain 21%, Italy 22%).
  2. **Marketplace Seller Profit & Fee Calculator** (net profit, margin, ROI, ACOS ads, VAT, break-even price, break-even ACOS, visual revenue breakdown bar) + **6 Programmatic SEO platform pages** (Etsy, Amazon FBA, eBay, Shopify, Upwork, Allegro).
  3. **Profit Margin & Markup Calculator** + interactive clickable **Margin ↔ Markup Reference Table**.
  4. **Freelance Hourly & Day Rate Calculator (B2B)**.
  5. **Compound Interest & ROI Calculator** + dynamic **SVG growth chart** + **year-by-year table**.
- **Full Technical SEO**: unique `<title>` and `<meta description>`, 1× `<h1>`, canonicals, `sitemap.xml` with `xhtml:link`, `robots.txt`, `ads.txt`, Cloudflare Pages `_headers`, JSON-LD (`WebSite`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`).
- **Google AdSense & GDPR/RODO/DSGVO Ready**: About, Privacy Policy, Terms / German Impressum (§ 5 DDG), Contact, Google Consent Mode v2 banner, zero-CLS ad slots controlled by `adsenseClientId` in [`src/config.js`](src/config.js).

## Commands

```bash
npm run build      # Build complete static site into dist/
npm run check-seo  # Run strict SEO, hreflang, JSON-LD, and internal link audit
npm run verify     # Build + SEO audit
npm run serve      # Local static preview on http://127.0.0.1:4173
```

## Activating Google AdSense

Edit [`src/config.js`](src/config.js) and set your publisher ID:

```js
adsenseClientId: 'ca-pub-XXXXXXXXXXXXXXXX',
adsenseSlots: {
  topBanner: '1111111111',
  midContent: '2222222222',
  bottomBanner: '3333333333',
},
```

Run `npm run build` (or push to `main` for automatic Cloudflare Pages rebuild). `dist/ads.txt`, the AdSense script tag, and zero-CLS `<ins class="adsbygoogle">` slots activate automatically.

## Cloudflare Pages Deployment

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 18+ (default on Cloudflare Pages)
