import { gridReader2 } from '../../common.mjs';
import chalk from 'chalk';

const gk = (x, y) => `${x}_${y}`;

const printGrid = (grid, w, h) => {
  for (let y = 0; y < h; y++) {
    let s = [];
    for (let x = 0; x < w; x++) {
      const node = grid.get(gk(x, y));
      if (node) {
        s.push(chalk.red(node.v));
      }
      else {
        s.push('.');
      }
    }
    console.log(s.join(''));
  }
}


const solver = async (expansion = 1) => {
  let w = 0;
  let h = 0;
  let map = new Map()
  let index = 0;
  await gridReader2('input.txt', (v, {x, y}) => {
    const key = gk(x, y);
    if (x > w) {
      w = x;
    }
    if (y > h) {
      h = y;
    }
    if (v === '#') {
      map.set(key, { v, x, y, key, ix: index });
      index++;
    }
    
  });
  w++;
  h++;

  let allX = Array(w).fill(null).map((_, ix) => ix);
  let allY = Array(h).fill(null).map((_, ix) => ix);

  // console.log(allX, allY)

  let addRowsAt = [];
  let addColsAt = [];

  for (let y = 0; y < h; y++) {
    if (!allX.some((x) => map.get(gk(x, y))?.v === '#' )) {
      addRowsAt.push(y);
    }
  }
  for (let x = 0; x < w; x++) {
    if (!allY.some((y) => map.get(gk(x, y))?.v === '#' )) {
      addColsAt.push(x);
    }
  }

  // printGrid(map, w, h);

  let expanded = new Map();

  for (let [_, node] of map) {
    const newNode = {...node};
    newNode.x = newNode.x + addColsAt.filter((ax) => ax < newNode.x).length * expansion;
    newNode.y = newNode.y + addRowsAt.filter((ay) => ay < newNode.y).length * expansion;
    const newKey = gk(newNode.x, newNode.y);
    expanded.set(gk(newNode.x, newNode.y), {...newNode, key: newKey})
  }

  // let exW = w + addColsAt.length;
  // let exH = h + addRowsAt.length;
  // printGrid(expanded, exW, exH);

  let d = 0;

  for (let [_, node1] of expanded) {
    for (let [_, node2] of expanded) {
      if (node1.ix > node2.ix) {
        let dist = (Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y));
        d += dist
      }

    }
  }

  console.log('d', d);
}


await solver(1);
await solver(999999);
