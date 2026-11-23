/**
 * Dedicated 1-on-1 platform comparison datasets (EN, DE, PL).
 * Powers 12 localized pSEO comparison calculator pages:
 *   1. Allegro vs Amazon FBA
 *   2. Amazon FBA vs eBay
 *   3. Etsy vs Shopify
 *   4. PayPal vs Stripe
 */

export const COMPARISONS = [
  {
    key: 'allegro-vs-amazon',
    kind: 'marketplace',
    defaultCurrencyByLang: { en: 'EUR', de: 'EUR', pl: 'PLN' },
    defaultsByLang: {
      en: { price: 45, cogs: 14, shipping: 4, acos: 10, returns: 5, orders: 100, vatOn: true, vatRate: 20 },
      de: { price: 49, cogs: 15, shipping: 4.5, acos: 10, returns: 6, orders: 100, vatOn: true, vatRate: 19 },
      pl: { price: 149, cogs: 48, shipping: 12, acos: 10, returns: 5, orders: 100, vatOn: true, vatRate: 23 },
    },
    sideA: {
      key: 'allegro',
      name: 'Allegro',
      pageKey: 'marketplace:allegro',
      commPct: 10.0,
      payPct: 0.0,
      fixedFeeByCur: { PLN: 0, EUR: 0, USD: 0, GBP: 0, CHF: 0 },
      extraFulfillmentByCur: { PLN: 0, EUR: 0, USD: 0, GBP: 0, CHF: 0 },
    },
    sideB: {
      key: 'amazon-fba',
      name: 'Amazon FBA',
      pageKey: 'marketplace:amazon-fba',
      commPct: 15.0,
      payPct: 0.0,
      fixedFeeByCur: { PLN: 16, EUR: 4.2, USD: 4.5, GBP: 3.6, CHF: 4.5 },
      extraFulfillmentByCur: { PLN: 0, EUR: 0, USD: 0, GBP: 0, CHF: 0 },
    },
    seo: {
      en: {
        title: 'Allegro vs Amazon FBA Fee & Profit Comparison | CalcLedger',
        description: 'Compare Allegro vs Amazon FBA fees, net profit per order, profit margin, break-even ACOS, and monthly profit side-by-side with live inputs.',
        h1: 'Allegro vs Amazon FBA — Fee & Profit Comparison',
        subtitle: 'Compare unit economics, referral fees, fulfillment charges, VAT, returns, and monthly net profit side-by-side for your exact product.',
        summary: 'Allegro typically charges ~10% commission with lower fixed fees and strong Polish/CEE demand, while Amazon FBA charges ~15% referral plus FBA pick-and-pack fees in exchange for Prime reach across Europe.',
        faqs: [
          {
            q: 'Which platform leaves higher net profit per order: Allegro or Amazon FBA?',
            a: 'On identical prices and ad spend, Allegro usually leaves a higher margin because average referral fees (~8%–12%) and self-shipping/Smart costs are lower than Amazon’s 15% referral fee plus FBA fulfillment.',
          },
          {
            q: 'When does Amazon FBA beat Allegro in monthly profit?',
            a: 'Amazon FBA wins when Prime pan-European volume lets you sell at higher EUR prices or reach significantly more monthly orders despite higher per-unit fulfillment fees.',
          },
          {
            q: 'Can I customize the category commission and FBA fee?',
            a: 'Yes. Both platform commission percentages and fixed/fulfillment fees are directly editable above so you can match your exact category table.',
          },
        ],
      },
      de: {
        title: 'Allegro vs. Amazon FBA — Gebühren & Gewinn Vergleich | CalcLedger',
        description: 'Vergleichen Sie Allegro und Amazon FBA live: Provisionen, FBA-Gebühren, Retouren, MwSt, Reingewinn pro Bestellung und Monatsgewinn.',
        h1: 'Allegro vs. Amazon FBA — Gebühren- & Gewinnvergleich',
        subtitle: 'Vergleichen Sie Provision, FBA-Fulfillment, Retouren, Umsatzsteuer, Marge und Monatsgewinn direkt nebeneinander für Ihr Produkt.',
        summary: 'Allegro punktet mit meist ~10 % Provision und starker Reichweite in Polen/CEE, während Amazon FBA ~15 % Verkaufsgebühr plus Versandgebühren für Prime-Reichweite im DACH- und EU-Raum verlangt.',
        faqs: [
          {
            q: 'Wo bleibt pro Bestellung mehr Gewinn: Allegro oder Amazon FBA?',
            a: 'Bei gleichem Verkaufspreis bietet Allegro meist die höhere Stückmarge, da durchschnittliche Provisionen (~8–12 %) und Eigenversand günstiger sind als 15 % Amazon-Provision plus FBA-Gebühr.',
          },
          {
            q: 'Wann lohnt sich Amazon FBA trotzdem stärker?',
            a: 'Wenn Sie über Amazon Prime höhere Verkaufspreise in EUR oder deutlich höhere monatliche Stückzahlen in Deutschland und Westeuropa erzielen.',
          },
          {
            q: 'Kann ich meine exakte Kategorie-Provision eintragen?',
            a: 'Ja, Sie können Provision (%) und Fix-/Fulfillment-Gebühr beider Plattformen direkt im Rechner anpassen.',
          },
        ],
      },
      pl: {
        title: 'Allegro vs Amazon FBA — Porównanie Prowizji i Zysku | CalcLedger',
        description: 'Porównaj na żywo prowizje Allegro i Amazon FBA, marżę netto, koszty wysyłki, zwroty, ACOS, VAT oraz miesięczny zysk z tego samego produktu.',
        h1: 'Allegro vs Amazon FBA — Porównanie Prowizji i Zysku',
        subtitle: 'Sprawdź na żywo, na której platformie zostanie Ci więcej czystego zysku z zamówienia i w skali miesiąca po prowizjach, reklamie ACOS, zwrotach i VAT.',
        summary: 'Allegro ma zwykle niższą prowizję (~8–12%) i tańszą logistykę w Polsce, natomiast Amazon FBA pobiera ok. 15% prowizji + stałą opłatę za pakowanie i wysyłkę FBA w zamian za skalę i zasięg Prime w całej Europie.',
        faqs: [
          {
            q: 'Gdzie zostaje wyższa marża na sztuce: Allegro czy Amazon FBA?',
            a: 'Przy tej samej cenie sprzedaży i koszcie zakupu Allegro zazwyczaj daje wyższy zysk jednostkowy, bo średnia prowizja jest niższa niż 15% na Amazonie powiększone o opłatę FBA.',
          },
          {
            q: 'Kiedy Amazon FBA wygrywa z Allegro pod względem zysku?',
            a: 'Gdy sprzedajesz w euro (np. Amazon.de) z wyższą ceną sprzedaży albo osiągasz znacznie większy wolumen miesięczny dzięki programowi Prime.',
          },
          {
            q: 'Czy mogę wpisać prowizję dla mojej konkretnej kategorii?',
            a: 'Tak — prowizje procentowe oraz opłaty stałe/FBA dla obu platform są w pełni edytowalne powyżej.',
          },
        ],
      },
    },
  },
  {
    key: 'amazon-vs-ebay',
    kind: 'marketplace',
    defaultCurrencyByLang: { en: 'USD', de: 'EUR', pl: 'PLN' },
    defaultsByLang: {
      en: { price: 50, cogs: 15, shipping: 5, acos: 10, returns: 5, orders: 100, vatOn: false, vatRate: 20 },
      de: { price: 55, cogs: 16, shipping: 4.9, acos: 10, returns: 6, orders: 100, vatOn: true, vatRate: 19 },
      pl: { price: 199, cogs: 60, shipping: 15, acos: 10, returns: 5, orders: 100, vatOn: true, vatRate: 23 },
    },
    sideA: {
      key: 'amazon-fba',
      name: 'Amazon FBA',
      pageKey: 'marketplace:amazon-fba',
      commPct: 15.0,
      payPct: 0.0,
      fixedFeeByCur: { USD: 4.5, EUR: 4.2, GBP: 3.6, CHF: 4.5, PLN: 16 },
    },
    sideB: {
      key: 'ebay',
      name: 'eBay',
      pageKey: 'marketplace:ebay',
      commPct: 12.9,
      payPct: 0.0,
      fixedFeeByCur: { USD: 0.3, EUR: 0.35, GBP: 0.3, CHF: 0.35, PLN: 1.35 },
    },
    seo: {
      en: {
        title: 'Amazon FBA vs eBay Seller Fee & Profit Comparison | CalcLedger',
        description: 'Compare Amazon FBA vs eBay selling fees, fulfillment costs, net profit per order, margin %, break-even ACOS, and monthly profit side-by-side.',
        h1: 'Amazon FBA vs eBay — Seller Fee & Profit Comparison',
        subtitle: 'Model your exact product cost, shipping, ads, and return rate across Amazon FBA and eBay to see where net profit and annual savings are highest.',
        summary: 'eBay typically charges ~12.9% + $0.30 with self-fulfillment flexibility, whereas Amazon FBA adds fulfillment pick-and-pack charges on top of ~15% referral fees while automating logistics and Prime shipping.',
        faqs: [
          {
            q: 'Are eBay seller fees lower than Amazon FBA fees?',
            a: 'Usually yes on a per-order basis, because eBay combines payment processing into ~12%–13.25% + $0.30 without mandatory warehouse fulfillment fees, though you handle shipping yourself.',
          },
          {
            q: 'Does this comparison include shipping cost differences?',
            a: 'Enter your self-shipping cost in Seller Shipping and adjust Amazon’s fixed FBA fulfillment fee to compare self-fulfilled eBay orders against Amazon FBA accurately.',
          },
          {
            q: 'Which platform has better Break-Even ACOS?',
            a: 'The platform with lower combined fees yields a higher Break-Even ACOS, giving you more room to bid on Sponsored Products or Promoted Listings profitably.',
          },
        ],
      },
      de: {
        title: 'Amazon FBA vs. eBay — Gebühren & Gewinn Vergleich | CalcLedger',
        description: 'Vergleichen Sie Amazon FBA und eBay Gebühren, Versandkosten, Marge, Retourenquote, Break-Even-ACOS und Monatsgewinn im Live-Rechner.',
        h1: 'Amazon FBA vs. eBay — Gebühren- & Gewinnvergleich',
        subtitle: 'Vergleichen Sie Amazon FBA (Provision + Fulfillment) direkt mit eBay-Verkaufsgebühren für Ihr Produkt inklusive Retouren, MwSt und Werbung.',
        summary: 'eBay verlangt meist rund 11–13 % Verkaufsprovision plus 0,35 € Fixgebühr bei Eigenversand, während Amazon FBA ca. 15 % plus FBA-Versandkosten für automatisierte Logistik und Prime-Versand berechnet.',
        faqs: [
          {
            q: 'Ist eBay bei den Gebühren günstiger als Amazon FBA?',
            a: 'Pro Bestellung meist ja, da bei eBay die Zahlungsabwicklung bereits in ca. 11–13 % + 0,35 € enthalten ist und keine FBA-Lager- oder Pick-and-Pack-Gebühren anfallen.',
          },
          {
            q: 'Wann ist Amazon FBA trotz höherer Gebühren sinnvoll?',
            a: 'Sobald Sie Versandzeit sparen oder das größere Prime-Suchvolumen nutzen möchten — besonders bei leichten Standardprodukten mit hoher Stückzahl.',
          },
          {
            q: 'Werden Retouren im Vergleich berücksichtigt?',
            a: 'Ja, tragen Sie einfach Ihre erwartete Retourenquote (%) ein — beide Plattformen werden sofort retourenbereinigt verglichen.',
          },
        ],
      },
      pl: {
        title: 'Amazon FBA vs eBay — Porównanie Prowizji i Zysku | CalcLedger',
        description: 'Porównaj prowizje Amazon FBA i eBay, koszty wysyłki, marżę netto, próg Break-Even ACOS oraz zysk miesięczny w kalkulatorze na żywo.',
        h1: 'Amazon FBA vs eBay — Porównanie Prowizji i Zysku',
        subtitle: 'Zestaw opłaty Amazon FBA z prowizjami eBay dla tego samego produktu — z uwzględnieniem reklam ACOS, zwrotów, VAT i wolumenu sprzedaży.',
        summary: 'eBay pobiera zwykle ok. 12–13% prowizji + drobną opłatę stałą przy wysyłce własnej, podczas gdy Amazon FBA dolicza ok. 15% prowizji i opłatę logistyczną FBA w zamian za obsługę Prime.',
        faqs: [
          {
            q: 'Czy prowizje na eBay są niższe niż na Amazon FBA?',
            a: 'Zazwyczaj tak w przeliczeniu na pojedyncze zamówienie, bo eBay zawiera obsługę płatności w ~12,9% + opłata stała bez obowiązkowych opłat magazynowych FBA.',
          },
          {
            q: 'Jak porównać wysyłkę własną z Amazon FBA?',
            a: 'Wpisz koszt własnej wysyłki i dostosuj opłatę stałą FBA po stronie Amazona — kalkulator pokaże realną różnicę w zysku miesięcznym i rocznym.',
          },
          {
            q: 'Czy mogę zmienić walutę na EUR, USD lub PLN?',
            a: 'Tak, przełącznik 5 walut działa na żywo i automatycznie przelicza formatowanie obu kolumn.',
          },
        ],
      },
    },
  },
  {
    key: 'etsy-vs-shopify',
    kind: 'marketplace',
    defaultCurrencyByLang: { en: 'USD', de: 'EUR', pl: 'PLN' },
    defaultsByLang: {
      en: { price: 42, cogs: 11, shipping: 4.5, acos: 12, returns: 3, orders: 80, vatOn: false, vatRate: 20 },
      de: { price: 45, cogs: 12, shipping: 4.5, acos: 12, returns: 4, orders: 80, vatOn: true, vatRate: 19 },
      pl: { price: 169, cogs: 45, shipping: 14, acos: 12, returns: 3, orders: 80, vatOn: true, vatRate: 23 },
    },
    sideA: {
      key: 'etsy',
      name: 'Etsy',
      pageKey: 'marketplace:etsy',
      commPct: 6.5,
      payPct: 3.0,
      fixedFeeByCur: { USD: 0.45, EUR: 0.5, GBP: 0.4, CHF: 0.5, PLN: 2.0 },
    },
    sideB: {
      key: 'shopify',
      name: 'Shopify',
      pageKey: 'marketplace:shopify',
      commPct: 0.0,
      payPct: 2.9,
      fixedFeeByCur: { USD: 0.3, EUR: 0.25, GBP: 0.25, CHF: 0.3, PLN: 1.2 },
    },
    seo: {
      en: {
        title: 'Etsy vs Shopify Fee & Profit Comparison Calculator | CalcLedger',
        description: 'Compare Etsy vs Shopify transaction fees, payment processing, ad spend (ACOS), net profit per order, and annual fee savings side-by-side.',
        h1: 'Etsy vs Shopify — Fee & Profit Comparison',
        subtitle: 'See exactly how much you save per order and per year moving from Etsy’s ~9.5%+ fees to your own Shopify store (factoring in your own ad spend).',
        summary: 'Etsy charges 6.5% transaction fee + ~3% payment fee + $0.20 listing fee (plus optional 12%–15% Offsite Ads) for built-in buyer traffic, while Shopify charges 0% marketplace commission and ~2.9% + $0.30 payment fees plus a monthly plan.',
        faqs: [
          {
            q: 'How much cheaper is Shopify than Etsy per order?',
            a: 'Shopify saves roughly 6.5% per order in marketplace transaction fees (more if Etsy Offsite Ads apply), which quickly exceeds Shopify’s monthly subscription once you pass ~20–30 orders per month.',
          },
          {
            q: 'What is the hidden catch when comparing Etsy vs Shopify?',
            a: 'Etsy brings built-in organic marketplace search traffic, whereas on Shopify you usually pay more for Meta/Google Ads (higher ACOS) to drive visitors to your store.',
          },
          {
            q: 'Can I include Etsy Offsite Ads (12% or 15%)?',
            a: 'Yes — simply add 12% or 15% to Etsy’s commission field above to see the immediate margin impact versus Shopify.',
          },
        ],
      },
      de: {
        title: 'Etsy vs. Shopify — Gebühren & Gewinn Vergleich | CalcLedger',
        description: 'Etsy-Gebühren (6,5 % + Zahlung + Listing) direkt mit Shopify (0 % Marktplatz-Provision) vergleichen: Marge, ACOS und jährliche Ersparnis.',
        h1: 'Etsy vs. Shopify — Gebühren- & Gewinnvergleich',
        subtitle: 'Berechnen Sie live, wie viel Gewinn pro Bestellung und pro Jahr bei Etsy gegenüber einem eigenen Shopify-Shop übrig bleibt.',
        summary: 'Etsy berechnet 6,5 % Transaktionsgebühr plus Zahlungs- und Einstellgebühr für fertige Käufer-Reichweite; Shopify verlangt 0 % Marktplatz-Provision (nur Zahlungsgebühr + Monatsabo), erfordert aber eigene Traffic-Akquise.',
        faqs: [
          {
            q: 'Ab wie vielen Bestellungen lohnt sich der Wechsel von Etsy zu Shopify?',
            a: 'Da Sie pro Bestellung rund 6,5 % Transaktionsgebühr sparen, amortisiert sich das Shopify-Basisabo oft schon ab 15 bis 30 Bestellungen im Monat — sofern Sie eigenen Traffic aufbauen.',
          },
          {
            q: 'Kann ich Etsy Offsite Ads (12 % / 15 %) mit einrechnen?',
            a: 'Ja, erhöhen Sie einfach den Provisionssatz bei Etsy um 12 % bzw. 15 %, um den Unterschied zu Shopify sofort zu sehen.',
          },
          {
            q: 'Sind Zahlungsgebühren (Shopify Payments / Etsy Payments) enthalten?',
            a: 'Ja, beide Seiten rechnen sowohl prozentuale als auch fixe Zahlungsgebühren pro Bestellung exakt ein.',
          },
        ],
      },
      pl: {
        title: 'Etsy vs Shopify — Porównanie Prowizji i Zysku | CalcLedger',
        description: 'Porównaj opłaty Etsy (6,5% + płatności + listing) ze sklepem Shopify (0% prowizji marketplace): marża netto, reklamy ACOS i roczna oszczędność.',
        h1: 'Etsy vs Shopify — Porównanie Prowizji i Zysku',
        subtitle: 'Policz na żywo różnicę w zysku na zamówieniu, miesiącu i roku między sprzedażą rękodzieła/produktów na Etsy a własnym sklepem na Shopify.',
        summary: 'Etsy pobiera 6,5% prowizji + prowizję płatniczą i opłatę za wystawienie w zamian za gotowy ruch z wyszukiwarki, a Shopify nie ma prowizji marketplace (tylko bramka płatnicza + abonament), ale wymaga własnego marketingu.',
        faqs: [
          {
            q: 'Ile można zaoszczędzić miesięcznie przenosząc sprzedaż z Etsy na Shopify?',
            a: 'Na samym braku 6,5% prowizji transakcyjnej oszczędzasz ok. 6,5% obrotu (a przy Etsy Offsite Ads nawet ponad 18%), co przy 20–30 zamówieniach miesięcznie zwykle z nawiązką pokrywa abonament Shopify.',
          },
          {
            q: 'O czym pamiętać porównując Etsy i Shopify?',
            a: 'Etsy dostarcza ruch organiczny od kupujących, natomiast w Shopify większą część budżetu pochłaniają reklamy (wyższy ACOS), które możesz tutaj od razu uwzględnić.',
          },
          {
            q: 'Czy kalkulator uwzględnia opłatę za wystawienie oferty na Etsy?',
            a: 'Tak, opłata stała Etsy obejmuje zarówno opłatę za płatność, jak i równowartość $0,20 za odnowienie oferty.',
          },
        ],
      },
    },
  },
  {
    key: 'paypal-vs-stripe',
    kind: 'payment',
    defaultCurrencyByLang: { en: 'EUR', de: 'EUR', pl: 'PLN' },
    defaultsByLang: {
      en: { amount: 100, txCount: 100, fxPct: 0 },
      de: { amount: 100, txCount: 100, fxPct: 0 },
      pl: { amount: 250, txCount: 100, fxPct: 0 },
    },
    sideA: {
      key: 'paypal',
      name: 'PayPal',
      pageKey: 'payment:paypal',
      feePct: 2.99,
      fixedFeeByCur: { EUR: 0.35, USD: 0.49, GBP: 0.3, CHF: 0.55, PLN: 1.35 },
      fxBonusPct: 3.0,
    },
    sideB: {
      key: 'stripe',
      name: 'Stripe',
      pageKey: 'payment:stripe',
      feePct: 1.5,
      fixedFeeByCur: { EUR: 0.25, USD: 0.3, GBP: 0.2, CHF: 0.3, PLN: 1.0 },
      fxBonusPct: 2.0,
    },
    seo: {
      en: {
        title: 'PayPal vs Stripe Fee Comparison Calculator | CalcLedger',
        description: 'Compare PayPal vs Stripe processing fees, fixed charges, international FX spreads, net payout, and annual fee savings for your exact volume.',
        h1: 'PayPal vs Stripe — Payment Fee Comparison',
        subtitle: 'Compare net payout per transaction, effective fee %, and total monthly & annual savings between PayPal and Stripe across 5 currencies.',
        summary: 'In Europe (EEA cards), Stripe typically charges ~1.5% + €0.25 compared to PayPal’s ~2.99% + €0.35, saving over 1.4% on every checkout — while international cards and currency conversion narrow or widen that gap.',
        faqs: [
          {
            q: 'Which is cheaper for European businesses: PayPal or Stripe?',
            a: 'For domestic European EEA cards, Stripe (1.5% + €0.25) is roughly half the cost of PayPal (2.99% + €0.35). For US domestic cards, Stripe is typically 2.9% + $0.30 vs PayPal’s 2.99%–3.49% + $0.49.',
          },
          {
            q: 'How much can switching from PayPal to Stripe save per year?',
            a: 'On 100 European transactions of €100/month (€120,000/yr), Stripe saves roughly €1,900+ per year in pure processing fees.',
          },
          {
            q: 'Should I remove PayPal completely to save fees?',
            a: 'Many stores keep both: make Stripe (cards, Apple Pay, Google Pay, BLIK/SEPA) the default option to minimize fees while keeping PayPal available for buyers who prefer wallet checkout.',
          },
        ],
      },
      de: {
        title: 'PayPal vs. Stripe — Gebühren-Vergleichsrechner | CalcLedger',
        description: 'Vergleichen Sie PayPal- und Stripe-Gebühren pro Transaktion, pro Monat und pro Jahr inklusive Fixgebühren und Währungsaufschlag (FX).',
        h1: 'PayPal vs. Stripe — Zahlungsgebühren im Vergleich',
        subtitle: 'Berechnen Sie live Netto-Auszahlung, effektive Gebührenquote sowie Ihre monatliche und jährliche Ersparnis zwischen PayPal und Stripe.',
        summary: 'Bei europäischen EWR-Karten liegt Stripe meist bei 1,5 % + 0,25 €, während PayPal häufig 2,99 % + 0,35 € berechnet — das spart über 1,4 Prozentpunkte pro Zahlung.',
        faqs: [
          {
            q: 'Was ist in Deutschland und der EU günstiger: PayPal oder Stripe?',
            a: 'Bei Standard-EWR-Karten ist Stripe mit 1,5 % + 0,25 € deutlich günstiger als PayPal mit 2,99 % + 0,35 €. Bei internationalen Karten oder FX-Wechselkursen lassen sich beide Sätze oben direkt anpassen.',
          },
          {
            q: 'Wie hoch ist die jährliche Ersparnis bei 100 Zahlungen im Monat?',
            a: 'Bei 100 Bestellungen à 100 € pro Monat spart Stripe im EWR-Raum rund 1.900 € pro Jahr gegenüber PayPal.',
          },
          {
            q: 'Sollte man PayPal im Checkout komplett streichen?',
            a: 'Im DACH-Raum erhöht PayPal oft die Conversion Rate — viele Shops setzen Stripe (Karten, Apple Pay, Klarna/SEPA) als Standard und bieten PayPal als Zweitoption an.',
          },
        ],
      },
      pl: {
        title: 'PayPal vs Stripe — Porównanie Prowizji Płatniczych | CalcLedger',
        description: 'Porównaj prowizje PayPal i Stripe (PLN, EUR, USD), opłaty stałe, przewalutowanie FX, kwotę na rękę oraz roczną oszczędność na prowizjach.',
        h1: 'PayPal vs Stripe — Porównanie Prowizji Płatniczych',
        subtitle: 'Sprawdź na żywo ile zostaje na rękę z każdej płatności oraz ile zaoszczędzisz miesięcznie i rocznie wybierając Stripe zamiast PayPal (lub odwrotnie).',
        summary: 'Dla kart europejskich (EOG) Stripe pobiera zazwyczaj 1,5% + 1 zł (lub €0,25), podczas gdy PayPal ok. 2,99% + 1,35 zł (lub €0,35) — różnica przy stałym wolumenie szybko sięga tysięcy złotych rocznie.',
        faqs: [
          {
            q: 'Co jest tańsze w Polsce i UE: Stripe czy PayPal?',
            a: 'Dla kart z Europy Stripe (1,5% + 1 zł) jest niemal o połowę tańszy od PayPal (2,99% + 1,35 zł), a dodatkowo obsługuje BLIK i Przelewy24.',
          },
          {
            q: 'Jak wygląda kwestia przewalutowania (FX) w PayPal i Stripe?',
            a: 'PayPal dolicza zazwyczaj 3%–4% spreadu walutowego, a Stripe ok. 2%. Możesz wpisać swój procent przewalutowania powyżej, aby zobaczyć pełny koszt.',
          },
          {
            q: 'Czy warto zostawić obie bramki w sklepie?',
            a: 'Tak — najlepiej ustawić Stripe (karty, Apple Pay, BLIK) jako domyślną metodę, a PayPal jako dodatkową opcję dla klientów zagranicznych przyzwyczajonych do portfela PayPal.',
          },
        ],
      },
    },
  },
];

export const COMPARISON_BY_KEY = Object.fromEntries(COMPARISONS.map((c) => [c.key, c]));
