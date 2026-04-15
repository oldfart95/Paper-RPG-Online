import { create } from 'zustand';
import { createDeckRun } from '../../engine/cards/deckEngine';
import { rollDiceProfile } from '../../engine/dice/diceEngine';
import { getRulesetManifest, orderedRulesets } from '../../engine/rulesets/registry';
import {
  formatSnapshotStamp,
  loadSaveSlots,
  loadThemePreference,
  saveSlotsToStorage,
  saveThemePreference,
} from '../persistence/sessionStorage';
import type {
  ActivityEntry,
  DeckCardDefinition,
  DiceMode,
  DiceRollResult,
  RulesetId,
  SaveSlot,
  SessionSnapshot,
  ThemeId,
} from '../types';

type AppState = {
  theme: ThemeId;
  rulesetId: RulesetId;
  diceProfileId: string;
  diceMode: DiceMode;
  deck: DeckCardDefinition[];
  discard: DeckCardDefinition[];
  currentCard: DeckCardDefinition | null;
  deckCount: number;
  ritualProgress: number;
  dangerLevel: number;
  boonWard: boolean;
  lastRoll: DiceRollResult | null;
  activity: ActivityEntry[];
  saveSlots: SaveSlot[];
  scenePulse: number;
  setTheme: (theme: ThemeId) => void;
  cycleRuleset: () => void;
  cycleDiceMode: () => void;
  drawCard: () => void;
  rollDice: () => void;
  resetRun: () => void;
  saveSession: (slotId: string) => void;
  restoreSession: (slotId: string) => void;
};

const nextEntry = (label: string, detail: string): ActivityEntry => ({
  id: `${label}-${crypto.randomUUID()}`,
  label,
  detail,
});

const getPrimaryDeck = (rulesetId: RulesetId) => getRulesetManifest(rulesetId).decks[0];

const getActiveDiceProfile = (rulesetId: RulesetId, profileId: string) => {
  const ruleset = getRulesetManifest(rulesetId);
  return ruleset.dice.find((profile) => profile.id === profileId) ?? ruleset.dice[0];
};

const freshRun = (rulesetId: RulesetId) => {
  const run = createDeckRun(getPrimaryDeck(rulesetId));
  return {
    ...run,
    ritualProgress: 0,
    dangerLevel: 0,
    boonWard: false,
    lastRoll: null,
  };
};

const resolveCard = (card: DeckCardDefinition, state: AppState) => {
  const ruleset = getRulesetManifest(state.rulesetId);
  const progressCounter = ruleset.counters.find((counter) => counter.id === 'progress');
  const dangerCounter = ruleset.counters.find((counter) => counter.id === 'danger');
  const progressLabel = ruleset.terminology.progress.toLowerCase();
  const dangerLabel = ruleset.terminology.danger.toLowerCase();
  const effect = card.effect ?? {};
  const entries: ActivityEntry[] = [nextEntry(card.title, card.feature)];
  let ritualProgress = state.ritualProgress;
  let dangerLevel = state.dangerLevel;
  let boonWard = state.boonWard;
  let lastRoll = state.lastRoll;

  if (card.type === 'hazard' && boonWard) {
    entries.unshift(nextEntry(`${ruleset.terminology.ward} Holds`, `${card.title} is cancelled and the token is spent.`));
    return {
      ritualProgress,
      dangerLevel,
      boonWard: false,
      lastRoll,
      entries,
    };
  }

  if (effect.rollTarget) {
    const profile = getActiveDiceProfile(state.rulesetId, state.diceProfileId);
    const roll = rollDiceProfile(profile, state.diceMode);
    lastRoll = roll;

    if (roll.total >= effect.rollTarget) {
      ritualProgress += effect.rollProgress ?? 1;
      entries.unshift(
        nextEntry(
          roll.label,
          `${profile.label} rolled ${roll.total}; gain ${effect.rollProgress ?? 1} ${progressLabel}.`,
        ),
      );
    } else {
      ritualProgress += effect.progress ?? 0;
      dangerLevel += effect.rollDanger ?? 0;
      entries.unshift(
        nextEntry(
          'Complication',
          `${profile.label} rolled ${roll.total}; gain ${effect.progress ?? 0} ${progressLabel} and ${
            effect.rollDanger ?? 0
          } ${dangerLabel}.`,
        ),
      );
    }
  } else {
    ritualProgress += effect.progress ?? (card.type === 'omen' ? 1 : 0);
    dangerLevel += effect.danger ?? (card.type === 'hazard' ? 1 : 0);
  }

  if (effect.preparedProgress && state.discard.some((discarded) => discarded.type === 'boon')) {
    ritualProgress += effect.preparedProgress;
    entries.unshift(nextEntry('Prepared Table', `Gain ${effect.preparedProgress} extra ${progressLabel}.`));
  }

  if (effect.stableProgress && state.dangerLevel <= 1) {
    ritualProgress += effect.stableProgress;
    entries.unshift(nextEntry('Stable Table', `Gain ${effect.stableProgress} extra ${progressLabel}.`));
  }

  if (effect.dangerRelief) {
    dangerLevel -= effect.dangerRelief;
    entries.unshift(nextEntry('Pressure Eases', `Reduce ${dangerLabel} by ${effect.dangerRelief}.`));
  }

  if (effect.ward) {
    boonWard = true;
    entries.unshift(nextEntry(`${ruleset.terminology.ward} Ready`, `The next hazard can be cancelled.`));
  }

  return {
    ritualProgress: Math.min(progressCounter?.max ?? 7, Math.max(0, ritualProgress)),
    dangerLevel: Math.min(dangerCounter?.max ?? 5, Math.max(0, dangerLevel)),
    boonWard,
    lastRoll,
    entries,
  };
};

const buildSnapshot = (
  state: Pick<
    AppState,
    'theme' | 'rulesetId' | 'diceProfileId' | 'diceMode' | 'deckCount' | 'ritualProgress' | 'dangerLevel' | 'scenePulse'
  >,
): SessionSnapshot => ({
  theme: state.theme,
  rulesetId: state.rulesetId,
  diceProfileId: state.diceProfileId,
  diceMode: state.diceMode,
  deckCount: state.deckCount,
  ritualProgress: state.ritualProgress,
  dangerLevel: state.dangerLevel,
  scenePulse: state.scenePulse,
  timestamp: new Date().toISOString(),
});

const initialRuleset = orderedRulesets[0];

export const useAppStore = create<AppState>((set, get) => ({
  theme: loadThemePreference(),
  rulesetId: initialRuleset.id,
  diceProfileId: initialRuleset.dice[0].id,
  diceMode: initialRuleset.dice[0].defaultMode,
  ...freshRun(initialRuleset.id),
  scenePulse: 0,
  saveSlots: loadSaveSlots(),
  activity: [
    nextEntry('Session Ready', 'The active deck is shuffled and the tabletop is ready.'),
    nextEntry('Framework Online', 'Rulesets, decks, dice, zones, counters, themes, and saves are loaded from manifests.'),
  ],
  setTheme: (theme) => {
    saveThemePreference(theme);
    set({
      theme,
      activity: [nextEntry('Theme Shifted', `${theme} theme engaged.`), ...get().activity].slice(0, 8),
    });
  },
  cycleRuleset: () => {
    const currentIndex = orderedRulesets.findIndex((ruleset) => ruleset.id === get().rulesetId);
    const nextRuleset = orderedRulesets[(currentIndex + 1) % orderedRulesets.length];
    const run = freshRun(nextRuleset.id);
    saveThemePreference(nextRuleset.visualTheme.themeId);
    set({
      ...run,
      rulesetId: nextRuleset.id,
      theme: nextRuleset.visualTheme.themeId,
      diceProfileId: nextRuleset.dice[0].id,
      diceMode: nextRuleset.dice[0].defaultMode,
      scenePulse: Math.random(),
      activity: [
        nextEntry('Ruleset Loaded', `${nextRuleset.name} engaged. ${nextRuleset.objective}`),
        ...get().activity,
      ].slice(0, 8),
    });
  },
  cycleDiceMode: () => {
    const profile = getActiveDiceProfile(get().rulesetId, get().diceProfileId);
    const currentIndex = profile.modes.indexOf(get().diceMode);
    const nextMode = profile.modes[(currentIndex + 1) % profile.modes.length];
    set({
      diceMode: nextMode,
      activity: [nextEntry('Dice Profile', `Switched ${profile.label} to ${nextMode}.`), ...get().activity].slice(0, 8),
    });
  },
  drawCard: () => {
    const state = get();
    const ruleset = getRulesetManifest(state.rulesetId);
    const progressMax = ruleset.counters.find((counter) => counter.id === 'progress')?.max ?? 7;
    const dangerMax = ruleset.counters.find((counter) => counter.id === 'danger')?.max ?? 5;

    if (state.deck.length === 0 || state.ritualProgress >= progressMax || state.dangerLevel >= dangerMax) {
      set({
        activity: [
          nextEntry('Draw Locked', 'Reset the run or restore a save to continue the encounter.'),
          ...state.activity,
        ].slice(0, 8),
      });
      return;
    }

    const [card, ...remainingDeck] = state.deck;
    const resolved = resolveCard(card, state);
    const discard = [card, ...state.discard].slice(0, getPrimaryDeck(state.rulesetId).cards.length);
    const deckCount = remainingDeck.length;
    const outcomeEntries = [...resolved.entries];

    if (resolved.ritualProgress >= progressMax) {
      outcomeEntries.unshift(nextEntry('Objective Complete', `${ruleset.terminology.progress} is complete. The table wins.`));
    } else if (resolved.dangerLevel >= dangerMax || deckCount === 0) {
      outcomeEntries.unshift(nextEntry('Objective Failed', `${ruleset.terminology.danger} or an empty deck ends the encounter.`));
    }

    set({
      deck: remainingDeck,
      discard,
      currentCard: card,
      deckCount,
      ritualProgress: resolved.ritualProgress,
      dangerLevel: resolved.dangerLevel,
      boonWard: resolved.boonWard,
      lastRoll: resolved.lastRoll,
      scenePulse: Math.random(),
      activity: [...outcomeEntries, ...state.activity].slice(0, 8),
    });
  },
  rollDice: () => {
    const profile = getActiveDiceProfile(get().rulesetId, get().diceProfileId);
    const roll = rollDiceProfile(profile, get().diceMode);
    set({
      lastRoll: roll,
      scenePulse: Math.random(),
      activity: [
        nextEntry('Practice Roll', `${profile.label} landed on ${roll.total} in ${get().diceMode} mode.`),
        ...get().activity,
      ].slice(0, 8),
    });
  },
  resetRun: () => {
    const run = freshRun(get().rulesetId);
    set({
      ...run,
      scenePulse: Math.random(),
      activity: [
        nextEntry('Encounter Reset', 'The active deck is reshuffled and the tabletop counters are clear.'),
        ...get().activity,
      ].slice(0, 8),
    });
  },
  saveSession: (slotId) => {
    const snapshot = buildSnapshot(get());
    const nextSlots = get().saveSlots.map((slot) => (slot.id === slotId ? { ...slot, snapshot } : slot));

    saveSlotsToStorage(nextSlots);
    set({
      saveSlots: nextSlots,
      activity: [
        nextEntry('Session Saved', `${slotId.toUpperCase()} updated at ${formatSnapshotStamp(snapshot)}.`),
        ...get().activity,
      ].slice(0, 8),
    });
  },
  restoreSession: (slotId) => {
    const slot = get().saveSlots.find((entry) => entry.id === slotId);
    if (!slot?.snapshot) {
      set({
        activity: [nextEntry('Restore Skipped', `${slotId.toUpperCase()} is empty.`), ...get().activity].slice(0, 8),
      });
      return;
    }

    const manifest = getRulesetManifest(slot.snapshot.rulesetId);
    const run = freshRun(slot.snapshot.rulesetId);
    saveThemePreference(slot.snapshot.theme);
    set({
      ...run,
      theme: slot.snapshot.theme,
      rulesetId: slot.snapshot.rulesetId,
      diceProfileId: slot.snapshot.diceProfileId ?? manifest.dice[0].id,
      diceMode: slot.snapshot.diceMode,
      deckCount: slot.snapshot.deckCount,
      ritualProgress: slot.snapshot.ritualProgress,
      dangerLevel: slot.snapshot.dangerLevel,
      scenePulse: Math.random(),
      activity: [
        nextEntry('Session Restored', `${manifest.name} restored from ${slot.label}.`),
        ...get().activity,
      ].slice(0, 8),
    });
  },
}));
