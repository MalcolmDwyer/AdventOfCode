import { gridReader, printGrid } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);


const solver = async () => {
  let grid = await gridReader('input.txt');

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = parseInt(grid[i][j]);
    }
  }

  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  
  // console.log(grid);
  let lowPoints = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let v = grid[i][j];

      if (
        (v < (grid[i-1]?.[j] ?? 99))
        && (v < (grid[i+1]?.[j] ?? 99))
        && (v < (grid[i]?.[j-1] ?? 99))
        && (v < (grid[i]?.[j+1] ?? 99))
      ) {
        lowPoints.push(v);
      }
    }
  }
  
  const score = lowPoints.reduce((acc, x) => acc + x + 1, 0);

  console.log('p1', score);
}

const solver2 = async () => {
  let grid = await gridReader('input.txt');

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      // grid[i][j] = {
      //   v: parseInt(grid[i][j]),
      //   n: null,
      //   steps: null,
      // };
      grid[i][j] = grid[i][j] === '9' ? ' ' : parseInt(grid[i][j]);
    }
  }

  // printGrid(grid);
  
  const regions = {};
  let key = 'A';

  const nextKey = (key) => String.fromCodePoint(1 + key.charCodeAt());

  const checkAndMarkNeighbor = (y,x, r) => {
    if (
      (grid[y]?.[x] === undefined)
      || (grid[y][x] === ' ')
    ) {
      return;
    }
    const gridKey = `${y}_${x}`;

    if (m.has(gridKey) && (m.get(gridKey) !== r)) {
      const old = m.get(gridKey);
      // console.log('MERGE!!!!!', r , '<--', old);
      m.forEach((value, key) => {
        if (value === old) {
          m.set(key, r);
        }
      });
      for (let n of regions[old]) {
        regions[r].add(n);
      }
      delete regions[old];
    }
    else {
      m.set(gridKey, r);
      regions[r].add(gridKey);
      // console.log('  ->  ', y, x, r)
    }
  }


  const m = new Map();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === ' ') {
        continue;
      }
      if (!m.has(`${i}_${j}`)) {
        // regions.push([`${i}_${j}`]);
        let s = new Set([]);
        s.add(`${i}_${j}`)
        // regions.push(s);
        regions[key] = s;
        m.set(`${i}_${j}`, key);
        key = nextKey(key);
      }
      const r = m.get(`${i}_${j}`);
      // console.log('%%%%%%', i, j, r)

      checkAndMarkNeighbor(i, j-1, r);
      checkAndMarkNeighbor(i, j+1, r);
      checkAndMarkNeighbor(i-1, j, r);
      checkAndMarkNeighbor(i+1, j, r);
    }
  }

  // console.log('p2');
  // printGrid(grid);
  // console.log(m);
  // console.log(regions);

  // console.log('array from regions');
  // console.log(Object.values(regions));
  // console.log(regions.map((r) => r.size));
  

  const top3 = Object.values(regions).sort((a, b) => a.size < b.size ? 1 : -1).slice(0, 3);
  // console.log('TOP 3', top3);
  // console.log('TOP 3 sizes', top3.map((r) => r.size));
 
  const p2 = top3.reduce((acc, n) => acc * n.size, 1);
  console.log('p2', p2);
  
}


// solver();
solver2();

/*

for (let i = 0; i < X; i++) {

}

for (let i = 0; i < X; i++) {
  for (let j = 0; j < Y; j++) {
  
  }
}


*/