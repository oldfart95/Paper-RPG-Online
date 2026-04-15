# Paper RPG Online

Paper RPG Online is a static-first tabletop companion app framework for GitHub Pages. It uses React, TypeScript, Vite, PixiJS, Motion, and Zustand to separate a polished UI shell from an interactive tabletop surface.

The current app is a playable vertical slice and a ruleset/plugin scaffold. It is designed for custom tabletop companions that need dice, cards, zones, counters, visual themes, asset hooks, and client-side saves without requiring a backend.

## Stack

- React + TypeScript for the app shell
- Vite for local development and static builds
- PixiJS for the interactive play surface
- Motion for panel and control transitions
- Zustand for client-side session state
- `localStorage` for static-site save slots and preferences
- GitHub Actions for pull request checks and Pages deployment

## Project Structure

```text
src/app/App.tsx                     UI shell, panels, controls, logs, saves
src/render/pixi/TabletopSurface.tsx PixiJS tabletop surface
src/core/types.ts                   Ruleset, deck, dice, zone, counter contracts
src/core/state/appStore.ts          Client-side runtime state
src/engine/cards/deckEngine.ts      Generic deck helpers
src/engine/dice/diceEngine.ts       Generic dice helpers
src/engine/rulesets/registry.ts     Installed ruleset registry
src/content/rulesets/               Ruleset/plugin manifests
src/content/demoGame.ts             Shared example cards and card specs
src/content/themes.ts               Theme packs used by rulesets and shell
```

The shell and the surface share state, but they do different jobs. `App.tsx` presents readable game-night controls and reference panels. `TabletopSurface.tsx` renders the tactile table: zones, counters, current card, discard fan, and ambient motion.

## Ruleset Plugin Model

A ruleset is a TypeScript manifest that defines:

- terminology for progress, danger, deck, discard, table, and ward concepts
- one or more dice profiles
- one or more decks
- tabletop zones with normalized surface coordinates
- counters and maximum values
- asset hooks for card backs, token icons, texture hints, and icon sets
- visual theme values
- optional modules for future character sheets, generators, encounter helpers, or utilities
- shell actions such as draw, roll, reset, and dice mode cycling

See:

- `src/content/rulesets/emberveil.ts` for a fuller fantasy example
- `src/content/rulesets/neonHollows.ts` for a reskinned ruleset using the same engine primitives
- `src/content/rulesets/exampleVoyagers.ts` for a minimal new-ruleset scaffold

## Adding A Ruleset

1. Create a file in `src/content/rulesets/`, for example `myRuleset.ts`.
2. Export a `RulesetManifest`.
3. Give it a unique `id`, terminology, dice profiles, decks, zones, counters, assets, theme values, modules, and actions.
4. Add the manifest to `src/engine/rulesets/registry.ts`.
5. Run `npm run build`.

The fastest starting point is to copy `exampleVoyagers.ts` and replace the manifest fields. Keep IDs stable because save slots store `rulesetId` and `diceProfileId`.

## Adding Decks And Cards

Decks are `DeckDefinition` objects. Each card can define:

- `id`, `title`, `type`, `subtitle`, and `rarity`
- an ASCII `icon` or future asset-backed icon key
- `feature`, `rulesText`, and `artDirection`
- an `accent` color for shell and surface rendering
- an optional `effect` object consumed by the shared card engine

Supported effect hooks currently include progress, danger, ward activation, roll targets, roll rewards, roll danger, prepared-table bonuses, stable-table bonuses, and danger relief.

Custom decks can live beside the ruleset manifest or in shared content files. The deck engine only requires a `DeckDefinition`, so future packs can be loaded from generated TypeScript, JSON, or static assets.

Primary decks use a standard poker-size playing-card profile (`63 x 88 mm`, `750 x 1050 px` target) by default. That keeps the framework friendly to sleeves, print shops, tabletop handling, and familiar card-game layouts.

## Adding Assets And Themes

Rulesets expose asset hooks through `assets`:

- `cardBacks` maps card back IDs to static asset paths
- `tokenIcons` maps logical token names to static asset paths
- `iconSet` names the icon language for cards and controls
- `textureHints` documents the visual material direction for generated or hand-made assets

Put static images in `public/assets/...` when you want them copied directly into the Pages build. Reference them with root-relative paths such as `/assets/tokens/ward.png`.

Theme packs live in `src/content/themes.ts`. A ruleset chooses a default theme through `visualTheme.themeId`, while the shell also lets the player cycle themes manually.

## Client State

Runtime state is kept in `src/core/state/appStore.ts`. It stores:

- active ruleset and dice profile
- active deck, discard, and current card
- progress, danger, ward, and last roll
- activity log
- save slots
- scene pulse used by the Pixi surface

There is no required backend. Save slots and theme preferences use browser `localStorage`, which works on GitHub Pages and other static hosts.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The Vite config sets the production base path to `/Paper-RPG-Online/`, which matches GitHub Pages for this repository name.

## GitHub Pages Deployment

The repository includes two workflows:

- `.github/workflows/pull-request-check.yml` runs the production build for PRs.
- `.github/workflows/deploy-pages.yml` builds and deploys `dist` to GitHub Pages on pushes to `main`.

In GitHub, enable Pages with GitHub Actions as the source. After that, merging to `main` will publish the static app.

## Next Extension Points

- Asset-backed Pixi sprites for cards, tokens, boards, and effects
- Character sheet modules registered by ruleset
- Encounter builders and random generators
- Import/export for shareable static save files
- Command history for undo, replay, and table logs
