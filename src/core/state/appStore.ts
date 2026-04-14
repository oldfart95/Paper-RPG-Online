import { create } from 'zustand';
import { orderedRulesets, getRulesetManifest } from '../../engine/rulesets/registry';
import {
  formatSnapshotStamp,
  loadSaveSlots,
  loadThemePreference,
  saveSlotsToStorage,
  saveThemePreference,
} from '../persistence/sessionStorage';
import type { ActivityEntry, DiceMode, RulesetId, SaveSlot, SessionSnapshot, ThemeId } from '../types';

type AppState = {
  theme: ThemeId;
  rulesetId: RulesetId;
  diceMode: DiceMode;
  deckCount: number;
  activity: ActivityEntry[];
  saveSlots: SaveSlot[];
  scenePulse: number;
  setTheme: (theme: ThemeId) => void;
  cycleRuleset: () => void;
  cycleDiceMode: () => void;
  drawCard: () => void;
  rollDice: () => void;
  saveSession: (slotId: string) => void;
  restoreSession: (slotId: string) => void;
};

const diceModes: DiceMode[] = ['advantage', 'neutral', 'risk'];

const nextEntry = (label: string, detail: string): ActivityEntry => ({
  id: `${label}-${crypto.randomUUID()}`,
  label,
  detail,
});

const buildSnapshot = (state: Pick<AppState, 'theme' | 'rulesetId' | 'diceMode' | 'deckCount' | 'scenePulse'>): SessionSnapshot => ({
  theme: state.theme,
  rulesetId: state.rulesetId,
  diceMode: state.diceMode,
  deckCount: state.deckCount,
  scenePulse: state.scenePulse,
  timestamp: new Date().toISOString(),
});

export const useAppStore = create<AppState>((set, get) => ({
  theme: loadThemePreference(),
  rulesetId: orderedRulesets[0].id,
  diceMode: 'neutral',
  deckCount: 18,
  scenePulse: 0,
  saveSlots: loadSaveSlots(),
  activity: [
    nextEntry('Session Ready', 'Demo ruleset loaded and the table has been prepared.'),
    nextEntry('Theme Loaded', 'Parchment Arcana skin applied with motion-enabled shell panels.'),
  ],
  setTheme: (theme) => {
    saveThemePreference(theme);
    set({
      theme,
      activity: [
        nextEntry('Theme Shifted', `${theme === 'holo' ? 'Signal Holo' : 'Parchment Arcana'} engaged.`),
        ...get().activity,
      ].slice(0, 6),
    });
  },
  cycleRuleset: () => {
    const currentIndex = orderedRulesets.findIndex((ruleset) => ruleset.id === get().rulesetId);
    const nextRuleset = orderedRulesets[(currentIndex + 1) % orderedRulesets.length];
    const currentDeck = nextRuleset.id === 'neon-hollows' ? 24 : 18;
    set({
      rulesetId: nextRuleset.id,
      theme: nextRuleset.themeHint,
      deckCount: currentDeck,
      scenePulse: Math.random(),
      activity: [
        nextEntry('Ruleset Loaded', `${nextRuleset.name} engaged with ${nextRuleset.starterDeck.toLowerCase()} ready.`),
        ...get().activity,
      ].slice(0, 6),
    });
    saveThemePreference(nextRuleset.themeHint);
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
  saveSession: (slotId) => {
    const snapshot = buildSnapshot(get());
    const nextSlots = get().saveSlots.map((slot) =>
      slot.id === slotId
        ? {
            ...slot,
            snapshot,
          }
        : slot,
    );

    saveSlotsToStorage(nextSlots);
    set({
      saveSlots: nextSlots,
      activity: [
        nextEntry('Session Saved', `${slotId.toUpperCase()} updated at ${formatSnapshotStamp(snapshot)}.`),
        ...get().activity,
      ].slice(0, 6),
    });
  },
  restoreSession: (slotId) => {
    const slot = get().saveSlots.find((entry) => entry.id === slotId);
    if (!slot?.snapshot) {
      set({
        activity: [
          nextEntry('Restore Skipped', `${slotId.toUpperCase()} is empty.`),
          ...get().activity,
        ].slice(0, 6),
      });
      return;
    }

    const manifest = getRulesetManifest(slot.snapshot.rulesetId);
    saveThemePreference(slot.snapshot.theme);
    set({
      theme: slot.snapshot.theme,
      rulesetId: slot.snapshot.rulesetId,
      diceMode: slot.snapshot.diceMode,
      deckCount: slot.snapshot.deckCount,
      scenePulse: Math.random(),
      activity: [
        nextEntry('Session Restored', `${manifest.name} restored from ${slot.label}.`),
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
