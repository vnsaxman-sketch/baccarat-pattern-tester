export type Card = number;
// 0 = baccarat value 0
// 1..9 = pip value

export interface HandResult {
  playerCards: Card[];
  bankerCards: Card[];

  playerTotal: number;
  bankerTotal: number;

  outcome: 'B' | 'P' | 'T';
}

export function createEightDeckShoe(): Card[] {
  const shoe: Card[] = [];

  /*
   * Eight decks:
   *
   * 0-value cards:
   * 10/J/Q/K = 16 cards per rank per deck
   * 4 × 8 × 4 = 128 zero-value cards
   *
   * Values 1–9:
   * 4 cards per rank per deck
   * 4 × 8 = 32 of each value
   */

  for (
    let value = 0;
    value <= 9;
    value += 1
  ) {
    const copies =
      value === 0
        ? 128
        : 32;

    for (
      let i = 0;
      i < copies;
      i += 1
    ) {
      shoe.push(value);
    }
  }

  return shoe;
}

export function shuffle<T>(
  items: T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items];

  for (
    let i = result.length - 1;
    i > 0;
    i -= 1
  ) {
    const j = Math.floor(
      random() * (i + 1),
    );

    [
      result[i],
      result[j],
    ] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

export function baccaratTotal(
  cards: Card[],
): number {
  return (
    cards.reduce(
      (sum, card) =>
        sum + card,
      0,
    ) % 10
  );
}

export function drawCard(
  shoe: Card[],
  cursor: { value: number },
): Card {
  const card =
    shoe[cursor.value];

  cursor.value += 1;

  return card;
}

export function dealHand(
  shoe: Card[],
  cursor: { value: number },
): HandResult {
  const playerCards: Card[] = [
    drawCard(shoe, cursor),
    drawCard(shoe, cursor),
  ];

  const bankerCards: Card[] = [
    drawCard(shoe, cursor),
    drawCard(shoe, cursor),
  ];

  let playerTotal =
    baccaratTotal(playerCards);

  let bankerTotal =
    baccaratTotal(bankerCards);

  /*
   * Natural:
   * 8 or 9 means no third card.
   */

  if (
    playerTotal >= 8 ||
    bankerTotal >= 8
  ) {
    return {
      playerCards,
      bankerCards,

      playerTotal,
      bankerTotal,

      outcome:
        resultFromTotals(
          playerTotal,
          bankerTotal,
        ),
    };
  }

  const playerThird =
    playerTotal <= 5;

  if (playerThird) {
    const third =
      drawCard(
        shoe,
        cursor,
      );

    playerCards.push(third);

    playerTotal =
      baccaratTotal(
        playerCards,
      );

    const bankerThird =
      shouldBankerDraw(
        bankerTotal,
        third,
      );

    if (bankerThird) {
      bankerCards.push(
        drawCard(
          shoe,
          cursor,
        ),
      );

      bankerTotal =
        baccaratTotal(
          bankerCards,
        );
    }
  } else {
    bankerCards.push(
      drawCard(
        shoe,
        cursor,
      ),
    );

    bankerTotal =
      baccaratTotal(
        bankerCards,
      );
  }

  return {
    playerCards,
    bankerCards,

    playerTotal,
    bankerTotal,

    outcome:
      resultFromTotals(
        playerTotal,
        bankerTotal,
      ),
  };
}

function shouldBankerDraw(
  bankerTotal: number,
  playerThird: number,
): boolean {
  if (bankerTotal <= 2) {
    return true;
  }

  if (bankerTotal === 3) {
    return playerThird !== 8;
  }

  if (bankerTotal === 4) {
    return (
      playerThird >= 2 &&
      playerThird <= 7
    );
  }

  if (bankerTotal === 5) {
    return (
      playerThird >= 4 &&
      playerThird <= 7
    );
  }

  if (bankerTotal === 6) {
    return (
      playerThird === 6 ||
      playerThird === 7
    );
  }

  return false;
}

function resultFromTotals(
  playerTotal: number,
  bankerTotal: number,
): 'B' | 'P' | 'T' {
  if (
    bankerTotal >
    playerTotal
  ) {
    return 'B';
  }

  if (
    playerTotal >
    bankerTotal
  ) {
    return 'P';
  }

  return 'T';
}

/*
 * Creates one finite 8-deck shoe.
 *
 * This uses a common cut-card approximation:
 *
 * 1. Shuffle 416 cards.
 * 2. Burn the first card.
 * 3. Burn additional cards equal to the first card's
 *    baccarat value.
 * 4. Treat a zero-value first card as 10 for burn count.
 * 5. Deal until the requested target hand count or
 *    fewer than six cards remain.
 *
 * This is intended for the research/pattern tester.
 */

export function simulateShoe(
  targetHands: number,
  random: () => number = Math.random,
): Array<'B' | 'P' | 'T'> {
  const shoe =
    shuffle(
      createEightDeckShoe(),
      random,
    );

  const cursor = {
    value: 0,
  };

  const burn =
    drawCard(
      shoe,
      cursor,
    );

  const burnCount =
    burn === 0
      ? 10
      : burn;

  cursor.value = Math.min(
    cursor.value + burnCount,
    shoe.length,
  );

  const outcomes:
    Array<'B' | 'P' | 'T'> = [];

  while (
    outcomes.length <
      targetHands &&
    shoe.length -
      cursor.value >=
      6
  ) {
    outcomes.push(
      dealHand(
        shoe,
        cursor,
      ).outcome,
    );
  }

  return outcomes;
}