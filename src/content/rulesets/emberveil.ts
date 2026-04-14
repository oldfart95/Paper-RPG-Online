import type { RulesetManifest } from '../../core/types';

export const emberveilManifest: RulesetManifest = {
  id: 'emberveil',
  name: 'Emberveil Ledger',
  tagline: 'Occult expedition play with omen cards and attrition pressure.',
  summary:
    'A parchment-forward demo ruleset built around ritual risk, a dwindling omen deck, and dramatic d20 checks.',
  supportedDice: ['d6', 'd10', 'd20'],
  zoneLabels: ['Deck', 'Ritual Ring', 'Discard', 'Player Line'],
  starterDeck: 'Omen Deck',
  themeHint: 'parchment',
  actions: [
    {
      id: 'draw-omen',
      label: 'Draw Omen',
      detail: 'Reveal pressure from the ritual deck and push the scene forward.',
    },
    {
      id: 'roll-risk',
      label: 'Risk Roll',
      detail: 'Make a high-drama d20 check with advantage, neutral, or risk modes.',
    },
  ],
};
