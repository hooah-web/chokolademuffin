import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export type Ingredient = { amount: string; unit: string; name: string };

export const EQUIPMENT_RE = /form|papir|bakke|piskeris|skål|sigte|rist$/i;

export type Recipe = {
  slug: string;
  title: string;
  published: string;
  intro: string;
  yield?: number;
  tempC?: number;
  timeMin?: string;
  ingredients: Ingredient[];
  steps: string[];
  tips: string[];
  equipment: Ingredient[];
  tags: string[];
};

const DIR = path.join(process.cwd(), 'src/content/recipes');

/** Tal-parsing der klarer "½", "2½", "1/2", "2-3", "ca. 100". */
export function parseAmount(raw: string): number | null {
  if (!raw) return null;
  const s = String(raw).trim().replace(',', '.');
  const fractions: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3 };
  const range = s.match(/^(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)$/);
  if (range) return (parseFloat(range[1]) + parseFloat(range[2])) / 2;
  const mixed = s.match(/^(\d+)\s*([½¼¾⅓⅔])$/);
  if (mixed) return parseInt(mixed[1], 10) + fractions[mixed[2]];
  const only = s.match(/^([½¼¾⅓⅔])$/);
  if (only) return fractions[only[1]];
  const frac = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) return parseInt(frac[1], 10) / parseInt(frac[2], 10);
  const num = s.match(/^(\d+(?:\.\d+)?)$/);
  if (num) return parseFloat(num[1]);
  return null;
}

/** Formaterer et tal tilbage til dansk mængde-notation. */
export function formatAmount(n: number): string {
  if (n === 0) return '0';
  const rounded = Math.round(n * 10) / 10;
  const whole = Math.floor(rounded);
  const rest = Math.round((rounded - whole) * 10) / 10;
  const map: Record<string, string> = { '0.5': '½', '0.3': '⅓', '0.7': '⅔', '0.2': '¼', '0.8': '¾' };
  if (rest === 0) return String(whole);
  const frag = map[String(rest)];
  if (frag) return whole > 0 ? `${whole}${frag}` : frag;
  return String(rounded).replace('.', ',');
}

const TAG_RULES: Array<[RegExp, string]> = [
  [/banan/i, 'banan'],
  [/æble|aeble/i, 'æble'],
  [/blåbær|blabaer/i, 'blåbær'],
  [/hindbær|kirsebær|ribs|pære|citron|appelsin|rabarber/i, 'frugt'],
  [/nødder|mandler|hasselnød|peanut|pecan|valnød/i, 'nødder'],
  [/oreo|dumle|snickers|after eight|nutella|bailey|amaretto|ben and jerry/i, 'slik og chokolade'],
  [/glutenfri/i, 'glutenfri'],
  [/uden æg|ikke kan tåle æg|ikke kan tåle aeg/i, 'uden æg'],
  [/kokos/i, 'kokos'],
];

function deriveTags(r: { title: string; slug: string; ingredients: Ingredient[] }): string[] {
  const hay = r.title + ' ' + r.slug + ' ' + r.ingredients.map((i) => i.name).join(' ');
  const tags = TAG_RULES.filter(([re]) => re.test(hay)).map(([, t]) => t);
  return [...new Set(tags)];
}

let cache: Recipe[] | null = null;

export function allRecipes(): Recipe[] {
  if (cache) return cache;
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md'));
  const list = files.map((f) => {
    const raw = fs.readFileSync(path.join(DIR, f), 'utf-8');
    const fm = raw.split('---')[1];
    const data = yaml.load(fm) as any;
    const recipe: Recipe = {
      slug: data.slug,
      title: data.title,
      published: String(data.published),
      intro: data.intro ?? '',
      yield: data.yield ?? undefined,
      tempC: data.tempC ?? undefined,
      timeMin: data.timeMin != null ? String(data.timeMin) : undefined,
      ingredients: (data.ingredients ?? []).map((i: any) => ({
        amount: String(i.amount ?? ''),
        unit: String(i.unit ?? ''),
        name: String(i.name ?? ''),
      })),
      steps: (data.steps ?? []).map(String),
      tips: (data.tips ?? []).map(String),
      tags: [],
      equipment: [] as Ingredient[],
    };
    recipe.tags = deriveTags(recipe);
    const food = recipe.ingredients.filter((i) => !EQUIPMENT_RE.test(i.name));
    recipe.equipment = recipe.ingredients.filter((i) => EQUIPMENT_RE.test(i.name));
    recipe.ingredients = food;
    return recipe;
  });
  cache = list.sort((a, b) => a.title.localeCompare(b.title, 'da'));
  return cache;
}

export function bySlug(slug: string) {
  return allRecipes().find((r) => r.slug === slug);
}

export function imagePath(slug: string, ratio: '1x1' | '4x3' | '16x9') {
  return `/billeder/${slug}-${ratio}.avif`;
}

/** Nærmeste opskrifter: delte tags, derefter delte ingredienser. */
export function related(recipe: Recipe, limit = 3): Recipe[] {
  const others = allRecipes().filter((r) => r.slug !== recipe.slug);
  const score = (r: Recipe) => {
    const tagHits = r.tags.filter((t) => recipe.tags.includes(t)).length;
    const names = new Set(recipe.ingredients.map((i) => i.name.toLowerCase()));
    const ingHits = r.ingredients.filter((i) => names.has(i.name.toLowerCase())).length;
    return tagHits * 3 + ingHits;
  };
  return others.sort((a, b) => score(b) - score(a) || a.title.localeCompare(b.title, 'da')).slice(0, limit);
}
