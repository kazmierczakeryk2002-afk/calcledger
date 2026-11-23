/**
 * Programmatic SEO dataset for 9 European VAT / MwSt countries.
 * Each country provides accurate standard & reduced rates, default currency,
 * local tax terminology, and full EN/DE/PL localized SEO metadata & FAQs.
 */

export const VAT_COUNTRIES = [
  {
    key: 'germany',
    code: 'DE',
    standardRate: 19,
    reducedRates: [7, 0],
    currency: 'EUR',
    localTaxName: 'Umsatzsteuer (MwSt)',
    vatIdFormat: 'DE + 9 digits',
    names: {
      en: 'Germany',
      de: 'Deutschland',
      pl: 'Niemcy',
    },
    seo: {
      en: {
        title: 'Germany VAT Calculator (19% & 7% MwSt) — Net to Gross | CalcLedger',
        description: 'Calculate German VAT (Mehrwertsteuer) at 19% standard or 7% reduced rate. Convert net to gross or reverse-calculate MwSt instantly in EUR.',
        h1: 'Germany VAT Calculator (19% & 7% MwSt)',
        subtitle: 'Instant net-to-gross and gross-to-net German Umsatzsteuer (MwSt) calculator with 19% standard and 7% reduced rate presets.',
        intro: 'In Germany, value-added tax is officially called Umsatzsteuer (USt) and commonly referred to as Mehrwertsteuer (MwSt). Most commercial goods and B2B/B2C services are taxed at the 19% standard rate, while books, groceries, public transport, and hotel stays qualify for the 7% reduced rate.',
        rateNotes: [
          { rate: '19%', label: 'Standard rate (Regelsteuersatz)', examples: 'Electronics, software, consulting, clothing, shipping, restaurant beverages.' },
          { rate: '7%', label: 'Reduced rate (Ermäßigter Steuersatz)', examples: 'Basic food items, print books & e-books, newspapers, cultural tickets, hotel accommodation.' },
          { rate: '0%', label: 'Zero-rated / exempt', examples: 'Intra-EU B2B supplies (Reverse Charge), qualifying solar PV installations, export deliveries outside the EU.' },
        ],
        faqs: [
          {
            q: 'How do I remove 19% German MwSt from a gross price?',
            a: 'Divide the gross amount by 1.19 to find the net price (Net = Gross ÷ 1.19). Subtract the net price from the gross price to get the exact 19% MwSt component.',
          },
          {
            q: 'When does the 7% reduced VAT rate apply in Germany?',
            a: 'The 7% rate applies mainly to basic foodstuffs, books, newspapers, local public transport, hotel stays, and certain cultural or artistic services listed in Annex 2 of the German UStG.',
          },
          {
            q: 'Do German small businesses (Kleinunternehmer) charge 19% VAT?',
            a: 'Businesses using the Kleinunternehmerregelung (§ 19 UStG) do not charge MwSt on invoices and cannot deduct input VAT, provided they remain below statutory annual revenue thresholds.',
          },
        ],
      },
      de: {
        title: 'MwSt Rechner Deutschland (19% & 7%) — Netto Brutto | CalcLedger',
        description: 'Mehrwertsteuer für Deutschland mit 19% Regelsteuersatz oder 7% ermäßigtem Satz berechnen. Netto zu Brutto und Brutto zu Netto live in EUR.',
        h1: 'MwSt-Rechner Deutschland (19 % & 7 %)',
        subtitle: 'Sofortiger Netto-Brutto- und Brutto-Netto-Rechner für die deutsche Umsatzsteuer mit 19 % Regelsteuersatz und 7 % ermäßigtem Satz.',
        intro: 'In Deutschland beträgt der reguläre Umsatzsteuersatz (umgangssprachlich Mehrwertsteuer, MwSt) 19 %. Für bestimmte Güter des täglichen Bedarfs wie Grundnahrungsmittel, Bücher, Zeitungen und Hotelübernachtungen gilt der ermäßigte Steuersatz von 7 %.',
        rateNotes: [
          { rate: '19 %', label: 'Regelsteuersatz', examples: 'Elektronik, Software, Beratung, Dienstleistungen, Kleidung, Versandkosten.' },
          { rate: '7 %', label: 'Ermäßigter Steuersatz', examples: 'Grundnahrungsmittel, Bücher & E-Books, Zeitungen, ÖPNV, Hotelübernachtungen.' },
          { rate: '0 %', label: 'Steuerfrei / Nullsteuersatz', examples: 'Innergemeinschaftliche B2B-Lieferungen (Reverse Charge), begünstigte Photovoltaikanlagen, Ausfuhrlieferungen.' },
        ],
        faqs: [
          {
            q: 'Wie rechne ich 19 % MwSt aus einem Bruttobetrag heraus?',
            a: 'Teilen Sie den Bruttobetrag durch 1,19, um den Nettobetrag zu erhalten (Netto = Brutto ÷ 1,19). Die Differenz zwischen Brutto und Netto ergibt exakt die enthaltene Mehrwertsteuer.',
          },
          {
            q: 'Wann gilt in Deutschland der ermäßigte Satz von 7 %?',
            a: 'Der 7-%-Satz gilt gemäß Anlage 2 zum UStG unter anderem für Grundnahrungsmittel, Bücher, Zeitungen, den öffentlichen Nahverkehr sowie Beherbergungsleistungen.',
          },
          {
            q: 'Müssen Kleinunternehmer in Deutschland Umsatzsteuer ausweisen?',
            a: 'Nein. Wer die Kleinunternehmerregelung nach § 19 UStG nutzt, weist auf Rechnungen keine Umsatzsteuer aus und verweist stattdessen auf die Steuerbefreiung.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator VAT Niemcy (19% i 7% MwSt) — Netto Brutto | CalcLedger',
        description: 'Oblicz niemiecki VAT (MwSt) według stawki podstawowej 19% lub obniżonej 7%. Szybkie przeliczanie netto na brutto i brutto na netto w EUR.',
        h1: 'Kalkulator VAT Niemcy (19% i 7% MwSt)',
        subtitle: 'Błyskawiczny kalkulator niemieckiego podatku Umsatzsteuer (MwSt) ze stawką podstawową 19% oraz obniżoną 7%.',
        intro: 'W Niemczech podatek od wartości dodanej funkcjonuje jako Umsatzsteuer (USt), potocznie Mehrwertsteuer (MwSt). Podstawowa stawka dla większości towarów i usług wynosi 19%, natomiast obniżona 7% obejmuje m.in. podstawową żywność, książki, prasę i noclegi hotelowe.',
        rateNotes: [
          { rate: '19%', label: 'Stawka podstawowa (Regelsteuersatz)', examples: 'Elektronika, SaaS, doradztwo, usługi B2B/B2C, odzież, logistyka.' },
          { rate: '7%', label: 'Stawka obniżona (Ermäßigter Steuersatz)', examples: 'Podstawowa żywność, książki i e-booki, prasa, transport lokalny, noclegi hotelowe.' },
          { rate: '0%', label: 'Stawka 0% / zwolnienie', examples: 'Wewnątrzwspólnotowa dostawa B2B (odwrotne obciążenie / Reverse Charge), eksport poza UE.' },
        ],
        faqs: [
          {
            q: 'Jak obliczyć kwotę netto z niemieckiej faktury brutto z 19% MwSt?',
            a: 'Podziel kwotę brutto przez 1,19 (Netto = Brutto ÷ 1,19). Różnica między kwotą brutto a netto to dokładnie 19% niemieckiego podatku MwSt.',
          },
          {
            q: 'Kiedy w Niemczech stosuje się stawkę 7% MwSt?',
            a: 'Stawka 7% dotyczy m.in. podstawowych produktów spożywczych, książek, gazet, transportu publicznego oraz usług hotelarskich wymienionych w załączniku nr 2 do UStG.',
          },
          {
            q: 'Jak rozliczyć fakturę z polskiej firmy do kontrahenta z Niemiec?',
            a: 'W relacji B2B z czynnym podatnikiem VAT-UE w Niemczech standardowo stosuje się mechanizm odwrotnego obciążenia (Reverse Charge, stawka NP / 0% po stronie sprzedawcy).',
          },
        ],
      },
    },
  },
  {
    key: 'austria',
    code: 'AT',
    standardRate: 20,
    reducedRates: [13, 10, 0],
    currency: 'EUR',
    localTaxName: 'Umsatzsteuer (USt / MwSt)',
    vatIdFormat: 'ATU + 8 digits',
    names: { en: 'Austria', de: 'Österreich', pl: 'Austria' },
    seo: {
      en: {
        title: 'Austria VAT Calculator (20%, 13% & 10% USt) | CalcLedger',
        description: 'Calculate Austrian VAT (Umsatzsteuer) at 20% standard, 13%, or 10% reduced rates. Fast net-to-gross and gross-to-net EUR conversion.',
        h1: 'Austria VAT Calculator (20%, 13% & 10% USt)',
        subtitle: 'Compute Austrian Umsatzsteuer (MwSt) with instant presets for 20% standard, 13% intermediate, and 10% reduced tax rates.',
        intro: 'Austria levies a standard VAT (Umsatzsteuer) rate of 20%, alongside two reduced rates: 10% for groceries, books, rent, and passenger transport, and 13% for selected cultural events, domestic flights, and agricultural goods.',
        rateNotes: [
          { rate: '20%', label: 'Standard rate', examples: 'General retail goods, SaaS, consulting, electronics, and standard commercial services.' },
          { rate: '13%', label: 'Reduced rate (intermediate)', examples: 'Cultural admission, cinema tickets, domestic flights, live plants, and certain farm products.' },
          { rate: '10%', label: 'Reduced rate', examples: 'Foodstuffs, books, residential rent, hotel stays, and public passenger transport.' },
        ],
        faqs: [
          {
            q: 'How do I calculate 20% Austrian VAT backwards from gross?',
            a: 'Divide the gross price by 1.20 to get the net amount. Since 20% equals one-fifth of net, VAT is exactly one-sixth (16.67%) of the gross amount.',
          },
          {
            q: 'What is the difference between Austria’s 10% and 13% VAT rates?',
            a: 'The 10% rate covers daily essentials like food, books, hospitality, and rent, whereas 13% applies to specific categories such as cinema/cultural tickets, plants, and domestic air travel.',
          },
          {
            q: 'What does an Austrian VAT ID (UID-Nummer) look like?',
            a: 'An Austrian UID starts with ATU followed by 8 digits (for example, ATU12345678).',
          },
        ],
      },
      de: {
        title: 'MwSt Rechner Österreich (20%, 13% & 10% USt) | CalcLedger',
        description: 'Österreichische Umsatzsteuer mit 20% Normalsteuersatz sowie 13% und 10% ermäßigten Sätzen berechnen. Netto-Brutto-Rechner in EUR.',
        h1: 'MwSt-Rechner Österreich (20 %, 13 % & 10 % USt)',
        subtitle: 'Berechnen Sie die österreichische Umsatzsteuer (USt) schnell und präzise mit Voreinstellungen für 20 %, 13 % und 10 %.',
        intro: 'In Österreich gilt der Normalsteuersatz von 20 % Umsatzsteuer. Zusätzlich bestehen zwei ermäßigte Steuersätze: 10 % etwa für Lebensmittel, Bücher, Mieten und Beherbergung sowie 13 % unter anderem für Kulturveranstaltungen, Pflanzen und Inlandsflüge.',
        rateNotes: [
          { rate: '20 %', label: 'Normalsteuersatz', examples: 'Allgemeine Waren, Elektronik, Software, Beratung und gewerbliche Dienstleistungen.' },
          { rate: '13 %', label: 'Ermäßigter Steuersatz', examples: 'Kultur- und Sportveranstaltungen, Kinokarten, Pflanzen, Inlandsflüge.' },
          { rate: '10 %', label: 'Ermäßigter Steuersatz', examples: 'Lebensmittel, Bücher, Wohnungsvermietung, Hotellerie und Personenbeförderung.' },
        ],
        faqs: [
          {
            q: 'Wie berechne ich die 20 % USt in Österreich aus dem Bruttobetrag?',
            a: 'Teilen Sie den Bruttobetrag durch 1,20, um den Nettobetrag zu bestimmen. Die enthaltene Umsatzsteuer entspricht genau einem Sechstel des Bruttobetrags.',
          },
          {
            q: 'Wann gelten in Österreich 10 % bzw. 13 % Umsatzsteuer?',
            a: '10 % gelten für Lebensmittel, Bücher, Hotellerie und Wohnraummiete; 13 % u. a. für Kulturveranstaltungen, lebende Pflanzen und bestimmte landwirtschaftliche Erzeugnisse.',
          },
          {
            q: 'Wie ist eine österreichische UID-Nummer aufgebaut?',
            a: 'Die österreichische UID-Nummer beginnt mit ATU gefolgt von acht Ziffern (z. B. ATU12345678).',
          },
        ],
      },
      pl: {
        title: 'Kalkulator VAT Austria (20%, 13% i 10% USt) | CalcLedger',
        description: 'Oblicz austriacki VAT (USt) dla stawki podstawowej 20% oraz obniżonych 13% i 10%. Szybkie przeliczanie netto i brutto w EUR.',
        h1: 'Kalkulator VAT Austria (20%, 13% i 10% USt)',
        subtitle: 'Przelicz kwoty netto i brutto dla austriackiego podatku Umsatzsteuer ze stawkami 20%, 13% oraz 10%.',
        intro: 'Podstawowa stawka VAT (Umsatzsteuer) w Austrii wynosi 20%. Obok niej funkcjonują dwie stawki obniżone: 10% (żywność, książki, noclegi, wynajem mieszkań) oraz 13% (wybrane wydarzenia kulturalne, loty krajowe, rośliny).',
        rateNotes: [
          { rate: '20%', label: 'Stawka podstawowa', examples: 'Większość towarów, elektronika, usługi IT, doradztwo i handel.' },
          { rate: '13%', label: 'Stawka obniżona pośrednia', examples: 'Bilety kulturalne i kinowe, rośliny, loty krajowe, wybrane produkty rolne.' },
          { rate: '10%', label: 'Stawka obniżona', examples: 'Artykuły spożywcze, książki, hotelarstwo, transport pasażerski i najem mieszkalny.' },
        ],
        faqs: [
          {
            q: 'Jak wyliczyć netto z kwoty brutto przy austriackim VAT 20%?',
            a: 'Podziel kwotę brutto przez 1,20. Podatek VAT stanowi dokładnie 1/6 ceny brutto (16,67%).',
          },
          {
            q: 'Kiedy w Austrii obowiązuje stawka 13%, a kiedy 10%?',
            a: 'Stawka 10% obejmuje żywność, książki, hotele i najem mieszkań, natomiast 13% m.in. bilety do kina/kultury, rośliny oraz wybrane usługi rolne.',
          },
          {
            q: 'Jaki format ma austriacki numer VAT-UE (UID)?',
            a: 'Austriacki numer VAT-UE składa się z prefiksu ATU i 8 cyfr (np. ATU12345678).',
          },
        ],
      },
    },
  },
  {
    key: 'switzerland',
    code: 'CH',
    standardRate: 8.1,
    reducedRates: [3.8, 2.6, 0],
    currency: 'CHF',
    localTaxName: 'Mehrwertsteuer (MWST / TVA)',
    vatIdFormat: 'CHE-123.456.789 MWST',
    names: { en: 'Switzerland', de: 'Schweiz', pl: 'Szwajcaria' },
    seo: {
      en: {
        title: 'Switzerland VAT Calculator (8.1%, 3.8% & 2.6% MWST) | CalcLedger',
        description: 'Calculate current Swiss MWST at 8.1% standard, 3.8% lodging, or 2.6% reduced rate. Instant CHF net-to-gross and reverse VAT calculator.',
        h1: 'Switzerland VAT Calculator (8.1% MWST)',
        subtitle: 'Up-to-date Swiss Mehrwertsteuer calculator supporting the 8.1% standard rate, 3.8% accommodation rate, and 2.6% reduced rate in CHF.',
        intro: 'Since January 1, 2024, Switzerland applies a standard VAT (MWST / TVA / IVA) rate of 8.1%, one of the lowest standard VAT rates in Europe. A special 3.8% rate applies to hotel accommodation and a 2.6% reduced rate covers groceries, medicine, and books.',
        rateNotes: [
          { rate: '8.1%', label: 'Standard rate (Normalsatz)', examples: 'Most goods, digital services, consulting, electronics, and restaurant meals.' },
          { rate: '3.8%', label: 'Special lodging rate (Sondersatz)', examples: 'Overnight hotel stays and accommodation including breakfast.' },
          { rate: '2.6%', label: 'Reduced rate (Reduzierter Satz)', examples: 'Groceries, non-alcoholic drinks, pharmaceuticals, books, newspapers, and water.' },
        ],
        faqs: [
          {
            q: 'Why is Swiss VAT 8.1% instead of 7.7%?',
            a: 'Switzerland increased its MWST rates on January 1, 2024 to help finance the AHV pension fund: standard rose from 7.7% to 8.1%, lodging from 3.7% to 3.8%, and reduced from 2.5% to 2.6%.',
          },
          {
            q: 'How do I calculate net price from gross with 8.1% Swiss MWST?',
            a: 'Divide the gross amount by 1.081 (Net = Gross ÷ 1.081). Subtract Net from Gross to obtain the exact 8.1% MWST amount.',
          },
          {
            q: 'What is the VAT registration threshold in Switzerland?',
            a: 'Businesses generating CHF 100,000 or more in taxable worldwide turnover are generally required to register for Swiss MWST.',
          },
        ],
      },
      de: {
        title: 'MWST Rechner Schweiz (8,1%, 3,8% & 2,6%) — CHF | CalcLedger',
        description: 'Aktuelle Schweizer Mehrwertsteuer mit 8,1% Normalsatz, 3,8% Sondersatz (Beherbergung) oder 2,6% reduziertem Satz in CHF berechnen.',
        h1: 'MWST-Rechner Schweiz (8,1 %, 3,8 % & 2,6 %)',
        subtitle: 'Aktueller Schweizer Mehrwertsteuerrechner in CHF für den Normalsatz von 8,1 %, den Beherbergungssatz von 3,8 % und 2,6 % reduziert.',
        intro: 'Seit dem 1. Januar 2024 gelten in der Schweiz angepasste MWST-Sätze: 8,1 % Normalsatz für die meisten Waren und Dienstleistungen, 3,8 % Sondersatz für Beherbergungsleistungen sowie 2,6 % reduzierter Satz für Güter des täglichen Bedarfs.',
        rateNotes: [
          { rate: '8,1 %', label: 'Normalsatz', examples: 'Waren, Dienstleistungen, Beratung, Elektronik, Gastronomie.' },
          { rate: '3,8 %', label: 'Sondersatz Beherbergung', examples: 'Hotelübernachtungen inklusive Frühstück.' },
          { rate: '2,6 %', label: 'Reduzierter Satz', examples: 'Lebensmittel, Medikamente, Bücher, Zeitungen, Leitungswasser.' },
        ],
        faqs: [
          {
            q: 'Seit wann gilt der MWST-Satz von 8,1 % in der Schweiz?',
            a: 'Die neuen Sätze (8,1 %, 3,8 % und 2,6 %) gelten seit dem 1. Januar 2024 zur Zusatzfinanzierung der AHV und lösen die früheren Sätze von 7,7 %, 3,7 % und 2,5 % ab.',
          },
          {
            q: 'Wie rechne ich 8,1 % Schweizer MWST aus einem Bruttobetrag heraus?',
            a: 'Dividieren Sie den Bruttobetrag durch 1,081 (Netto = Brutto ÷ 1,081). Die Differenz zum Bruttobetrag ergibt die enthaltene MWST.',
          },
          {
            q: 'Ab welchem Umsatz besteht in der Schweiz MWST-Pflicht?',
            a: 'Unternehmen mit einem weltweiten steuerbaren Umsatz ab CHF 100’000 pro Jahr sind in der Regel in der Schweiz MWST-pflichtig.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator VAT Szwajcaria (8,1%, 3,8% i 2,6% MWST) | CalcLedger',
        description: 'Oblicz aktualny szwajcarski VAT (MWST) dla stawek 8,1%, 3,8% (noclegi) i 2,6%. Szybkie przeliczanie netto i brutto w CHF.',
        h1: 'Kalkulator VAT Szwajcaria (8,1% MWST)',
        subtitle: 'Aktualny kalkulator szwajcarskiego podatku MWST w CHF ze stawką podstawową 8,1%, hotelową 3,8% oraz obniżoną 2,6%.',
        intro: 'Od 1 stycznia 2024 r. w Szwajcarii obowiązuje podstawowa stawka MWST wynosząca 8,1% — jedna z najniższych w Europie. Dodatkowo stosuje się stawkę 3,8% dla usług noclegowych oraz 2,6% dla żywności, leków i książek.',
        rateNotes: [
          { rate: '8,1%', label: 'Stawka podstawowa (Normalsatz)', examples: 'Większość towarów, usługi IT, doradztwo, elektronika, gastronomia.' },
          { rate: '3,8%', label: 'Stawka specjalna (noclegi)', examples: 'Usługi hotelarskie i noclegowe wraz ze śniadaniem.' },
          { rate: '2,6%', label: 'Stawka obniżona', examples: 'Żywność, leki, książki, prasa, woda wodociągowa.' },
        ],
        faqs: [
          {
            q: 'Dlaczego szwajcarski VAT wynosi 8,1%, a nie 7,7%?',
            a: 'Od 1 stycznia 2024 r. Szwajcaria podniosła stawki MWST (z 7,7% na 8,1%, z 3,7% na 3,8% oraz z 2,5% na 2,6%) w celu wsparcia funduszu emerytalnego AHV.',
          },
          {
            q: 'Jak obliczyć netto z kwoty brutto w CHF przy stawce 8,1%?',
            a: 'Podziel kwotę brutto przez 1,081 (Netto = Brutto ÷ 1,081). Różnica między kwotą brutto a netto to dokładnie kwota podatku MWST.',
          },
          {
            q: 'Czy Szwajcaria należy do systemu VAT-UE?',
            a: 'Nie, Szwajcaria leży poza UE, więc handel z kontrahentami szwajcarskimi rozlicza się jako eksport/import usług lub towarów z odrębnymi zasadami celno-podatkowymi.',
          },
        ],
      },
    },
  },
  {
    key: 'uk',
    code: 'GB',
    standardRate: 20,
    reducedRates: [5, 0],
    currency: 'GBP',
    localTaxName: 'Value Added Tax (VAT)',
    vatIdFormat: 'GB + 9 digits',
    names: { en: 'United Kingdom', de: 'Großbritannien (UK)', pl: 'Wielka Brytania (UK)' },
    seo: {
      en: {
        title: 'UK VAT Calculator (20% & 5% HMRC VAT) — Net to Gross | CalcLedger',
        description: 'Calculate UK VAT at 20% standard or 5% reduced rate in GBP. Instantly add or remove VAT from any price with exact net and gross figures.',
        h1: 'UK VAT Calculator (20% & 5%)',
        subtitle: 'Fast GBP net-to-gross and gross-to-net calculator for UK Value Added Tax at the 20% standard and 5% reduced rates.',
        intro: 'In the United Kingdom, HMRC sets the standard VAT rate at 20% for most goods and commercial services. A 5% reduced rate applies to domestic fuel, children’s car seats, and selected energy-saving products, while essential groceries, books, and children’s clothing are zero-rated (0%).',
        rateNotes: [
          { rate: '20%', label: 'Standard rate', examples: 'Most retail goods, digital services, consulting, SaaS, and commercial supplies.' },
          { rate: '5%', label: 'Reduced rate', examples: 'Home energy & electricity, children’s car seats, mobility aids for older people.' },
          { rate: '0%', label: 'Zero-rated', examples: 'Most basic food items, printed books & newspapers, children’s clothes and footwear.' },
        ],
        faqs: [
          {
            q: 'How do I remove 20% UK VAT from a gross total?',
            a: 'Divide the gross total by 1.2 (or multiply by 5/6) to get the net amount excluding VAT. The VAT element is exactly one-sixth of the gross price.',
          },
          {
            q: 'What is the UK VAT registration threshold?',
            a: 'UK businesses must register for VAT with HMRC if their VAT-taxable turnover exceeds £90,000 over any rolling 12-month period (subject to current HMRC rules).',
          },
          {
            q: 'Is zero-rated (0%) the same as VAT-exempt in the UK?',
            a: 'No. Zero-rated sales are still VAT-taxable at 0%, which allows VAT-registered businesses to reclaim input VAT on related expenses, unlike VAT-exempt supplies.',
          },
        ],
      },
      de: {
        title: 'UK MwSt Rechner (20% & 5% Großbritannien VAT) — GBP | CalcLedger',
        description: 'Britische VAT (Großbritannien) mit 20% Standardsatz oder 5% ermäßigtem Satz in GBP berechnen. Netto-Brutto-Umrechnung sofort im Browser.',
        h1: 'UK-MwSt-Rechner Großbritannien (20 % & 5 %)',
        subtitle: 'Schneller Netto-Brutto-Rechner für die britische Value Added Tax (VAT) in GBP mit 20 % Regelsteuersatz und 5 % ermäßigtem Satz.',
        intro: 'Im Vereinigten Königreich (UK) beträgt der reguläre VAT-Satz 20 %. Für ausgewählte Bereiche wie Haushaltsenergie und Kindersitze gilt der ermäßigte Satz von 5 %, während viele Grundnahrungsmittel, Bücher und Kinderkleidung dem Nullsatz (0 %) unterliegen.',
        rateNotes: [
          { rate: '20 %', label: 'Standard Rate', examples: 'Allgemeine Waren, Elektronik, Beratung, Software und Dienstleistungen.' },
          { rate: '5 %', label: 'Reduced Rate', examples: 'Haushaltsenergie, Kindersitze, bestimmte Energiesparmaßnahmen.' },
          { rate: '0 %', label: 'Zero-Rated', examples: 'Grundnahrungsmittel, gedruckte Bücher, Zeitungen, Kinderkleidung.' },
        ],
        faqs: [
          {
            q: 'Wie rechne ich 20 % britische VAT aus einem Bruttobetrag heraus?',
            a: 'Teilen Sie den Bruttobetrag durch 1,20, um den Nettobetrag in GBP zu erhalten. Die enthaltene VAT entspricht exakt einem Sechstel des Bruttobetrags.',
          },
          {
            q: 'Welche Waren sind in Großbritannien mit 0 % (Zero-Rated) besteuert?',
            a: 'Dazu zählen u. a. die meisten Grundnahrungsmittel, gedruckte Bücher sowie Kinderbekleidung. Anders als bei steuerbefreiten Umsätzen bleibt der Vorsteuerabzug erhalten.',
          },
          {
            q: 'Gilt das EU-Reverse-Charge-Verfahren für Großbritannien?',
            a: 'Nach dem Brexit ist das Vereinigte Königreich (mit Ausnahme besonderer Regelungen für Nordirland) Drittland; B2B-Dienstleistungen werden in der Regel nach dem Empfängerortprinzip besteuert.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator VAT Wielka Brytania UK (20% i 5%) — GBP | CalcLedger',
        description: 'Oblicz brytyjski VAT (UK) w funtach GBP dla stawki podstawowej 20% oraz obniżonej 5%. Natychmiastowe przeliczanie netto i brutto.',
        h1: 'Kalkulator VAT Wielka Brytania — UK (20% i 5%)',
        subtitle: 'Przeliczaj kwoty netto i brutto w funtach brytyjskich (GBP) z uwzględnieniem brytyjskich stawek VAT 20%, 5% i 0%.',
        intro: 'W Wielkiej Brytanii (UK) podstawowa stawka VAT ustalana przez HMRC wynosi 20%. Stawka obniżona 5% obejmuje m.in. energię dla gospodarstw domowych i foteliki dziecięce, natomiast podstawowa żywność, książki i odzież dziecięca podlegają stawce 0% (zero-rated).',
        rateNotes: [
          { rate: '20%', label: 'Stawka podstawowa (Standard)', examples: 'Większość towarów, e-commerce, usługi IT, konsulting i elektronika.' },
          { rate: '5%', label: 'Stawka obniżona (Reduced)', examples: 'Energia domowa, foteliki dziecięce, wybrane materiały energooszczędne.' },
          { rate: '0%', label: 'Stawka zerowa (Zero-rated)', examples: 'Podstawowa żywność, książki drukowane, odzież i obuwie dziecięce.' },
        ],
        faqs: [
          {
            q: 'Jak obliczyć netto z ceny brutto przy 20% brytyjskiego VAT?',
            a: 'Podziel kwotę brutto przez 1,20. Kwota podatku VAT stanowi dokładnie 1/6 ceny brutto (16,67%).',
          },
          {
            q: 'Jaki jest próg rejestracji do VAT w Wielkiej Brytanii?',
            a: 'Obowiązek rejestracji do brytyjskiego VAT (HMRC) powstaje po przekroczeniu £90 000 obrotu opodatkowanego w ciągu dowolnych 12 kolejnych miesięcy.',
          },
          {
            q: 'Czym różni się stawka 0% (zero-rated) od zwolnienia (exempt) w UK?',
            a: 'Sprzedaż zero-rated nadal uprawnia firmę do odliczania podatku naliczonego od kosztów, podczas gdy sprzedaż zwolniona (exempt) nie daje takiego prawa.',
          },
        ],
      },
    },
  },
  {
    key: 'poland',
    code: 'PL',
    standardRate: 23,
    reducedRates: [8, 5, 0],
    currency: 'PLN',
    localTaxName: 'Podatek od towarów i usług (VAT)',
    vatIdFormat: 'PL + 10 digits (NIP)',
    names: { en: 'Poland', de: 'Polen', pl: 'Polska' },
    seo: {
      en: {
        title: 'Poland VAT Calculator (23%, 8% & 5% PTU) — PLN | CalcLedger',
        description: 'Calculate Polish VAT at 23% standard, 8%, or 5% reduced rates in PLN or EUR. Accurate net-to-gross and gross-to-net invoice math.',
        h1: 'Poland VAT Calculator (23%, 8% & 5%)',
        subtitle: 'Instant net-to-gross and reverse VAT calculator for Poland with 23% standard, 8% reduced, and 5% super-reduced presets.',
        intro: 'Poland’s standard VAT rate is 23%, applied to most commercial goods and B2B services. Two reduced rates apply to priority sectors: 8% (construction/housing, hospitality, medical devices, transport) and 5% (basic food staples, printed books, e-books, and baby products).',
        rateNotes: [
          { rate: '23%', label: 'Standard rate', examples: 'General goods, IT & software services, consulting, electronics, fuel, marketing.' },
          { rate: '8%', label: 'Reduced rate', examples: 'Residential construction & renovation, hotels, passenger transport, pharmaceuticals, dining.' },
          { rate: '5%', label: 'Super-reduced rate', examples: 'Basic foodstuffs, printed books, e-books, agricultural staples, selected hygiene products.' },
        ],
        faqs: [
          {
            q: 'How do I extract 23% Polish VAT from a gross invoice total?',
            a: 'Divide the gross amount by 1.23 (Net = Gross ÷ 1.23). Subtract Net from Gross to get the exact 23% Polish VAT figure (about 18.70% of gross).',
          },
          {
            q: 'Which items qualify for Poland’s 5% and 8% VAT rates?',
            a: 'Basic food products and books are generally taxed at 5%, whereas housing construction, hotel stays, public transport, and restaurant food services typically use 8%.',
          },
          {
            q: 'What is Poland’s VAT ID format?',
            a: 'For EU cross-border transactions, Polish businesses use prefix PL followed by their 10-digit NIP tax identification number.',
          },
        ],
      },
      de: {
        title: 'MwSt Rechner Polen (23%, 8% & 5% VAT) — PLN & EUR | CalcLedger',
        description: 'Polnische Mehrwertsteuer (VAT) mit 23% Standardsatz, 8% oder 5% ermäßigtem Satz berechnen. Netto-Brutto-Rechner für PLN und EUR.',
        h1: 'MwSt-Rechner Polen (23 %, 8 % & 5 % VAT)',
        subtitle: 'Präziser Netto-Brutto-Rechner für die polnische Umsatzsteuer (VAT) mit 23 % Regelsteuersatz sowie 8 % und 5 % ermäßigten Sätzen.',
        intro: 'In Polen liegt der reguläre Mehrwertsteuersatz bei 23 %. Darüber hinaus gelten zwei ermäßigte Steuersätze: 8 % etwa für Wohnungsbau, Gastronomie, Hotels und Medikamente sowie 5 % für Grundnahrungsmittel, Bücher und E-Books.',
        rateNotes: [
          { rate: '23 %', label: 'Regelsteuersatz', examples: 'Allgemeine Waren, IT- und Beratungsleistungen, Elektronik, Marketing.' },
          { rate: '8 %', label: 'Ermäßigter Satz', examples: 'Wohnungsbau, Hotellerie, Gastronomie, Arzneimittel, Personenverkehr.' },
          { rate: '5 %', label: 'Stark ermäßigter Satz', examples: 'Grundnahrungsmittel, Bücher, E-Books, landwirtschaftliche Basisprodukte.' },
        ],
        faqs: [
          {
            q: 'Wie berechne ich Netto aus Brutto bei 23 % polnischer VAT?',
            a: 'Teilen Sie den Bruttobetrag durch 1,23 (Netto = Brutto ÷ 1,23). Die enthaltene polnische VAT entspricht rund 18,70 % des Bruttobetrags.',
          },
          {
            q: 'Wofür gelten in Polen die ermäßigten Sätze von 8 % und 5 %?',
            a: '5 % gelten vor allem für Grundnahrungsmittel und Bücher; 8 % unter anderem für Wohnungsbau, Hotellerie, Gastronomie und Arzneimittel.',
          },
          {
            q: 'Wie lautet das Format der polnischen USt-IdNr.?',
            a: 'Polnische Unternehmen verwenden im EU-Handel das Präfix PL gefolgt von der 10-stelligen Steuernummer NIP.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator VAT Polska (23%, 8% i 5%) — Netto Brutto | CalcLedger',
        description: 'Polski kalkulator VAT netto-brutto i brutto-netto dla stawek 23%, 8%, 5% i 0%. Szybkie wyliczenia do faktur w PLN, EUR i USD.',
        h1: 'Kalkulator VAT Polska (23%, 8% i 5%)',
        subtitle: 'Szybki kalkulator netto ↔ brutto dla polskich stawek podatku od towarów i usług: 23%, 8%, 5% oraz 0%.',
        intro: 'Podstawowa stawka podatku VAT w Polsce wynosi 23% i obejmuje większość towarów oraz usług B2B i B2C. Stawki obniżone to 8% (m.in. budownictwo mieszkaniowe, gastronomia, hotelarstwo, leki, transport) oraz 5% (podstawowa żywność, książki, e-booki).',
        rateNotes: [
          { rate: '23%', label: 'Stawka podstawowa', examples: 'Usługi IT i B2B, doradztwo, elektronika, odzież, paliwa, marketing, handel.' },
          { rate: '8%', label: 'Stawka obniżona', examples: 'Budownictwo społeczne/mieszkaniowe, gastronomia, noclegi, leki, transport osób.' },
          { rate: '5%', label: 'Stawka obniżona (preferencyjna)', examples: 'Podstawowe produkty spożywcze, książki drukowane i e-booki, wybrane artykuły dla niemowląt.' },
        ],
        faqs: [
          {
            q: 'Jak obliczyć kwotę netto z kwoty brutto przy stawce 23% VAT?',
            a: 'Podziel kwotę brutto przez 1,23 (Netto = Brutto ÷ 1,23). Różnica między kwotą brutto a netto daje dokładną kwotę podatku VAT (ok. 18,70% ceny brutto).',
          },
          {
            q: 'Jakie towary i usługi mają w Polsce 8% lub 5% VAT?',
            a: 'Stawka 5% dotyczy podstawowej żywności i książek, natomiast 8% obejmuje m.in. usługi gastronomiczne, hotelarskie, transport pasażerski, leki oraz wybrane roboty mieszkaniowe.',
          },
          {
            q: 'Kiedy w Polsce przysługuje zwolnienie podmiotowe z VAT?',
            a: 'Zwolnienie podmiotowe przysługuje przedsiębiorcom, których wartość sprzedaży opodatkowanej nie przekroczyła ustawowego limitu rocznego (z wyłączeniem branż wyłączonych ze zwolnienia, np. doradztwa).',
          },
        ],
      },
    },
  },
  {
    key: 'france',
    code: 'FR',
    standardRate: 20,
    reducedRates: [10, 5.5, 2.1],
    currency: 'EUR',
    localTaxName: 'Taxe sur la valeur ajoutée (TVA)',
    vatIdFormat: 'FR + 2 chars + 9 digits',
    names: { en: 'France', de: 'Frankreich', pl: 'Francja' },
    seo: {
      en: {
        title: 'France VAT Calculator (20%, 10% & 5.5% TVA) | CalcLedger',
        description: 'Calculate French TVA (HT to TTC and TTC to HT) at 20% standard, 10%, 5.5%, or 2.1% rates. Instant EUR VAT breakdown.',
        h1: 'France VAT Calculator (20%, 10% & 5.5% TVA)',
        subtitle: 'Convert French prices between HT (net) and TTC (gross) with 20% standard, 10% intermediate, 5.5% reduced, and 2.1% super-reduced TVA presets.',
        intro: 'In France, VAT is called TVA (Taxe sur la valeur ajoutée), with net prices written as HT (Hors Taxes) and gross prices as TTC (Toutes Taxes Comprises). The standard rate is 20%, complemented by 10%, 5.5%, and 2.1% reduced tiers.',
        rateNotes: [
          { rate: '20%', label: 'Standard rate (Taux normal)', examples: 'Most goods, digital services, consulting, electronics, apparel.' },
          { rate: '10%', label: 'Intermediate rate (Taux intermédiaire)', examples: 'Restaurants, hotel accommodation, passenger transport, home renovations.' },
          { rate: '5.5%', label: 'Reduced rate (Taux réduit)', examples: 'Essential groceries, books, energy subscriptions, cinema & live events.' },
        ],
        faqs: [
          {
            q: 'What do HT and TTC mean on French invoices?',
            a: 'HT (Hors Taxes) means net price excluding TVA, while TTC (Toutes Taxes Comprises) means gross price including TVA.',
          },
          {
            q: 'How do I convert TTC to HT at 20% French TVA?',
            a: 'Divide the TTC (gross) amount by 1.20 to obtain the HT (net) value. The TVA amount is TTC minus HT.',
          },
          {
            q: 'When does France’s 2.1% super-reduced TVA rate apply?',
            a: 'The 2.1% rate applies narrowly to reimbursable prescription medicines, registered press publications, and selected live theatre performances.',
          },
        ],
      },
      de: {
        title: 'MwSt Rechner Frankreich (20%, 10% & 5,5% TVA) | CalcLedger',
        description: 'Französische TVA (HT zu TTC und TTC zu HT) mit 20% Standardsatz sowie 10%, 5,5% und 2,1% berechnen. Schnell und kostenlos in EUR.',
        h1: 'MwSt-Rechner Frankreich (20 %, 10 % & 5,5 % TVA)',
        subtitle: 'Rechnen Sie französische Preise zwischen HT (Netto) und TTC (Brutto) für alle TVA-Sätze (20 %, 10 %, 5,5 %, 2,1 %) um.',
        intro: 'In Frankreich heißt die Mehrwertsteuer TVA (Taxe sur la valeur ajoutée). Nettopreise werden als HT (Hors Taxes) und Bruttopreise als TTC (Toutes Taxes Comprises) ausgewiesen. Der Normalsatz beträgt 20 %, ergänzt um 10 %, 5,5 % und 2,1 %.',
        rateNotes: [
          { rate: '20 %', label: 'Taux normal (Normalsatz)', examples: 'Standardwaren, Elektronik, Beratung, Software und Dienstleistungen.' },
          { rate: '10 %', label: 'Taux intermédiaire', examples: 'Gastronomie, Hotellerie, Personenverkehr, bestimmte Renovierungen.' },
          { rate: '5,5 %', label: 'Taux réduit', examples: 'Grundnahrungsmittel, Bücher, Eintrittskarten für Kulturveranstaltungen.' },
        ],
        faqs: [
          {
            q: 'Was bedeuten HT und TTC auf französischen Rechnungen?',
            a: 'HT (Hors Taxes) entspricht dem Nettobetrag ohne Steuer, während TTC (Toutes Taxes Comprises) den Bruttobetrag inklusive TVA bezeichnet.',
          },
          {
            q: 'Wie berechne ich HT aus TTC bei 20 % französischer TVA?',
            a: 'Teilen Sie den TTC-Betrag durch 1,20, um den Nettobetrag (HT) zu ermitteln. Die enthaltene TVA beträgt genau ein Sechstel des TTC-Betrags.',
          },
          {
            q: 'Wofür gilt der Sondersatz von 2,1 % in Frankreich?',
            a: 'Der Satz von 2,1 % gilt u. a. für erstattungsfähige Arzneimittel sowie anerkannte Pressepublikationen.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator VAT Francja (20%, 10% i 5,5% TVA) | CalcLedger',
        description: 'Oblicz francuski podatek VAT (TVA) dla stawek 20%, 10%, 5,5% i 2,1%. Błyskawiczne przeliczanie HT (netto) i TTC (brutto) w EUR.',
        h1: 'Kalkulator VAT Francja (20%, 10% i 5,5% TVA)',
        subtitle: 'Przeliczaj francuskie faktury między HT (netto) i TTC (brutto) ze stawkami TVA: 20%, 10%, 5,5% i 2,1%.',
        intro: 'We Francji podatek VAT nosi nazwę TVA (Taxe sur la valeur ajoutée). Kwota netto oznaczana jest skrótem HT (Hors Taxes), a kwota brutto TTC (Toutes Taxes Comprises). Stawka podstawowa to 20%, obok której działają progi 10%, 5,5% oraz 2,1%.',
        rateNotes: [
          { rate: '20%', label: 'Stawka podstawowa (Taux normal)', examples: 'Większość towarów, elektronika, usługi cyfrowe, B2B i konsulting.' },
          { rate: '10%', label: 'Stawka pośrednia', examples: 'Restauracje, hotele, transport pasażerski, remonty lokali mieszkalnych.' },
          { rate: '5,5%', label: 'Stawka obniżona', examples: 'Podstawowe artykuły spożywcze, książki, bilety kulturalne, wybrane media.' },
        ],
        faqs: [
          {
            q: 'Co oznaczają skróty HT i TTC na francuskiej fakturze?',
            a: 'HT (Hors Taxes) to kwota netto bez podatku, a TTC (Toutes Taxes Comprises) to kwota brutto z wliczonym podatkiem TVA.',
          },
          {
            q: 'Jak przeliczyć TTC na HT przy 20% francuskiego TVA?',
            a: 'Podziel kwotę TTC (brutto) przez 1,20, aby otrzymać dokładną kwotę HT (netto). Podatek TVA to różnica TTC − HT.',
          },
          {
            q: 'Czego dotyczy superobniżona stawka 2,1% TVA we Francji?',
            a: 'Stawka 2,1% obejmuje m.in. leki refundowane, prasę spełniającą kryteria ustawowe oraz wybrane przedstawienia teatralne.',
          },
        ],
      },
    },
  },
  {
    key: 'netherlands',
    code: 'NL',
    standardRate: 21,
    reducedRates: [9, 0],
    currency: 'EUR',
    localTaxName: 'Belasting over de toegevoegde waarde (BTW)',
    vatIdFormat: 'NL + 9 digits + B + 2 digits',
    names: { en: 'Netherlands', de: 'Niederlande', pl: 'Holandia' },
    seo: {
      en: {
        title: 'Netherlands VAT Calculator (21% & 9% BTW) | CalcLedger',
        description: 'Calculate Dutch BTW (Omzetbelasting) at 21% standard or 9% reduced rate. Convert exclusief BTW to inclusief BTW instantly in EUR.',
        h1: 'Netherlands VAT Calculator (21% & 9% BTW)',
        subtitle: 'Instant net-to-gross (excl. BTW ↔ incl. BTW) calculator for Dutch 21% standard and 9% reduced VAT rates.',
        intro: 'In the Netherlands, VAT is known as BTW (Belasting over de toegevoegde waarde). The general rate is 21% for most products and commercial services, while the 9% reduced rate applies to groceries, books, medicines, hairdressers, and passenger transport.',
        rateNotes: [
          { rate: '21%', label: 'Standard rate (Algemeen tarief)', examples: 'Retail goods, SaaS, consulting, electronics, clothing, logistics.' },
          { rate: '9%', label: 'Reduced rate (Verlaagd tarief)', examples: 'Food & non-alcoholic drinks, books, medicines, hairdressing, bicycle repairs, public transport.' },
          { rate: '0%', label: 'Zero rate (Nultarief)', examples: 'Intra-EU B2B exports and international freight outside the EU.' },
        ],
        faqs: [
          {
            q: 'How do I remove 21% Dutch BTW from a gross price?',
            a: 'Divide the gross (inclusief BTW) price by 1.21 to get the net (exclusief BTW) amount. The BTW portion is roughly 17.36% of the gross total.',
          },
          {
            q: 'What is covered by the 9% reduced BTW rate in the Netherlands?',
            a: 'The 9% tariff covers groceries, water, books, periodicals, medicines, passenger transport, and selected labor-intensive repair services such as bicycle and shoe repairs.',
          },
          {
            q: 'What does a Dutch VAT ID (btw-identificatienummer) look like?',
            a: 'Dutch VAT IDs follow the pattern NL + 9 digits + B + 2 digits (e.g., NL123456789B01).',
          },
        ],
      },
      de: {
        title: 'MwSt Rechner Niederlande (21% & 9% BTW) | CalcLedger',
        description: 'Niederländische BTW mit 21% Standardsatz oder 9% ermäßigtem Satz berechnen. Schnell zwischen excl. BTW (Netto) und incl. BTW (Brutto) umrechnen.',
        h1: 'MwSt-Rechner Niederlande (21 % & 9 % BTW)',
        subtitle: 'Sofortiger Netto-Brutto-Rechner für die niederländische BTW mit 21 % Regelsteuersatz und 9 % ermäßigtem Steuersatz.',
        intro: 'In den Niederlanden heißt die Mehrwertsteuer BTW (Omzetbelasting). Der reguläre Steuersatz beträgt 21 %, während für Lebensmittel, Bücher, Arzneimittel, Friseure und Personenverkehr der ermäßigte Satz von 9 % gilt.',
        rateNotes: [
          { rate: '21 %', label: 'Algemeen tarief (Normalsatz)', examples: 'Standardwaren, Elektronik, Software, Beratung und gewerbliche Leistungen.' },
          { rate: '9 %', label: 'Verlaagd tarief (Ermäßigt)', examples: 'Lebensmittel, Bücher, Medikamente, ÖPNV, Friseur- und kleine Reparaturdienste.' },
          { rate: '0 %', label: 'Nultarief', examples: 'Innergemeinschaftliche B2B-Lieferungen und Exporte in Drittländer.' },
        ],
        faqs: [
          {
            q: 'Wie rechne ich 21 % niederländische BTW aus dem Bruttobetrag heraus?',
            a: 'Teilen Sie den Bruttobetrag (incl. BTW) durch 1,21, um den Nettobetrag (excl. BTW) zu erhalten.',
          },
          {
            q: 'Wann gilt in den Niederlanden der 9-%-BTW-Satz?',
            a: 'Der 9-%-Satz gilt u. a. für Lebensmittel, alkoholfreie Getränke, Bücher, Arzneimittel, öffentlichen Verkehr und ausgewählte Handwerksleistungen wie Fahrrad- oder Schuhreparaturen.',
          },
          {
            q: 'Wie ist eine niederländische BTW-Nummer aufgebaut?',
            a: 'Das Format lautet NL + 9 Ziffern + B + 2 Ziffern (z. B. NL123456789B01).',
          },
        ],
      },
      pl: {
        title: 'Kalkulator VAT Holandia (21% i 9% BTW) | CalcLedger',
        description: 'Oblicz holenderski podatek VAT (BTW) dla stawki podstawowej 21% i obniżonej 9%. Przeliczanie excl. BTW (netto) na incl. BTW (brutto).',
        h1: 'Kalkulator VAT Holandia (21% i 9% BTW)',
        subtitle: 'Szybkie przeliczanie netto (excl. BTW) i brutto (incl. BTW) dla holenderskich stawek VAT 21% oraz 9%.',
        intro: 'W Holandii podatek VAT funkcjonuje pod nazwą BTW (Belasting over de toegevoegde waarde). Podstawowa stawka to 21%, natomiast obniżona 9% obejmuje żywność, książki, leki, transport publiczny oraz wybrane drobne usługi naprawcze.',
        rateNotes: [
          { rate: '21%', label: 'Stawka podstawowa (Algemeen)', examples: 'Większość towarów, e-commerce, usługi IT, konsulting i elektronika.' },
          { rate: '9%', label: 'Stawka obniżona (Verlaagd)', examples: 'Żywność, woda, książki, leki, fryzjerstwo, naprawa rowerów, transport pasażerski.' },
          { rate: '0%', label: 'Stawka zerowa (Nultarief)', examples: 'Dostawy wewnątrzwspólnotowe B2B oraz eksport poza UE.' },
        ],
        faqs: [
          {
            q: 'Jak wyliczyć kwotę netto z holenderskiej ceny brutto (21% BTW)?',
            a: 'Podziel kwotę brutto (incl. BTW) przez 1,21, aby uzyskać kwotę netto (excl. BTW). Sam podatek BTW to ok. 17,36% ceny brutto.',
          },
          {
            q: 'Co obejmuje stawka 9% BTW w Holandii?',
            a: 'Stawka 9% dotyczy artykułów spożywczych, książek, leków, transportu publicznego oraz wybranych usług pracochłonnych, takich jak naprawa rowerów czy fryzjerstwo.',
          },
          {
            q: 'Jak wygląda holenderski numer VAT-UE (btw-id)?',
            a: 'Holenderski numer VAT-UE składa się z prefiksu NL, 9 cyfr, litery B i 2 cyfr (np. NL123456789B01).',
          },
        ],
      },
    },
  },
  {
    key: 'spain',
    code: 'ES',
    standardRate: 21,
    reducedRates: [10, 4, 0],
    currency: 'EUR',
    localTaxName: 'Impuesto sobre el Valor Añadido (IVA)',
    vatIdFormat: 'ES + 9 alphanumeric chars',
    names: { en: 'Spain', de: 'Spanien', pl: 'Hiszpania' },
    seo: {
      en: {
        title: 'Spain VAT Calculator (21%, 10% & 4% IVA) | CalcLedger',
        description: 'Calculate Spanish IVA at 21% general, 10% reduced, or 4% super-reduced rate. Instant EUR net-to-gross and reverse IVA math.',
        h1: 'Spain VAT Calculator (21%, 10% & 4% IVA)',
        subtitle: 'Calculate Spanish Impuesto sobre el Valor Añadido (IVA) across the 21% standard, 10% reduced, and 4% super-reduced tiers.',
        intro: 'Mainland Spain and the Balearic Islands charge IVA (Impuesto sobre el Valor Añadido) at a 21% general rate, a 10% reduced rate (hospitality, transport, most foods), and a 4% super-reduced rate (staple foods, books, essential medicines). Note that the Canary Islands use IGIC instead of IVA.',
        rateNotes: [
          { rate: '21%', label: 'General rate (Tipo general)', examples: 'Electronics, clothing, consulting, SaaS, commercial goods and services.' },
          { rate: '10%', label: 'Reduced rate (Tipo reducido)', examples: 'Hotels, restaurants, passenger transport, most food products, new residential housing.' },
          { rate: '4%', label: 'Super-reduced rate (Tipo superreducido)', examples: 'Staple foods (bread, milk, fruit, vegetables), printed & digital books, medicines.' },
        ],
        faqs: [
          {
            q: 'How do I calculate net price before 21% Spanish IVA?',
            a: 'Divide the gross total by 1.21 (Net = Gross ÷ 1.21). Subtract Net from Gross to get the exact 21% IVA amount.',
          },
          {
            q: 'Does Spanish IVA apply in the Canary Islands?',
            a: 'No. The Canary Islands sit outside the EU VAT territory and apply their own indirect tax called IGIC (general rate 7%) rather than mainland IVA.',
          },
          {
            q: 'What qualifies for the 4% super-reduced IVA in Spain?',
            a: 'Essential staple foods (bread, flour, milk, eggs, fruits, vegetables), books, newspapers, and human prescription medicines qualify for 4% IVA.',
          },
        ],
      },
      de: {
        title: 'MwSt Rechner Spanien (21%, 10% & 4% IVA) | CalcLedger',
        description: 'Spanische Mehrwertsteuer (IVA) mit 21% Normalsatz, 10% ermäßigtem oder 4% stark ermäßigtem Satz berechnen. Netto-Brutto-Rechner in EUR.',
        h1: 'MwSt-Rechner Spanien (21 %, 10 % & 4 % IVA)',
        subtitle: 'Berechnen Sie die spanische IVA präzise für den Normalsatz von 21 %, den ermäßigten Satz von 10 % und den Sondersatz von 4 %.',
        intro: 'Auf dem spanischen Festland und den Balearen gilt die IVA mit einem allgemeinen Steuersatz von 21 %. Daneben bestehen 10 % für Gastronomie, Hotels und Verkehr sowie 4 % für Grundnahrungsmittel, Bücher und Medikamente. Auf den Kanaren gilt stattdessen die IGIC.',
        rateNotes: [
          { rate: '21 %', label: 'Tipo general (Normalsatz)', examples: 'Elektronik, Kleidung, Beratung, Software, reguläre Dienstleistungen.' },
          { rate: '10 %', label: 'Tipo reducido (Ermäßigt)', examples: 'Gastronomie, Hotellerie, Personenverkehr, die meisten Lebensmittel.' },
          { rate: '4 %', label: 'Tipo superreducido', examples: 'Grundnahrungsmittel (Brot, Milch, Obst, Gemüse), Bücher, Medikamente.' },
        ],
        faqs: [
          {
            q: 'Wie rechne ich 21 % spanische IVA aus einem Bruttobetrag heraus?',
            a: 'Teilen Sie den Bruttobetrag durch 1,21, um den Nettobetrag (Base imponible) zu bestimmen.',
          },
          {
            q: 'Gilt die spanische IVA auch auf den Kanarischen Inseln?',
            a: 'Nein. Auf den Kanaren gilt statt der IVA eine eigene indirekte Steuer namens IGIC (Regelsatz 7 %).',
          },
          {
            q: 'Welche Produkte unterliegen in Spanien dem 4-%-Satz?',
            a: 'Unter anderem Grundnahrungsmittel wie Brot, Milch, Eier, Obst und Gemüse sowie Bücher, Zeitungen und zugelassene Medikamente.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator VAT Hiszpania (21%, 10% i 4% IVA) | CalcLedger',
        description: 'Oblicz hiszpański VAT (IVA) dla stawek 21%, 10% i 4%. Szybkie przeliczanie netto i brutto w EUR dla faktur z Hiszpanii.',
        h1: 'Kalkulator VAT Hiszpania (21%, 10% i 4% IVA)',
        subtitle: 'Błyskawiczny kalkulator hiszpańskiego podatku IVA w EUR dla stawki podstawowej 21%, obniżonej 10% oraz superobniżonej 4%.',
        intro: 'W kontynentalnej Hiszpanii i na Balearach obowiązuje podatek IVA w stawkach: 21% (podstawowa), 10% (obniżona — m.in. hotele, restauracje, transport) oraz 4% (podstawowa żywność, książki, leki). Na Wyspach Kanaryjskich zamiast IVA stosuje się lokalny podatek IGIC.',
        rateNotes: [
          { rate: '21%', label: 'Stawka podstawowa (Tipo general)', examples: 'Elektronika, odzież, usługi IT, konsulting, towary standardowe.' },
          { rate: '10%', label: 'Stawka obniżona (Tipo reducido)', examples: 'Hotele, gastronomia, transport pasażerski, większość produktów spożywczych.' },
          { rate: '4%', label: 'Stawka superobniżona', examples: 'Chleb, mleko, owoce, warzywa, książki i prasa, leki.' },
        ],
        faqs: [
          {
            q: 'Jak obliczyć netto z ceny brutto przy 21% hiszpańskiego IVA?',
            a: 'Podziel kwotę brutto przez 1,21 (Netto = Brutto ÷ 1,21). Różnica między kwotą brutto a netto to wartość podatku IVA.',
          },
          {
            q: 'Czy hiszpański IVA obowiązuje na Wyspach Kanaryjskich?',
            a: 'Nie — Wyspy Kanaryjskie są poza unijnym obszarem VAT i stosują lokalny podatek IGIC (stawka podstawowa 7%).',
          },
          {
            q: 'Co obejmuje najniższa stawka 4% IVA w Hiszpanii?',
            a: 'Podstawowe produkty spożywcze (pieczywo, mleko, jajka, warzywa, owoce), książki oraz leki przeznaczone dla ludzi.',
          },
        ],
      },
    },
  },
  {
    key: 'italy',
    code: 'IT',
    standardRate: 22,
    reducedRates: [10, 5, 4],
    currency: 'EUR',
    localTaxName: 'Imposta sul Valore Aggiunto (IVA)',
    vatIdFormat: 'IT + 11 digits (Partita IVA)',
    names: { en: 'Italy', de: 'Italien', pl: 'Włochy' },
    seo: {
      en: {
        title: 'Italy VAT Calculator (22%, 10%, 5% & 4% IVA) | CalcLedger',
        description: 'Calculate Italian IVA at 22% standard, 10%, 5%, or 4% reduced rates. Fast EUR net-to-gross and reverse IVA calculation.',
        h1: 'Italy VAT Calculator (22%, 10%, 5% & 4% IVA)',
        subtitle: 'Accurate net-to-gross and gross-to-net calculator for Italian Imposta sul Valore Aggiunto (IVA) with 22%, 10%, 5%, and 4% presets.',
        intro: 'Italy applies a 22% standard VAT (IVA) rate on most commercial transactions, alongside three reduced tiers: 10% for hospitality, electricity, and medicines, 5% for selected social/health services and herbs, and 4% for staple foods, books, and e-books.',
        rateNotes: [
          { rate: '22%', label: 'Standard rate (Aliquota ordinaria)', examples: 'General merchandise, software, consulting, electronics, apparel.' },
          { rate: '10%', label: 'Reduced rate', examples: 'Hotels, restaurants, passenger transport, medicines, residential utilities.' },
          { rate: '4% / 5%', label: 'Super-reduced rates', examples: '4%: bread, pasta, milk, fruit, books, e-books; 5%: selected care services & culinary herbs.' },
        ],
        faqs: [
          {
            q: 'How do I remove 22% Italian IVA from a gross price?',
            a: 'Divide the gross total by 1.22 (Net = Gross ÷ 1.22). Subtract Net from Gross to find the exact 22% Italian IVA portion (approx. 18.03% of gross).',
          },
          {
            q: 'What is an Italian Partita IVA format?',
            a: 'An Italian VAT number (Partita IVA) consists of the prefix IT followed by 11 digits.',
          },
          {
            q: 'Why does Italy have both 4% and 5% IVA rates?',
            a: 'Italy retains a historic 4% rate for basic groceries, books, and newspapers, and introduced a 5% tier for specific health/social cooperatives and selected food items.',
          },
        ],
      },
      de: {
        title: 'MwSt Rechner Italien (22%, 10%, 5% & 4% IVA) | CalcLedger',
        description: 'Italienische Mehrwertsteuer (IVA) mit 22% Standardsatz sowie 10%, 5% und 4% berechnen. Sofortiger Netto-Brutto-Rechner in EUR.',
        h1: 'MwSt-Rechner Italien (22 %, 10 %, 5 % & 4 % IVA)',
        subtitle: 'Berechnen Sie die italienische IVA für alle gültigen Steuersätze (22 %, 10 %, 5 % und 4 %) schnell und übersichtlich in EUR.',
        intro: 'In Italien beträgt der reguläre Mehrwertsteuersatz (IVA) 22 %. Daneben gelten drei ermäßigte Sätze: 10 % für Gastronomie, Hotels und Arzneimittel, 5 % für ausgewählte Sozialleistungen und Kräuter sowie 4 % für Grundnahrungsmittel, Bücher und E-Books.',
        rateNotes: [
          { rate: '22 %', label: 'Aliquota ordinaria (Normalsatz)', examples: 'Allgemeine Waren, Elektronik, Beratung, Software, Dienstleistungen.' },
          { rate: '10 %', label: 'Ermäßigter Satz', examples: 'Hotels, Restaurants, Personenverkehr, Arzneimittel, Wohnungsstrom.' },
          { rate: '4 % / 5 %', label: 'Stark ermäßigte Sätze', examples: '4 %: Brot, Pasta, Milch, Bücher, E-Books; 5 %: ausgewählte Pflegeleistungen & Kräuter.' },
        ],
        faqs: [
          {
            q: 'Wie rechne ich 22 % italienische IVA aus dem Bruttobetrag heraus?',
            a: 'Teilen Sie den Bruttobetrag durch 1,22, um den Nettobetrag (Imponibile) zu berechnen. Die IVA entspricht rund 18,03 % des Bruttobetrags.',
          },
          {
            q: 'Wie sieht eine italienische Partita IVA aus?',
            a: 'Die italienische USt-IdNr. (Partita IVA) besteht aus dem Präfix IT gefolgt von genau 11 Ziffern.',
          },
          {
            q: 'Wofür gilt in Italien der 4-%-Satz?',
            a: 'Der 4-%-Satz gilt u. a. für Grundnahrungsmittel (Brot, Pasta, Obst, Milch), Bücher, E-Books und Zeitungen.',
          },
        ],
      },
      pl: {
        title: 'Kalkulator VAT Włochy (22%, 10%, 5% i 4% IVA) | CalcLedger',
        description: 'Oblicz włoski podatek VAT (IVA) dla stawki podstawowej 22% oraz obniżonych 10%, 5% i 4%. Natychmiastowe przeliczanie netto i brutto w EUR.',
        h1: 'Kalkulator VAT Włochy (22%, 10%, 5% i 4% IVA)',
        subtitle: 'Przeliczaj kwoty netto i brutto dla włoskiego podatku IVA ze stawkami 22%, 10%, 5% oraz 4%.',
        intro: 'We Włoszech stawka podstawowa podatku VAT (IVA) wynosi 22%. Obok niej funkcjonują trzy progi obniżone: 10% (hotelarstwo, gastronomia, leki, energia domowa), 5% (wybrane usługi opiekuńcze i zioła) oraz 4% (podstawowa żywność, książki, e-booki).',
        rateNotes: [
          { rate: '22%', label: 'Stawka podstawowa (Ordinaria)', examples: 'Większość towarów, elektronika, usługi IT, konsulting i handel B2B.' },
          { rate: '10%', label: 'Stawka obniżona', examples: 'Hotele, restauracje, transport pasażerski, leki, energia dla domów.' },
          { rate: '4% / 5%', label: 'Stawki superobniżone', examples: '4%: pieczywo, makaron, mleko, owoce, książki i e-booki; 5%: wybrane usługi społeczne i zioła.' },
        ],
        faqs: [
          {
            q: 'Jak obliczyć kwotę netto z włoskiej faktury brutto (22% IVA)?',
            a: 'Podziel kwotę brutto przez 1,22 (Netto = Brutto ÷ 1,22). Kwota podatku IVA to ok. 18,03% ceny brutto.',
          },
          {
            q: 'Jaki format ma włoski numer VAT-UE (Partita IVA)?',
            a: 'Włoska Partita IVA składa się z prefiksu IT oraz 11 cyfr.',
          },
          {
            q: 'Dlaczego we Włoszech działają jednocześnie stawki 4% i 5%?',
            a: 'Stawka 4% obejmuje podstawową żywność, książki i prasę, natomiast 5% wprowadzono dla określonych usług społecznych/opiekuńczych oraz wybranych produktów spożywczych.',
          },
        ],
      },
    },
  },
];

export function getVatCountry(key) {
  return VAT_COUNTRIES.find((c) => c.key === key);
}
