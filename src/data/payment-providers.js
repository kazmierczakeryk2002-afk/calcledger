/**
 * Programmatic SEO dataset for PayPal & Stripe Payment Fee Calculators.
 */

export const PAYMENT_PROVIDERS = [
  {
    key: 'paypal',
    name: 'PayPal',
    defaultCurrencyByLang: { en: 'USD', de: 'EUR', pl: 'PLN' },
    defaultPresetByLang: { en: 'paypal-us', de: 'paypal-eu', pl: 'paypal-eu' },
    presets: [
      { id: 'paypal-eu', pct: 2.99, fixed: 0.35, fxPct: 0, labels: { en: 'PayPal EU/DE Commercial (2.99% + €0.35)', de: 'PayPal DE/EU Geschäftlich (2,99 % + 0,35 €)', pl: 'PayPal UE / Polska standard (2,99% + 0,35 €)' } },
      { id: 'paypal-us', pct: 3.49, fixed: 0.49, fxPct: 0, labels: { en: 'PayPal US Checkout / Invoice (3.49% + $0.49)', de: 'PayPal US Checkout / Rechnung (3,49 % + 0,49 $)', pl: 'PayPal US Checkout / Faktura (3,49% + $0,49)' } },
      { id: 'paypal-goods', pct: 2.99, fixed: 0.49, fxPct: 0, labels: { en: 'PayPal Standard Goods & Services (2.99% + $0.49)', de: 'PayPal Waren & Dienstleistungen (2,99 % + 0,49 $)', pl: 'PayPal Towary i usługi (2,99% + $0,49)' } },
      { id: 'paypal-intl', pct: 4.99, fixed: 0.35, fxPct: 3.0, labels: { en: 'PayPal International + FX Spread (4.99% + 0.35 + 3% FX)', de: 'PayPal International + Währung (4,99 % + 0,35 + 3 % FX)', pl: 'PayPal Zagraniczny + przewalutowanie (4,99% + 0,35 + 3%)' } },
    ],
    feeSummary: {
      en: '2.99%–3.49% + fixed fee domestic, up to 4.99% + 3%–4% FX spread on cross-border payments.',
      de: '2,99 %–3,49 % + Fixgebühr im Inland, bis zu 4,99 % + 3–4 % Wechselkursaufschlag international.',
      pl: '2,99%–3,49% + opłata stała krajowo, do 4,99% + 3–4% spreadu walutowego w płatnościach zagranicznych.',
    },
    seo: {
      en: {
        title: 'PayPal Fee Calculator — Reverse & Net Payout | CalcLedger',
        description: 'Calculate exact PayPal commercial, invoice, and international FX fees. Instantly find net payout or reverse-calculate how much to request.',
        h1: 'PayPal Fee Calculator (Net & Reverse)',
        subtitle: 'Calculate exact PayPal seller and freelancer fees — or reverse-calculate the gross invoice amount needed to receive your exact net target.',
        intro: 'PayPal charges a percentage fee plus a currency-specific fixed fee on commercial payments, plus an extra cross-border surcharge (typically 1.29%–1.99%) and currency conversion spread (3%–4%) when receiving funds from abroad.',
        tips: [
          'Use "Reverse Fee (Request Amount)" mode whenever you want a client to cover PayPal fees so you clear an exact net amount.',
          'For international clients paying in USD while you withdraw to EUR or PLN, add 3%–4% in the FX conversion spread field to see true landed payout.',
          'PayPal’s fixed fee varies by currency ($0.49 USD, €0.35 EUR, £0.30 GBP, 1.35 PLN) — you can edit it directly above.',
        ],
        faqs: [
          {
            q: 'How do I calculate how much to ask for on PayPal to receive $100 net?',
            a: 'Use the reverse formula: Gross = (Target Net + Fixed Fee) ÷ (1 − Fee%). At 3.49% + $0.49, to receive $100.00 net you must request $104.12.',
          },
          {
            q: 'Why does PayPal deduct extra on international payments?',
            a: 'Cross-border commercial payments incur an international surcharge (often +1.29% to +1.99% on top of domestic rates) plus a 3%–4% exchange rate markup if PayPal converts the currency.',
          },
          {
            q: 'Are PayPal Friends & Family payments free?',
            a: 'Domestic Friends & Family transfers funded by bank or PayPal balance are usually free, but using Friends & Family for commercial goods or freelance services violates PayPal terms and removes buyer/seller protection.',
          },
        ],
      },
      de: {
        title: 'PayPal Gebührenrechner — Netto & Rückwärts | CalcLedger',
        description: 'PayPal-Gebühren für geschäftliche Zahlungen, Rechnungen und Auslandstransaktionen (EUR/USD) live berechnen — inklusive Rückwärtsrechnung.',
        h1: 'PayPal Gebührenrechner (Netto & Rückwärts)',
        subtitle: 'Berechnen Sie exakte PayPal-Händlergebühren in EUR, CHF oder USD — oder rechnen Sie rückwärts, welchen Bruttobetrag Sie anfordern müssen.',
        intro: 'Für geschäftliche Zahlungen erhebt PayPal in Deutschland und der EU eine prozentuale Gebühr (häufig 2,99 % oder 2,49 % je nach Zahlungsart) zuzüglich 0,35 € Fixgebühr sowie Aufschläge bei Auslandszahlungen und Währungsumrechnung.',
        tips: [
          'Mit dem Modus „Rückwärts rechnen“ ermitteln Sie sofort den Rechnungsbetrag, damit nach PayPal-Abzug exakt Ihr Wunsch-Netto übrig bleibt.',
          'Bei Zahlungen außerhalb des EWR fallen zusätzlich Auslandsgebühren und häufig 3–4 % Wechselkursaufschlag an.',
          'Sie können Prozentsatz und Fixgebühr jederzeit individuell an Ihren PayPal-Händlertarif anpassen.',
        ],
        faqs: [
          {
            q: 'Wie hoch sind die PayPal-Gebühren in Deutschland für Händler?',
            a: 'Standardmäßige geschäftliche PayPal-Zahlungen im Inland liegen typischerweise bei 2,99 % + 0,35 € (bzw. 2,49 % + 0,35 € bei bestimmten Standard-Checkout-Tarifen).',
          },
          {
            q: 'Wie rechne ich PayPal-Gebühren rückwärts auf den Rechnungsbetrag auf?',
            a: 'Die Formel lautet: Brutto = (Wunsch-Netto + Fixgebühr) ÷ (1 − Gebühr%). Für 100,00 € netto bei 2,99 % + 0,35 € müssen Sie 103,44 € anfordern.',
          },
          {
            q: 'Kann ich PayPal-Gebühren als Betriebsausgabe absetzen?',
            a: 'Ja, für gewerbliche Verkäufer und Freelancer stellen PayPal-Transaktionsgebühren reguläre Betriebsausgaben dar (monatliche Abrechnung im PayPal-Konto abrufbar).',
          },
        ],
      },
      pl: {
        title: 'Kalkulator Prowizji PayPal — Netto i Odwrotny | CalcLedger',
        description: 'Oblicz dokładną prowizję PayPal (krajową, zagraniczną i przewalutowanie) w PLN, EUR lub USD oraz wylicz, ile wystawić na fakturze, by dostać pełną kwotę.',
        h1: 'Kalkulator Prowizji PayPal (Netto i Odwrotny)',
        subtitle: 'Sprawdź, ile PayPal potrąci z przelewu komercyjnego, lub oblicz odwrotnie, jaką kwotę wpisać klientowi, aby otrzymać dokładną sumę na czysto.',
        intro: 'PayPal pobiera od płatności komercyjnych prowizję procentową (zwykle 2,99%–3,49%) oraz opłatę stałą zależną od waluty (np. 1,35 PLN, €0,35, $0,49), a przy płatnościach spoza EOG także dopłatę transgraniczną i 3–4% spreadu za przewalutowanie.',
        tips: [
          'Przełącz tryb na „Wylicz kwotę do pobrania”, jeśli chcesz wiedzieć, ile wpisać na rachunku, aby po prowizji PayPal dostać równe np. 1000 zł lub $500.',
          'Dla płatności w PLN zmień opłatę stałą na 1,35 (lub odpowiednik dla EUR: 0,35 / USD: 0,49).',
          'Jeśli otrzymujesz USD, a wypłacasz na konto w PLN przez PayPal, dolicz 3–4% w polu przewalutowania (FX).',
        ],
        faqs: [
          {
            q: 'Ile wynosi prowizja PayPal dla sprzedawców i freelancerów w Polsce?',
            a: 'Standardowa prowizja komercyjna w Polsce/EOG wynosi najczęściej 2,99% + 1,35 PLN (lub 0,35 EUR), natomiast dla płatności z USA lub spoza EOG rośnie o ok. 1,99% plus ewentualny koszt przewalutowania.',
          },
          {
            q: 'Jak obliczyć, ile poprosić klienta na PayPal, żeby dostać $1000 na czysto?',
            a: 'Użyj wzoru odwrotnego: Kwota brutto = (Cel netto + Opłata stała) ÷ (1 − Prowizja%). Nasz kalkulator wylicza to automatycznie w trybie odwrotnym.',
          },
          {
            q: 'Czy PayPal pobiera prowizję za wypłatę pieniędzy na polskie konto?',
            a: 'Standardowy przelew w PLN na polskie konto bankowe jest bezpłatny, ale jeśli środki są w obcej walucie (np. USD/EUR), PayPal nalicza 3–4% spreadu przy przewalutowaniu.',
          },
        ],
      },
    },
  },
  {
    key: 'stripe',
    name: 'Stripe',
    defaultCurrencyByLang: { en: 'USD', de: 'EUR', pl: 'PLN' },
    defaultPresetByLang: { en: 'stripe-us', de: 'stripe-eu', pl: 'stripe-eu' },
    presets: [
      { id: 'stripe-eu', pct: 1.5, fixed: 0.25, fxPct: 0, labels: { en: 'Stripe EEA Standard Cards (1.5% + €0.25)', de: 'Stripe EWR Standardkarten (1,5 % + 0,25 €)', pl: 'Stripe UE / Polska karty (1,5% + 0,25 € / 1 zł)' } },
      { id: 'stripe-us', pct: 2.9, fixed: 0.30, fxPct: 0, labels: { en: 'Stripe US Domestic Cards (2.9% + $0.30)', de: 'Stripe US Inlandskarten (2,9 % + 0,30 $)', pl: 'Stripe US karty krajowe (2,9% + $0,30)' } },
      { id: 'stripe-uk', pct: 1.5, fixed: 0.20, fxPct: 0, labels: { en: 'Stripe UK Standard Cards (1.5% + £0.20)', de: 'Stripe UK Standardkarten (1,5 % + 0,20 £)', pl: 'Stripe UK karty krajowe (1,5% + £0,20)' } },
      { id: 'stripe-intl', pct: 3.25, fixed: 0.25, fxPct: 2.0, labels: { en: 'Stripe Non-EEA Card + 2% FX (3.25% + 0.25 + 2% FX)', de: 'Stripe Nicht-EWR-Karte + 2 % FX (3,25 % + 0,25 + 2 % FX)', pl: 'Stripe Karta spoza UE + 2% FX (3,25% + 0,25 + 2%)' } },
    ],
    feeSummary: {
      en: '1.5% + €0.25 EEA cards, 2.9% + $0.30 US cards, ~3.25% + 2% FX for international non-EEA cards.',
      de: '1,5 % + 0,25 € (EWR-Karten), 2,9 % + 0,30 $ (US-Karten), ca. 3,25 % + 2 % FX für Nicht-EWR-Karten.',
      pl: '1,5% + 1 zł / 0,25 € (karty z UE), 2,9% + $0,30 (USA), ok. 3,25% + 2% FX dla kart spoza EOG.',
    },
    seo: {
      en: {
        title: 'Stripe Fee Calculator — EU, US & Reverse Payout | CalcLedger',
        description: 'Calculate Stripe card processing fees for EEA (1.5% + €0.25), US (2.9% + $0.30), UK, and international cards with FX conversion and reverse mode.',
        h1: 'Stripe Fee Calculator (EU, US & Reverse)',
        subtitle: 'Compute Stripe card processing fees, international card surcharges, currency conversion, and reverse-calculate gross checkout pricing.',
        intro: 'Stripe’s transparent pay-as-you-go pricing depends on card origin: standard EEA cards typically cost 1.5% + €0.25 (UK 1.5% + £0.20, US 2.9% + $0.30), while non-EEA international cards cost around 3.25% + €0.25 plus 2% if automatic currency conversion is required.',
        tips: [
          'European SaaS and e-commerce stores pay much less on domestic EEA cards (1.5%) than on US or commercial cards (2.9%–3.25%).',
          'If you use Stripe Billing, Stripe Tax, or Payment Links with invoicing, add ~0.4%–0.7% to the fee % to model total effective Stripe take rate.',
          'Use reverse calculation to price B2B retainers or SaaS invoices so net revenue matches your accounting target.',
        ],
        faqs: [
          {
            q: 'What are Stripe’s standard card fees in Europe vs. the US?',
            a: 'In the EEA, standard European consumer cards cost 1.5% + €0.25 (or 1.5% + 1 PLN in Poland). In the US, domestic cards cost 2.9% + $0.30.',
          },
          {
            q: 'How much extra does Stripe charge for currency conversion?',
            a: 'When settling in a different currency than the customer paid in, Stripe typically charges a 2% currency conversion fee (1% in the US) on top of standard card fees.',
          },
          {
            q: 'Does Stripe refund its processing fee if I refund a customer?',
            a: 'No. Like most payment processors, Stripe does not return the original card processing fee when a transaction is refunded.',
          },
        ],
      },
      de: {
        title: 'Stripe Gebührenrechner — EU, US & Rückwärts | CalcLedger',
        description: 'Stripe-Kreditkartengebühren für EWR (1,5% + 0,25 €), USA (2,9% + 0,30 $) und internationale Karten inklusive Währungsumrechnung berechnen.',
        h1: 'Stripe Gebührenrechner (EU, US & Rückwärts)',
        subtitle: 'Berechnen Sie Stripe-Transaktionsgebühren für EWR- und internationale Karten, Währungsgebühren und Ihren exakten Netto-Auszahlungsbetrag.',
        intro: 'Stripe berechnet in Deutschland und dem EWR für europäische Standard-Privatkarten in der Regel 1,5 % + 0,25 €, für US-Karten 2,9 % + 0,30 $ sowie rund 3,25 % + 0,25 € (plus 2 % Währungsumrechnung) für internationale Nicht-EWR-Karten.',
        tips: [
          'Für deutsche Firmenkarten (Commercial Cards) liegen die Stripe-Gebühren meist höher als bei privaten EWR-Karten — passen Sie den Prozentsatz einfach an.',
          'Nutzen Sie Stripe Billing oder Stripe Tax, können Sie die Zusatzgebühr (ca. 0,5 %) direkt im Prozentfeld addieren.',
          'Im Rückwärts-Modus berechnen Sie sofort den Brutto-Checkout-Preis für Ihr gewünschtes Nettoziel.',
        ],
        faqs: [
          {
            q: 'Wie hoch sind die Stripe-Gebühren in Deutschland?',
            a: 'Für Standard-Privatkarten aus dem Europäischen Wirtschaftsraum (EWR) berechnet Stripe 1,5 % + 0,25 € pro erfolgreicher Kartenzahlung.',
          },
          {
            q: 'Welche Zusatzgebühren fallen bei Nicht-EU-Karten in Stripe an?',
            a: 'Für Karten außerhalb des EWR berechnet Stripe in der Regel 3,25 % + 0,25 € (zzgl. 2 %, falls eine Währungsumrechnung erforderlich ist).',
          },
          {
            q: 'Erstattet Stripe die Gebühren bei einer Rückzahlung an den Kunden?',
            a: 'Nein. Bei einer Rückerstattung (Refund) behält Stripe die ursprüngliche Transaktionsgebühr ein.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator Prowizji Stripe — Polska, UE i USA | CalcLedger',
        description: 'Oblicz prowizje Stripe dla kart z Polski/UE (1,5% + 1 zł / 0,25 €), USA (2,9% + $0,30) oraz kart spoza EOG i przewalutowania 2% FX.',
        h1: 'Kalkulator Prowizji Stripe (Polska, UE, USA)',
        subtitle: 'Sprawdź dokładną opłatę bramki płatniczej Stripe dla kart europejskich i międzynarodowych lub wylicz odwrotnie kwotę do pobrania od klienta.',
        intro: 'W Polsce i EOG standardowa prowizja Stripe dla kart konsumentów z Europy wynosi 1,5% + 1,00 PLN (lub 1,5% + 0,25 EUR). Dla kart z USA to 2,9% + $0,30, a dla kart spoza EOG ok. 3,25% + opłata stała (oraz +2% przy przewalutowaniu).',
        tips: [
          'Dla rozliczeń w złotówkach (PLN) wpisz w polu opłaty stałej 1,00 (dla EUR: 0,25, dla USD: 0,30).',
          'Jeśli korzystasz ze Stripe Billing (subskrypcje SaaS) lub Stripe Tax, dodaj ok. 0,5%–0,7% do stawki procentowej.',
          'Przy metodach lokalnych jak BLIK lub Przelewy24 w Stripe stawki wynoszą zwykle 1,8%–2,2% + 1 zł — możesz wpisać je wprost w kalkulatorze.',
        ],
        faqs: [
          {
            q: 'Ile wynosi prowizja Stripe w Polsce za płatność kartą i BLIK?',
            a: 'Dla standardowych kart europejskich (EOG) w Polsce to 1,5% + 1,00 PLN, dla kart spoza EOG ok. 3,25% + 1,00 PLN, a dla BLIK i Przelewy24 zazwyczaj 1,8%–2,2% + 1,00 PLN.',
          },
          {
            q: 'Czy Stripe pobiera dodatkową opłatę za przewalutowanie?',
            a: 'Tak — jeśli klient płaci w innej walucie niż waluta wypłaty na Twoje konto bankowe, Stripe dolicza zazwyczaj 2% opłaty za przewalutowanie.',
          },
          {
            q: 'Czy Stripe zwraca prowizję przy zwrocie zamówienia (refund)?',
            a: 'Nie. W przypadku zwrotu środków klientowi pierwotna prowizja bramki płatniczej nie podlega zwrotowi.',
          },
        ],
      },
    },
  },
];

export function getPaymentProvider(key) {
  return PAYMENT_PROVIDERS.find((p) => p.key === key);
}
