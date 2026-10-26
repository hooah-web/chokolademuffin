# Dagbog — chokolademuffin.dk

Nyeste post øverst. Én post pr. arbejdsfase, ikke pr. kommando.
Skriv hvad der blev ændret, hvad der blev besluttet, og hvad der stadig mangler.
Tal skal være talt op, ikke husket.

---

## 26. oktober 2026 — beslutningerne skrevet ned

**Hvad der skete**
- Gennemgang af samtaletråden for at finde beslutninger der kun fandtes i dialogen.
  De er nu i `docs/BESLUTNINGER.md` — 8 beslutninger med dato og begrundelse.

**Beslutninger**
- Domæne-niveau redirects laves som Cloudflare-regler, ikke i `_redirects`.
  Det er den fremgangsmåde vi bruger fremover.
- Beslutninger skrives i `docs/BESLUTNINGER.md` samme dag de træffes.

**Mangler stadig**
- Search Console hænger på gammel http://-kanonisk, AdSense-verificering mangler.

---
## 26. oktober 2026 — dagbogen indført

**Hvad der skete**
- Projektet har fået `STATUS.md` og denne dagbog, så en ny session kan sætte sig ind i
  sitet uden at læse hele samtaletråden.
- `scripts/dagbog.py` er kopieret hertil fra readmagasiner, så posten kan skrives ens.

**Beslutninger**
- Dagbogen skrives ved afslutning af en fase, ikke pr. kommando. Der er en ugentlig
  kørsel fredag kl. 15:30, der gennemgår ugens commits.

---

## 25.–26. oktober 2026 — annoncer, analyse og overvågning

**Hvad der skete**
- AdSense kom i produktion: `ads.txt`, fast annoncekomponent med reserveret højde,
  CSP udvidet til Google-domænerne, privatlivspolitik opdateret med CMP.
- Cloudflare Web Analytics (RUM) sat op i stedet for GA4 — cookieless, kræver intet
  samtykkebanner. Egen trafik ekskluderes med `?intern=1` i stedet for IP-filter.
- Morgenrapport kl. 07:00 på Telegram med AdSense, Search Console, besøgstal,
  Adtraction, Partner-ads, site-status og AI-forbrug.

**Beslutninger**
- Annoncer vises kun på `main`, aldrig i preview-deploys.
- Zone-analytics tælles ikke som læsere: fordelingen (868 USA, 200 UK, 113 CA, 74 DK)
  er scannere. RUM er det ærlige tal.
- RUM har maks. 7 dages tilbageblik; længere vinduer giver tomt svar uden fejl.

**Fejl fundet og rettet**
- `min-height` i stedet for `height` på annoncepladsen, så højden er reserveret.
- CSP blokerede Cloudflare Web Analytics — `static.cloudflareinsights.com` tilføjet.

---

## 24.–25. oktober 2026 — migreringen fra WordPress

**Hvad der skete**
- 49 opskrifter, 68 vedhæftninger og 4 kategorier konverteret fra WXR-eksport til markdown.
- 49 AI-billeder i tre størrelser og to formater: 294 filer, 6,8 MB.
- 83 redirects fra de gamle URL'er. Sitemap med 54 URL'er, 0 fejl i Search Console.
- Produktion på Cloudflare Pages, www → 301.

**Beslutninger**
- Kommentarer migreres ikke (91 godkendte, 21 afventende) — de indeholder persondata.
- Forfatternavnet fjernes helt; sitet står ved at være AI-drevet.
- Recipe-structured-data kræver `image`, derfor fik alle opskrifter et AI-billede.
