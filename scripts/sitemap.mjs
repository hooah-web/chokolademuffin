import fs from 'node:fs';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');
const SITE = 'https://chokolademuffin.dk';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === 'index.html') out.push(full);
  }
  return out;
}

const files = walk(DIST);
const urls = files
  .map((f) => '/' + path.relative(DIST, path.dirname(f)).split(path.sep).join('/'))
  .map((p) => (p === '/.' ? '/' : p.endsWith('/') ? p : p + '/'))
  .filter((p) => p !== '/404/' && !p.startsWith('/404'))
  .sort();

const today = new Date().toISOString().slice(0, 10);
const body = urls
  .map((u) => {
    const isHome = u === '/';
    const priority = isHome ? '1.0' : u.split('/').filter(Boolean).length === 1 ? '0.8' : '0.6';
    return `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} URLer`);
