import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);

// const graph = [
//   { l: [1]                  }, // 0
//   { l: [0, 2]               }, // 1
//   { l: [1, 3, 11], ns: true }, // 2
//   { l: [2, 4]               }, // 3
//   { l: [3, 15, 5], ns: true }, // 4
//   { l: [4, 6]               }, // 5
//   { l: [5, 7, 19], ns: true }, // 6
//   { l: [6, 8]               }, // 7
//   { l: [7, 9, 23], ns: true }, // 8
//   { l: [8, 10]              }, // 9
//   { l: [9]                  }, // 10

//   { l: [2, 12],  t: 'A'}, // 11
//   { l: [11, 13], t: 'A'}, // 12
//   { l: [12, 14], t: 'A'}, // 13
//   { l: [13],     t: 'A'}, // 14

//   { l: [4, 16],  t: 'B'}, // 15
//   { l: [15, 17], t: 'B'}, // 16
//   { l: [16, 18], t: 'B'}, // 17
//   { l: [17],     t: 'B'}, // 18

//   { l: [6, 20],  t: 'C'}, // 19
//   { l: [19, 21], t: 'C'}, // 20
//   { l: [20, 22], t: 'C'}, // 21
//   { l: [21],     t: 'C'}, // 22

//   { l: [8, 24],  t: 'D'}, // 23
//   { l: [23, 25], t: 'D'}, // 24
//   { l: [24, 26], t: 'D'}, // 25
//   { l: [25],     t: 'D'}, // 26
// ].map((n, ix) => ({...n, ix }));

const graph = [
  { ix: 0, l: [1]                  }, // 0
  { ix: 1, l: [0], l2: [3, 11],    }, // 1
  { ix: 2, l: [1, 3, 11], ns: true }, // 2
  { ix: 3, l2: [1, 5, 11, 15]      }, // 3
  { ix: 4, l: [3, 15, 5], ns: true }, // 4
  { ix: 5, l2: [3, 7, 15, 19]      }, // 5
  { ix: 6, l: [5, 7, 19], ns: true }, // 6
  { ix: 7, l2: [5, 9, 19, 23]      }, // 7
  { ix: 8, l: [7, 9, 23], ns: true }, // 8
  { ix: 9, l: [10], l2: [7, 23]    }, // 9
  { ix: 10, l: [9]                  }, // 10

  { ix: 11, l: [12], l2: [1, 3]}, // 11
  { ix: 12, l: [11, 13]}, // 12
  { ix: 13, l: [12, 14]}, // 13
  { ix: 14, l: [13],   }, // 14

  { ix: 15, l: [16], l2: [3, 5],}, // 15
  { ix: 16, l: [15, 17]}, // 16
  { ix: 17, l: [16, 18]}, // 17
  { ix: 18, l: [17],   }, // 18

  { ix: 19, l: [20], l2: [5, 7]}, // 19
  { ix: 20, l: [19, 21]}, // 20
  { ix: 21, l: [20, 22]}, // 21
  { ix: 22, l: [21],   }, // 22

  { ix: 23, l: [24], l2: [7, 9],}, // 23
  { ix: 24, l: [23, 25]}, // 24
  { ix: 25, l: [24, 26]}, // 25
  { ix: 26, l: [25],   }, // 26
]; // .map((n, ix) => ({...n, ix }));

const moves = {
  0: [
    [1, 2, 'A'],
    [1, 2, 3, 4, 'B'],
    [1, 2, 3, 4, 5, 6, 'C'],
    [1, 2, 3, 4, 5, 6, 7, 8, 'D'],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, 6, 7],
  ],
  1: [
    [2, 'A'],
    [2, 3, 4, 'B'],
    [2, 3, 4, 5, 6, 'C'],
    [2, 3, 4, 5, 6, 7, 8, 'D'],
    [0],
    [2, 3, 4, 5, 6, 7, 8, 9, 10],
    [2, 3, 4, 5, 6, 7, 8, 9],
    [2, 3],
    [2, 3, 4, 5],
    [2, 3, 4, 5, 6, 7],
  ],
  3: [
    [2, 'A'],
    [4, 'B'],
    [4, 5, 6, 'C'],
    [4, 5, 6, 7, 8, 'D'],
    [2, 1, 0],
    [4, 5, 6, 7, 8, 9, 10],
    [2, 1],
    [4, 5, 6, 7, 8, 9],
    [4, 5],
    [4, 5, 6, 7],
  ],
  5: [
    [4, 'B'],
    [6, 'C'],
    [4, 3, 2, 'A'],
    [6, 7, 8, 'D'],
    [4, 3, 2, 1, 0],
    [6, 7, 8, 9, 10],
    [4, 3, 2, 1],
    [6, 7, 8, 9],
    [4, 3],
    [6, 7],
  ],
  7: [
    [6, 'C'],
    [8, 'D'],
    [6, 5, 4, 'B'],
    [6, 5, 4, 3, 2, 'A'],
    [8, 9, 10],
    [8, 9],
    [6, 5, 4, 3, 2, 1, 0],
    [6, 5, 4, 3, 2, 1],
    [6, 5],
    [6, 5, 4, 3],
  ],
  9: [
    [8, 'D'],
    [8, 7, 6, 'C'],
    [8, 7, 6, 5, 4, 'B'],
    [8, 7, 6, 5, 4, 3, 2, 'A'],
    [10],
    [8, 7, 6, 5, 4, 3, 2, 1, 0],
    [8, 7, 6, 5, 4, 3, 2, 1],
    [8, 7],
    [8, 7, 6, 5],
    [8, 7, 6, 5, 4, 3],
  ],
  10: [
    [9, 8, 'D'],
    [9, 8, 7, 6, 'C'],
    [9, 8, 7, 6, 5, 4, 'B'],
    [9, 8, 7, 6, 5, 4, 3, 2, 'A'],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    [9, 8, 7, 6, 5, 4, 3, 2, 1],
    [9, 8, 7],
    [9, 8, 7, 6, 5],
    [9, 8, 7, 6, 5, 4, 3],
  ],
  'A': [
    [2, 3, 4, 'B'],
    [2, 3, 4, 5, 6, 'C'],
    [2, 3, 4, 5, 6, 7, 8, 'D'],
    [2, 1, 0],
    [2, 1],
    [2, 3, 4, 5, 6, 7, 8, 9, 10],
    [2, 3, 4, 5, 6, 7, 8, 9],
    [2, 3],
    [2, 3, 4, 5],
    [2, 3, 4, 5, 6, 7],
  ],
  'B': [
    [4, 5, 6, 'C'],
    [4, 3, 2, 'A'],
    [4, 5, 6, 7, 8, 'D'],
    [4, 3, 2, 1, 0],
    [4, 3, 2, 1],
    [4, 5, 6, 7, 8, 9, 10],
    [4, 5, 6, 7, 8, 9],
    [4, 3],
    [4, 5],
    [4, 5, 6, 7],
  ],
  'C': [
    [6, 5, 4, 'B'],
    [6, 7, 8, 'D'],
    [6, 5, 4, 3, 2, 'A'],
    [6, 7, 8, 9, 10],
    [6, 7, 8, 9],
    [6, 5, 4, 3, 2, 1, 0],
    [6, 5, 4, 3, 2, 1],
    [6, 5],
    [6, 7],
    [6, 5, 4, 3],
  ],
  'D': [
    [8, 7, 6, 'C'],
    [8, 7, 6, 5, 4, 'B'],
    [8, 7, 6, 5, 4, 3, 2, 'A'],
    [8, 9, 10],
    [8, 9],
    [8, 7, 6, 5, 4, 3, 2, 1, 0],
    [8, 7, 6, 5, 4, 3, 2, 1],
    [8, 7],
    [8, 7, 6, 5],
    [8, 7, 6, 5, 4, 3],
  ],
}

const stacks = {
  A: [11, 12, 13, 14],
  B: [15, 16, 17, 18],
  C: [19, 20, 21, 22],
  D: [23, 24, 25, 26],
};

const stackForLoc = (loc) => {
  if (loc <= 10) {
    console.error('Bad stackForX', loc);
  }
  if (loc <= 14) {
    return ['A', loc - (14 - 3)];
  }
  else if (loc <= 18) {
    return ['B', loc - (18 - 3)];
  }
  else if (loc <= 22) {
    return ['C', loc - (22 - 3)];
  }
  else if (loc <= 26) {
    return ['D', loc - (26 - 3)];
  }
  else {
    console.error('Bad stackForX', loc);
  }
}

const costs = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

const print = (locs) => `${locs.slice(0, 11)}   ${locs.slice(11, 15)}   ${locs.slice(15, 19)}   ${locs.slice(19, 23)}   ${locs.slice(23)}`;
const v = (locs, n) => locs.split('')[n] === '_' ? null : locs.split('')[n];

const stackFilter = (x, to, locs) => {
  if (to <= 10) {
    return true;
  }
  // X can move into stack containing to
  if (!stacks[x].includes(to)) {
    return false;
  }
  if (stacks[x].some((sl) => locs[sl] !== x)) {
    // console.log(`Check stack ${x} and found ${stacks[x].map((sl) => locs[sl]).join('')}`)
    return false;
  }
  console.log(`Check stack ${x} and found ${stacks[x].map((sl) => locs[sl]).join('')}`)
  return true;
}

const getMoves = (locs, from) => {
  const X = v(locs, from);
  // console.log('getMoves', from, 'X:', X);
  const paths = [];
  let m;
  let sourceStackDepth = 0;
  if (from <= 10) {
    m = moves[from];
  }
  else {
    const [X, sDepth] = stackForLoc(from);
    sourceStackDepth += sDepth;
    m = moves[X];
  }

  // console.log('m', m);

  const goodMoves = m
    .filter((path) => {
      // console.log('path1', path);
      const tail = path.slice(-1)[0];
      if (Number.isFinite(tail)) {
        return path.every((l) => !v(locs, l))
      }
      if (tail !== X) {
        // console.log('  wrong stack => false')
        return false;
      }
      // console.log('  ',
      //   stacks[tail].filter((l) => Number.isFinite(l)).every((l) => [X, null].includes(v(locs, l)))
      // );
      // console.log(stacks[tail].map((l) => v(locs, l)).join(','));
      const pathToStackIsEmpty = path
        .slice(0, -1) // ignore ABCD stack headers
        .every((l) => !v(locs, l));
      
      const stackCanTakeX = stacks[tail]
        .every((l) => {
          let sx = v(locs, l);
          return (!sx || sx === X);
        });

      // if (stackCanTakeX && pathToStackIsEmpty) {
      //   console.log('Good path to stack', from, path, X);
      // }
      
      return pathToStackIsEmpty && stackCanTakeX;
    })
    // .filter((path) => {
    //   // console.log('path2', path);
    //   return path
    //     .filter((l) => Number.isFinite(l)) // ignore ABCD stack headers
    //     .every((l) => !v(locs, l))
    // })
    .map((path) => {
      const tail = path.slice(-1)[0];
      if (!Number.isFinite(tail)) {
        const st = stacks[tail];

        // console.group('stack check', path);
        let i = 0;
        // while(!v(locs, st[i]) && (i < 4)) {
        //   console.log(v(locs, st[i]));
        //   i++;          
        // }

        // if (i === 4) {
        //   console.log('Empty stack');
        // }
        const deepestEmpty = i;
        // console.log('deepestEmpty', deepestEmpty);
        // console.groupEnd();
        // for (let i = 0; i < st.length; i++) {
        //   if (!v(locs, st[i])) {
        //     deepestEmpty = i;
        //   }
        //   else {
        //     break;
        //   }
        // }
        // const f = s.findIndex((l) => !v(locs, l));
        return [
          from,
          stacks[tail][deepestEmpty],
          sourceStackDepth + path.length + deepestEmpty,
        ]
      }
      return [
        from,
        tail,
        sourceStackDepth + path.length,
      ];
    });

  // console.log('good moves (depth:)', sourceStackDepth);
  // if (goodMoves.length) {
  //   console.log(goodMoves);
  // }
  return goodMoves;
};

const getAllMoves = (locs) => {
  // console.log('getAllMoves', print(locs));
  let movable = [];
  if (v(locs, 0) && !v(locs, 1)) { movable.push(0); }
  if (v(locs, 10) && !v(locs, 9)) { movable.push(10); }
  if (v(locs, 1)) { movable.push(1); }
  if (v(locs, 9)) { movable.push(9); }

  [3, 5, 7]
    .filter((l) => (v(locs, l)))
    .forEach((l) => {
      movable.push(l);
    });

  Object.entries(stacks).forEach(([x, stack]) => {
    const topOfStackIndex = stack.findIndex((s) => v(locs, s));
    if (topOfStackIndex < 0) {
      return;
    }
    const topOfStack = stack[topOfStackIndex];
    // console.log('stack', stack, x, 'topOfStack', topOfStack, topOfStackIndex, stack.slice(topOfStackIndex));
    // Keep already placed items in their stack
    if (!stack.slice(topOfStackIndex).every((l) => v(locs, l) === x)) {
      movable.push(topOfStack);
    }
  });

  movable.sort((a, b) => {
    // let X = v(locs, a).charCodeAt(0);
    // let Y = v(locs, b).charCodeAt(0); 
    // if (X < Y) {
    //   return 1;  
    // }
    // if (X > Y) {
    //   return -1;
    // }
    // if {

    // }
    return v(locs, a).charCodeAt(0) < v(locs, b).charCodeAt(0) ? 1 : -1;
  });

  // console.log('movable', movable);

  return movable.map((from) => getMoves(locs, from)).flat();
}

// const getAllMoves2 = (locs) => graph
//   .filter((n) => v(locs, n.ix))
//   // .map((n) => {
//   //   console.log('getMoves', locs, n.ix, v(locs, n.ix), 'l', n.l, 'l2', n.l2);
//   //   return n;
//   // })
//   .reduce(
//     (acc, n) => {
//       n.l
//         ?.filter((to) => !v(locs, to))
//         .filter((to) => stackFilter(v(locs, n.ix), to, locs))
//         .forEach((to) => {
//           acc.push([n.ix, to, 1]);
//         });
//       n.l2
//         ?.filter((to) => !v(locs, to))
//         .filter((to) => stackFilter(v(locs, n.ix), to, locs))
//         .forEach((to) => {
//           acc.push([n.ix, to, 2]);
//         });
//       return acc;
//     }, []);

const solver2 = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p2');

  // const locs = '___________CDDCBCBDABAADACB'; // Input
  const locs = '___________BDDACCBDBBACDACA'; // Test

  const target = '___________AAAABBBBCCCCDDDD';
  const visits = new Map();
  // const check = [];
  // const check = new Map();
  const check = [];

  visits.set(locs, { cost: 0, prev: null }); // 0 cost of initial

  // console.log('graph:');
  console.log(print(locs));
  // console.log('avail:');
  // console.log(getAvail(locs));
  // console.log('first moves:');
  // console.log(getAllMoves(locs, 0));
  // console.log('^^^ first moves');

  // check.push(...getMoves(locs, 0));
  // check.push([locs, 0]);
  // check.set(locs, 0);
  check.push([locs, 0]);

  let best = Infinity;
  const maxBest = 200000;

  let t = 0;
  let T = Infinity;
  while(check.length && t < T) {
    // console.group(' checks');
    //   check.forEach(([c, cost]) => console.log(`   ${cost}    ${print(c)}`));
    // console.groupEnd();
    
    // let [checkNext, prevCost] = Array.from(check.entries()).slice(-1)[0];
    // let [checkNext, prevCost] = check.entries().next().value;
    // check.delete(checkNext);
    let [checkNext, prevCost] = check.pop();
    
    if (prevCost > best) {
      continue;
    }
    if (prevCost > maxBest) {
      continue;
    }
    // const [checkNext, prevCost] = check.pop();
    // console.log(`T ${t} -- [${prevCost}] ${checkNext}`);
    // if (!(t%10000)) {
      console.log(`T ${t.toString().padStart(6, ' ')} -- [${prevCost.toString().padStart(6, ' ')}] ${print(checkNext)}  ${best} v:${visits.size} c: ${check.length}`);
    // }

    const moveCandidates = getAllMoves(checkNext);

    // getAllMoves(checkNext).forEach((move) => {
    for (let m = 0; m < moveCandidates.length; m++) {
      const move = moveCandidates[m];
      const [from, to, moveSteps] = move;
      // console.log(`M ${from} (${checkNext[from]}) -> ${to}`);
      let next = [...checkNext.split('')];
      const X = next[from];
      next[to] = next[from];
      next[from] = '_';
      
      next = next.join('');
      // console.log(`          CHECK: ${print(next)}`);

      const moveCost = prevCost + (moveSteps * costs[X]);

      if (next === target) {
        if (moveCost < best) {
          best = moveCost;
          visits.set(next, {cost: moveCost, prev: checkNext });
        }
        return;
      }

      const v = visits.get(next);
      
      if (v) {
        const { cost: vCost } = v;
        if (moveCost < vCost) {
          // console.log(`   ${from} -> ${to} ${next[to]}`);
          // console.log('Set visit', cost, print(next));
          visits.set(next, {cost: moveCost, prev: checkNext });
          // if (!check.has(next)) {
          //   check.set(next, moveCost);
          // }
          if (!check.find(([n]) => n === next)) {
            // console.log(' new check', print(next));
            check.unshift([next, moveCost]);
          }
        }
      }
      else {
        visits.set(next, {cost: moveCost, prev: checkNext });

        // console.log(`   ${from} -> ${to} ${next[to]}`);
        // visits.set(next, {cost: moveCost, prev: checkNext });
        // check.push([next, moveCost]);
        // if (!check.has(next)) {
        //   check.set(next, moveCost);  
        // }
        if (!check.find(([n]) => n === next)) {
          // console.log(' new check', print(next));
          check.unshift([next, moveCost]);
        }
      }

      // if (!check.find(([n]) => n === next)) {
      //   check.unshift([next, moveCost]);
      // }

      // if (!check.has(next)) {
      //   check.set(next, moveCost);
      // }
    }

    t++;
  }

  console.log(`p2 (t ${t}) ${best}`);
}



const solver = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p1 ... manual solve');
}

// await solver();
await solver2();
