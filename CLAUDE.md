# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Paradise Lost: The Fallen — a narrative adventure game built with Phaser 3 and Ink (inkjs) for branching dialogue. Players experience Milton's Paradise Lost from the fallen angels' perspective.

## Commands

- `npm run dev` — Start dev server on port 3000 with hot reload
- `npm run build` — TypeScript compile + Vite build to `dist/`
- `npm run preview` — Serve production build locally

No test framework or linter is configured.

## Architecture

**Entry**: `index.html` → `src/main.ts` creates a Phaser game (1280×720, AUTO renderer) with four scenes.

**Scene flow**: BootScene → MainMenuScene → LakeOfFireScene → DialogueScene (overlay)

- `src/scenes/BootScene.ts` — Preloads assets (Doré illustrations, dialogue JSON) and procedurally generates fallback textures (character silhouettes, gradient backgrounds).
- `src/scenes/MainMenuScene.ts` — Title screen with ember particle animations.
- `src/scenes/LakeOfFireScene.ts` — Book I gameplay scene. Loads Ink story JSON, displays Doré engraving background (fit-scaled with sepia tint), reveals characters with timed animations, launches DialogueScene as an overlay scene.
- `src/ui/DialogueScene.ts` — Dialogue UI overlay with typewriter effect (30ms/char), speaker names, and numbered choices. Supports keyboard (Space to advance, number keys 1-4 for choices) and mouse/tap input.

**Systems**:
- `src/systems/GameState.ts` — Global state singleton (module-level variable, not a class). Tracks characters (Satan, Beelzebub, Moloch, Belial, Mammon) with loyalty/resolve/wisdom stats, player choices, flags, and moral alignment (-100 to 100). Exported via `getState()`, `recordChoice()`, `setFlag()`, `getCharacter()`, `modifyCharacter()`.
- `src/systems/DialogueManager.ts` — Wraps inkjs Story. Extracts `#speaker:Name` tags from Ink lines. Returns `DialogueLine` objects with text, speaker, and tags. Supports `goTo(knotName)` for jumping between Ink knots.

**Assets**:
- `public/assets/dialogue/book1-lake-of-fire.json` — Compiled Ink JSON with branching narrative.
- `public/assets/illustrations/dore/paradise-lost-01.jpg` through `paradise-lost-50.jpg` — All 50 Gustave Doré engravings (public domain, from Wikimedia Commons). ~20MB total.

## Key Conventions

- ES modules (`"type": "module"` in package.json)
- TypeScript strict mode, target ES2020
- Path alias: `@/*` → `src/*` (configured in tsconfig.json and vite.config.ts, but source currently uses relative imports)
- Color palette: gold `#c4a45a`, dark gold `#8a7a5a`, fire orange `#c44a1a`, cream `#e0d8c8`, blacks `#0a0a0a`/`#1a1a1a`
- Georgia serif font throughout
- All animations use Phaser tweens and `time.delayedCall()` for sequencing
- Dependencies `zustand` and `howler` are installed but not yet actively used
