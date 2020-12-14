import { lineReader } from '../../common.mjs';
import Map from './map.mjs';
// import blessed from 'neo-blessed';


// let display = blessed.screen({
//   smartCSR: true
// });
// display.key(['escape', 'q', 'C-c'], function(ch, key) {
//   return process.exit(0);
// });

// let boxDisplay = blessed.log({
//   // left: 0,
//   // top: 0,
//   width: 40,
//   height: '100%',
//   border: {
//     type: 'line',
//   },
//   scroll: true,
//   style: {
//     fg: 'white',
//     bg: 'blue',
//     border: {
//       fg: '#f0f0f0'
//     },
//     // hover: {
//     //   bg: 'green'
//     // }
//   }
// });

// let screenLog = blessed.log({
//   left: 44,
//   height: '100%',
//   border: {
//     type: 'line',
//   },
// })

// display.append(boxDisplay);
// display.append(screenLog);
// boxDisplay.focus();
// display.render();

let screenLog =  console;


// import { lcm } from 'mathjs';
// import math from 'mathjs';

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';

  let lines = await lineReader(file);
  // let data = lines[0].split('').map(n => parseInt(n));

  // Part 1
  setup(lines);
  // part1();

  // Part 2
  part2();

  // test();
}

let map = new Map({});
let w;
let h;

let maps = {};

const drawMaps = () => {
  let drawStrings = [];
  let mapKeys = Object.keys(maps).sort((a, b) => parseInt(a) < parseInt(b) ? -1 : 1);

  mapKeys.forEach((key, ix) => {
    key = parseInt(key);
    let pre = '';
    if (!ix && (key > -5)) {
      pre = (new Array(11 * (key + 5))).fill().map(x => ' ').join('');
    }
    drawStrings.push(maps[key].drawStrings(pre));
  });
  for (let y = 0; y < 5; y++) {
    let s = drawStrings.map(strs => strs[y]);
    if (y == 1) {
      s = s.join('   /  ');
    }
    else if (y == 2) {
      s = s.join('  <   ');
    }
    else if (y == 3) {
      s = s.join('   \\  ');
    }
    else {
      s = s.join('      ');
    }
    
    console.log(s);
  }
  console.log('');
}

const setup = (lines) => {
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      map.writeCell(x, y, {s: lines[y][x]});
      w = x;
      h = y;
    }
  }
  w = lines[0].length;
  h = lines.length;

  // map.draw();
}

const initMap = (map) => {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      map.writeCell(x, y, {s: '.'});
    }
  }
}

const needsOuter = (map) => {
  let has = false;

  [0, 4].forEach(y => [0,1,2,3,4].forEach(x => {
    let c = map.readCell(x, y);
    // screenLog.log(`  hasOuter check ${x},${y}`, c);
    if (c && c.s === '#') {
      has = true;
    }
  }));
  [1, 2, 3].forEach(y => [0, 4].forEach(x => {
    let c = map.readCell(x, y);
    // screenLog.log(`  hasOuter check ${x},${y}`, c);
    if (c && c.s === '#') {
      has = true;
    }
  }))
  return has;
}

const needsInner = (map) => {
  let has = false;

  [1,3].forEach(y => [1,2,3].forEach(x => {
    let c = map.readCell(x, y);
    // screenLog.log(`  hasOuter check ${x},${y}`, c);
    if (c && c.s === '#') {
      has = true;
    }
  }));
  [2].forEach(y => [1, 3].forEach(x => {
    let c = map.readCell(x, y);
    // screenLog.log(`  hasOuter check ${x},${y}`, c);
    if (c && c.s === '#') {
      has = true;
    }
  }))
  return has;
}

const update = (map) => {
  let next = {};
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const key = `${y}_${x}`;
      const current = map.readCell(x,y).s;
      // next[key] = current;
      let count = 0;
      map.neighbors(x, y).forEach(cell => {
        // if (cell.s === '#') {
          // count++;
        // }
        count += cell.s;
      });
      if (current && count !== 1) {
        next[key] = false;
      }
      if (!current && [1, 2].includes(count)) {
        next[key] = true;
      }
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const key = `${y}_${x}`;
      if (typeof next[key] !== 'undefined') {
        map.writeCell(x, y, {s: next[key] ? 1 : 0});
      }
    }
  }
}

const updateInnerOuter = (map, inner, outer) => {
  // screenLog.log('updateInnerOuter');
  // map.draw();
  // screenLog.log('inner:');
  // if (inner) {
  //   inner.draw();
  // }
  // else {
  //   screenLog.log(' ... none');
  // }
  // screenLog.log('outer:');
  // if (outer) {
  //   outer.draw();
  // }
  // else {
  //   screenLog.log(' ... none');
  // }
  
  // screenLog.log(map);
  // screenLog.log(inner);
  // screenLog.log(outer);
  let next = {};
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // screenLog.log(`${x},${y}`)
      if (x === 2 && y === 2) {
        continue;
      }
      const key = `${y}_${x}`;
      const cell = map.readCell(x, y);
      let current = '.';
      if (cell) {
        current = map.readCell(x,y).s;
      }
      // next[key] = current;
      let count = 0;
      // console.log('map.neighbors', x, y, map.neighbors(x,y));
      map.neighbors(x, y).forEach(cell => {
        // screenLog.log('flat neighbor cell', cell);
        if (cell.x === 2 && cell.y === 2) {
          return; // skip for below inner
        }
        if (cell.s === '#') {
          count++;
        }
      });
      if (inner) {
        // left
        if (x === 1 && y === 2) {
          [0, 1, 2, 3, 4].forEach(y2 => {
            let cell = inner.readCell(0, y2);
            if (cell && cell.s === '#') {
              // screenLog.log(`inner neighbor left y2:${y2}`, cell);
              count++;
            }
          });
        }
        // right
        if (x === 3 && y === 2) {
          [0, 1, 2, 3, 4].forEach(y2 => {
            let cell = inner.readCell(4, y2);
            if (cell && cell.s === '#') {
              // screenLog.log(`inner neighbor right y2:${y2}`, cell);
              count++;
            }
          });
        }
        // top
        if (x === 2 && y === 1) {
          [0, 1, 2, 3, 4].forEach(x2 => {
            let cell = inner.readCell(x2, 0);
            if (cell && cell.s === '#') {
              // screenLog.log(`inner neighbor top x2:${x2}`, cell);
              count++;
            }
          });
        }
        // bottom
        if (x === 2 && y === 3) {
          [0, 1, 2, 3, 4].forEach(x2 => {
            let cell = inner.readCell(x2, 4);
            if (cell && cell.s === '#') {
              // screenLog.log(`inner neighbor bottom x2:${x2}`, cell);
              count++;
            }
          });
        }
      }

      if (outer) {
        // left
        if (x === 0) {
          let cell = outer.readCell(1, 2);
          if (cell && cell.s === '#') {
            // screenLog.log(`outer neighbor left x 0`, cell);
            count++;
          }
        }
        // right
        if (x === 4) {
          let cell = outer.readCell(3, 2);
          if (cell && cell.s === '#') {
            // screenLog.log(`outer neighbor right x 4`, cell);
            count++;
          }
        }
        // top
        if (y === 0) {
          let cell = outer.readCell(2, 1);
          if (cell && cell.s === '#') {
            // screenLog.log(`outer neighbor top y 0`, cell);
            count++;
          }
        }
        // bottom
        if (y === 4) {
          let cell = outer.readCell(2, 3);
          if (cell && cell.s === '#') {
            // screenLog.log(`outer neighbor bottom y 4`, cell);
            count++;
          }
        }
      }
      // console.log(`current: ${current}    count: ${count}`);

      if (!['#', '.'].includes(current)) {
        console.error('??????');
        throw new Error('foo');
      }
      if ((current === '#') && count !== 1) {
        next[key] = '.';
        // screenLog.log(`  ${x},${y} current: ${current} count: ${count} ==> .`);
      }
      else if ((current !== '#') && [1, 2].includes(count)) {
        // screenLog.log(`  ${x},${y} current: ${current} count: ${count} ==> #`);
        next[key] = '#';
      }
      else {
        next[key] = current;
      }
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const key = `${y}_${x}`;
      if (typeof next[key] !== 'undefined') {
        map.delayedWriteCell(x, y, {s: next[key]});
      }
    }
  }
}

solver();

const part1 = () => {
  const scores = new Set([]);
  // map.draw();
  let done = false;
  while (!done) {
    update(map);
    // map.draw();
    
    // let score = map.reduce((acc, d, x, y, i) => acc + (d.s === '#' ? (0x010 << i) : 0), 0);
    let score = map.reduce((acc, d, x, y, i) => {
      // screenLog.log('reducer', acc, x, y, i, d.s === '#', (0x001 << i));
      return acc + (d.s === '#' ? (0x01 << i) : 0);
    }, 0);

    if (scores.has(score)){
      screenLog.log('repeat ', score);
      done = true;
    }
    scores.add(score);
  }
}

const part2 = () => {
  maps['0'] = map;

  console.log('                                    <--- OUTER                            INNER --->')
  drawMaps();
  // let cycles = 10;
  let cycles = 200;

  for (let t = 0; t < cycles; t++) {
    // screenLog.log(`${t} ================================================================================================`);
    let mapKeys = Object.keys(maps).sort((a, b) => parseInt(a) < parseInt(b) ? -1 : 1);
    mapKeys.forEach(key => {
      // screenLog.log(`   ${key} --------------------`);
      key = parseInt(key);
      // screenLog.log('key', key);
      // maps[key].draw();
      // let needsOuterMap = needsOuter(maps[key]);
      // screenLog.log('   hasOuter:', needsOuter(maps[key]));
      // Add outer if needed:
      if (!maps[key - 1] && needsOuter(maps[key])) {
        // screenLog.log(`       building outer`);
        maps[key - 1] = new Map({});
        initMap(maps[key - 1]);
      }
      // screenLog.log('   hasInner:', needsInner(maps[key]));
      if (!maps[key + 1] && needsInner(maps[key])) {
        // screenLog.log(`       building inner`);
        maps[key + 1] = new Map({});
        initMap(maps[key + 1]);
      }
    });

    mapKeys = Object.keys(maps).sort((a, b) => parseInt(a) < parseInt(b) ? -1 : 1);
    // screenLog.log(`Updated keys: ${mapKeys.join(',')}`)
    mapKeys.forEach(key => {
      key = parseInt(key);
      // screenLog.log(`   ${key} --------------------`);
      updateInnerOuter(maps[key], maps[key + 1], maps[key - 1]);
    });

    console.log('-----------------------------------------------------------')
    // drawMaps();

    mapKeys.forEach(key => {
      // key = parseInt(key);
      // screenLog.log('commiting key', key);
      maps[key].commit();
    });

    drawMaps();

  }

  let count = 0;
  let mapKeys = Object.keys(maps).sort((a, b) => parseInt(a) < parseInt(b) ? -1 : 1);
  mapKeys.forEach(key => {
    let map = maps[key];
    count += map.reduce((acc, val, x, y) => {
      // if (x === 2 && y === 2) {
      //   return acc;
      // }
      let add = (val.s === '#' ? 1 : 0);
      // screenLog.log(`${x},${y} `)
      return acc + add
    }, 0);
    screenLog.log(`key: ${key}  count: ${count}`)
  });
  screenLog.log('count', count);
}


// !18420640

// part2 
// 1905 -- too low
// 1958 -- too high