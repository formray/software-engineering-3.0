# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start local dev server (localhost:4321)
npm run build    # Generate static site in dist/ + Pagefind search index
npm run preview  # Preview production build locally
```

## Architecture Overview

Astro 7 static site (Content Layer API) for Italian AI/software development content, deployed to GitHub Pages at `https://formray.github.io/software-engineering-3.0/`.

### Content Collections

Three Zod-validated collections defined in `src/content.config.ts` (glob loaders — NOT the legacy `src/content/config.ts`):

- **dispense/** — the AI Engineering study series, numbered reading order. Schema: `title`, `description`, `order` (int, drives numbering and prev/next nav), `argomento`, `stato` (default `'pubblicata'`), `date`, `tag?` (`"Nuova"` renders a pill).
- **articles/** — schema adds `section: 'fondamenta' | 'analisi'`; the homepage groups by it.
- **guides/** — technical guides.

`icon` is optional everywhere and never rendered (no emoji in the UI). Entry ids come from filenames (`entry.id`); pages use `render(entry)` from `astro:content`.

### Routing

- `src/pages/index.astro` — four-section homepage: Dispense (ordered, plus hardcoded `inCoda` ghost cards) · Fondamenta · Guide tecniche · Analisi puntuali. Section anchors `#dispense #fondamenta #guide #analisi` are linked from the site header. A «Filtra e ordina» sidebar (section filter + sort: editoriale/recenti/vecchi/A–Z) and a Griglia/Elenco view toggle drive the grids client-side via `data-*` attributes on cards (`data-date`, `data-title`, `data-idx`).
- `src/pages/dispense/[...slug].astro` — passes prev/next/total for series navigation.
- `src/pages/articles/[...slug].astro`, `src/pages/guides/[...slug].astro`.

### Layouts & Components

- `BaseLayout.astro` — head (fonts, ClientRouter, light-only meta), site header, footer (`updated` prop), scroll-reveal script.
- `ArticleLayout.astro` — nests BaseLayout; reading layout with sticky sidebar TOC ≥1100px; `category: 'article' | 'guide' | 'dispensa'`, optional `eyebrow`, `date`, `readingTime`.
- `Card.astro` — homepage card (props: eyebrow, order, pill, ghost for "in coda", coverSection/coverSeed) with a `CardCover` on top.
- `CardCover.astro` — generative SVG covers, Anthropic-blog style: warm flat ground (Formray palette, one cool counterpoint) + hand-drawn line motif, deterministic per slug (hash). Dispense get a topical motif by `order` (mappa, loop, metodo, runtime, vettori, sicurezza, evals) and the serif numeral; other sections pick from per-section pools. Adding a dispensa beyond order 6 requires a new motif in the pool.
- MDX components (InfoBox, ProsCons, ComparisonTable, ToolCard, Checklist, Quote, StepHeader, TimelineItem, StatCard, MarketCard, VersionBadge) are token-styled, label-based, emoji-free.
- Interactive scripts (ProgressBar, CopyCode, BackToTop, Search, reveal) initialize on `astro:page-load` with idempotency guards — required because ClientRouter (View Transitions) is active. Never use bare `DOMContentLoaded`.

### Design System (`src/styles/global.css`)

Light-only, claude.com-editorial language. **Three-level light enforcement** (do not remove any):
1. `<meta name="color-scheme" content="light only">` in BaseLayout
2. `color-scheme: light only` on `:root`
3. `@media (prefers-color-scheme: dark)` block re-asserting the light tokens

Tokens: `--paper #FAF9F5`, `--panel #F0EEE6`, `--ink #141413`, `--ink-2 #5E5D59`, `--ink-3 #75746E` (AA on paper), `--line #E8E6DC`, `--accent #D97757`, `--accent-deep #B85C3D`. Fonts: Source Serif 4 (headings), Archivo (UI/body), JetBrains Mono (code, Shiki theme `vesper`). Sharp corners (`border-radius: 0`), no shadows, hairline separators. `prefers-reduced-motion` disables all animation.

Dispensa-specific patterns live in global.css: `.part`, `.atlas`, `.stack/.ring`, `.ex`, `.box.key/.human-box/.warn`, `.selfcheck`, `.mistakes`, `.arc/.week`, `ul.check`, `dl.gloss`, `.badge-done/.badge-todo`.

### Key Configuration

`astro.config.mjs`:
- Site `https://formray.github.io`, base `/software-engineering-3.0` (use `import.meta.env.BASE_URL` for links).
- **Redirects: destinations must include the base path explicitly** — Astro prefixes the source route but NOT the destination.
- `markdown.shikiConfig.theme: 'vesper'`.

## Adding Content

1. Create `.mdx` in the right collection folder. Dispense are named `NN-slug.mdx`.
2. Required frontmatter: title, description (+ `order`/`argomento`/`date` for dispense; `section` for articles).
3. No emoji in headings or frontmatter. Internal links carry the base path (`/software-engineering-3.0/...`).
4. **Dispense must stay brand-neutral** — before deploy run:
   `grep -riE "formray|disctale|discman|skeldon|albrizio" src/content/dispense/` (must be empty).
5. When publishing a new dispensa, update the live series index in `00-la-mappa.mdx` (§13 «La rotta della serie») and, if it was listed there, the `inCoda` array in `index.astro`.

## Editorial Calendar (from the August 2026 migration brief)

- Next dispense in queue: Sicurezza degli agenti (prossima), Evals.
- Scheduled checks: Memory War + Hinton thesis (Dec 2026 / Q4), Cursor comparison re-read (Dec 2026). Analisi puntuali are dated snapshots: verified at expiry, not updated.

## Special Directories

- `legacy-html/` — original HTML versions (backwards compatibility)
- `setup/` + `public/setup/` — Claude Code automation files
- `docs/superpowers/` — design specs and implementation plans
