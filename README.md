# Software Engineering 3.0

> **Migrato su [formray.io/blog](https://formray.io/blog).**
>
> Software Engineering 3.0 è diventato l'imprint editoriale del blog di
> Formray. Tutti i contenuti — dispense, articoli e guide — vivono ora su
> **[formray.io/blog](https://formray.io/blog)** con gli stessi slug
> (`/blog/dispense/…`, `/blog/articles/…`, `/blog/guides/…`).
>
> Questo repository è archiviato: GitHub Pages continua a servire una
> shell di redirect permanenti verso i nuovi URL
> (`npm run build` → `scripts/build-redirect-shell.mjs`).
> La build Astro originale resta disponibile come `npm run build:astro`.

---

## Archivio storico

Dispense, articoli e guide sul mondo dello sviluppo software nell'era dell'AI. In italiano.

## Sviluppo Locale

```bash
npm install        # Installa dipendenze
npm run dev        # Avvia server locale (localhost:4321)
npm run build      # Genera sito statico in dist/ (build + indice Pagefind)
npm run preview    # Preview build di produzione
```

## Struttura

```
src/
├── content/
│   ├── dispense/    # Serie Dispense AI Engineering (numerata, in ordine di lettura)
│   ├── articles/    # Fondamenta e Analisi puntuali (campo `section`)
│   └── guides/      # Guide tecniche
├── pages/           # Route Astro (/, /dispense/, /articles/, /guides/)
├── layouts/         # BaseLayout (chrome del sito) e ArticleLayout (lettura)
├── components/      # Componenti Astro (InfoBox, ProsCons, Card, TOC, …)
└── styles/          # Design system (global.css, light-only)

setup/               # File automazione Claude Code
legacy-html/         # Versioni HTML originali (retrocompatibilità)
```

## Le quattro sezioni

La homepage è organizzata in quattro sezioni editoriali:

1. **Dispense** — la serie AI Engineering, numerata 00→04, con le prossime uscite «in coda»
2. **Fondamenta** — il paradigma e i principi
3. **Guide tecniche** — setup e strumenti
4. **Analisi puntuali** — fotografie datate, verificate a scadenza e non aggiornate

## Dispense

| # | Dispensa | Argomento |
|---|----------|-----------|
| 00 | [La Mappa](src/content/dispense/00-la-mappa.mdx) | L'atlante L0–L5 della disciplina |
| 01 | [Harness & Loop Engineering](src/content/dispense/01-harness-loop-engineering.mdx) | Il sistema attorno al modello |
| 02 | [Metodo operativo](src/content/dispense/02-metodo-operativo.mdx) | Sei pratiche in quattro settimane |
| 03 | [Sotto Ollama](src/content/dispense/03-sotto-ollama.mdx) | Il runtime di inferenza (L0) |
| 04 | [Database vettoriali](src/content/dispense/04-database-vettoriali.mdx) | Embedding, HNSW, Qdrant |

In coda: Sicurezza degli agenti, Evals.

## Articoli

| Articolo | Sezione |
|----------|---------|
| [ai-developer-paradigm](src/content/articles/ai-developer-paradigm.mdx) | Fondamenta |
| [ai-developer-paradigm-python](src/content/articles/ai-developer-paradigm-python.mdx) | Fondamenta |
| [mindset-shift-ai-developer](src/content/articles/mindset-shift-ai-developer.mdx) | Fondamenta |
| [engineering-guidelines](src/content/articles/engineering-guidelines.mdx) | Fondamenta |
| [hyper-human-manifesto](src/content/articles/hyper-human-manifesto.mdx) | Fondamenta |
| [ai-jobs-overview-2026](src/content/articles/ai-jobs-overview-2026.mdx) | Analisi puntuali |
| [memory-war-enterprise](src/content/articles/memory-war-enterprise.mdx) | Analisi puntuali |
| [welcome-to-the-machine-analysis](src/content/articles/welcome-to-the-machine-analysis.mdx) | Analisi puntuali |
| [scaling-postgresql](src/content/articles/scaling-postgresql.mdx) | Analisi puntuali |

## Guide

| Guida | Tema |
|-------|------|
| [claude-code-vs-cursor-2026](src/content/guides/claude-code-vs-cursor-2026.mdx) | Confronto strumenti, ed. agosto 2026 |
| [claude-code-setup-macos](src/content/guides/claude-code-setup-macos.mdx) | Installazione Claude Code su macOS |
| [claude-code-setup-windows](src/content/guides/claude-code-setup-windows.mdx) | Installazione Claude Code su Windows |
| [macos-dev-setup](src/content/guides/macos-dev-setup.mdx) | macOS Dev Environment Setup |
| [windows-dev-setup](src/content/guides/windows-dev-setup.mdx) | Windows Dev Environment Setup |
| [windows-terminal-setup](src/content/guides/windows-terminal-setup.mdx) | Windows Terminal Setup |
| [github-cli-guide](src/content/guides/github-cli-guide.mdx) | GitHub CLI |
| [uv-cheatsheet](src/content/guides/uv-cheatsheet.mdx) | uv |
| [python-fundamentals-to-generative](src/content/guides/python-fundamentals-to-generative.mdx) | Percorso Python |

## Setup Automazione (Claude Code)

File di contesto per automatizzare il setup dell'ambiente di sviluppo con Claude Code.

| File | Descrizione |
|------|-------------|
| [macos.md](setup/macos.md) | Setup completo macOS (Homebrew, Node, Python, Docker, etc.) |
| [windows.md](setup/windows.md) | Setup completo Windows (winget, Scoop, WSL2, Node, Python, etc.) |

**Come usare:** apri la repo con Claude Code e chiedi di leggere il file di setup appropriato ed eseguire i comandi.

## Tech Stack

- **[Astro 7](https://astro.build/)** — framework per siti statici (Content Layer API)
- **MDX** — Markdown con componenti Astro
- **Content Collections** — tre collection con schema Zod (dispense, articles, guides)
- **[Pagefind](https://pagefind.app/)** — ricerca full-text statica
- **GitHub Pages** — hosting statico

Design: light-only in stile editoriale (Source Serif 4, Archivo, JetBrains Mono; carta avorio, angoli vivi, accento corallo).

## Changelog

### v3.0.0 - 2026-09-01 — Rilancio

- Nuova sezione **Dispense**: serie AI Engineering 00–04 (La Mappa, Harness & Loop, Metodo operativo, Sotto Ollama, Database vettoriali) con ordine di lettura, navigazione precedente/successiva e voci «in coda»
- Homepage riorganizzata in quattro sezioni: Dispense · Fondamenta · Guide tecniche · Analisi puntuali
- Redesign completo light-only in stile editoriale claude.com: nuovi token, Source Serif 4 + Archivo + JetBrains Mono, angoli vivi, reveal allo scroll, View Transitions
- Upgrade Astro 5→7 e MDX 4→8 (Content Layer API)
- Paradigma pubblicato in edizione v2 integrale; l'articolo precedente preservato come «I 5 Shift Mentali dell'AI Developer»
- Claude Code vs Cursor — Edizione Agosto 2026 (sostituisce l'edizione 2025, con redirect)
- Contenuti Python riallineati alle versioni canoniche; Python Fundamentals → Generative spostata tra le Guide
- Rimosse Roadmap 2026 v3 e il confronto Cursor 2025 (redirect attivi)
- Ritirato il toggle dark/light: light-only su tre livelli (i WebView mobili in dark rompevano la resa)
- Indice laterale sticky negli articoli, componenti MDX ristilizzati senza emoji, contrasto AA

### v2.3.0 - 2026-01-05
- Aggiunto articolo "The Hyper-Human Manifesto 2.0"
- Quick Wins UI: toggle tema, tempo di lettura, TOC, copia codice, back-to-top
- Integrato Pagefind per ricerca full-text

### v2.2.0 - 2026-01-05
- Aggiunto articolo "Claude Code vs Cursor - Confronto 2025"
- Aggiunto colore purple al componente ComparisonTable
- Aggiornata guida GitHub CLI con workflow PR completo

### v2.1.0 - 2026-01-05
- Convertiti tutti i contenuti da Markdown a MDX
- Aggiunti 11 componenti Astro per styling avanzato (InfoBox, ProsCons, Quote, etc.)
- Styling visuale migliorato con box colorati, griglie, timeline

### v2.0.0 - 2026-01-05
- Migrazione completa ad Astro framework
- Contenuti convertiti da HTML a Markdown con Content Collections
- File HTML originali preservati in `legacy-html/` per retrocompatibilità
- Aggiunto `CLAUDE.md` per guidance Claude Code

### v1.4.0 - 2026-01-05
- Aggiunta cartella `setup/` con file di contesto per Claude Code
- File markdown ottimizzati per automazione (macos.md, windows.md)
- Aggiunta documentazione open source (CONTRIBUTING, CODE_OF_CONDUCT, LICENSE)
- Aggiunti template GitHub per issues e PR

### v1.3.0 - 2026-01-05
- Aggiunte guide complete Dev Environment Setup per macOS e Windows
- Boilerplate per setup automatizzato con Claude Code

### v1.2.0 - 2026-01-04
- Aggiunta homepage con design dark minimal
- Cards interattive con filtri per categoria (Articoli/Guide)
- Documenti resi agnostici (rimossi riferimenti personali)

### v1.1.0 - 2026-01-04
- Riorganizzazione file in cartelle `articles/` e `guides/`
- Rinominati tutti i file in kebab-case
- Aggiunta guida Claude Code per macOS
- Aggiunto articolo "Da Python Fundamentals a Generative Programming"

### v1.0.0 - 2025-12-28
- Setup iniziale repository
- Primi articoli e guide
