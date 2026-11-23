# CalcLedger — Kompletny Blueprint Projektu & Playbook Niszowy

> **Jak używać tego pliku w przyszłości:**  
> Możesz wgrać ten plik do nowej rozmowy z AI jako wzorzec referencyjny z poleceniem:  
> *„Zbuduj mi nowy serwis w niszy [X] na dokładnie takiej samej architekturze zero-dependency + SEO + Cloudflare + AdSense jak w załączonym pliku `PROJECT_BLUEPRINT.md`, tylko zamiast ogólnych kalkulatorów finansowych zrób narzędzia dla [X].”*

---

## 1. Metryczka gotowego projektu (co już powstało)

- **Marka / Domena:** CalcLedger — `https://calcledger.org`
- **Repozytorium GitHub:** `kazmierczakeryk2002-afk/calcledger` (gałąź `main`)
- **Kontakt:** `contact@calcledger.org` (Cloudflare Email Routing → Gmail)
- **Hosting:** Cloudflare Workers Static Assets (`wrangler.jsonc` → `./dist`, automatyczny deploy z `main`, darmowy SSL/HTTPS)
- **Skala projektu:** **105 statycznych podstron HTML** (35 EN + 35 DE + 35 PL) + `404.html` + `sitemap.xml` (420 tagów `xhtml:link`) + `robots.txt` + `ads.txt` + `_headers`
- **Zależności npm:** **0** (czysty Node.js ESM + HTML + Vanilla CSS + Vanilla JS)
- **Czas budowania (`npm run build`):** ~80 ms
- **Audyt techniczny (`npm run check-seo`):** 105/105 unikalnych `<title>` i `<meta description>`, 288 zwalidowanych bloków JSON-LD, 0 błędów, 0 ostrzeżeń.

---

## 2. Architektura techniczna (wzorzec do kopiowania pod nowe nisze)

```text
/
├── package.json                  # 0 zależności; scripts: build, check-seo, serve, verify
├── wrangler.jsonc                # Cloudflare Workers Static Assets (directory: "./dist", 404-page)
├── src/
│   ├── config.js                 # Domena, marka, e-mail, waluty, adsenseClientId + sloty zero-CLS
│   ├── data/
│   │   ├── routes.js             # Mapa slugów 1:1 (EN/DE/PL) + generator canonical & hreflang
│   │   ├── i18n.js               # Helpery językowe + bezpieczne escapowanie HTML i JSON-LD
│   │   ├── i18n-en.js            # Słownik EN (UI, treści, FAQ, strony prawne)
│   │   ├── i18n-de.js            # Słownik DE (w tym Impressum / DSGVO)
│   │   ├── i18n-pl.js            # Słownik PL (w tym RODO)
│   │   ├── vat-countries.js      # Programmatic SEO #1 (15 krajów VAT)
│   │   ├── marketplaces.js       # Programmatic SEO #2 (6 platform: Etsy, Amazon FBA, eBay, Shopify, Upwork, Allegro)
│   │   └── payment-providers.js  # Programmatic SEO #3 (PayPal, Stripe)
│   ├── templates/
│   │   ├── layout.js             # Główna ramka HTML: SEO head, Consent Mode v2, AdSense, JSON-LD, header/footer
│   │   ├── home.js               # Strona główna + 404
│   │   ├── vat.js                # Kalkulator VAT + 15 podstron krajowych
│   │   ├── marketplace.js        # Kalkulator prowizji marketplace + 6 podstron platform
│   │   ├── payment.js            # Kalkulator PayPal/Stripe (forward + reverse)
│   │   ├── roas.js               # Kalkulator ROAS <-> ACOS + tabela referencyjna
│   │   ├── margin.js             # Kalkulator Marża <-> Narzut + tabela referencyjna
│   │   ├── freelance.js          # Kalkulator stawki godzinowej i dniówki B2B
│   │   ├── compound.js           # Kalkulator procentu składanego + wykres SVG + tabela rok po roku
│   │   └── legal.js              # About, Privacy, Terms/Impressum, Contact (mailto bez trackerów)
│   └── assets/
│       ├── css/styles.css        # Jasny design finansowy (Vanilla CSS, tabular-nums, zero-CLS, mobile-first)
│       ├── js/app.js             # Formatowanie walut, Consent Mode v2, URL state sync, kopiowanie, toast
│       ├── js/calculators.js     # Logika 7 kalkulatorów 100% po stronie przeglądarki
│       └── img/favicon.svg       # Minimalistyczne logo SVG
└── scripts/
    ├── build.js                  # Generator statyczny -> dist/
    ├── check-seo.js              # Automatyczny audytor SEO, hreflang, JSON-LD i martwych linków
    └── serve.js                  # Lokalny serwer podglądu (bez zależności)
```

### Kluczowe zasady techniczne, które się sprawdziły:
1. **Zero frameworków i zero backendu:** brak błędów zależności po roku, błyskawiczny LCP/INP (Core Web Vitals 99–100/100), hosting za 0 zł na Cloudflare.
2. **Stan narzędzia w parametrach URL (`?cur=EUR&...`):** użytkownik może skopiować link z gotowym wyliczeniem i wysłać klientowi/wspólnikowi — to napędza naturalne udostępnienia i powroty.
3. **Pełna dwukierunkowa macierz `hreflang`:** każda podstrona EN/DE/PL ma zlokalizowany slug (np. `/vat-calculator/germany/`, `/de/mwst-rechner/deutschland/`, `/pl/kalkulator-vat/niemcy/`), `x-default` wskazujący na EN i symetryczne linki w HTML oraz w `sitemap.xml`.
4. **Google Consent Mode v2 + AdSense bez pustych boksów:**
   - Domyślny stan `denied` dla `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` przed skryptem AdSense.
   - Jedna zmienna `adsenseClientId` w `src/config.js` automatycznie włącza: `<meta name="google-adsense-account">`, skrypt `adsbygoogle.js` i plik `dist/ads.txt`.
   - Ręczne sloty zero-CLS pokazują się dopiero po wpisaniu `data-ad-slot` (żadnych brzydkich pustych ramek podczas weryfikacji AdSense!).
5. **Automatyczny strażnik jakości (`npm run check-seo`):** blokuje deploy, jeśli jakakolwiek strona ma duplikat `<title>`, zły `canonical`, niesymetryczny `hreflang`, błędny JSON-LD albo martwy link wewnętrzny.

---

## 3. Checklista wdrożeniowa + pułapki, które już rozwiązaliśmy

Gdy będziesz odpalać kolejną domenę z iPhona:

1. **GitHub → Cloudflare Workers Static Assets:**
   - Zawsze dodaj plik `wrangler.jsonc` z bezpieczną, przeszłą datą `compatibility_date` (np. `"2025-09-01"`), `assets.directory: "./dist"` i `not_found_handling: "404-page"`.
   - Build command: `npm run build` | Deploy command: `npx wrangler deploy`.
2. **Domena + przekierowanie `www` → root (`301`):**
   - W DNS dodaj `CNAME` `www` → `twojadomena.org` (Proxied).
   - W **Rules → Redirect Rules** (Wildcard pattern): `https://www.twojadomena.org/*` → `https://twojadomena.org/${1}` (uwaga na iPhonie: wpisuj `{1}` ręcznie z klawiatury, bo kopiowanie potrafi zamienić nawiasy na `%7B1%7D`!). Zaznacz `Preserve query string`.
3. **Darmowa poczta `contact@twojadomena.org` (Cloudflare Email Routing):**
   - Twój prywatny Gmail dodajesz w **Destination addresses** (i klikasz link potwierdzający w mailu).
   - Adres `contact@twojadomena.org` tworzysz w zakładce **Routing rules → Custom addresses** (NIE w Destination addresses!).
   - Test wysyłki rób z **innego** maila niż docelowy Gmail (Gmail ukrywa w Odebranych maile wysłane „do samego siebie”).
4. **Indeksacja (Google Search Console + Bing):**
   - W usłudze typu **Domena** w GSC podawaj pełny URL mapy witryny z `https://` (`https://twojadomena.org/sitemap.xml`).
   - W Bing Webmaster Tools użyj **Import from Google Search Console** (1 kliknięcie).
5. **Katalogi i promocja:**
   - **AlternativeTo** odrzuca proste zestawy kalkulatorów — nie trać na nie czasu.
   - Działają: SaaSHub, Product Hunt, Indie Hackers, MicroLaunch, SimpleLister, profil GitHub + naturalne odpowiedzi w świeżych wątkach na Reddicie (bez myślników `—`, emotek i korpo-słów).

---

## 4. Dlaczego ogólne kalkulatory są zatłoczone — i jak znaleźć prawdziwą niszę, której AI nie podpowie tysiącom ludzi

Gdy ktoś wpisze w ChatGPT/Claude *„daj mi pomysły na micro-tools pod AdSense”*, dostaje w kółko tę samą listę: kalkulator VAT, BMI, kredytowy, procent składany, konwerter PDF, generator QR, licznik słów. Tysiące ludzi robi dokładnie te same strony.

**Gdzie leżą pieniądze i wolne miejsce w Google?**  
Tam, gdzie **AI nie zagląda domyślnie**, bo temat jest:
- „nudny” / branżowy / techniczny / fizyczny,
- lokalny lub związany z konkretnym przepisem w 1–2 krajach (np. prawo PL/DE/AT/CH),
- bolesny w codziennej pracy specjalistów, rzemieślników albo hobbystów, gdzie dziś na 1. miejscu w Google wiszą brzydkie strony z 2009 roku albo dziurawe arkusze Excela.

### 4 filtry dobrej niszy (zanim napiszesz linijkę kodu):
1. **Brzydka konkurencja w TOP 5 Google:** wpisz zapytanie w Google — jeśli w TOP 5 są stare fora, PDF-y z urzędów albo strony nieczytelne na telefonie → **ZŁOTO**.
2. **Powtarzalny problem z parametrami:** użytkownik musi wracać i zmieniać 3–6 liczb (wymiary, dawki, normy, progi, wagi, stawki).
3. **Możliwość Programmatic SEO (20–150 podstron):** narzędzie da się naturalnie rozbić na konkretne modele, materiały, regiony, gminy, przepisy, wymiary albo gatunki.
4. **Monetyzacja nie tylko z AdSense, ale też afiliacja (często 5× wyższe zarobki niż AdSense):** link do konkretnego sprzętu, ubezpieczenia, konta, materiału, kursu albo oprogramowania pasującego do wyniku.

---

## 5. 12 konkretnych, nieoczywistych kierunków niszowych (poza szablonem AI)

### A. Przepisy lokalne i transgraniczne (wysoki RPM, mała konkurencja globalna)
1. **Narzędzia dla pracowników transgranicznych PL ↔ DE / DE ↔ CH (Grenzgänger):**
   - Kalkulator opłacalności dojazdu + diety delegacyjne + niemieckie *Pendlerpauschale* / *Minijob* / *Midijob* / klasy podatkowe *Steuerklasse I–VI* po polsku i niemiecku.
   - Bardzo wysoki ruch, ludzie szukają tego co miesiąc, afiliacja: zwrot podatku z Niemiec, konta walutowe (Wise/Revolut).
2. **Cło, akcyza i import aut / paczek spoza UE (PL / DE):**
   - Kalkulator akcyzy i kosztów sprowadzenia auta z USA / Szwajcarii / Niemiec (pojemność, hybryda, cło 10%, VAT 19% DE vs 23% PL w portach Bremerhaven vs Gdynia) + podstrony pod konkretne modele/pojemności.
   - Ogromny intent zakupowy + drogie reklamy (ubezpieczenia, transport aut, raporty VIN).
3. **Logistyka / kierowcy zawodowi (B2B transport — EU Mobility Package):**
   - Kalkulator czasu jazdy i pauz tachografu (4h30 / 9h / 11h / skrócony odpoczynek tygodniowy), kalkulator punktów **ADR** (kiedy wymagane oznakowanie tablicą pomarańczową), kalkulator załadunku palet EUR/EPAL na naczepę (LDM — metry ładowne!).
   - Temat kompletnie nietknięty przez „AI indie hackerów”, a codziennie używany przez dziesiątki tysięcy spedytorów w PL i DE.

### B. Rzemiosło, budowa, OZE i majsterkowanie (stare strony w Google, wysokie CPC budowlane)
4. **Druk 3D (FDM & żywica) — wycena zlecenia i kosztu wydruku:**
   - Koszt filamentu/żywicy + prąd (kWh) + amortyzacja drukarki + % nieudanych wydruków + czas post-processingu + narzut. Podstrony pod materiały (PLA, PETG, ABS, ASA, TPU, żywica 8K) i konkretne drukarki (Bambu Lab, Prusa, Creality).
5. **Fotowoltaika, magazyny energii, kampery i off-grid (LiFePO4):**
   - Dobór pojemności akumulatora LiFePO4, mocy paneli solarnych, grubości przekroju kabla (spadek napięcia 12V/24V/48V!) i falownika do kampera / łodzi / domku letniskowego.
   - Ogromny rynek DE/EN/PL, wysoka afiliacja (Amazon, sklepy solarne/kamperowe).
6. **Kalkulatory wykończeniowe „bez strat” z wizualizacją SVG:**
   - Układanie płytek (prosto vs jodełka vs karo + zapas na docinki), deski tarasowe, kostka brukowa, wylewka samopoziomująca (worki na m² i grubość w mm), ilość farby / tynku / płyt GK + profili UD/CD na pokój.
   - Bardzo konkretne frazy z ogromnym wolumenem, niska konkurencja wśród nowoczesnych mobilnych narzędzi.
7. **Obróbka CNC / laser / stolarstwo (Feeds & Speeds, rozkrój płyt, waga stali):**
   - Kalkulator wagi profili stalowych i aluminiowych (rury, kątowniki, płaskowniki, blachy — podstrony pod każdy profil i stop!), kalkulator parametrów skrawania CNC / lasera CO2.

### C. Specjalistyczne hobby z drogim sprzętem (lojalni użytkownicy, zero spamu AI)
8. **Akwarystyka (roślinna i morska) / oczka wodne / baseny:**
   - Kalkulator nawożenia EI / soli mineralnych (NO3, PO4, K, GH/KH), objętości i ciężaru akwarium (szkło + woda + podłoże — czy strop wytrzyma!), dawkowania chemii basenowej (pH minus, chlor szokowy wg m³).
9. **Kawa specialty / domowe wypieki chleba (piekarstwo rzemieślnicze) / piwowarstwo domowe:**
   - Kalkulator procentów piekarskich (hydracja zakwasu, temperatura wody DDT, skalowanie przepisu pod rozmiar blaszki), kalkulator ekstrakcji espresso / wody do kawy, korekta areometru i kalkulator ABV / nagazowania w piwowarstwie domowym.
10. **Fotografia, druk wielkoformatowy i wideo:**
    - Kalkulator rozmiaru wydruku z megapikseli i DPI (jaki maksymalny plakat z danego aparatu), głębia ostrości / hiperfokalna pod konkretny obiektyw, kalkulator bitrate i pojemności kart SD dla konkretnych kamer (Sony FX3, GoPro, DJI Mavic/Air — ile godzin 4K 60fps wejdzie na 256 GB!).

### D. Specjalistyczne B2B i e-commerce (głębsze niż ogólne kalkulatory)
11. **Kalkulator gabarytów przesyłek i dopłat kurierskich (PL / DE / EU):**
    - Wpisujesz wymiary i wagę paczki → narzędzie od razu liczy **wagę gabarytową** i pokazuje, w który gabaryt wpada (InPost Paczkomat A/B/C, DPD, DHL Paket DE, GLS, Orlen Paczka) oraz czy grozi dopłata za NST (element niestandardowy).
12. **Kalkulator mocy i doboru sprzętu IT / sieci / serwerów domowych (Homelab):**
    - Kalkulator pojemności RAID (RAID 0/1/5/6/10, ZFS RAIDZ1/2/3 — realna pojemność w TiB vs TB!), kalkulator czasu podtrzymania UPS (VA/W → minuty), koszt prądu serwera 24/7.

---

## 6. Jak zwalidować niszę w 15 minut przed budowaniem

1. Wpisz główną frazę po angielsku i po niemiecku w Google (np. `12v wire gauge calculator`, `kabelquerschnitt berechnen 12v`, `kalkulator wagi stali`, `raidz2 calculator`).
2. Sprawdź TOP 5 na telefonie:
   - Czy strony wyglądają na stare (2010–2016), mają fatalny UX na iPhonie albo wymagają logowania? **Jeśli tak → wchodzisz.**
   - Jeśli w TOP 5 siedzą same gigantyczne, nowoczesne portale (jak przy „kalkulator kredytu hipotecznego” albo „BMI calculator”) → **odpuszczasz i bierzesz węższą niszę**.
3. Wpisz frazę w wyszukiwarkę Reddita (`sort=new`) — czy w ostatnich 3 miesiącach ludzie pytali, jak to policzyć? Jeśli tak, masz gotowy kanał na pierwszy ruch.
4. Przynieś wybrany pomysł z tym plikiem tutaj i powiedz: *„Robimy nową stronę w niszy [X] na tym samym silniku co CalcLedger”* — w 1 sesję postawimy kompletny, wielojęzyczny serwis z 50–150 podstronami Programmatic SEO.
