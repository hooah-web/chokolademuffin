# Beslutninger — chokolademuffin.dk

Hvad vi har besluttet, hvornår, og hvorfor. Skriv her når en beslutning træffes i dialog,
så den ikke skal genopdages. Nyeste først.

---

## 26. oktober 2026

**Cookieless analyse i stedet for GA4.**
Cloudflare Web Analytics (RUM) måler sidevisninger og Core Web Vitals uden cookies og uden
samtykkebanner. Egen trafik filtreres med `?intern=1`, ikke med IP.
*Hvorfor:* Et CMP-banner på en opskriftside koster mere, end GA4's ekstra data er værd.

**RUM har 7 dages tilbageblik.**
Længere vinduer giver tomt svar uden fejl. Det er en grænse i datasættet, ikke i vores kode.

---

## 25. oktober 2026

**Domæne-niveau redirects laves som Cloudflare-regler, ikke i `_redirects`.**
`_redirects` bruges til stier på sitet. www → apex og den slags laves som Redirect Rule i
Cloudflare.
*Hvorfor:* Anders' valg: "Det er den fremgangsmåde vi vil lave sådan noget på i fremtiden."

**Annonceformater: 300×600, 930×180 og 320×320/300×250.**
728×90 blev droppet som for lille. Faste pladser med reserveret højde frem for Auto ads.
Annoncer vises kun når `CF_PAGES_BRANCH === 'main'`.

**AdSense kom senere end planlagt, med vilje.**
Først efter at sitet kørte, og efter ads.txt og privatlivspolitik var på plads.

---

## 24. oktober 2026

**Repoet er hooah-web/chokolademuffin.**
Jeg opretter ikke nye repos; Anders opretter dem.

**Ingen kommentarer migreres.**
91 godkendte og 21 afventende kommentarer indeholder persondata (bl.a. mailadresser).
De bliver ikke flyttet med.

**Forfatteren fjernes helt.**
Navnet Helge Vang Andersen optræder ikke på det nye site. Sitet står ved at være AI-drevet.

**Kategorier droppes.**
De fire kategorier var for tynde til at bære en navigation.

**Ét AI-billede pr. opskrift, beskåret til tre formater.**
Ikke tre separate billeder pr. opskrift. 49 opskrifter → 294 filer, 6,8 MB, AVIF og WebP.
*Hvorfor:* Recipe-structured-data kræver `image`, ellers mister opskrifterne rich results.

**Ingen custom domain eller DNS-ændring fra min side.**
Hosting på Cloudflare Pages, men domænet er Anders' beslutning.
