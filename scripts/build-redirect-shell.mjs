#!/usr/bin/env node
// Redirect shell — spegnimento di SE 3.0 (Fase 6 del piano blog unificato,
// formray-website/docs/plans/2026-09-01-blog-unificato.md).
//
// Sostituisce la build Astro: per ogni URL pubblicato genera in dist/ una
// pagina con meta refresh 0 + rel=canonical verso il nuovo indirizzo su
// formray.io/blog (schema specchio 1:1). I redirect legacy di
// astro.config.mjs sono appiattiti sulla destinazione finale. I file
// public/setup/*.md diventano stub testuali che puntano ai nuovi URL
// (per chi li legge via curl una pagina HTML non servirebbe).
//
// Il repo resta archiviato con questa shell pubblicata su GitHub Pages:
// vive per sempre a costo zero, congelata.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const NEW_BASE = 'https://formray.io';

const redirectPage = (target) => `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Spostato su formray.io</title>
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="${target}">
</head>
<body>
<p>Software Engineering 3.0 è diventato il blog di Formray.
Questo contenuto vive ora su <a href="${target}">${target.replace('https://', '')}</a>.</p>
</body>
</html>
`;

const setupStub = (target) => `# File spostato

Questo file vive ora su formray.io:

    ${target}

Aggiorna i tuoi comandi, ad esempio:

    curl -fsSL ${target}
`;

// ---- Mappa degli URL pubblicati ----------------------------------------

const entries = [];

// Home
entries.push({ file: 'index.html', target: `${NEW_BASE}/blog` });

// Contenuti: schema specchio 1:1 sotto /blog
for (const collection of ['dispense', 'articles', 'guides']) {
  const dir = path.join(ROOT, 'src/content', collection);
  for (const filename of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
    const slug = filename.replace(/\.mdx$/, '');
    entries.push({
      file: `${collection}/${slug}/index.html`,
      target: `${NEW_BASE}/blog/${collection}/${slug}`,
    });
  }
}

// Redirect legacy (da astro.config.mjs), appiattiti sulla destinazione finale
const legacy = {
  'articles/claude-code-vs-cursor-comparison': `${NEW_BASE}/blog/guides/claude-code-vs-cursor-2026`,
  'articles/ai-developer-roadmap-2026': `${NEW_BASE}/blog`,
  'articles/python-fundamentals-to-generative': `${NEW_BASE}/blog/guides/python-fundamentals-to-generative`,
};
for (const [route, target] of Object.entries(legacy)) {
  entries.push({ file: `${route}/index.html`, target });
}

// ---- Generazione --------------------------------------------------------

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

for (const { file, target } of entries) {
  const dest = path.join(DIST, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, redirectPage(target));
}

// Stub per i file setup (letti via curl: testo, non HTML)
const setupDir = path.join(ROOT, 'public/setup');
const setupFiles = fs.readdirSync(setupDir).filter((f) => f.endsWith('.md'));
fs.mkdirSync(path.join(DIST, 'setup'), { recursive: true });
for (const filename of setupFiles) {
  fs.writeFileSync(
    path.join(DIST, 'setup', filename),
    setupStub(`${NEW_BASE}/setup/${filename}`)
  );
}

// Catch-all per gli URL non mappati (vecchi asset, sitemap, pagefind…)
fs.writeFileSync(
  path.join(DIST, '404.html'),
  `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Spostato su formray.io</title>
<meta http-equiv="refresh" content="0; url=${NEW_BASE}/blog">
</head>
<body>
<p>Software Engineering 3.0 è diventato il blog di Formray:
<a href="${NEW_BASE}/blog">formray.io/blog</a>.</p>
</body>
</html>
`
);

console.log(
  `Shell generata: ${entries.length} redirect, ${setupFiles.length} stub setup, 404 catch-all.`
);
for (const { file, target } of entries) {
  console.log(`  /${file.replace(/index\.html$/, '')} → ${target}`);
}
