import { lineReader } from '../../common.mjs';

const shapes = [
  [[1, 1, 1, 1]],
  [[0, 1, 0], [1, 1, 1], [0, 1, ]],
  [[1, 1, 1], [0, 0, 1], [0, 0, 1]],
  [[1], [1], [1], [1]],
  [[1, 1], [1, 1]],
];

const symbol = (_s) => ['_', '+', 'L', '|', '■'][_s];

const solver = async (file, blockCount, tag) => {
  let air = (await lineReader(file, line => line.split('')))[0];

  let grid = [];
  let t = 0; // time (rock count)
  let s = 0; // shape ix
  let a = 0; // air ix
  let floor = 0; // highest rock / floor
  let cleaned = -1;
  const cleanKeep = 100000;
  

  let live = {x: null, y: null};

  const initRows = (first, last) => {
    for (let y = first; y <= last; y++) {
      if (!grid[y]) {
        grid[y] = '.......';
      }
    }
  };

  const draw = (t, sIx, aIx, slice = Infinity) => {
    console.log(t, '--------------------------------------', symbol(sIx), air[aIx]);
    const rows = [...grid];
    const liveRocks = liveRockPositions();
    liveRocks.forEach(({x, y}) => {
      // console.log('y', y);
      let temp = rows[y].split('');
      temp[x] = '@'
      rows[y] = temp.join('');
    })
    rows.reverse();
    rows.slice(slice ? 4 : 0, slice + 4).forEach((row, ix) => {
      console.log(`|${row}|  ${deck + (rows.length - ix)}`);
    })
  };

  const getXMove = (dir, _s) => {
    const test = liveRockPositions(dir === '<' ? -1 : 1, 0);

    if (test.some(({x, y}) => (x < 0 || x > 6 || grid[y][x] === '#'))) {
      return 0;
    }
    
    if (dir === '<') {
      return -1;
    }
    else {
      return 1;
    }
  };

  const getYMove = () => {
    const test = liveRockPositions(0, -1);
    // console.log(test);
    if (test.some(({x, y}) => (y < 0 || grid[y][x] === '#'))) {
      return 0;
    }

    return -1;
  }

  const liveRockPositions = (dx = 0, dy = 0) => {
    const newRocks = [];
    if (!live) { return []; }
    shapes[s].forEach((shapeRow, rowY) => {
      shapeRow.forEach((cell, cellX) => {
        if (cell) {
          newRocks.push({x: live.x + cellX + dx, y: live.y + rowY + dy});
        }
      });
    });
    return newRocks;
  };

  const solidify = (rocks) => {
    rocks.forEach(({x, y}) => {
      let temp = grid[y].split('');
      temp[x] = '#'
      grid[y] = temp.join('');
    });
  };

  const findNewFloor = () => {
    let max = floor;
    for (let y = 0; y < floor + 5; y++) {
      if (grid[y].indexOf('#') >= 0) {
        max = y;
      }
    }
    return max;
  };

  const cleanPile = () => {
    // console.log(t, 'cleanPile', floor);
    let y = floor;
    let blockedLeft = false;
    while(true && y > 0) {
      if (blockedLeft && grid[y][6] === '#') {
        // console.log('cleaned below deck ', y);
        grid = grid.slice(y);

        // draw(t, s, a);
        // console.log('deck cleaned to ', y);
        // draw(t, s, a);
        return y;
      }
      if (grid[y][0] === '#') {
        blockedLeft = true;
      }
      // if (grid[y] === '#######') {
      //   grid = grid.slice(y);
      //   console.log('deck cleaned to ', y);
      //   return y;
      // }
      y--
    }
    return 0;
    // const cleanTo = Math.max(0, floor - cleanKeep);

    // for (let y = cleaned; y < cleanTo; y++) {
    //   delete grid[y];
    // }
    // cleaned = cleanTo;
    // console.log('cleaned', cleaned);
  };

  const c = false;

  let deck = 0;
  let prev = 0;
  let prevT = 0;

  while (t < blockCount) {
    let score = deck + floor;
    // if (!(t%10000)) { console.log(t);}
    // while (t < air.length * 10 + 1) {

    // console.log(t, s, a) <--- Use to find tag - repeated value for a when s == 1
    if (t && s === 1 && a === tag ) {
      // draw(t, s, a, 15);
      if (prev) {
        // console.log(
        //   '***',
        //   t,
        //   t - prevT,
        //   score,
        //   score - prev
        // );

        // Jump ahead
        const blockT = t - prevT;
        const blockScore = score - prev;
        const toEnd = blockCount - t;
        const jumpBlocks = Math.floor(toEnd / blockT);
        t += jumpBlocks * blockT;
        console.log('jumping to ', t);
        deck += jumpBlocks * blockScore;
      }
      prev = deck + floor;
      prevT = t;
      
    }
    // if (grid[floor - 1] === '###.###') {
    //   draw(t, s, a, 10);
    // }

    if (!(t % (5 * air.length * 10))) {
      const cleaned = cleanPile();
      deck += cleaned;
      floor -= cleaned;
    }
    // console.log('SHAPE', s);
    live = {x: 2, y: floor + 3};

    initRows(floor, floor + 3 + shapes[s].length);

    c && console.log('######################################## NEW PIECE', symbol(s));
    c && draw(t, s, a);
    
    while (true) {      
      c && console.log('#################')
      // draw(t, s, a);

      // wind:
      c && console.log('WIND', air[a]);
      live.x += getXMove(air[a], s);

      c && draw(t, s, a);

      a = (a + 1) % air.length;
      // console.log('a', a, air.length);
      
      const yMove = getYMove();
      // console.log('yMove', yMove);
      live.y += yMove;

      if (!yMove) {
        solidify(liveRockPositions());
        // floor = live.y + shapes[s].length;
        floor = findNewFloor() + 1;
        live = null;
        c && draw(t, s, a);
        break;
      }
      c && draw(t, s, a);
    }

    s = (s + 1) % shapes.length;
    t++;
  }

  // draw(t, s, a);
  console.log('Solution: ', deck + floor);
}



await solver('test.txt', 2022);
// await solver('test.txt', 1_000_000_000_000, 25);
await solver('input.txt', 1_000_000_000_000, 13);
