import { lineReader } from '../../common.mjs';
import math from 'mathjs';

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';
    // 'test4.txt';
    // 'test5.txt';
  // const count = 10;
  const count = 10007;

  // const pos = 3;
  let pos = 2019;

  let lines = await lineReader(file);
  let instructions = lines.map(parseInstr);
  // console.log('instructions');
  // console.log(instructions);
  const incrs = instructions.filter(([i, v]) => i === 2).map(([i, v]) => v);
  console.log('incrs', incrs);
  console.log('lcm incrs:', math.lcm(...incrs));

  // Part 1
  // run(instructions, count, pos, 1);

  // Part 2
  pos = 2020;
  let stuff = {};
  for (let i = count; i < count + 100000; i++) {
    // console.log(`${i}--------------------------------------------------------------------------`, pos)
    let v = run(instructions, i, pos, 1);
    if (v) {
      // console.log(i, v);
      if (stuff[v]) {
        console.log(`repeat ${stuff[v]} at ${i} (${v})`);
      }
      stuff[v] = i;
    }
  }
  
  // run(instructions, 119315717514047, 2020, 101741582076661);
}

const parseInstr = (line) => {
  let reg;
  if (/deal into new stack/.test(line)) {
    return [0, 0];
  }
  else if (reg = /cut ([-0-9]*)/.exec(line)) {
    let cut = parseInt(reg[1]);
    return [1, cut];
  }
  else if (reg = /deal with increment ([-0-9]*)/.exec(line)) {
    let incr = parseInt(reg[1]);
    return [2, incr];
  }
}

class card {
  constructor(v, p, n) {
    this.v = v
    this.p = p
    this.n = n
  }
}

solver();

const run = (instructions, count, firstPos, repeat) => {
  // console.log('run', instructions.length, count, firstPos);
  let useDeck = true;
  let deck;
  if (useDeck) {
    deck = Array(count);
    deck.fill(0);
    deck = deck.map((n,x) => x);
  }
  
  let pos = firstPos;

  // let stack = new card(0, null, null);
  // let top = stack;
  // for (let i = 1; i < count; i++) {
  //   let newCard = new card(i, stack, null);
  //   stack.n = newCard;
  //   stack = newCard;
  // }
  // let end = stack;
  // stack.n = top;
  // top.p = stack;
  // stack = top;

  // let dir = true;

  // while (stack.n) {
  //   console.log(`____${stack.v}`);
  //   stack = stack.n;
  // }

  // console.log('   ', pos, deck.join(','), `${top.v}__${end.v}`);

  // console.log(`pos: ${pos}   indexOf(2019): ${deck.indexOf(2019)}`);
  // console.log('pos', pos);
  const map = {};

  let bail = false;

  for(let r = 0; r < repeat; r++) {
    if (bail) {
      break;
    }
    // if (!(r%1000000)) {
    //   console.log(`${r}--------------------------------------------------------------------------`, pos)
    // }
    for (let [command, v] of instructions) {
      if (bail) {
        break;
      }
      if (command === 0) {
        if (useDeck) {
          deck = deck.reverse();
        }
        // console.log('reverse');
        pos = count - pos - 1;
        // console.log(`pos: ${pos}   indexOf(2019): ${deck.indexOf(2019)}`);
      }
      else if (command === 1) {
        const cut = v;
        if (useDeck) {
          deck = deck.slice(cut).concat(deck.slice(0, cut));
        }
  
        let diff = pos - cut;
        pos = (diff + count) % count;
        // console.log('cut ', cut);
        // console.log(`pos: ${pos}   indexOf(2019): ${deck.indexOf(2019)}`);
        // console.log('    ', pos, `${top.v}__${end.v}`);
      }
      else if (command === 2) {
        let incr = v
        if (useDeck) {
          let newDeck = [];
          let o = 0;
          // deck.forEach(c => {
          for(let c of deck) {
            if (typeof newDeck[o] !== 'undefined') {
              // console.log('failed deal');
              bail = true;
              break;
            }
            newDeck[o] = c;
            o = (o + incr) % count;
          }
          deck = newDeck;
        }
        
        // console.log('incr', incr);
        pos = (pos * incr) % count;
        // console.log(`pos: ${pos}   indexOf(2019): ${deck.indexOf(2019)}`);
        // console.log('    ', pos, `${top.v}__${end.v}`);
      }
    }
    if (map[pos]) {
      console.log('repeat at ', r, pos)
      break;
    }
    map[pos] = true;
  }

  // console.log('part1');
  // console.log(deck.indexOf(2019));
  // console.log(`pos: ${pos}   indexOf(2019): ${deck.indexOf(2019)}    indexOf(2020): ${deck.indexOf(2020)}`);
  // console.log('pos', pos);
  // console.log(`Deck length: ${count}, &2020: ${deck[2020]}`);
  if (deck[2020]) {
    return deck[2020]
  }
}

// part1 not 708
// !5826