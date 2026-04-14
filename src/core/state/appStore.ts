import { create } from 'zustand';
import type { ActivityEntry, DiceMode, ThemeId } from '../types';

type AppState = {
  theme: ThemeId;
  diceMode: DiceMode;
  deckCount: number;
  activity: ActivityEntry[];
  scenePulse: number;
  setTheme: (theme: ThemeId) => void;
  cycleDiceMode: () => void;
  drawCard: () => void;
  rollDice: () => void;
};

const diceModes: DiceMode[] = ['advantage', 'neutral', 'risk'];

const nextEntry = (label: string, detail: string): ActivityEntry => ({
  id: `${label}-${crypto.randomUUID()}`,
  label,
  detail,
});

const readInitialTheme = (): ThemeId => {
  const saved = window.localStorage.getItem('paper-rpg-theme');
  return saved === 'holo' ? 'holo' : 'parchment';
};

export const useAppStore = create<AppState>((set, get) => ({
  theme: readInitialTheme(),
  diceMode: 'neutral',
  deckCount: 18,
  scenePulse: 0,
  activity: [
    nextEntry('Session Ready', 'Demo ruleset loaded and the table has been prepared.'),
    nextEntry('Theme Loaded', 'Parchment Arcana skin applied with motion-enabled shell panels.'),
  ],
  setTheme: (theme) => {
    window.localStorage.setItem('paper-rpg-theme', theme);
    set({
      theme,
      activity: [
        nextEntry('Theme Shifted', `${theme === 'holo' ? 'Signal Holo' : 'Parchment Arcana'} engaged.`),
        ...get().activity,
      ].slice(0, 6),
    });
  },
  cycleDiceMode: () => {
    const currentIndex = diceModes.indexOf(get().diceMode);
    const nextMode = diceModes[(currentIndex + 1) % diceModes.length];
    set({
      diceMode: nextMode,
      activity: [
        nextEntry('Dice Profile', `Switched roller profile to ${nextMode}.`),
        ...get().activity,
      ].slice(0, 6),
    });
  },
  drawCard: () => {
    const nextDeckCount = Math.max(0, get().deckCount - 1);
    set({
      deckCount: nextDeckCount,
      scenePulse: Math.random(),
      activity: [
        nextEntry('Card Drawn', nextDeckCount === 0 ? 'The deck is exhausted.' : `${nextDeckCount} cards remain in the omen deck.`),
        ...get().activity,
      ].slice(0, 6),
    });
  },
  rollDice: () => {
    const roll = Math.ceil(Math.random() * 20);
    set({
      scenePulse: Math.random(),
      activity: [
        nextEntry('Dice Rolled', `A d20 landed on ${roll} in ${get().diceMode} mode.`),
        ...get().activity,
      ].slice(0, 6),
    });
  },
}));
