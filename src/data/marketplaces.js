/**
 * Programmatic SEO dataset for 6 Marketplace Seller Fee & Profit Calculators:
 * Etsy, Amazon FBA, eBay, Shopify, Upwork, Allegro.
 */

export const MARKETPLACES = [
  {
    key: 'etsy',
    name: 'Etsy',
    defaultCurrency: 'USD',
    presets: {
      price: 42,
      buyerShipping: 6,
      cogs: 11,
      sellerShipping: 5.5,
      commissionPct: 6.5,
      paymentPct: 4.0,
      fixedFee: 0.50, // $0.20 listing + $0.30 payment fixed
      acosPct: 12,
      vatPct: 0,
      vatRegistered: false,
    },
    feeSummary: {
      en: '6.5% transaction fee + ~3–4% payment processing + $0.20 listing fee (+ optional 12–15% Offsite Ads).',
      de: '6,5 % Transaktionsgebühr + ca. 4 % Zahlungsabwicklung + 0,20 $ Einstellgebühr (+ optional 12–15 % Offsite Ads).',
      pl: '6,5% prowizji transakcyjnej + ok. 4% opłaty płatniczej + $0,20 opłaty za wystawienie (+ opcjonalnie 12–15% Offsite Ads).',
    },
    seo: {
      en: {
        title: 'Etsy Fee & Profit Calculator — Margin, Ads & Break-Even | CalcLedger',
        description: 'Calculate Etsy seller fees (6.5% transaction, payment processing, listing, Etsy Ads), net profit, margin, and break-even price in USD, EUR, GBP, or PLN.',
        h1: 'Etsy Fee & Profit Calculator',
        subtitle: 'Estimate your real Etsy net profit per order after transaction fees, Etsy Payments, listing costs, shipping, VAT, and ad spend.',
        intro: 'Etsy fees stack quickly across item price and buyer-paid shipping: a 6.5% transaction fee, Etsy Payments processing (typically 3%–4% + fixed fee depending on country), $0.20 listing fee, plus optional Etsy Ads or Offsite Ads (12%–15%). Model every fee line before setting your retail price.',
        tips: [
          'Etsy charges its 6.5% transaction fee and payment processing percentage on both the item price and the shipping charged to the buyer.',
          'If your shop exceeds $10,000 in annual revenue, Offsite Ads become mandatory at 12% on attributed orders — factor blended ad cost into your ACOS.',
          'Always verify your break-even ACOS so your Etsy Ads daily budget stays profitable.',
        ],
        faqs: [
          {
            q: 'Does Etsy charge transaction fees on shipping?',
            a: 'Yes. Etsy applies the 6.5% transaction fee and Etsy Payments processing percentage to the total order amount, including buyer-paid shipping and gift wrap.',
          },
          {
            q: 'How much is the Etsy listing fee?',
            a: 'Standard listings cost $0.20 USD per listing (or auto-renewal per quantity sold). Combine this with your fixed payment fee in the fixed fee input.',
          },
          {
            q: 'What is a healthy profit margin for Etsy sellers?',
            a: 'Many handmade and print-on-demand Etsy sellers target 25%–45% net profit margin after materials, shipping, fees, and ads to leave room for promotions and seasonal discounts.',
          },
        ],
      },
      de: {
        title: 'Etsy Gebührenrechner & Gewinn — Marge, Ads & Break-Even | CalcLedger',
        description: 'Etsy-Gebühren (6,5% Transaktion, Etsy Payments, Einstellgebühr, Ads), Reingewinn, Marge und Break-Even-Preis sofort in EUR oder USD berechnen.',
        h1: 'Etsy Gebühren- & Gewinnrechner',
        subtitle: 'Berechnen Sie Ihren echten Etsy-Nettogewinn pro Bestellung nach Transaktionsgebühr, Zahlungsabwicklung, Versand, MwSt und Werbekosten.',
        intro: 'Bei Etsy fallen pro Verkauf mehrere Gebühren parallel an: 6,5 % Transaktionsgebühr (auch auf Versandkosten), Etsy Payments (in Deutschland meist 4 % + 0,30 €), 0,20 $ Einstellgebühr sowie optionale Etsy Ads oder Offsite Ads (12–15 %).',
        tips: [
          'Etsy berechnet sowohl die 6,5 % Transaktionsgebühr als auch die Zahlungsgebühr auf Artikelpreis plus berechnete Versandkosten.',
          'In der EU erhebt Etsy zusätzlich Umsatzsteuer auf Verkäufergebühren, sofern keine gültige USt-IdNr. hinterlegt ist.',
          'Nutzen Sie den Break-Even-ACOS als Obergrenze für Ihre Etsy-Ads-Kampagnen.',
        ],
        faqs: [
          {
            q: 'Berechnet Etsy die 6,5 % Gebühr auch auf Versandkosten?',
            a: 'Ja. Sowohl die 6,5 % Transaktionsgebühr als auch die prozentuale Gebühr für Etsy Payments werden auf den gesamten Bestellwert inklusive Versand berechnet.',
          },
          {
            q: 'Wie hoch sind die Etsy-Payments-Gebühren in Deutschland?',
            a: 'Für Verkäufer mit Sitz in Deutschland betragen die Gebühren für Etsy Payments in der Regel 4 % plus 0,30 € pro Bestellung (zuzüglich 0,20 $ Einstellgebühr).',
          },
          {
            q: 'Was ist mein Break-Even-ACOS bei Etsy Ads?',
            a: 'Ihr Break-Even-ACOS entspricht Ihrer Gewinnmarge vor Werbekosten. Bleibt Ihr tatsächlicher ACOS darunter, erzielen Werbeverkäufe einen positiven Deckungsbeitrag.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator Prowizji Etsy — Zysk, Marża i Break-Even | CalcLedger',
        description: 'Oblicz prowizje Etsy (6,5% transakcyjna, Etsy Payments, opłata za wystawienie, Ads), zysk netto, marżę i cenę break-even w PLN, EUR lub USD.',
        h1: 'Kalkulator Prowizji i Zysku Etsy',
        subtitle: 'Policz realny zysk ze sprzedaży na Etsy po odjęciu prowizji 6,5%, opłat płatniczych, wysyłki, VAT oraz reklam Etsy Ads.',
        intro: 'Koszty sprzedaży na Etsy obejmują prowizję transakcyjną 6,5%, prowizję Etsy Payments (w Polsce ok. 4% + stała opłata), opłatę za wystawienie $0,20 oraz ewentualne reklamy Etsy Ads lub Offsite Ads (12–15%). Kalkulator pozwala szybko sprawdzić marżę przed ustaleniem ceny.',
        tips: [
          'Etsy nalicza 6,5% prowizji oraz opłatę płatniczą od sumy ceny produktu i kosztu wysyłki opłaconej przez kupującego.',
          'Jeśli sprzedajesz na Etsy z Polski jako firma B2B, podaj numer VAT-UE, aby uniknąć naliczania VAT do faktur prowizyjnych Etsy.',
          'Sprawdzaj wskaźnik Break-Even ACOS — pokazuje maksymalny udział reklam, przy którym nie dokładasz do zamówienia.',
        ],
        faqs: [
          {
            q: 'Czy Etsy pobiera prowizję także od kosztów wysyłki?',
            a: 'Tak. Zarówno prowizja transakcyjna 6,5%, jak i procentowa prowizja Etsy Payments liczone są od łącznej kwoty płaconej przez kupującego (produkt + wysyłka).',
          },
          {
            q: 'Ile wynoszą opłaty Etsy Payments dla sprzedawców z Polski?',
            a: 'Dla kont w Polsce stawka Etsy Payments wynosi zazwyczaj 4% plus stała opłata za zamówienie (ok. 1,25 PLN / €0,30), oprócz $0,20 opłaty za wystawienie.',
          },
          {
            q: 'Jak uwzględnić Offsite Ads (12% lub 15%) w kalkulatorze?',
            a: 'Wpisz uśredniony udział kosztów reklam w przychodzie (blended ACOS %) w polu kosztów reklamy, aby zobaczyć realny zysk na przestrzeni całego miesiąca.',
          },
        ],
      },
    },
  },
  {
    key: 'amazon-fba',
    name: 'Amazon FBA',
    defaultCurrency: 'EUR',
    presets: {
      price: 34.99,
      buyerShipping: 0,
      cogs: 7.5,
      sellerShipping: 4.8, // FBA fulfillment + inbound per unit
      commissionPct: 15.0,
      paymentPct: 0,
      fixedFee: 0.35, // monthly storage / closing allocation
      acosPct: 18,
      vatPct: 19,
      vatRegistered: true,
    },
    feeSummary: {
      en: '8–15% referral fee + FBA fulfillment & storage per unit + PPC ACOS + destination VAT.',
      de: '8–15 % Verkaufsprovision + FBA-Versand- & Lagergebühren pro Einheit + PPC-ACOS + Umsatzsteuer.',
      pl: '8–15% prowizji referral + opłata FBA za realizację i magazynowanie + reklamy PPC ACOS + VAT.',
    },
    seo: {
      en: {
        title: 'Amazon FBA Profit & Fee Calculator — ACOS, VAT & Margin | CalcLedger',
        description: 'Calculate Amazon FBA referral fees (15%), fulfillment costs, PPC ACOS, VAT, net profit, ROI, and break-even price in EUR, USD, GBP, or PLN.',
        h1: 'Amazon FBA Profit & Fee Calculator',
        subtitle: 'Model Amazon referral fees, FBA fulfillment per unit, PPC ACOS, and destination VAT to verify unit economics before launching a product.',
        intro: 'Profitable Amazon FBA selling depends on tight unit economics: Amazon referral fees (commonly 15% in most categories), FBA pick-pack-ship & storage costs, Amazon PPC advertising (ACOS/TACOS), landed product cost (COGS), and local VAT for EU/UK marketplaces.',
        tips: [
          'Enter your FBA fulfillment + inbound freight cost per unit in the Seller Shipping / Fulfillment field.',
          'For EU/UK sellers, toggle VAT-registered on and enter the destination rate (e.g., 19% DE, 20% UK) so VAT is deducted from the gross listing price before profit.',
          'Compare your target PPC ACOS directly against Break-Even ACOS to keep Sponsored Products profitable.',
        ],
        faqs: [
          {
            q: 'What is Amazon’s standard referral fee percentage?',
            a: 'Most Amazon categories charge a 15% referral fee on the total selling price, though electronics, computers, and certain high-ticket categories can range from 7% to 12%.',
          },
          {
            q: 'How is VAT calculated on Amazon EU FBA sales?',
            a: 'Amazon listing prices in the EU and UK are VAT-inclusive (gross). If you are VAT-registered, output VAT is extracted from the gross selling price (Gross − Gross ÷ (1 + VAT%)).',
          },
          {
            q: 'What is a good ROI and margin for Amazon FBA?',
            a: 'Private-label FBA sellers typically aim for at least 20%–30% net profit margin (before or after PPC) and 80%–100%+ ROI on landed COGS.',
          },
        ],
      },
      de: {
        title: 'Amazon FBA Rechner — Gebühren, ACOS, MwSt & Gewinn | CalcLedger',
        description: 'Amazon FBA Gebühren (15% Provision, Versand durch Amazon), PPC-ACOS, 19% MwSt, Reingewinn, ROI und Break-Even-Preis live berechnen.',
        h1: 'Amazon FBA Gewinn- & Gebührenrechner',
        subtitle: 'Kalkulieren Sie Verkaufsprovision, FBA-Fulfillment-Kosten, PPC-ACOS und Umsatzsteuer für fundierte Amazon-Produktkalkulationen.',
        intro: 'Im Amazon-FBA-Geschäft entscheiden wenige Prozentpunkte über Gewinn oder Verlust: 15 % Verkaufsprovision, FBA-Versand- und Lagergebühren, Amazon PPC (ACOS/TACOS), Einkaufskosten inklusive Import sowie 19 % deutsche Umsatzsteuer.',
        tips: [
          'Tragen Sie die FBA-Fulfillment-Gebühr pro Einheit inklusive anteiligem Wareneingang im Feld Versand-/Fulfillment-Kosten ein.',
          'Aktivieren Sie für Amazon.de die USt-Option mit 19 %, damit die Umsatzsteuer korrekt aus dem Brutto-Verkaufspreis herausgerechnet wird.',
          'Vergleichen Sie Ihren laufenden PPC-ACOS direkt mit dem angezeigten Break-Even-ACOS.',
        ],
        faqs: [
          {
            q: 'Wie hoch ist die Amazon-Verkaufsprovision in Deutschland?',
            a: 'In den meisten Kategorien auf Amazon.de beträgt die Verkaufsprovision 15 % vom Bruttoverkaufspreis (in Kategorien wie Elektronik oder Computer teilweise 7–12 %).',
          },
          {
            q: 'Wird die Amazon-Provision auf den Netto- oder Bruttopreis berechnet?',
            a: 'Amazon berechnet die Verkaufsprovision grundsätzlich auf den Brutto-Verkaufspreis inklusive Umsatzsteuer.',
          },
          {
            q: 'Welche Marge und welcher ROI gelten bei Amazon FBA als gesund?',
            a: 'Viele FBA-Händler streben nach Abzug von Einkauf, FBA-Gebühren, MwSt und Werbung mindestens 15–25 % Nettomarge sowie einen ROI über 80 % an.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator Amazon FBA — Prowizje, ACOS, VAT i Zysk | CalcLedger',
        description: 'Oblicz prowizje Amazon FBA (15%), koszty fulfillment, reklamy PPC ACOS, VAT, zysk netto, ROI i cenę break-even w EUR, USD, GBP lub PLN.',
        h1: 'Kalkulator Zysku i Prowizji Amazon FBA',
        subtitle: 'Sprawdź rentowność produktu na Amazon FBA po uwzględnieniu prowizji referral, kosztów fulfillment, reklam PPC ACOS i podatku VAT.',
        intro: 'Rentowność sprzedaży na Amazon FBA zależy od dokładnej kalkulacji jednostkowej: prowizji Amazon (zwykle 15%), opłaty za realizację i magazynowanie FBA, reklam Sponsored Products (ACOS), kosztu zakupu z importem oraz VAT na rynku docelowym.',
        tips: [
          'Koszt obsługi FBA (pick & pack + transport do magazynu) wpisz w polu kosztu wysyłki / fulfillment po stronie sprzedawcy.',
          'Przy sprzedaży na Amazon.de lub Amazon.pl włącz opcję podatnika VAT i wybierz stawkę kraju docelowego (np. 19% lub 23%).',
          'Pilnuj, aby Twój PPC ACOS mieścił się poniżej wyliczonego progu Break-Even ACOS.',
        ],
        faqs: [
          {
            q: 'Ile wynosi standardowa prowizja sprzedażowa Amazon?',
            a: 'W większości kategorii na Amazon prowizja referral wynosi 15% od ceny brutto (dla elektroniki czy komputerów stawki bywają niższe: 7–12%).',
          },
          {
            q: 'Od jakiej kwoty Amazon nalicza prowizję — netto czy brutto?',
            a: 'Amazon nalicza prowizję procentową od pełnej ceny sprzedaży brutto (wraz z podatkiem VAT).',
          },
          {
            q: 'Jaka marża netto jest uznawana za bezpieczną w modelu Amazon FBA?',
            a: 'Sprzedawcy FBA zazwyczaj celują w co najmniej 18–25% marży netto po kosztach reklam oraz ROI powyżej 80–100%.',
          },
        ],
      },
    },
  },
  {
    key: 'ebay',
    name: 'eBay',
    defaultCurrency: 'EUR',
    presets: {
      price: 55,
      buyerShipping: 5,
      cogs: 22,
      sellerShipping: 5.5,
      commissionPct: 12.8,
      paymentPct: 0,
      fixedFee: 0.35,
      acosPct: 5,
      vatPct: 0,
      vatRegistered: false,
    },
    feeSummary: {
      en: '~12.8–13.25% final value fee (incl. payment processing) + $0.30–€0.35 per order + optional Promoted Listings.',
      de: 'ca. 11–13 % Verkaufsprovision (inkl. Zahlungsabwicklung) + 0,35 € pro Bestellung + optional Anzeigen (Promoted Listings).',
      pl: 'ok. 11–13,25% prowizji od sprzedaży (z płatnościami) + €0,35 za zamówienie + opcjonalne Promoted Listings.',
    },
    seo: {
      en: {
        title: 'eBay Fee & Profit Calculator — Final Value Fee & Margin | CalcLedger',
        description: 'Calculate eBay final value fees (~13% + $0.30/€0.35), Promoted Listings ad fees, shipping, VAT, net profit, and break-even price instantly.',
        h1: 'eBay Fee & Profit Calculator',
        subtitle: 'Compute exact eBay Managed Payments final value fees, per-order fixed fees, Promoted Listings ad spend, and net seller profit.',
        intro: 'Under eBay Managed Payments, sellers pay a single category-based final value fee (commonly around 12.8%–13.25% on most items) plus a fixed per-order fee ($0.30–$0.40 or €0.35), calculated on the total sale amount including shipping and applicable sales tax.',
        tips: [
          'eBay calculates its final value fee on the item price plus buyer-paid shipping.',
          'Adjust the Ad Spend (ACOS %) input to model eBay Promoted Listings Standard ad rates (typically 2%–10%).',
          'Store subscribers pay lower category final value fees — customize the percentage field to match your category.',
        ],
        faqs: [
          {
            q: 'Does eBay charge final value fees on shipping?',
            a: 'Yes. eBay calculates final value fees on the total amount of the sale, including the item price and any shipping charged to the buyer.',
          },
          {
            q: 'Is PayPal still a separate fee on eBay?',
            a: 'No. eBay Managed Payments bundles payment processing into the main final value fee plus the fixed per-order fee.',
          },
          {
            q: 'How do eBay Promoted Listings affect profit?',
            a: 'Promoted Listings Standard charge an extra percentage (chosen by you) on the total sale whenever a buyer clicks your ad and purchases within 30 days.',
          },
        ],
      },
      de: {
        title: 'eBay Gebührenrechner & Gewinn — Provision & Marge | CalcLedger',
        description: 'eBay Verkaufsprovision (ca. 11–13% + 0,35 €), Anzeigengebühren, Versand, MwSt, Nettogewinn und Break-Even-Preis für Händler berechnen.',
        h1: 'eBay Gebühren- & Gewinnrechner',
        subtitle: 'Ermitteln Sie eBay-Verkaufsprovision, fixe Bestellgebühr, Anzeigenkosten und Ihren echten Nettogewinn pro Verkauf.',
        intro: 'Für gewerbliche eBay-Händler in Deutschland setzt sich die Gebühr aus einer kategorieabhängigen Verkaufsprovision (häufig 11–13 %), einer fixen Gebühr von 0,35 € pro Bestellung sowie optionalen eBay-Anzeigen (Promoted Listings) zusammen.',
        tips: [
          'eBay berechnet die prozentuale Verkaufsprovision auf Artikelpreis zuzüglich berechneter Versandkosten.',
          'Mit einem eBay-Shop gelten in vielen Kategorien reduzierte Provisionssätze — passen Sie den Prozentsatz einfach an.',
          'Berücksichtigen Sie mögliche Rücksendekosten als Puffer in Ihrer Zielmarge.',
        ],
        faqs: [
          {
            q: 'Fallen bei eBay noch separate PayPal-Gebühren an?',
            a: 'Nein. Durch die eBay-Zahlungsabwicklung sind die Zahlungsgebühren bereits in der regulären Verkaufsprovision plus 0,35 € Fixgebühr enthalten.',
          },
          {
            q: 'Erhebt eBay Gebühren auf die Versandkosten?',
            a: 'Ja. Die prozentuale Verkaufsprovision wird auf den Gesamtbetrag inklusive der vom Käufer bezahlten Versandkosten berechnet.',
          },
          {
            q: 'Wie kalkuliere ich eBay-Anzeigen (Promoted Listings) ein?',
            a: 'Tragen Sie Ihren gewählten Anzeigensatz (z. B. 4 % oder 6 %) direkt in das Feld Werbekosten (ACOS %) ein.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator Prowizji eBay — Zysk, Marża i Break-Even | CalcLedger',
        description: 'Oblicz prowizje eBay (ok. 12,8% + €0,35), opłaty za Promoted Listings, wysyłkę, VAT, zysk netto i cenę break-even w EUR, USD lub PLN.',
        h1: 'Kalkulator Prowizji i Zysku eBay',
        subtitle: 'Sprawdź dokładny koszt sprzedaży na eBay (prowizja od sprzedaży, opłata stała, reklamy Promoted Listings) oraz marżę netto.',
        intro: 'W systemie eBay Managed Payments prowizja za płatności jest wliczona w główną prowizję od sprzedaży (zwykle ok. 11–13,25% w zależności od kategorii) plus stałą opłatę za zamówienie (€0,35 / $0,30) oraz opcjonalne koszty promocji ofert.',
        tips: [
          'eBay nalicza prowizję procentową od sumy ceny przedmiotu i wysyłki opłaconej przez kupującego.',
          'Jeśli korzystasz z Promoted Listings, wpisz swoją stawkę procentową w polu kosztów reklam (ACOS %).',
          'Przy sprzedaży zagranicznej pamiętaj o ewentualnej opłacie za przewalutowanie — możesz doliczyć ją w polu prowizji płatniczej.',
        ],
        faqs: [
          {
            q: 'Czy na eBay nadal płaci się osobną prowizję PayPal?',
            a: 'Nie. Opłata za obsługę płatności jest wliczona w główną prowizję eBay oraz stałą opłatę od zamówienia.',
          },
          {
            q: 'Czy eBay pobiera prowizję od kosztu wysyłki?',
            a: 'Tak, prowizja procentowa naliczana jest od łącznej kwoty zapłaconej przez kupującego za towar i wysyłkę.',
          },
          {
            q: 'Jak uwzględnić przewalutowanie na eBay w kalkulatorze?',
            a: 'Dodaj stawkę przewalutowania (np. 2–3%) w polu prowizji płatniczej, aby zobaczyć rzeczywisty zysk na czysto.',
          },
        ],
      },
    },
  },
  {
    key: 'shopify',
    name: 'Shopify',
    defaultCurrency: 'USD',
    presets: {
      price: 68,
      buyerShipping: 5,
      cogs: 19,
      sellerShipping: 6,
      commissionPct: 0, // 0% with Shopify Payments (0.5%-2% if third-party gateway)
      paymentPct: 2.9,
      fixedFee: 0.30,
      acosPct: 22, // Meta / Google Ads CAC / AOV
      vatPct: 0,
      vatRegistered: false,
    },
    feeSummary: {
      en: '2.4–2.9% + $0.30 Shopify Payments (0% platform fee with Shopify Payments; 0.5–2% with external gateways) + Paid Ads.',
      de: 'ca. 2,1–2,9 % + 0,25–0,30 € Shopify Payments (0 % Transaktionsgebühr) + Meta/Google Ads.',
      pl: 'ok. 2,1–2,9% + stała opłata bramki płatniczej (0,5–2% prowizji przy zewnętrznej bramce) + reklamy Meta/Google.',
    },
    seo: {
      en: {
        title: 'Shopify Profit & Fee Calculator — Payments, Ads & Margin | CalcLedger',
        description: 'Calculate Shopify Payments fees (2.9% + $0.30), external gateway fees, Meta/Google ad spend (ROAS/ACOS), VAT, net profit, and break-even price.',
        h1: 'Shopify Profit & Fee Calculator',
        subtitle: 'Calculate true D2C order profitability on Shopify after payment processing, shipping, COGS, VAT, and paid acquisition spend.',
        intro: 'Unlike marketplaces, Shopify does not charge a 15% referral fee — instead, your biggest levers are Shopify Payments processing (typically 2.4%–2.9% + $0.30 depending on plan), third-party gateway fees (0.5%–2% if not using Shopify Payments), shipping, and paid traffic (Meta/Google/TikTok Ads).',
        tips: [
          'Using Shopify Payments sets Shopify’s extra transaction fee to 0%; if you use Stripe/PayPal/Przelewy24 externally, add 0.5%–2% in the Platform Fee field.',
          'Convert your target ROAS to ACOS easily: ROAS 4.0 = 25% ACOS; ROAS 5.0 = 20% ACOS.',
          'Focus on your Break-Even ACOS to calculate your minimum profitable ROAS (Break-Even ROAS = 100 ÷ Break-Even ACOS).',
        ],
        faqs: [
          {
            q: 'What are Shopify’s transaction and card processing fees?',
            a: 'On Basic Shopify with Shopify Payments (US), online card fees are typically 2.9% + $0.30 with 0% additional Shopify transaction fee. External payment providers incur an extra 2% fee on Basic (1% on Shopify, 0.6% on Advanced).',
          },
          {
            q: 'How do I convert ROAS to ACOS for my Shopify store?',
            a: 'Divide 100 by your ROAS. For example, a 4x ROAS equals 25% ACOS (100 ÷ 4 = 25%), meaning 25% of order revenue goes to paid ads.',
          },
          {
            q: 'Should I include monthly Shopify subscription costs in per-order profit?',
            a: 'You can amortize monthly plan & app costs by dividing monthly fixed SaaS spend by your monthly order count and adding that small amount to the Fixed Fee field.',
          },
        ],
      },
      de: {
        title: 'Shopify Gebühren- & Gewinnrechner — Marge & Ads | CalcLedger',
        description: 'Shopify Payments Gebühren, externe Zahlungsanbieter, Meta/Google Ads (ACOS), MwSt, Deckungsbeitrag und Break-Even-Preis sofort berechnen.',
        h1: 'Shopify Gewinn- & Gebührenrechner',
        subtitle: 'Ermitteln Sie die echte Bestellprofitabilität (Unit Economics) Ihres Shopify-Shops inklusive Zahlungsgebühren, Versand, MwSt und Ads.',
        intro: 'Bei einem eigenen Shopify-Shop entfallen hohe Marktplatz-Provisionen, doch Zahlungsgebühren (Shopify Payments ca. 2,1–2,9 % + 0,25–0,30 €), Versand, Retouren und vor allem bezahlte Werbung (Meta/Google Ads) bestimmen Ihre wahre Nettomarge.',
        tips: [
          'Mit Shopify Payments entfällt die zusätzliche Shopify-Transaktionsgebühr (0 %). Bei externen Gateways fallen je nach Tarif 0,6–2 % extra an.',
          'Rechnen Sie Ihren Ziel-ROAS direkt in ACOS um: ROAS 4 = 25 % ACOS, ROAS 5 = 20 % ACOS.',
          'Aus dem Break-Even-ACOS ergibt sich Ihr Mindest-ROAS (100 ÷ Break-Even-ACOS).',
        ],
        faqs: [
          {
            q: 'Wie hoch sind die Shopify-Payments-Gebühren in Deutschland?',
            a: 'Je nach Tarif und Zahlungsmethode liegen Online-Kartenzahlungen über Shopify Payments in der Regel zwischen ca. 1,5 % und 2,9 % plus 0,25–0,30 € pro Transaktion.',
          },
          {
            q: 'Wie rechne ich ROAS in ACOS um?',
            a: 'Teilen Sie 100 durch Ihren ROAS. Ein ROAS von 4 entspricht einem ACOS von 25 % (25 % des Umsatzes fließen in Werbung).',
          },
          {
            q: 'Wie berücksichtige ich monatliche Shopify-App-Kosten?',
            a: 'Teilen Sie Ihre monatlichen Shop- und App-Fixkosten durch Ihre monatliche Bestellanzahl und addieren Sie den Wert zur fixen Gebühr pro Bestellung.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator Zysku i Kosztów Shopify — Marża i Ads | CalcLedger',
        description: 'Oblicz koszty bramki płatniczej na Shopify, prowizję zewnętrznych operatorów, reklamy Meta/Google (ACOS/ROAS), VAT, zysk netto i break-even.',
        h1: 'Kalkulator Zysku i Opłat Shopify',
        subtitle: 'Policz rentowność zamówienia w sklepie Shopify po kosztach towaru, wysyłki, bramki płatniczej, VAT i reklam (Meta / Google Ads).',
        intro: 'Własny sklep na Shopify pozwala uniknąć wysokich prowizji marketplace, ale kluczowe dla zysku są koszty bramki płatniczej (ok. 1,5–2,9% + opłata stała), ewentualna prowizja Shopify dla zewnętrznych operatorów (0,6–2% w Polsce) oraz koszt pozyskania klienta z reklam.',
        tips: [
          'Jeśli korzystasz w Polsce z zewnętrznej bramki (np. Przelewy24, PayU, Autopay), wpisz dodatkową prowizję planu Shopify (0,6–2%) w polu prowizji platformy.',
          'Łatwo przeliczysz ROAS na ACOS: ROAS 4,0 = 25% ACOS; ROAS 5,0 = 20% ACOS.',
          'Sprawdź Break-Even ACOS — 100 podzielone przez tę wartość daje Twój minimalny rentowny ROAS.',
        ],
        faqs: [
          {
            q: 'Ile wynosi dodatkowa prowizja Shopify przy zewnętrznej bramce w Polsce?',
            a: 'Na planie Basic wynosi zazwyczaj 2%, na planie Shopify 1%, a na Advanced 0,6% — oprócz prowizji samej bramki płatniczej.',
          },
          {
            q: 'Jak przeliczyć ROAS z Meta Ads na pole ACOS %?',
            a: 'Podziel 100 przez ROAS. Przykładowo ROAS = 4 oznacza ACOS = 25% (czyli 25% przychodu z zamówienia idzie na reklamę).',
          },
          {
            q: 'Czy warto wliczać koszt abonamentu i aplikacji Shopify w kalkulację?',
            a: 'Tak — podziel miesięczny koszt planu i aplikacji przez liczbę zamówień w miesiącu i dodaj tę kwotę w polu opłaty stałej.',
          },
        ],
      },
    },
  },
  {
    key: 'upwork',
    name: 'Upwork',
    defaultCurrency: 'USD',
    presets: {
      price: 1000,
      buyerShipping: 0,
      cogs: 0,
      sellerShipping: 0,
      commissionPct: 10.0,
      paymentPct: 1.5, // withdrawal / FX spread estimate
      fixedFee: 15, // Connects / bank wire allocation
      acosPct: 0,
      vatPct: 0,
      vatRegistered: false,
    },
    feeSummary: {
      en: '10% freelancer service fee + Connects cost + withdrawal / FX conversion fees.',
      de: '10 % Freelancer-Servicegebühr + Connects-Kosten + Auszahlungs-/Währungsgebühren.',
      pl: '10% prowizji serwisowej Upwork + koszt Connects + prowizja wypłaty / przewalutowania.',
    },
    seo: {
      en: {
        title: 'Upwork Fee & Net Earnings Calculator (10% Service Fee) | CalcLedger',
        description: 'Calculate Upwork 10% freelancer service fee, Connects cost, FX withdrawal spread, taxes/VAT, and net take-home pay in USD, EUR, GBP, or PLN.',
        h1: 'Upwork Fee & Freelancer Earnings Calculator',
        subtitle: 'See exactly how much you keep from an Upwork fixed-price or hourly contract after the 10% service fee, Connects, and withdrawal costs.',
        intro: 'Upwork charges freelancers a flat 10% service fee on most contracts (with variable rates on select enterprise or promoted agreements), plus the cost of Connects to bid on projects and any bank withdrawal or currency conversion fees when moving USD to EUR, GBP, or PLN.',
        tips: [
          'Use the Selling Price field for your contract or milestone value, and set COGS to 0 (or subcontractor/software costs for that project).',
          'Estimate FX spread (e.g., 1%–2% if withdrawing to a non-USD local bank) in the Payment Fee % field.',
          'Check the Break-Even Price to know what gross quote to send a client to clear your desired net take-home.',
        ],
        faqs: [
          {
            q: 'What is Upwork’s freelancer service fee?',
            a: 'Upwork’s standard freelancer service fee is a flat 10% across most hourly and fixed-price contracts, replacing the older 20%/10%/5% sliding tiers.',
          },
          {
            q: 'How much should I quote on Upwork to take home $1,000 net?',
            a: 'To net $1,000 after a 10% fee alone, divide by 0.90 — meaning you should quote at least $1,111.11 (plus any Connects or FX withdrawal costs).',
          },
          {
            q: 'Does Upwork charge VAT on its 10% service fee for EU freelancers?',
            a: 'If you do not provide a valid EU VAT ID in Upwork tax settings, Upwork charges local VAT on its service fee. Providing a valid EU VAT ID triggers reverse charge (0% VAT on the fee).',
          },
        ],
      },
      de: {
        title: 'Upwork Gebührenrechner (10% Servicegebühr) — Netto | CalcLedger',
        description: 'Upwork 10% Freelancer-Gebühr, Connects, Wechselkurskosten und Netto-Auszahlung für Verträge in USD oder EUR berechnen.',
        h1: 'Upwork Gebühren- & Honorarrechner',
        subtitle: 'Berechnen Sie Ihren Netto-Auszahlungsbetrag aus Upwork-Projekten nach 10 % Servicegebühr, Connects und Auszahlungsgebühren.',
        intro: 'Upwork erhebt für Freelancer in der Regel eine Servicegebühr von 10 % auf den Vertragswert. Hinzu kommen Kosten für Connects sowie eventuelle Auszahlungs- oder Währungsumrechnungsgebühren beim Transfer von USD nach EUR.',
        tips: [
          'Tragen Sie den Projektwert bzw. Meilenstein als Verkaufspreis ein und lassen Sie Einkaufskosten auf 0 (oder tragen Sie Projekt-Tools/Subunternehmer ein).',
          'Schätzen Sie Wechselkurskosten (z. B. 0,5–2 % bei Auszahlung auf ein EUR-Konto) im Feld Zahlungsgebühr %.',
          'Hinterlegen Sie Ihre deutsche USt-IdNr. in Upwork, damit auf die 10-%-Gebühr das Reverse-Charge-Verfahren gilt.',
        ],
        faqs: [
          {
            q: 'Wie hoch ist die Upwork-Gebühr für Freelancer?',
            a: 'Die reguläre Upwork-Servicegebühr für Freelancer beträgt pauschal 10 % auf die meisten Stunden- und Festpreisverträge.',
          },
          {
            q: 'Welchen Betrag muss ich anbieten, um netto 1.000 $ zu erhalten?',
            a: 'Bei 10 % Gebühr teilen Sie Ihren Zielbetrag durch 0,90 — für 1.000 $ netto müssen Sie mindestens 1.111,11 $ anbieten (zuzüglich Auszahlungskosten).',
          },
          {
            q: 'Berechnet Upwork Mehrwertsteuer auf die Servicegebühr?',
            a: 'Ohne hinterlegte USt-IdNr. erhebt Upwork die lokale Umsatzsteuer auf die eigene Servicegebühr. Mit gültiger USt-IdNr. greift das Reverse-Charge-Verfahren.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator Prowizji Upwork (10%) — Ile Zostaje Na Rękę | CalcLedger',
        description: 'Oblicz prowizję Upwork (10%), koszty Connects, przewalutowania USD→PLN/EUR oraz czysty zysk freelancera z kontraktu.',
        h1: 'Kalkulator Prowizji i Zarobków Upwork',
        subtitle: 'Sprawdź, ile realnie otrzymasz z projektu na Upwork po odjęciu 10% prowizji serwisowej, kosztu Connects i opłat za wypłatę.',
        intro: 'Upwork pobiera od freelancerów standardową prowizję 10% od wartości kontraktu. Do realnych kosztów dochodzą wydatki na Connects oraz ewentualna opłata za przelew i przewalutowanie USD na PLN lub EUR.',
        tips: [
          'W polu ceny wpisz wartość kontraktu lub kamienia milowego, a koszt towaru ustaw na 0 (lub wpisz koszty podwykonawców/narzędzi).',
          'W polu prowizji płatniczej możesz wpisać szacowany spread walutowy (np. 0,5–2% przy wypłacie na konto w PLN).',
          'Podaj w ustawieniach Upwork swój polski numer VAT-UE, aby Upwork nie doliczał 23% VAT do swojej prowizji.',
        ],
        faqs: [
          {
            q: 'Ile wynosi prowizja Upwork dla freelancera?',
            a: 'Standardowa prowizja serwisowa Upwork wynosi 10% wartości kontraktu (zarówno godzinowego, jak i fixed-price).',
          },
          {
            q: 'Ile muszę wycenić projekt na Upwork, aby dostać $1000 na czysto?',
            a: 'Podziel docelową kwotę przez 0,90 — przy samej prowizji 10% musisz wycenić zlecenie na minimum $1111,11 (plus ewentualny koszt Connects i wypłaty).',
          },
          {
            q: 'Czy Upwork dolicza VAT do swojej prowizji dla freelancerów z Polski?',
            a: 'Jeśli nie uzupełnisz numeru VAT-UE w profilu podatkowym, Upwork doliczy polski VAT 23% do swojej 10% prowizji. Po podaniu VAT-UE stosowany jest mechanizm Reverse Charge.',
          },
        ],
      },
    },
  },
  {
    key: 'allegro',
    name: 'Allegro',
    defaultCurrency: 'PLN',
    presets: {
      price: 129,
      buyerShipping: 0,
      cogs: 48,
      sellerShipping: 10.99, // Allegro Smart! co-financing estimate
      commissionPct: 10.0,
      paymentPct: 0,
      fixedFee: 1.0, // transaction/listing fixed fee
      acosPct: 8, // Allegro Ads
      vatPct: 23,
      vatRegistered: true,
    },
    feeSummary: {
      en: '6–15% category commission + Allegro Smart! delivery co-pay + 1 PLN transaction fee + Allegro Ads + 23% VAT.',
      de: '6–15 % Kategorieprovision + Allegro Smart! Versandanteil + 1 PLN Fixgebühr + Allegro Ads + 23 % VAT.',
      pl: '6–15% prowizji kategorii + dopłata do Allegro Smart! + 1 zł opłaty transakcyjnej + Allegro Ads + 23% VAT.',
    },
    seo: {
      en: {
        title: 'Allegro Seller Fee & Profit Calculator — Smart, Ads & VAT | CalcLedger',
        description: 'Calculate Allegro marketplace commission, Allegro Smart! shipping co-pay, Allegro Ads ACOS, 23% Polish VAT, net profit, and break-even price in PLN or EUR.',
        h1: 'Allegro Seller Fee & Profit Calculator',
        subtitle: 'Model Allegro category commission, Smart! delivery fees, Allegro Ads spend, and 23% VAT to price products profitably in Poland and CEE.',
        intro: 'Allegro is Central Europe’s largest marketplace. Sellers need to account for category commissions (commonly 8%–15% including featured-offer surcharge if used), Allegro Smart! seller shipping contributions, fixed transaction fees, Allegro Ads (ACOS), and 23% Polish VAT.',
        tips: [
          'Enter your average Allegro Smart! seller co-pay (e.g., 4–12 PLN depending on parcel value) in the Seller Shipping field.',
          'If you use Wyróżnienie (Featured Offers), remember Allegro adds extra commission on promoted sales — include it in the commission % field.',
          'Keep VAT set to 23% (or 8%/5% depending on category) when operating as a Polish VAT payer.',
        ],
        faqs: [
          {
            q: 'How much commission does Allegro charge sellers?',
            a: 'Allegro category commissions typically range from 6% to 15% of gross order value, depending on product category, plus an optional surcharge on Featured (Wyróżnione) offers.',
          },
          {
            q: 'How do I include Allegro Smart! shipping fees in the calculator?',
            a: 'Enter your seller contribution to Allegro Smart! delivery (which varies by order value bracket and carrier) in the Seller Shipping Cost field.',
          },
          {
            q: 'Are Allegro fees charged on gross or net prices?',
            a: 'Allegro calculates percentage commissions on the gross selling price (including VAT).',
          },
        ],
      },
      de: {
        title: 'Allegro Gebührenrechner & Gewinn — Smart, Ads & VAT | CalcLedger',
        description: 'Allegro-Provisionen, Allegro Smart! Versandanteil, Allegro Ads (ACOS), 23% polnische VAT, Nettogewinn und Break-Even-Preis in PLN oder EUR berechnen.',
        h1: 'Allegro Gebühren- & Gewinnrechner',
        subtitle: 'Berechnen Sie Kategorieprovision, Smart!-Versandanteil, Allegro Ads und Umsatzsteuer für profitables Verkaufen auf Allegro.',
        intro: 'Allegro ist der größte Online-Marktplatz in Polen und Mitteleuropa. Für eine realistische Kalkulation müssen Händler Kategorieprovision (oft 8–15 %), Allegro Smart!-Versandbeteiligung, Transaktionsgebühr, Allegro Ads und 23 % polnische VAT einbeziehen.',
        tips: [
          'Tragen Sie Ihren durchschnittlichen Händleranteil für Allegro Smart!-Sendungen im Feld Versandkosten (Verkäufer) ein.',
          'Bei hervorgehobenen Angeboten (Wyróżnienie) erhebt Allegro eine zusätzliche Erfolgsprovision — addieren Sie diese zur Kategorieprovision.',
          'Prüfen Sie den Break-Even-ACOS für Ihre Allegro-Ads-Kampagnen.',
        ],
        faqs: [
          {
            q: 'Wie hoch ist die Verkaufsprovision bei Allegro?',
            a: 'Je nach Kategorie liegt die Provision bei Allegro meist zwischen 6 % und 15 % des Bruttoverkaufspreises.',
          },
          {
            q: 'Wie berücksichtige ich Allegro Smart! im Rechner?',
            a: 'Tragen Sie den vom Händler getragenen Versandanteil je nach Bestellwertklasse im Feld Versandkosten (Verkäufer) ein.',
          },
          {
            q: 'Berechnet Allegro die Provision auf Brutto- oder Nettopreise?',
            a: 'Allegro berechnet die prozentuale Verkaufsprovision auf den Brutto-Verkaufspreis inklusive Mehrwertsteuer.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator Prowizji Allegro — Smart, Ads, VAT i Zysk | CalcLedger',
        description: 'Oblicz prowizję Allegro, koszt wysyłki Allegro Smart!, reklamy Allegro Ads (ACOS), podatek VAT 23%, marżę netto, ROI i cenę break-even w PLN.',
        h1: 'Kalkulator Prowizji i Zysku Allegro',
        subtitle: 'Policz realny zysk ze sprzedaży na Allegro po odjęciu prowizji kategorii, dopłat Allegro Smart!, reklam Allegro Ads i podatku VAT.',
        intro: 'Sprzedaż na Allegro wymaga precyzyjnej kalkulacji wszystkich opłat: prowizji od sprzedaży (zwykle 6–15% w zależności od kategorii), ewentualnej dodatkowej prowizji od oferty wyróżnionej, dopłaty sprzedawcy do przesyłki Allegro Smart!, opłaty transakcyjnej (1 zł), kosztów Allegro Ads oraz podatku VAT.',
        tips: [
          'W polu kosztu wysyłki po stronie sprzedawcy wpisz swoją stawkę dopłaty za paczkę Allegro Smart! (zależną od przedziału cenowego zamówienia).',
          'Jeśli korzystasz z Wyróżnienia oferty, dolicz dodatkową prowizję od sprzedaży w polu prowizji platformy.',
          'Porównuj koszt kampanii Allegro Ads (ACOS %) z wyliczonym progiem Break-Even ACOS, aby nie tracić na reklamach.',
        ],
        faqs: [
          {
            q: 'Ile wynosi prowizja od sprzedaży na Allegro?',
            a: 'W zależności od kategorii prowizja na Allegro wynosi najczęściej od 6% do 15% ceny brutto (plus ewentualna dodatkowa prowizja przy ofertach wyróżnionych oraz 1 zł opłaty transakcyjnej).',
          },
          {
            q: 'Od jakiej kwoty Allegro liczy prowizję — netto czy brutto?',
            a: 'Allegro nalicza prowizję procentową od ceny brutto (z podatkiem VAT).',
          },
          {
            q: 'Jak uwzględnić koszt wysyłki Allegro Smart! w kalkulatorze?',
            a: 'Wpisz kwotę współfinansowania przesyłki Allegro Smart! w polu kosztu wysyłki sprzedawcy (a wysyłkę opłacaną przez kupującego zostaw na 0 zł dla zamówień ze Smartem).',
          },
        ],
      },
    },
  },
];

export function getMarketplace(key) {
  return MARKETPLACES.find((m) => m.key === key);
}
