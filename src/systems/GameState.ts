export interface CharacterState {
  name: string;
  title: string;
  loyalty: number;     // -100 (rebellious) to 100 (loyal to Satan)
  resolve: number;     // 0–100, determination to continue the war
  wisdom: number;      // 0–100, understanding of their situation
}

export interface GameState {
  currentChapter: number;
  currentScene: string;
  characters: Record<string, CharacterState>;
  choices: string[];             // history of player choices
  flags: Record<string, boolean>; // story flags
  moralAlignment: number;        // -100 (tyrannical) to 100 (sympathetic)
}

const initialCharacters: Record<string, CharacterState> = {
  satan: {
    name: 'Satan',
    title: 'The Adversary',
    loyalty: 100,
    resolve: 90,
    wisdom: 60,
  },
  beelzebub: {
    name: 'Beelzebub',
    title: 'Lord of the Flies',
    loyalty: 85,
    resolve: 70,
    wisdom: 65,
  },
  moloch: {
    name: 'Moloch',
    title: 'The Warrior',
    loyalty: 90,
    resolve: 95,
    wisdom: 20,
  },
  belial: {
    name: 'Belial',
    title: 'The Persuader',
    loyalty: 50,
    resolve: 30,
    wisdom: 80,
  },
  mammon: {
    name: 'Mammon',
    title: 'The Builder',
    loyalty: 60,
    resolve: 50,
    wisdom: 70,
  },
};

let state: GameState = {
  currentChapter: 1,
  currentScene: 'LakeOfFireScene',
  characters: { ...initialCharacters },
  choices: [],
  flags: {},
  moralAlignment: 0,
};

export function getState(): GameState {
  return state;
}

export function recordChoice(choiceId: string, alignmentShift: number = 0): void {
  state.choices.push(choiceId);
  state.moralAlignment = Phaser.Math.Clamp(
    state.moralAlignment + alignmentShift, -100, 100
  );
}

export function setFlag(flag: string, value: boolean = true): void {
  state.flags[flag] = value;
}

export function hasFlag(flag: string): boolean {
  return state.flags[flag] === true;
}

export function getCharacter(id: string): CharacterState | undefined {
  return state.characters[id];
}

export function modifyCharacter(id: string, changes: Partial<CharacterState>): void {
  if (state.characters[id]) {
    Object.assign(state.characters[id], changes);
  }
}

// We import Phaser for the Clamp utility — keep it available
import Phaser from 'phaser';
