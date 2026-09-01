# Rilancio SE 3.0 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrare il blog a quattro sezioni (Dispense · Fondamenta · Guide tecniche · Analisi puntuali) con i contenuti di agosto 2026 e il redesign light-only in stile claude.com/blog.

**Architecture:** Restyle in place sull'architettura Astro esistente (approccio A della spec): riscrittura di token/layout, nuova collection `dispense` con `order` nello schema, campo `section` su `articles`, conversioni HTML→MDX dal pacchetto sorgente. URL esistenti preservati; redirect dichiarati in `astro.config.mjs`.

**Tech Stack:** Astro 5.16.6, @astrojs/mdx 4, pagefind 1.4 (search), Google Fonts (Source Serif 4, Archivo, JetBrains Mono).

**Spec:** `docs/superpowers/specs/2026-09-01-rilancio-agosto-2026-design.md` — in caso di dubbio fa fede la spec, e sopra di lei il brief `MIGRATION.md` del pacchetto.

**Sorgenti:** `/private/tmp/claude-501/-Users-giuseppealbriziowork-Repos-Formray-software-engineering-3-0/239c9e5a-17d3-462d-8a49-98369c32dea9/scratchpad/zip-agosto/se30/` (estratto dallo zip sul Desktop; ri-estrarre da `~/Desktop/software-engineering-3.0-agosto-2026.zip` se mancante). **Mai pubblicare nulla da `_locale/`.**

## Global Constraints

- Light-only su tre livelli: `<meta name="color-scheme" content="light only">` + `color-scheme: light only` su `:root` + `@media (prefers-color-scheme: dark)` che riafferma la palette chiara.
- Token esatti: `--paper:#FAF9F5 --panel:#F0EEE6 --ink:#141413 --ink-2:#5E5D59 --ink-3:#87867F --line:#E8E6DC --accent:#D97757 --accent-deep:#B85C3D`. `border-radius: 0` ovunque, niente box-shadow.
- Font: Source Serif 4 (titoli, weight 500–600), Archivo (testo/UI), JetBrains Mono (codice), da Google Fonts con preconnect. Fallback reali (Georgia / system-ui / monospace).
- Niente emoji nell'interfaccia né nelle intestazioni dei contenuti nuovi convertiti.
- Dispense brand-neutrali: `grep -riE "formray|disctale|discman|skeldon|albrizio" src/content/dispense/` deve restituire vuoto.
- Data dei contenuti nuovi: agosto 2026 (`2026-08-31`).
- URL esistenti invariati; redirect solo per rimossi/spostati.
- `npm run build` verde alla fine di ogni task (il build valida schemi Zod e genera pagefind).
- Conventional commits; ogni commit chiude con `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- `prefers-reduced-motion: reduce` disattiva ogni animazione.

## Slug e frontmatter delle Dispense (contratto, usato da più task)

| Order | Slug | Title | Argomento | Sorgente |
|---|---|---|---|---|
| 0 | `00-la-mappa` | La Mappa | Atlante | `01-dispense/ai-engineering-map.html` |
| 1 | `01-harness-loop-engineering` | Harness & Loop Engineering | Harness & Loop | `01-dispense/harness-loop-engineering.html` |
| 2 | `02-metodo-operativo` | Metodo operativo | Metodo | `01-dispense/ai-engineering-playbook.html` |
| 3 | `03-sotto-ollama` | Sotto Ollama — Il runtime di inferenza | Strato L0 | `01-dispense/dispensa-inferenza-runtime.html` |
| 4 | `04-database-vettoriali` | Database vettoriali | Retrieval | `01-dispense/dispensa-database-vettoriali.html` |

In coda (non contenuti; costante `IN_CODA` in `index.astro`): 05 Evals, 06 Sicurezza degli agenti.

## Regole di conversione HTML → MDX (usate dai task 2, 3, 4, 6, 7)

1. Leggere l'HTML sorgente integralmente; convertire il body in Markdown pulito: `<h2>→##`, `<h3>→###`, liste, tabelle→tabelle markdown, `<strong>/<em>`→`**`/`*`, blocchi codice→fenced con linguaggio.
2. Rimuovere emoji dalle intestazioni. Il testo scorre in prosa; nessun residuo di markup o classi.
3. Callout/box dell'HTML → componenti esistenti: box informativi→`<InfoBox>`, pro/contro→`<ProsCons>`, checklist e domande di autoverifica→`<Checklist>`, citazioni→`<Quote>`, confronti tabellari ricchi→`<ComparisonTable>` (import espliciti in testa al MDX, pattern già in uso negli MDX esistenti).
4. Frontmatter: `title` e `description` da `<title>` e sommario del documento; niente campo `icon` nei contenuti nuovi.
5. Fedeltà al contenuto: nessuna riscrittura editoriale, nessun taglio; si converte, non si riassume.

---

### Task 0: Branch e baseline

**Files:** nessuno (solo git).

- [x] **Step 1:** `git checkout -b feature/rilancio-agosto-2026` (da develop pulito).
- [x] **Step 2:** `npm install && npm run build` — deve chiudere verde. Annotare eventuali warning preesistenti.
- [x] **Step 3:** Commit di spec e piano: `git add docs/ && git commit -m "docs: add design spec and implementation plan for rilancio agosto 2026"`.

### Task 1: Design system e layout base

**Files:**
- Modify: `src/styles/global.css` (riscrittura completa)
- Modify: `src/layouts/BaseLayout.astro`
- Delete: `src/components/ThemeToggle.astro`

**Interfaces (Produces):** classi globali `.site-header`, `.sec-head`, `.eyebrow`, `.pill`, token CSS del blocco Global Constraints; `BaseLayout` con slot invariato e prop `title`/`description` invariate (i consumer non cambiano).

- [x] **Step 1:** Riscrivere `global.css`: reset minimo, token in `:root` (blocco esatto sopra) + `color-scheme: light only` + media query dark che riafferma i token chiari; tipografia (serif per h1–h4, misura 68ch nella prosa articolo), filetti, `.sec-head` (filetto scuro superiore + h2 serif + nota occhiello), `.pill`, header/footer, focus visibile `outline: 2px solid var(--accent)`, blocco `@media (prefers-reduced-motion: reduce)` che azzera transizioni/animazioni.
- [x] **Step 2:** `BaseLayout.astro`: aggiungere nel `<head>` `<meta name="color-scheme" content="light only">`, link Google Fonts con preconnect, `<ClientRouter />` da `astro:transitions`; rimuovere import/render di ThemeToggle e lo script `data-theme`; nuovo header (wordmark testuale + ancore `#dispense #fondamenta #guide #analisi` verso la home + link GitHub); footer con «Ultimo aggiornamento» calcolato da prop `updated?: Date` (la home la passa; default: build date).
- [x] **Step 3:** Eliminare `ThemeToggle.astro`; grep che nessun file lo importi più: `grep -rn "ThemeToggle" src/` → vuoto.
- [x] **Step 4:** `npm run build` verde; verifica su output: `grep -l "color-scheme" dist/index.html` e `grep -c "fonts.googleapis" dist/index.html` ≥ 1.
- [x] **Step 5:** Commit `feat: rewrite design system light-only in claude.com editorial style`.

### Task 2: Sostituzione Cursor 2025 → 2026

**Files:**
- Create: `src/content/guides/claude-code-vs-cursor-2026.mdx` (da `02-operativi/claude-code-vs-cursor-2026.html`)
- Delete: `src/content/articles/claude-code-vs-cursor-comparison.mdx`
- Modify: `astro.config.mjs`

- [x] **Step 1:** Convertire l'HTML secondo le regole; frontmatter:
```yaml
title: "Claude Code vs Cursor — Edizione Agosto 2026"
description: "<dal sommario del documento>"
tag: "Confronto"
date: 2026-08-31
```
- [x] **Step 2:** Eliminare l'articolo 2025; in `astro.config.mjs` aggiungere:
```js
redirects: {
  '/articles/claude-code-vs-cursor-comparison': '/guides/claude-code-vs-cursor-2026',
},
```
(chiavi senza prefisso base: Astro lo antepone da sé).
- [x] **Step 3:** Build verde; `dist/articles/claude-code-vs-cursor-comparison/index.html` esiste e contiene il meta refresh verso `/software-engineering-3.0/guides/claude-code-vs-cursor-2026`.
- [x] **Step 4:** Commit `feat: replace Cursor 2025 comparison with August 2026 edition`.

### Task 3: Paradigma v2 senza perdite + rimozione Roadmap v3

**Files:**
- Create: `src/content/articles/mindset-shift-ai-developer.mdx` (contenuto integrale dell'attuale `ai-developer-paradigm.mdx`)
- Modify: `src/content/articles/ai-developer-paradigm.mdx` (sostituito dalla conversione di `03-fondamenta/ai_developer_paradigm_v2.html`)
- Delete: `src/content/articles/ai-developer-roadmap-2026.mdx`
- Modify: `astro.config.mjs`

- [x] **Step 1:** Copiare il contenuto attuale del paradigma nel nuovo file; frontmatter: `title: "I 5 Shift Mentali dell'AI Developer"`, description riscritta sul contenuto reale (Karpathy, autonomy slider, quality gates), `tag: "Paradigma"`, data originale `2026-01-05` conservata.
- [x] **Step 2:** Sostituire il corpo di `ai-developer-paradigm.mdx` con la conversione integrale della v2 (~4.300 parole); title invariato «Il Nuovo Paradigma dello Sviluppatore AI», `date: 2026-08-31` (riedizione).
- [x] **Step 3:** Eliminare la roadmap; aggiungere redirect `'/articles/ai-developer-roadmap-2026': '/'`.
- [x] **Step 4:** Build verde; il nuovo articolo compare in `dist/articles/mindset-shift-ai-developer/`; `grep -c "Software 3.0" dist/articles/ai-developer-paradigm/index.html` ≥ 1.
- [x] **Step 5:** Commit `feat: publish Paradigma v2, preserve original as Mindset Shift article, remove roadmap v3`.

### Task 4: Riallineamento contenuti Python

**Files:**
- Create: `src/content/guides/python-fundamentals-to-generative.mdx` (ri-conversione integrale da `04-guide/python-fundamentals-to-generative.html`)
- Delete: `src/content/articles/python-fundamentals-to-generative.mdx`
- Modify: `src/content/articles/ai-developer-paradigm-python.mdx` (diff contro `03-fondamenta/ai_developer_paradigm_python_v2.html`, reintegro sezioni/passaggi mancanti, struttura H2 invariata)
- Modify: `astro.config.mjs`

- [x] **Step 1:** Ri-convertire python-fundamentals nella collection guides (frontmatter attuale conservato salvo `icon` e con `tag: "Percorso"`); redirect `'/articles/python-fundamentals-to-generative': '/guides/python-fundamentals-to-generative'`.
- [x] **Step 2:** Diff sezione per sezione della Python Edition contro la v2; reintegrare il contenuto mancante (~700 parole), rimuovendo le emoji dalle intestazioni in linea con le regole di conversione.
- [x] **Step 3:** Build verde; conteggio parole del MDX python edition ≥ 2.900.
- [x] **Step 4:** Commit `feat: realign Python contents with canonical August 2026 sources`.

### Task 5: Modello dei contenuti e homepage a quattro sezioni

**Files:**
- Modify: `src/content/config.ts`
- Create: `src/pages/dispense/[...slug].astro`
- Create: `src/content/dispense/00-la-mappa.mdx` (pilota, da `01-dispense/ai-engineering-map.html`)
- Modify: `src/components/Card.astro` (riscrittura)
- Modify: `src/pages/index.astro` (riscrittura)
- Modify: frontmatter dei 9 articles rimasti (aggiунgere `section`)

**Interfaces (Produces):** collection `dispense`; `Card` con props `{ title, description, href, eyebrow, date?, tag?, order?, ghost? }`; ancore di sezione `#dispense #fondamenta #guide #analisi` (consumate dall'header del Task 1).

- [x] **Step 1:** `config.ts`:
```ts
const dispense = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().min(0),
    argomento: z.string(),
    stato: z.enum(['pubblicata']).default('pubblicata'),
    date: z.date(),
    tag: z.string().optional(),
  }),
});
```
Su `articles`: aggiungere `section: z.enum(['fondamenta', 'analisi'])`, rendere `icon` `z.string().optional()`. Su `guides`: `icon` optional. Export `{ articles, guides, dispense }`.
- [x] **Step 2:** `section` nei 9 articles: fondamenta → ai-developer-paradigm, ai-developer-paradigm-python, engineering-guidelines, hyper-human-manifesto, mindset-shift-ai-developer; analisi → ai-jobs-overview-2026, memory-war-enterprise, welcome-to-the-machine-analysis, scaling-postgresql.
- [x] **Step 3:** Route `dispense/[...slug].astro` su `getStaticPaths` + `getCollection('dispense')`, layout `ArticleLayout` con `category` esteso (accetta `'dispensa'`).
- [x] **Step 4:** Convertire la Dispensa 00 (regole di conversione; frontmatter dal contratto slug; nell'indice vivo della serie la voce «Sotto Ollama» marcata **pubblicata** con link relativo alla Dispensa 03, le voci Evals/Sicurezza restano in coda).
- [x] **Step 5:** Riscrivere `Card.astro` (varianti: dispensa con numero serif `order` a due cifre, standard, ghost non cliccabile «In coda») e `index.astro`: hero tipografico, quattro `.sec-head` nell'ordine Dispense (ordinate per `order`, + ghost) · Fondamenta · Guide tecniche · Analisi puntuali, Search pagefind conservata, rimozione filtri/sort e della vecchia setup-section (i file in `public/setup/` restano serviti).
- [x] **Step 6:** Build verde; `dist/dispense/00-la-mappa/index.html` esiste; la home contiene le quattro intestazioni e due card ghost; reveal allo scroll attivo (IntersectionObserver) con classi `.rv/.in` e guardia reduced-motion.
- [x] **Step 7:** Commit `feat: add dispense collection, four-section homepage, editorial cards`.

### Task 6: Conversione Dispense 01–04

**Files:**
- Create: `src/content/dispense/01-harness-loop-engineering.mdx`, `02-metodo-operativo.mdx`, `03-sotto-ollama.mdx`, `04-database-vettoriali.mdx`

- [x] **Step 1:** Convertire i quattro HTML secondo le regole e il contratto slug/frontmatter (una alla volta, build dopo ciascuna se emergono dubbi di schema).
- [x] **Step 2:** Grep di neutralità (vincolo globale) su `src/content/dispense/` → vuoto.
- [x] **Step 3:** Build verde; le quattro pagine esistono in `dist/dispense/`; la home elenca cinque dispense ordinate.
- [x] **Step 4:** Commit `feat: publish Dispense 01-04 (Harness & Loop, Metodo, Sotto Ollama, Database vettoriali)`.

### Task 7: Layout di lettura e componenti

**Files:**
- Modify: `src/layouts/ArticleLayout.astro`
- Modify: `src/components/{InfoBox,ProsCons,ToolCard,Checklist,ComparisonTable,Quote,StatCard,TimelineItem,StepHeader,CopyCode,ReadingTime,TableOfContents,BackToTop,Search,ProgressBar,VersionBadge,MarketCard}.astro` (solo stile, API invariate)

- [x] **Step 1:** `ArticleLayout`: occhiello sezione + data, H1 serif, meta con `ReadingTime`, prosa a 68ch, TOC sticky da 1100px; per le dispense: indicatore «Dispensa NN di 04» e navigazione precedente/successiva ordinata per `order` (props `prev`/`next` passate dalla route del Task 5).
- [x] **Step 2:** Restyle dei componenti sui token (angoli vivi, filetti, niente ombre; le emoji decorative interne ai componenti si rimuovono).
- [x] **Step 3:** Build verde; controllo visivo in dev di una dispensa, un articolo, una guida.
- [x] **Step 4:** Commit `feat: restyle reading layout and MDX components`.

### Task 8: QA

- [x] **Step 1:** `npm run build` finale; poi link interni: estrarre gli `href` interni dal `dist/` e verificare che ogni destinazione esista (script one-liner in sessione, non committato).
- [x] **Step 2:** Verifica browser su `npm run preview`: home e una dispensa in viewport desktop e mobile (375px), con `prefers-color-scheme: dark` emulato → la pagina resta chiara; con reduced-motion → nessuna animazione.
- [x] **Step 3:** Contrasto: `--ink-2` e `--ink-3` su `--paper`/`--panel` ≥ AA per il loro ruolo; pagefind funzionante (ricerca di «ollama» trova la Dispensa 03).
- [x] **Step 4:** Fix di quanto emerso; commit `fix: QA pass (links, mobile, contrast)` se ci sono correzioni.

### Task 9: Documentazione e chiusura

**Files:**
- Modify: `CHANGELOG.md` (sezione `[Unreleased]`), `README.md` (se esiste, sezioni visibili), `CLAUDE.md` (nuova collection, sezioni, comandi invariati), `docs/PROGRESS.md` se esiste
- Modify (repo root Formray): `.claude/docs/PROJECTS.md` («Last session» / «Next priority»)

- [x] **Step 1:** Aggiornare i documenti di progetto (lingua: PROGRESS in italiano, resto secondo convenzione).
- [x] **Step 2:** Commit `docs: update project docs for rilancio agosto 2026`.
- [x] **Step 3:** Merge del feature branch in develop, push, PR develop → main con sommario del rilancio (come da flusso del progetto).

## Self-review

- Coverage: tutte le sezioni della spec hanno un task (design→1, sostituzioni→2-4, modello+home→5, dispense→5-6, lettura→7, QA→8, docs→9; calendario editoriale = solo documentazione, entra nel CHANGELOG).
- Tipi coerenti: `section` enum coincide tra Task 5 step 1 e step 2; slug del contratto usati in Task 2 (redirect), 5 e 6; props Card definite una volta.
- Nessun placeholder: le description dei frontmatter derivano «dal sommario del documento» per regola di conversione 4 — è la procedura, non un rinvio.
