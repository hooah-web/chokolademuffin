# STATUS — chokolademuffin.dk

Sidst opdateret: 26. oktober 2026. Læs denne fil først, hvis du starter en ny session.
Historik ligger i [`docs/DAGBOG.md`](docs/DAGBOG.md), og beslutninger med begrundelse i
[`docs/BESLUTNINGER.md`](docs/BESLUTNINGER.md).

## Hvad sitet er

Opskrifter på chokolademuffins og andre muffins, migreret fra WordPress til et statisk
site. Sitet er bygget, skrevet og drevet af en AI, og det står i footer og på Om-siden.
Ingen kommentarer migreret, ingen personoplysninger med over.

## Teknisk

```
Repo        hooah-web/chokolademuffin
Branch      main er produktion (Cloudflare Pages, production_branch = main)
Stack       Astro 5, statisk, ingen klientframework
Hosting     Cloudflare Pages, projekt "chokolademuffin"
Byg         npm run build   (astro build + scripts/sitemap.mjs)
Sider       49 opskrifter + forside, om, kontakt, privatlivspolitik, 404
Git-ident   Hooah AI <346939773+hooah-ai@users.noreply.github.com>
```

Indholdet ligger som markdown i `src/content/recipes` med frontmatter: `title`, `slug`,
`published`, `tempC`, `timeMin`, `intro`, `ingredients[]`, `steps[]` m.fl.
Skemaet er i `src/content/config.ts` og driver både Recipe-structured-data og visningen.

`public/_redirects` har 83 regler fra de gamle WordPress-URL'er. `public/_headers`
sætter CSP, HSTS og cache. Rør ikke CSP'en uden at tjekke, at annoncerne stadig loader.

## Annoncer

AdSense `ca-pub-7973118635555368`, `ads.txt` ligger i `public/`.
`src/components/AdSlot.astro` har faste pladser med reserveret højde, så layoutet ikke
flytter sig. Annoncer vises **kun** når `CF_PAGES_BRANCH === 'main'` — preview-deploys
må ikke generere visninger.

Google CMP kører via AdSense Privacy & messaging. Fjern den ikke, og indlæs ikke annoncer
før samtykke.

## Overvågning

Morgenrapport kl. 07:00 (cron `6a40a4fded1b`) dækker både dette site og porteføljen:
AdSense, Search Console, Cloudflare Web Analytics, Adtraction, Partner-ads og site-status.
Den henter tal fra `daily_status.py` i agentens hjem, ikke fra dette repo.

## Kendte mangler

```
Search Console      forsiden hænger på en gammel http://-kanonisk fra crawl 13. oktober
AdSense             phone-pin-verification mangler — udbetalinger er sat på pause
AdSense-valuta      ukendt; beløb vises derfor uden valutasymbol
Adtraction          ingen kanal oprettet for chokolademuffin.dk endnu
```

## Næste skridt

1. Få Search Console til at crawle forsiden igen, så den kanoniske URL bliver `https://`.
2. Få AdSense-verificeringen færdig (kræver Anders' telefon).
3. Mål Core Web Vitals på mobil efter annonceændringerne.
4. Nye opskrifter: maks. 3 pr. uge, og kun med reelt indhold.

## Arbejdsregler for dette site

- Ingen påstande om at have smagt, bagt eller testet. Skriv hvad opskriften bygger på.
- AI-genererede billeder markeres som AI-genererede, også i alt-tekst.
- Ændr aldrig en URL uden 301 i `public/_redirects`.
- Alt udgives gennem pull request med preview-link til Anders.
