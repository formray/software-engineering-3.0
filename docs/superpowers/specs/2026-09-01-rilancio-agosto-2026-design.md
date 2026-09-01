# Rilancio SE 3.0 — Design spec

Data: 2026-09-01 · Stato: in revisione · Proposta approvata: https://claude.ai/code/artifact/3d4f7ad7-0c5a-4c68-82f6-2d02e72c3931

Documento di riferimento: `MIGRATION.md` nello zip `~/Desktop/software-engineering-3.0-agosto-2026.zip` (estratto in scratchpad di sessione, cartella `zip-agosto/se30/`). Dove questa spec e il brief coincidono, fa fede il brief.

## Obiettivi

1. Pubblicare i contenuti del pacchetto agosto 2026: la serie Dispense AI Engineering (00→04) e Claude Code vs Cursor ed. 2026.
2. Sostituire il filtro piatto Articoli/Guide con quattro sezioni: **Dispense · Fondamenta · Guide tecniche · Analisi puntuali**.
3. Redesign completo in stile claude.com/blog: light-only, editoriale, serif per i titoli, angoli vivi.
4. Riallineare i contenuti divergenti e rimuovere i superati, senza perdere lavoro esistente.

## Decisioni consolidate (con Giuseppe, 2026-09-01)

| Decisione | Esito |
|---|---|
| Paradigma v2 | La v2 integrale sostituisce il contenuto dello slug `ai-developer-paradigm`. L'articolo corto attuale **non si cancella**: migra in un nuovo file `mindset-shift-ai-developer.mdx` (titolo di lavoro: «I 5 Shift Mentali dell'AI Developer»), sezione Fondamenta, contenuto integrale preservato. |
| Cursor 2026 | Sezione **Guide tecniche** (collection `guides`). |
| URL | Si conservano gli attuali. Redirect solo per rimossi/spostati. `/dispense/` nasce nuovo. |
| Tema | **Light-only**, ThemeToggle ritirato. Tre livelli come da brief. |

## Architettura dei contenuti

### Collections

- **Nuova collection `dispense`** (`src/content/dispense/`), schema Zod: `title`, `description`, `order` (number, 0–4), `argomento` (string, es. "Strato L0"), `stato` (`'pubblicata'`, default), `date`, `tag?`. URL: `/dispense/<slug>` con slug numerati (`00-la-mappa`, `01-harness-loop-engineering`, `02-metodo-operativo`, `03-sotto-ollama`, `04-database-vettoriali`).
- **Collection `articles`**: si aggiunge `section: z.enum(['fondamenta','analisi'])`; `icon` diventa `optional()` e non viene più renderizzata. URL invariati.
- **Collection `guides`**: `icon` optional come sopra. URL invariati.
- Le voci **in coda** della serie (05 Evals, 06 Sicurezza degli agenti) non sono contenuti: vivono come costante nella homepage e si renderizzano come card non cliccabili «in coda».

### Mappa delle sezioni

- **Dispense** (ordine di lettura): 00 La Mappa · 01 Harness & Loop Engineering · 02 Metodo operativo · 03 Sotto Ollama (nuova, ago 2026) · 04 Database vettoriali (nuova, ago 2026) · in coda: Evals, Sicurezza degli agenti.
- **Fondamenta** (`section: fondamenta`): Il Nuovo Paradigma (v2), Paradigma — Python Edition (v2 riallineata), Engineering Guidelines, Hyper-Human Manifesto 2.0, I 5 Shift Mentali (nuovo file dal contenuto attuale del paradigma).
- **Guide tecniche** (collection `guides`): Claude Code macOS/Windows, dev setup macOS/Windows, Windows Terminal, GitHub CLI, uv cheatsheet, Python Fundamentals → Generative (spostata da articles, ri-convertita dalla canonica), Claude Code vs Cursor — ed. 2026.
- **Analisi puntuali** (`section: analisi`): AI Jobs 2026, The Memory War, Welcome to the Machine, Scaling PostgreSQL. La data di pubblicazione va in evidenza: sono fotografie datate, si verificano a scadenza e non si aggiornano.

### Rimozioni, spostamenti, redirect (in `astro.config.mjs`)

| Azione | Percorso | Redirect verso |
|---|---|---|
| Rimuovi `ai-developer-roadmap-2026.mdx` | `/articles/ai-developer-roadmap-2026` | `/` (home) |
| Rimuovi `claude-code-vs-cursor-comparison.mdx` (2025) | `/articles/claude-code-vs-cursor-comparison` | `/guides/claude-code-vs-cursor-2026` |
| Sposta `python-fundamentals-to-generative` in guides | `/articles/python-fundamentals-to-generative` | `/guides/python-fundamentals-to-generative` |

Verificato il 2026-09-01: nessun link interno punta ai contenuti rimossi.

## Conversione contenuti (HTML → MDX)

- Pipeline consueta del progetto: HTML → MDX con i componenti esistenti (InfoBox, ProsCons, ToolCard, Checklist…).
- Frontmatter da `<title>` e sommario del documento; data dei contenuti nuovi: **agosto 2026**.
- Niente emoji nelle intestazioni dei contenuti nuovi convertiti.
- **Dispense brand-neutrali**: grep di verifica (`formray|disctale|discman|skeldon|albrizio`) prima del deploy — già verificato pulito sul pacchetto sorgente.
- Dispensa 00 (La Mappa): aggiornare l'indice vivo — «Sotto Ollama» da *in coda* a *pubblicata*, con link alla Dispensa 03.
- Riallineamenti: `ai-developer-paradigm-python` (diff sezione per sezione contro la v2, reintegro delle parti mancanti), `python-fundamentals-to-generative` (ri-conversione integrale dalla canonica).
- Mai pubblicare nulla dalla cartella `_locale/` dello zip.

## Design system

### Token (estratti dal vivo da claude.com/blog il 2026-09-01)

```css
--paper: #FAF9F5;   /* sfondo pagina */
--panel: #F0EEE6;   /* superfici secondarie, blocchi codice inline */
--ink:   #141413;   /* testo primario */
--ink-2: #5E5D59;   /* testo secondario */
--ink-3: #87867F;   /* muted, occhielli */
--line:  #E8E6DC;   /* filetti */
--accent:      #D97757;  /* corallo — link hover, marcatori, pill "nuova" */
--accent-deep: #B85C3D;  /* corallo scuro — hover/testo su carta */
```

- **Angoli vivi**: `border-radius: 0` ovunque. Niente ombre. Separazione con filetti `--line` e contrasto di superficie carta/pannello.
- **Light-only su tre livelli** (dal brief): `<meta name="color-scheme" content="light only">` nel layout; `color-scheme: light only` su `:root`; blocco `@media (prefers-color-scheme: dark)` che riafferma la palette chiara. ThemeToggle e script tema in `BaseLayout` si rimuovono.

### Tipografia (Google Fonts, con preconnect)

- Titoli e card title: **Source Serif 4**, weight 500–600, `letter-spacing -0.01em`, `text-wrap: balance`.
- Testo e UI: **Archivo** 400/500/600; corpo ~1.0625rem, interlinea 1.65, misura ~68ch negli articoli.
- Codice: **JetBrains Mono** (lo stesso di claude.com).
- Occhielli e label: Archivo 600, uppercase, `letter-spacing .1em`, `--ink-3`.

### Layout

- **Header**: barra minima con wordmark testuale «Software Engineering 3.0», ancore alle quattro sezioni, link GitHub. Niente logo emoji.
- **Homepage**: hero tipografico (titolo serif + tagline), poi le quattro sezioni nell'ordine del brief. Ogni sezione apre con filetto scuro superiore + titolo serif grande + nota occhiello (stile categorie claude.com). Card tipografiche: numero d'ordine serif grande (solo Dispense), occhiello, titolo serif, descrizione, data + tempo di lettura, freccia. Search si mantiene, ristilizzata; i bottoni di ordinamento si ritirano (l'ordine è quello editoriale delle sezioni).
- **Pagina articolo** (`ArticleLayout`): occhiello sezione + data, H1 serif grande, meta con tempo di lettura, sommario laterale sticky da ~1100px (TableOfContents ristilizzato), prosa a misura ~68ch. Per le Dispense: navigazione precedente/successiva secondo `order` e indicatore «Dispensa NN di 04».
- **Footer**: ristilizzato; «Ultimo aggiornamento» calcolato dalla data più recente delle collections, non più hardcoded.

### Movimento

- Reveal allo scroll con IntersectionObserver: fade + translateY 12–14px, stagger ~60ms sulle card.
- View Transitions native Astro (`<ClientRouter />`) per le transizioni tra pagine.
- Micro-interazioni hover: titolo card → `--accent-deep`, freccia `translateX(4px)`, sottolineatura link che scorre.
- `prefers-reduced-motion: reduce` disattiva tutto il movimento in blocco.

### Componenti

I ~20 componenti esistenti si ristilizzano con i token nuovi senza cambiare API: InfoBox, ProsCons, ToolCard, Checklist, ComparisonTable, Quote, StatCard, TimelineItem, StepHeader, CopyCode, ReadingTime, TableOfContents, BackToTop, Search, ProgressBar, VersionBadge, MarketCard. ThemeToggle si elimina. Card si riscrive (varianti: dispensa con numero, articolo/guida, «in coda» non cliccabile).

## Non-obiettivi

- Nessuna ristrutturazione degli URL esistenti (eventuale approccio B in un secondo momento).
- Nessun tema scuro.
- Nessuna pubblicazione da `_locale/` (roadmap v4, guida Qdrant estesa).
- Nessun aggiornamento contenutistico di Memory War e Welcome to the Machine ora: verifiche a scadenza dicembre 2026 come da brief.
- Nessun rebuild su tema esterno; si lavora sull'architettura Astro esistente.

## Verifica

- `npm run build` pulito; controllo link interni sull'output statico (inclusi i redirect generati).
- Resa mobile e simulazione WebView con OS in dark: la pagina deve restare chiara (regola dei tre livelli).
- `prefers-reduced-motion`: nessuna animazione.
- Grep di neutralità sulle Dispense sull'output finale.
- Lighthouse: performance e accessibilità ≥ 90 sulla home e su una dispensa.
- Contrasto AA per `--ink-2` e `--ink-3` sui fondi carta e pannello.

## Fasi di lavoro

0. Branch `feature/rilancio-agosto-2026` da develop; questa spec è il primo commit; screenshot baseline.
1. Design system: `global.css` riscritto, font, BaseLayout light-only, header/footer, ritiro ThemeToggle.
2. Architettura: collection `dispense`, campo `section`, homepage a quattro sezioni con «in coda», redirect, rimozioni, spostamento python-fundamentals, nuovo file 5 Shift Mentali.
3. Contenuti: conversione delle 5 Dispense e Cursor 2026; riallineamenti (paradigma v2, python edition, python-fundamentals); indice della Mappa; grep neutralità.
4. Componenti di lettura: ArticleLayout, componenti MDX, TOC, navigazione tra Dispense.
5. Verifica e chiusura: QA come sopra; CHANGELOG, PROGRESS, CLAUDE.md, registry root; PR develop → main.

## Calendario editoriale ereditato dal brief

- Prossime dispense in coda: Evals, Sicurezza degli agenti.
- Revisione roadmap: 30 settembre 2026.
- Verifiche a scadenza: tesi Hinton e Memory War (dicembre 2026 / Q4), rilettura confronto Cursor (dicembre 2026).
