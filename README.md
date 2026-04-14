# Paper RPG Online

Paper RPG Online is a static-first tabletop companion app built for GitHub Pages with Vite, React, TypeScript, PixiJS, Motion, and a lightweight client-side state layer.

## What is in this vertical slice

- A React app shell for controls, logs, and save management
- A PixiJS tabletop surface for the play area
- A plugin-style ruleset registry with two demo manifests
- Local save slots stored in browser storage
- GitHub Actions workflows for pull request validation and Pages deployment

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## GitHub Pages flow

- Open pull requests against `main`
- The `Pull Request Check` workflow verifies the production build
- Merges to `main` trigger the `Deploy Pages` workflow

## Next directions

- Replace the demo ruleset manifests with richer content packs
- Add command/event history for replay and undo
- Move from abstract dice/card visuals to asset-backed components
