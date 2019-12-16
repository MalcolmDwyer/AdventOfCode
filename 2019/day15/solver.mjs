import computer from './computer.mjs';
// import blessed from 'neo-blessed';
import { lineReader } from '../../common.mjs';
import Map from './Map.mjs';

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';

  let lines = await lineReader(file);
  let data = lines[0].split(',').map(n => parseInt(n));

  // Part 1
  run(data, false);

  // Part 2
  run(data, true);
}

solver();


// let display = blessed.screen({
//   smartCSR: true
// });
// display.key(['escape', 'q', 'C-c'], function(ch, key) {
//   return process.exit(0);
// });

// const dirs = [null, '^', 'v', '<', '>'];
const cX = [null, 0, 0, -1, 1];
const cY = [null, -1, 1, 0, 0];
const rTurns = [null, 4, 3, 1, 2];
const nextDir = (dir) => rTurns[dir];
const dirForAtoB = (ax, ay, bx, by) => {
  if (ax == bx) {
    if (ay < by) {
      return 2;
    }
    return 1;
  }
  if (ax < bx) {
    return 4;
  }
  return 3;
}
// const nextTurn = turn => 1 + ((turn) % 4); //  [1,2,3,4]
// const lTurns = [3, 1, 0, 2];
// const rTurns = [1, 3, 2, 0];

const run = async (data, exhaustive) => {
  let program = data;
  let done = false;
  let next = 1;
  // let map = {};
  let x = 0;
  let y = 0;
  // map[y] = [];
  let map = new Map();
  let d = 0; // distance from origin;
  let backtracking = false;

  let ox;
  let oy;

  map.writeCell(x, y, {
    d,
    s: '.',
  });

  const draw = () => {
    map.draw(`${t}--D:${d}--xy:${x},${y}---`);
  }

  const inputFn = () => {
    // console.log('INPUT ', next);
    return next;
  }

  const cpu = await computer(
    program, {
      // inputPromise,
      inputFn,
      // logObj: screenLog,
    })();

  const pathfind = () => {
    let go = false;
    next = nextDir(next);

    let tried = 0;
    while (!go) {
      let nx = x + cX[next];
      let ny = y + cY[next];
      let cell = map.readCell(nx, ny);
      if (!cell) {
        go = true;
        backtracking = false;
        break;
      }
      else if (backtracking) {
        let neighbors = map.neighbors(x, y);
        if (neighbors.length !== 4) {
          tried = 0;
          backtracking = false;
          continue;
        }
        // console.log(`t${t}------d${d}`);
        // console.log(cell);
        // console.log(neighbors);
        let b = neighbors.filter(n => n.d < d)[0];
        next = dirForAtoB(x, y, b.x, b.y);

        if (exhaustive && b.d === 0) {
          console.log('Exhaustive - DONE -- tracked back to 0,0');
          done = true;

          break;
        }
        // go = true;
        // done = true;
        break;
      }
      else {
        next = nextDir(next);
        tried++;

        if (tried > 3) {
          // console.log("OUT OF MOVES (need to backtrack)");
          backtracking = true;
          // done = true;
          // break;
        }
      }
    }
  }

  const updateMap = (result) => {
    let tx = x + cX[next];
    let ty = y + cY[next];

    if (result === 2) {
      d++
      ox = tx;
      oy = ty;
      if (!exhaustive) {
        // draw();
        done = true;
        console.log(`*********** DONE at ${d}  xy: ${x}, ${y}`)
      }
      map.writeCell(tx, ty, {
        s: 'o',
        d,
        // prevX: x,
        // prevY: y
      });
      x = tx;
      y = ty;
    }

    if (result === 0) {
      map.writeCell(tx, ty, {s: '#'});
    }
    if (result === 1) {
      let cell = map.readCell(tx, ty);
      if (cell) {
        // console.log(`ALREADY VISITED CELL ${x},${y} => ${tx},${ty}`)
        // console.log(cell);
        // done = true;
        // return;
        d = cell.d;
      }
      else {
        d++;
        map.writeCell(tx, ty, {
          d,
          s: '.',
          // prevX: x,
          // prevY: y,
        });
      }
      x = tx;
      y = ty;
    }
    
  }

  let t = 0;

  while (!done && t < 10000) {
    let result = await cpu.next();
    updateMap(result.value);
    pathfind();
    t++;
  }

  draw();

  if (exhaustive) {
    done = false;
    t = 0;

    let cells = [[ox, oy]];

    while (!done) {
      t++;
      let nextCells = [];
      cells.forEach(([x, y]) => {
        map.writeCell(x, y, {s: 'O'});
        let neighbors = map.neighbors(x, y).filter(n => n.s === '.');
        // if (!neighbors) {
          // console.log(map.neighbors(x, y));
          // done = true;
        // }
        nextCells = [...nextCells, ...neighbors.map(n => ([n.x, n.y]))];
        // console.log('nextCells', nextCells);
        // done = true;
      })
      if (!nextCells.length) {
        done = true;
      }
      else {
        cells = nextCells;
      }
      // draw();
    }
    console.log(`Done filling after ${t-1} minutes.`);
  }

  draw();
};




// 221 - too low


// part2:
// 395 too high