# Paradise Lost: The Fallen — Gameplay Document

## Overview

**Title**: Paradise Lost: The Fallen
**Genre**: Narrative Adventure / Interactive Fiction
**Engine**: Phaser 3 + Ink (inkjs)
**Resolution**: 1280×720
**Platform**: Web (Desktop & Mobile browsers)

A narrative adventure game that retells John Milton's *Paradise Lost* from the fallen angels' perspective. Players navigate branching dialogue, shape character relationships, and influence the moral trajectory of the story through meaningful choices — from the burning lake of Hell to the gates of Eden.

---

## Core Gameplay Loop

```
Enter Scene → Watch cinematic intro → Read dialogue (typewriter effect)
    → Make choices (1–4 options) → Observe consequences → Transition to next scene
```

1. **Scene Entry** — A thematic environment fades in with animated elements (particles, character silhouettes, environmental effects).
2. **Dialogue** — An overlay presents narrative text with a typewriter effect (30ms/character). Speaker names appear in gold above the text.
3. **Player Choice** — At branching points, 1–4 numbered options appear. Choices affect moral alignment, character stats, and story flags.
4. **Scene Transition** — After dialogue completes, the screen fades to black (2000ms) and the next scene begins.

---

## Controls

| Input | Action |
|-------|--------|
| **Space** | Advance dialogue / Skip typewriter animation |
| **1–4** | Select numbered dialogue choice |
| **Click/Tap** | Advance dialogue or select a choice |

All interactions are available via both keyboard and mouse/touch, ensuring full mobile compatibility.

---

## Characters

### Playable Perspective

The player experiences the story primarily through **Satan's** perspective, making choices that shape his rhetoric, alliances, and moral stance.

### Fallen Angels

| Character | Title | Starting Loyalty | Starting Resolve | Starting Wisdom | Role |
|-----------|-------|:---:|:---:|:---:|------|
| **Satan** | The Adversary | 100 | 90 | 60 | Protagonist. The defiant leader rallying the fallen host. |
| **Beelzebub** | Lord of the Flies | 85 | 70 | 65 | Satan's lieutenant and voice of pragmatism. |
| **Moloch** | The Warrior | 90 | 95 | 20 | Advocates open war. Fierce but unsubtle. |
| **Belial** | The Persuader | 50 | 30 | 80 | Counsels inaction and ease. Eloquent but uncommitted. |
| **Mammon** | The Builder | 60 | 50 | 70 | Proposes building a rival kingdom in Hell. |

### Other Key Figures

- **Sin** — Daughter of Satan, guardian of Hell's gates. Part woman, part serpent.
- **Death** — Son of Sin, a crowned shadow at the gates.
- **Chaos** — Primordial ruler of the formless void between Hell and Heaven.
- **The Son** — Voice of divine mercy in the Heavenly court.
- **Michael** — Archangel who enforces the expulsion from Eden.
- **Adam & Eve** — Humanity in Paradise, observed and ultimately tempted.

---

## Character Stats

Each fallen angel has three stats on sliding scales:

- **Loyalty** (-100 to 100) — Commitment to Satan's cause. Negative values indicate rebellion against the rebellion itself.
- **Resolve** (0 to 100) — Determination and willingness to act. Low resolve leads to passivity or despair.
- **Wisdom** (0 to 100) — Understanding of consequences and deeper truths. High wisdom enables nuanced choices.

Stats are modified by player choices throughout the game and are tracked for future branching and ending variations.

---

## Moral Alignment

A global **Moral Alignment** scale ranges from **-100 (Tyrannical)** to **+100 (Sympathetic)**.

- Choices that emphasize power, domination, and revenge shift alignment negative.
- Choices that emphasize understanding, empathy, and questioning authority shift alignment positive.
- The final alignment score reflects the player's interpretation of Satan — tragic hero or irredeemable tyrant.

---

## Scene Progression

The game follows a linear chapter structure across Milton's 12-book epic, with branching dialogue within each scene.

### Act I — The Fall and the Abyss (Books I–II)

| # | Scene | Setting | Key Events |
|---|-------|---------|------------|
| 1 | **Lake of Fire** | Burning lake in Hell | Satan and Beelzebub awaken after the Fall from Heaven. Satan delivers his first defiant speech. Player shapes his initial rhetoric. |
| 2 | **Pandemonium** | Hell's newly built palace | The fallen angels construct Pandemonium. Six golden pillars rise as construction sparks fly. The host assembles. |
| 3 | **Council of Hell** | Council chamber | The great debate. Moloch argues for war, Belial for peace, Mammon for building, Beelzebub for corrupting Man. Player influences the outcome. |
| 4 | **Gates of Hell** | Hell's threshold | Satan encounters Sin and Death. He must persuade them to open the gates. A negotiation of allegiance and horror. |
| 5 | **Chaos** | The formless void | Satan navigates the abyss between Hell and the created world. Swirling elements, lightning flashes, and a battered figure pressing onward. |

### Act II — Heaven and Earth (Books III–IV)

| # | Scene | Setting | Key Events |
|---|-------|---------|------------|
| 6 | **Heaven** | The celestial throne room | A shift in perspective. God observes Satan's journey and foretells humanity's fall. The Son offers himself as sacrifice. Concentric rings of divine light pulse from the throne. |
| 7 | **Satan Lands** | Earth's outer shell / cosmic descent | Satan descends through the planetary spheres — Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn — toward the green-blue glow of Earth. |
| 8 | **Garden of Eden** | Paradise | Satan perches in the Tree of Life and watches Adam and Eve in their innocence. Rivers, fireflies, and dappled sunlight. The player shapes Satan's reaction — envy, sorrow, or cold purpose. |
| 9 | **Satan's Soliloquy** | Mount Niphates at dawn | "Which way I fly is Hell; myself am Hell." Satan wrestles with regret, pride, and the impossibility of repentance as the sun rises over the mountains. |

### Act III — Temptation and Judgment (Books IX–XII)

| # | Scene | Setting | Key Events |
|---|-------|---------|------------|
| 10 | **Temptation** | Garden clearing by the Tree of Knowledge | The serpent approaches Eve beneath the forbidden tree. Glowing fruit pulses with warmth. The player influences the serpent's rhetoric. |
| 11 | **The Fall** | Beneath the Tree of Knowledge | Eve reaches for the fruit. Adam arrives and chooses to fall with her. The sky darkens progressively as the moment of transgression unfolds. |
| 12 | **Judgment** | The garden, beneath divine light | The Son descends in a column of light to judge Adam, Eve, and the serpent. Hellfire creeps in from the edges. Consequences are pronounced. |
| 13 | **Expulsion** | Gate of Eden | Michael with flaming sword bars the gate. Cherubim fire blazes around the pillars. Adam and Eve walk hand-in-hand into the barren world beyond — toward a distant dawn. Credits roll. |

---

## Visual Design

### Art Direction

The game evokes the aesthetic of 19th-century illustrated editions of *Paradise Lost*, drawing directly from **Gustave Doré's 50 engravings** (public domain).

- **Doré illustrations** serve as scene backgrounds when available, displayed with a sepia tint (0xddaa88) and fit-scaled to the viewport.
- **Procedurally generated fallbacks** ensure the game is fully playable without any image assets. Each scene has a hand-crafted gradient background with appropriate mood.

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | `#c4a45a` | Speaker names, UI highlights, choices |
| Dark Gold | `#8a7a5a` | Subtitles, disabled UI, secondary text |
| Fire Orange | `#c44a1a` | Hellfire, danger, temptation glow |
| Cream | `#e0d8c8` | Body text, readable content |
| Primary Black | `#0a0a0a` | Backgrounds, dialogue box |
| Secondary Black | `#1a1a1a` | Character silhouettes, deep shadows |

### Typography

**Georgia, serif** is used throughout — evoking the literary, classical nature of the source material. Font sizes range from 14px (UI elements) to 64px (title screen).

### Particle Effects

Every scene features ambient particle systems that reinforce mood:

- **Lake of Fire**: 40 floating embers rising from the lower half
- **Pandemonium**: 25 golden-orange construction sparks
- **Council**: 20 slow-drifting dust motes in lamplight
- **Gates of Hell**: 18 cold-blue and hot-red motes
- **Chaos**: 30 wild multi-colored particles with erratic motion
- **Heaven**: 25 golden-white ascending motes
- **Garden scenes**: 12–25 golden fireflies
- **Expulsion**: 8 cherubim flame particles around the gate

---

## Dialogue System

### Ink Integration

All narrative content is authored in **Ink** (compiled to JSON) and processed by the `DialogueManager` system, which wraps the inkjs runtime.

- **Speaker tags**: Lines are tagged with `#speaker:CharacterName` to attribute dialogue.
- **Branching**: Ink's knot/stitch system provides branching paths within each scene.
- **Story variables**: Ink variables can be set from game code to influence available branches.
- **Knot jumping**: The `goTo(knotName)` method allows scenes to start at specific narrative points.

### Dialogue UI

The `DialogueScene` runs as a Phaser overlay on top of the current gameplay scene.

- **Dialogue box**: Dark rounded rectangle (85% opacity) with a gold border at the bottom of the screen.
- **Speaker name**: Displayed in gold above the text area.
- **Typewriter effect**: Text reveals at 30ms per character. Click or press Space to skip to full text.
- **Continue prompt**: A blinking "▶ Continue" indicator pulses when the player can advance.
- **Choice display**: Numbered options (1–4) fade in with a staggered slide animation. Choices highlight on hover.

---

## Narrative Content

| Dialogue File | Book | Approximate Size |
|---------------|------|:---:|
| `book1-lake-of-fire.json` | I | 1.9 KB |
| `book1-pandemonium.json` | I | 6.5 KB |
| `book2-council.json` | II | 7.5 KB |
| `book2-gates-of-hell.json` | II | 8.7 KB |
| `book2-chaos.json` | II | 11 KB |
| `book3-heaven.json` | III | 11 KB |
| `book3-satan-lands.json` | III | 13 KB |
| `book4-garden-of-eden.json` | IV | 16 KB |
| `book4-satan-soliloquy.json` | IV | 16 KB |
| `book4-temptation-begins.json` | IV | 16 KB |
| `book9-the-fall.json` | IX | 15 KB |
| `book10-judgment.json` | X–XI | 12 KB |
| `book12-expulsion.json` | XII | 13 KB |

**Total narrative content**: ~150 KB of compiled Ink JSON across 13 dialogue files.

---

## Game Flow Diagram

```
┌─────────────┐
│  Boot Scene  │  Load assets, generate fallback textures
└──────┬──────┘
       ▼
┌─────────────┐
│  Main Menu   │  "Begin the Fall" / Continue / About
└──────┬──────┘
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Lake of Fire │────▶│ Pandemonium │────▶│   Council   │
│   (Book I)   │     │   (Book I)   │     │  (Book II)  │
└──────────────┘     └──────────────┘     └──────┬──────┘
                                                  ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Heaven    │◀────│    Chaos    │◀────│Gates of Hell│
│  (Book III)  │     │  (Book II)  │     │  (Book II)  │
└──────┬──────┘     └──────────────┘     └──────────────┘
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Satan Lands  │────▶│Garden/Eden  │────▶│  Soliloquy  │
│ (Book III)   │     │  (Book IV)  │     │  (Book IV)  │
└──────────────┘     └──────────────┘     └──────┬──────┘
                                                  ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Temptation  │────▶│  The Fall   │────▶│  Judgment   │
│  (Book IV)   │     │  (Book IX)  │     │ (Book X–XI) │
└──────────────┘     └──────────────┘     └──────┬──────┘
                                                  ▼
                                          ┌─────────────┐
                                          │  Expulsion   │
                                          │  (Book XII)  │
                                          └──────┬──────┘
                                                  ▼
                                          ┌─────────────┐
                                          │   Credits    │
                                          └─────────────┘
```

---

## Technical Architecture

### Systems

| System | File | Purpose |
|--------|------|---------|
| **GameState** | `src/systems/GameState.ts` | Global singleton tracking characters, choices, flags, and moral alignment |
| **DialogueManager** | `src/systems/DialogueManager.ts` | Ink story wrapper handling narrative flow, speaker tags, choices, and knot navigation |
| **DialogueScene** | `src/ui/DialogueScene.ts` | Phaser overlay scene rendering dialogue UI with typewriter effect and choice selection |

### Key API

```typescript
// GameState
getState(): GameState
recordChoice(choiceId: string, alignmentShift?: number): void
setFlag(flag: string, value: boolean): void
hasFlag(flag: string): boolean
getCharacter(id: string): CharacterState
modifyCharacter(id: string, changes: Partial<CharacterState>): void

// DialogueManager
loadStory(inkJson: object): void
continue(): DialogueLine | null
getChoices(): DialogueChoice[]
choose(index: number): void
goTo(knotName: string): void
isEnded(): boolean
```

### Scene Lifecycle

Each gameplay scene follows a consistent pattern:

1. **create()** — Build visual environment (background, characters, effects, particles)
2. **Fade in** — Camera fades from black/white (2000–4000ms)
3. **Staggered reveals** — Characters and elements appear with timed delays
4. **Launch dialogue** — Start `DialogueScene` as overlay after intro animations complete
5. **onDialogueComplete** — Fade out camera, transition to next scene via `scene.start()`

---

## Future Roadmap

### Audio (Howler.js — installed, not yet active)
- Ambient soundscapes per scene (crackling fire, celestial choirs, wind, birdsong)
- UI sound effects for dialogue advance and choice selection
- Optional voice narration for key speeches

### Save System (Zustand — installed, not yet active)
- LocalStorage-based save/load using Zustand state management
- Auto-save at scene transitions
- Manual save slots from pause menu

### Expanded Narrative
- Books V–VIII dialogue (the War in Heaven, Creation)
- Multiple endings based on final moral alignment score
- Stat-gated dialogue branches (e.g., high wisdom unlocks philosophical options)

### Accessibility
- Adjustable text size and typewriter speed
- High-contrast mode
- Screen reader support for dialogue text
- Colorblind-safe palette option
