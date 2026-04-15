import { emberveilDeck } from '../demoGame';
import type { RulesetManifest } from '../../core/types';

export const emberveilManifest: RulesetManifest = {
  id: 'emberveil',
  name: 'Emberveil Ledger',
  tagline: 'Occult expedition play with omen cards and attrition pressure.',
  summary:
    'A parchment-forward demo ruleset built around ritual risk, a dwindling omen deck, and dramatic d20 checks.',
  objective: 'Complete the seal before the breach overwhelms the table.',
  terminology: {
    progress: 'Seal',
    danger: 'Danger',
    deck: 'Omen Deck',
    discard: 'Ash Archive',
    table: 'Ritual Ring',
    ward: 'Ward',
  },
  dice: [
    {
      id: 'ritual-d20',
      label: 'Ritual d20',
      notation: '1d20',
      faces: 20,
      defaultMode: 'neutral',
      modes: ['advantage', 'neutral', 'risk'],
      successTarget: 11,
      criticalTarget: 20,
    },
  ],
  decks: [emberveilDeck],
  zones: [
    { id: 'deck', label: 'Omen Deck', role: 'Draw stack', x: 0.08, y: 0.56, width: 0.16, height: 0.28 },
    { id: 'table', label: 'Ritual Ring', role: 'Active card and tokens', x: 0.3, y: 0.22, width: 0.4, height: 0.54 },
    { id: 'discard', label: 'Ash Archive', role: 'Discard fan', x: 0.74, y: 0.56, width: 0.18, height: 0.28 },
    { id: 'player', label: 'Player Line', role: 'Future sheets and hand zones', x: 0.14, y: 0.82, width: 0.72, height: 0.1 },
  ],
  counters: [
    { id: 'progress', label: 'Seal', max: 7, tone: 'warm' },
    { id: 'danger', label: 'Danger', max: 5, tone: 'threat' },
    { id: 'ward', label: 'Ward', max: 1, tone: 'cool' },
  ],
  assets: {
    iconSet: 'letter-crest',
    cardBacks: {
      'emberveil-card-back': '/assets/card-backs/emberveil.png',
    },
    tokenIcons: {
      ward: '/assets/tokens/ward.png',
      danger: '/assets/tokens/danger.png',
      seal: '/assets/tokens/seal.png',
    },
    textureHints: ['aged vellum', 'smoked glass', 'brass edgework'],
  },
  visualTheme: {
    themeId: 'parchment',
    accent: '#d8b77f',
    tableFelt: '#1d120d',
    cardStock: '#f6ead3',
    glow: '#d49b47',
  },
  modules: [
    {
      id: 'character-sheets',
      label: 'Character Sheets',
      status: 'scaffold',
      description: 'Reserve panel slots and state namespaces for future player sheets.',
    },
    {
      id: 'encounter-helper',
      label: 'Encounter Helper',
      status: 'ready',
      description: 'The draw, roll, counter, and log loop acts as a first encounter utility.',
    },
    {
      id: 'generator-lab',
      label: 'Generator Lab',
      status: 'planned',
      description: 'Future tables can generate omens, relics, and scene prompts.',
    },
  ],
  actions: [
    {
      id: 'draw-omen',
      label: 'Draw Omen',
      detail: 'Reveal pressure from the ritual deck and push the scene forward.',
      kind: 'draw',
    },
    {
      id: 'roll-risk',
      label: 'Practice Cast',
      detail: 'Roll the active dice profile without advancing the encounter.',
      kind: 'roll',
    },
    {
      id: 'cycle-dice',
      label: 'Dice Mode',
      detail: 'Rotate advantage, neutral, and risk handling.',
      kind: 'cycle-dice',
    },
    {
      id: 'reset-run',
      label: 'Reset Run',
      detail: 'Reshuffle the active deck and clear the tabletop counters.',
      kind: 'reset',
    },
  ],
};
