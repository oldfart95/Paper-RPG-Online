import type { DeckCardDefinition, DeckDefinition } from '../../core/types';

export const shuffleCards = (cards: DeckCardDefinition[]): DeckCardDefinition[] => {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

export const createDeckRun = (deck: DeckDefinition) => {
  const cards = shuffleCards(deck.cards);

  return {
    deck: cards,
    discard: [] as DeckCardDefinition[],
    currentCard: cards[0] ?? null,
    deckCount: cards.length,
  };
};
