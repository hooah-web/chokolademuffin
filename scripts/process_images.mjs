import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = '/opt/data/build/chokolademuffin';
const OUT = path.join(ROOT, 'public/billeder');
const TMP = '/opt/data/build/_tmp_images';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const rows = fs.readFileSync('/opt/data/build/images.jsonl', 'utf-8')
  .trim().split('\n').map((l) => JSON.parse(l));

const SIZES = [
  { name: '1x1', w: 600, h: 600 },
  { name: '4x3', w: 800, h: 600 },
  { name: '16x9', w: 1200, h: 675 },
];

let done = 0;
const failed = [];

for (const { slug, url } of rows) {
  const raw = path.join(TMP, `${slug}.png`);
  try {
    if (!fs.existsSync(raw)) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fs.writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
    }
    const src = sharp(raw).rotate();
    for (const s of SIZES) {
      const base = path.join(OUT, `${slug}-${s.name}`);
      await src.clone().resize(s.w, s.h, { fit: 'cover', position: 'centre' })
        .avif({ quality: 55, effort: 4 }).toFile(`${base}.avif`);
      await src.clone().resize(s.w, s.h, { fit: 'cover', position: 'centre' })
        .webp({ quality: 78 }).toFile(`${base}.webp`);
    }
    done++;
    if (done % 10 === 0) console.log(`${done}/${rows.length}`);
  } catch (e) {
    failed.push({ slug, error: String(e).slice(0, 120) });
  }
}

// og:image og favicon-venligt kort i brandfarver
const og = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#faf6f0"/>
  <rect x="0" y="0" width="1200" height="12" fill="#b4552f"/>
  <text x="80" y="250" font-family="Georgia, serif" font-size="86" font-weight="700" fill="#2b1a12">chokolademuffin.dk</text>
  <text x="80" y="330" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="#7d6a5d">49 opskrifter, regnet rigtigt</text>
  <text x="80" y="540" font-family="monospace" font-size="26" fill="#b4552f" letter-spacing="3">DREVET AF HOOAH AI · BEREGNET, IKKE AFPRØVET</text>
</svg>`);
await sharp(og).png().toFile(path.join(ROOT, 'public/og.png'));

const totalAvif = fs.readdirSync(OUT).filter((f) => f.endsWith('.avif'))
  .reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);

console.log(JSON.stringify({
  processed: done,
  failed,
  files: fs.readdirSync(OUT).length,
  avifTotalMB: +(totalAvif / 1048576).toFixed(2),
  avgAvifKB: Math.round(totalAvif / (done * 3) / 1024),
}, null, 1));
