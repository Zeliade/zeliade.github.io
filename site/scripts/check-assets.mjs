/**
 * Build-time asset check. Verifies that every file referenced from content
 * actually exists, and warns about files that nothing references any more
 * (an orphaned logo, a withdrawn PDF, the portrait of someone who has left).
 * Runs as the first step of `npm run build`.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const missing = [];

/** Reads one frontmatter field from every .md file in a collection. */
async function fieldFromCollection(collection, field) {
  const dir = new URL(`src/content/${collection}/`, root);
  const values = new Map();
  for (const file of await readdir(dir)) {
    if (!file.endsWith('.md')) continue;
    const md = await readFile(new URL(file, dir), 'utf8');
    const match = md.match(new RegExp(`^${field}:\\s*(\\S+)\\s*$`, 'm'));
    if (!match) {
      missing.push(`src/content/${collection}/${file}: no "${field}:" field`);
      continue;
    }
    values.set(`src/content/${collection}/${file}`, match[1]);
  }
  return values;
}

// --- Client logos: public/ paths listed in clients.yaml ---------------------
const yaml = await readFile(new URL('src/content/clients.yaml', root), 'utf8');
const logos = new Set([...yaml.matchAll(/src:\s*(\/img\/logos\/[^\s,}]+)/g)].map((m) => m[1]));
for (const ref of logos) {
  if (!existsSync(new URL(`public${ref}`, root))) missing.push(`public${ref} (clients.yaml)`);
}

// --- White paper PDFs: public/ paths in the whitepapers collection ----------
const pdfFields = await fieldFromCollection('whitepapers', 'pdf');
const pdfs = new Set(pdfFields.values());
for (const [source, ref] of pdfFields) {
  if (!existsSync(new URL(`public${ref}`, root))) missing.push(`public${ref} (${source})`);
}

// --- Team portraits: src/assets/ paths, relative to the markdown file -------
const photoFields = await fieldFromCollection('team', 'photo');
const portraits = new Set();
for (const [source, ref] of photoFields) {
  const resolved = new URL(ref, new URL(source, root));
  if (!existsSync(resolved)) missing.push(`${ref} (${source})`);
  portraits.add(resolved.pathname.split('/').pop());
}

if (missing.length) {
  console.error('Missing files:');
  for (const m of missing) console.error(`  ${m}`);
  process.exit(1);
}

// --- Warn about files nothing references ------------------------------------
for (const [label, dir, referenced] of [
  ['logo', 'public/img/logos', logos],
  ['PDF', 'public/whitepapers', pdfs],
  ['portrait', 'src/assets/team', portraits],
]) {
  const isPublic = dir.startsWith('public/');
  const files = (await readdir(new URL(dir, root))).filter((f) => !f.endsWith('.html'));
  const unused = files.filter((f) =>
    isPublic ? !referenced.has(`/${dir.slice('public/'.length)}/${f}`) : !referenced.has(f)
  );
  if (unused.length) {
    console.warn(`Note: ${unused.length} unreferenced ${label} file(s):`);
    for (const f of unused) console.warn(`  ${dir}/${f}`);
  }
}

console.log(
  `✓ ${logos.size} logo, ${pdfs.size} PDF and ${portraits.size} portrait reference(s) resolved.`
);
