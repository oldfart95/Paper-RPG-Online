import type { SaveSlot, SessionSnapshot, ThemeId } from '../types';

const THEME_KEY = 'paper-rpg-theme';
const SAVE_SLOTS_KEY = 'paper-rpg-save-slots';

const defaultSlots = (): SaveSlot[] => [
  { id: 'slot-1', label: 'Slot I', snapshot: null },
  { id: 'slot-2', label: 'Slot II', snapshot: null },
  { id: 'slot-3', label: 'Slot III', snapshot: null },
];

export const loadThemePreference = (): ThemeId => {
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'holo' || saved === 'verdant') {
    return saved;
  }

  return 'parchment';
};

export const saveThemePreference = (theme: ThemeId) => {
  window.localStorage.setItem(THEME_KEY, theme);
};

export const loadSaveSlots = (): SaveSlot[] => {
  const raw = window.localStorage.getItem(SAVE_SLOTS_KEY);

  if (!raw) {
    return defaultSlots();
  }

  try {
    const parsed = JSON.parse(raw) as SaveSlot[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultSlots();
    }

    return parsed.map((slot, index) => ({
      id: slot.id ?? `slot-${index + 1}`,
      label: slot.label ?? `Slot ${index + 1}`,
      snapshot: slot.snapshot ?? null,
    }));
  } catch {
    return defaultSlots();
  }
};

export const saveSlotsToStorage = (slots: SaveSlot[]) => {
  window.localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
};

export const formatSnapshotStamp = (snapshot: SessionSnapshot | null) => {
  if (!snapshot) {
    return 'Empty';
  }

  return new Date(snapshot.timestamp).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};
