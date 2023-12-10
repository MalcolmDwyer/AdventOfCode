import { gridReader2 } from '../../common.mjs';
import chalk from 'chalk';

const gk = (x, y) => `${x}_${y}`;

/*
| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
*/
const m = {
  '|': (x, y) => [gk(x, y+1), gk(x, y-1)],
  '-': (x, y) => [gk(x+1, y), gk(x-1, y)],
  'L': (x, y) => [gk(x, y-1), gk(x+1, y)],
  'J': (x, y) => [gk(x, y-1), gk(x-1, y)],
  '7': (x, y) => [gk(x, y+1), gk(x-1, y)],
  'F': (x, y) => [gk(x, y+1), gk(x+1, y)],
  '.': () => [],
  'S': () => [],
}

const getConnections = (char, x, y) => {
  return m[char](x, y) 
}


const printGrid = (grid, w, h) => {
  for (let y = 0; y <= h; y++) {
    let s = [];
    for (let x = 0; x <= w; x++) {
      const node = grid.get(gk(x, y));
      if (node.loop) {
        if (node.inside) {
          s.push(chalk.red.bold(node.v))  
        }
        else {
          s.push(chalk.red(node.v))
        }
        
      }
      else {
        s.push(chalk.green(node.v))
      }
    }
    console.log(s.join(''));
  }
}

const solver = async () => {
  const starts = [];
  const grid = new Map();
  let w = 0;
  let h = 0;

  await gridReader2('input.txt', (v, {x, y}) => {
    if (x > w) {
      w = x;
    }
    if (y > h) {
      h = y;
    }
    const connections = getConnections(v, x, y);
    if (v === 'S') {
      starts.push(gk(x, y))
    }
    
    const r = ({
      d: (v === 'S') ? 0 : Infinity,
      v,
      x,
      y,
      connections,
      key: gk(x, y),
      loop: (v === 'S') ? true : false,
    });

    grid.set(gk(x,y), r);
  });

  starts.forEach((key) => {
    const node = grid.get(key);
    const nk = gk(node.x, node.y-1);
    const sk = gk(node.x, node.y+1);
    const wk = gk(node.x-1, node.y);
    const ek = gk(node.x+1, node.y);
    const n = grid.get(nk);
    const s = grid.get(sk);
    const w = grid.get(wk);
    const e = grid.get(ek);

    let dir = ''

    // Find the neighbor connections
    if (n && ['7', 'F', '|'].includes(n.v)) {
      node.connections.push(nk)
      dir += 'n'
    }
    if (s && ['L', 'J', '|'].includes(s.v)) {
      node.connections.push(sk)
      dir += 's'
    }
    if (w && ['L', 'F', '-'].includes(w.v)) {
      node.connections.push(wk)
      dir += 'w'
    }
    if (e && ['J', '7', '-'].includes(e.v)) {
      node.connections.push(ek)
      dir += 'e'
    }

    // Replace node.v with the correct symbol 
    if (dir === 'nw') {
      node.v = 'J';
    }
    else if (dir === 'ne') {
      node.v = 'L';
    }
    else if (dir === 'ns') {
      node.v = '|';
    }
    else if (dir === 'sw') {
      node.v = '7'
    }
    else if (dir === 'se') {
      node.v = 'F'
    }
    else if (dir === 'we') {
      node.v = '-'
    }
  });

  let checks = [...starts];

  let maxD = 0;

  // Find the loop and distance for each step
  while (checks.length) {
    const nodeKey = checks.shift();
    const node = grid.get(nodeKey);
    node.connections.forEach((key) => {
      const neighbor = grid.get(key);
      if (neighbor && neighbor.d > (node.d + 1)) {
        neighbor.d = node.d + 1;
        neighbor.loop = true;
        maxD = Math.max(maxD, neighbor.d)
        checks.push(neighbor.key);
      }
    });
  }

  // Part 2
  let innies = 0;
  for (let y = 0; y <= h; y++) {
    let inside = 0;
    let hstart = '';
    for (let x = 0; x <= w; x++) {
      const key = gk(x,y);
      const node = grid.get(key);
      if (node.loop) {
        if (['F', 'L'].includes(node.v)) {
          // start of a horizontal run
          hstart = node.v;
        }
        if (!['F', 'L', '-'].includes(node.v)) { // ignore the start or middle of a horizontal run
          if (
            !(
              (hstart && hstart === 'F' && node.v === '7') ||
              (hstart && hstart === 'L' && node.v === 'J')
            )
          ) {
            // only count the horizontal run if it continued
            // opposite direction from the start. If it looped
            // back the same way, it doesn't change in/out.
            inside = (inside + 1) % 2;
          }
        }
        node.inside = inside;
      }
      else {
        if (inside) {
          innies++; 
          node.v = 'I';
        }
        else {
          node.v = 'O';
        } 
      }
    }
  }

  printGrid(grid, w, h);

  console.log('p1', maxD);
  console.log('p2', innies);
}


await solver();
