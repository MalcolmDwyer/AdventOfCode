import { lineReader } from '../../common.mjs';

const parseMonkey = (lines) => {
  const items = lines[0].slice(18).split(',').map(s => parseInt(s));

  const op = lines[1][23] === '*'
    ? (old) => old * (
        lines[1][25] === 'o'
          ? old
          : parseInt(lines[1].slice(25))
      )
    : (old) => old + (
        lines[1][25] === 'o'
          ? old
          : parseInt(lines[1].slice(25))
      );

  // console.log(`test op(2) : ${op(2)} ... op(3) :  ${op(3)}`)

  const testDiv = parseInt(lines[2].slice(21));
  const m1 = parseInt(lines[3].slice(29));
  const m2 = parseInt(lines[4].slice(30));
  // console.log('m1/m2/d', m1, m2, testDiv);
  const test = (n) => n % testDiv
    ? m2
    : m1;

  return {
    items,
    op,
    test,
    count: 0,
    modulo:  testDiv,
  }
};

const testMonkeys = [
  {
    items: [79, 98],
    op: (old) => old * 19,
    test: (n) => !(n%23)
      ? 2
      : 3,
  },
];

const solver = async (rounds, div = true) => {
  let lines = await lineReader('input.txt');

  let monkeys = [];
  while (lines.length) {
    const [index, a, b, c, d, e, ...rest] = lines;
    monkeys.push(parseMonkey([a,b,c,d,e]));
    lines = rest;
  }

  const allMods = monkeys.map(m => m.modulo).reduce((acc, m) => acc * m, 1);

  let round = 0;

  while (round < rounds) {
    // console.log('ROUND', round + 1);
    for (let m = 0; m < monkeys.length; m++) {
      let M = monkeys[m];
      // console.log(`  M[${m}] ${M.items.join(',')}`)
      while (M.items.length) {
        M.count++;
        let I = M.items.shift();
        let o = M.op(I) % allMods;
        
        let w = div
          ? Math.floor(o / 3)
          : o;

        let n = M.test(w);
        // console.log(`   ${I} ... ${M.op(I)} => ${n}`)
        // console.log(`${m} throws ${w} to ${n}`);

        monkeys[n].items.push(w);
      }
    }

    round++;
    // if (!(round%100)) {
    //   console.log(round, 'counts', monkeys.map((m) => m.count).join(', '));
    // }
  }

  const counts = monkeys.map((m) => m.count);
  counts.sort((a,b) => a < b ? 1 : -1);

  console.log(counts[0] * counts[1]);
}


await solver(20, true);
await solver(10000, false);

