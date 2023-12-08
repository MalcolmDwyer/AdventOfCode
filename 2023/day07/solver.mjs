import { lineReader, gridReader } from '../../common.mjs';

const handRank = ['5', '4', 'full', '3', 'tp', 'p', 'h'];

const solver = async () => {
  const rank = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  let lines = await lineReader('input.txt');

  const hands = lines.map((line) => {
    const [cardsText, bidText] = line.split(' ');
    const bid = parseInt(bidText);
    const cards = cardsText.split('');
    return {bid, cards};
  });

  const ranked = hands.map(({bid, cards}) => {
    const counts = new Map();
    cards.forEach((card) => {
      counts.set(card, (counts.get(card) ?? 0) + 1);
    });
    const rankedCounts = Array.from(counts).sort((a, b) => a[1] < b[1]);

    // console.log(cards, rankedCounts);

    const best = rankedCounts[0][1];
    const second = rankedCounts[1]?.[1] ?? 0;

    let type = 'h';

    if (best === 5) {
      type = '5';
    }
    else if (best === 4) {
      type = '4';
    }
    else if (best === 3) {
      if (second === 2) {
        type = 'full'
      }
      else {
        type = '3'
      }
    }
    else if (best === 2) {
      if (second === 2) {
        type = 'tp'
      }
      else {
        type = 'p'
      }
    }

    return {
      bid, cards, type
    }
  }).sort((a,b) => {
    if (handRank.indexOf(a.type) < handRank.indexOf(b.type)) {
      return -1
    }
    else if (handRank.indexOf(a.type) ===  handRank.indexOf(b.type)) {
      const firstDiff = a.cards.findIndex((card, ix) => card !== b.cards[ix]);
      return rank.indexOf(a.cards[firstDiff]) - rank.indexOf(b.cards[firstDiff]);
    }
    return 1;
  });

  // console.log('ranked hands', ranked);

  const score = ranked.reduce((acc, {bid}, ix) => {
    return acc + (ranked.length - ix) * bid;
  }, 0)
  console.log('p1', score);
}

const solver2 = async () => {
  const rank = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];
  let lines = await lineReader('input.txt');
  const hands = lines.map((line) => {
    const [cardsText, bidText] = line.split(' ');
    const bid = parseInt(bidText);
    const cards = cardsText.split('');
    return {bid, cards};
  });

  const ranked = hands.map(({bid, cards}) => {
    // console.log('--------------------');
    const counts = new Map();
    cards.forEach((card) => {
      counts.set(card, (counts.get(card) ?? 0) + 1);
    });
    const rankedCounts = Array.from(counts).sort((a, b) => a[1] < b[1]);

    const jC = counts.get('J') ?? 0;
    // console.log(cards.join(''), 'rankedCounts', rankedCounts);

    const best = rankedCounts[0][1];
    const second = rankedCounts[1]?.[1] ?? 0;

    const bestWild = rankedCounts[0][0] === 'J' ? second + jC : best + jC;
    // console.log(cards.join(''), 'best', best, 'bestWild', bestWild);

    let type = 'h';

    if (bestWild === 5) {
      type = '5';
    }
    else if (bestWild === 4) {
      type = '4';
    }
    else if (bestWild === 3) {
      if (second === 2) {
        type = 'full'
      }
      else {
        type = '3'
      }
    }
    else if (bestWild === 2) {
      if (second === 2) {
        type = 'tp'
      }
      else {
        type = 'p'
      }
    }
    // console.log('type', type);

    return {
      bid, cards, type
    }
  }).sort((a,b) => {
    if (handRank.indexOf(a.type) < handRank.indexOf(b.type)) {
      return -1
    }
    else if (handRank.indexOf(a.type) ===  handRank.indexOf(b.type)) {
      const firstDiff = a.cards.findIndex((card, ix) => card !== b.cards[ix]);
      return rank.indexOf(a.cards[firstDiff]) - rank.indexOf(b.cards[firstDiff]);
    }
    return 1;
  });

  // console.log('ranked hands', ranked);

  const score = ranked.reduce((acc, {bid}, ix) => {
    return acc + (ranked.length - ix) * bid;
  }, 0)
  console.log('p2', score);
}

await solver();
await solver2();
