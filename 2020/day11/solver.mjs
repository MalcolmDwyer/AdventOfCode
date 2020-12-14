import { lineReader, gridReader } from '../../common.mjs';

const nextCell = (grid, r, c) => {
  const neighbors = [
    grid[r-1] ? grid[r-1][c-1] : '',
    grid[r-1] ? grid[r-1][c] : '',
    grid[r-1] ? grid[r-1][c+1] : '',
    grid[r][c-1] || '',
    grid[r][c+1] || '',
    grid[r+1] ? grid[r+1][c-1] : '',
    grid[r+1] ? grid[r+1][c] : '',
    grid[r+1] ? grid[r+1][c+1] : '',
  ]
  if (grid[r][c] === 'L' && !neighbors.filter(n => n === '#').length) {
    return '#';
  }
  else if (grid[r][c] === '#' && neighbors.filter(n => n === '#').length >= 4) {
    return 'L'
  }
  else {
    return grid[r][c];
  }
}

const ray = (grid, _x, _y, dx, dy) => {
  // x is row, y is col
  let x = _x;
  let y = _y;
  let n;

  while (true) {
    n = grid[x + dx] && grid[x + dx][y + dy] || null;

    if (n === null) {
      return null;
    }
    if (['L', '#'].includes(n)) {
      return n;
    }
    x = x + dx;
    y = y + dy;
    
  }
}

const nextCell2 = (grid, r, c) => {
  const neighbors = [
    ray(grid, r, c, -1, -1),
    ray(grid, r, c, -1,  0),
    ray(grid, r, c, -1,  1),
    ray(grid, r, c, 0, -1),
    ray(grid, r, c, 0, +1),
    ray(grid, r, c, 1, -1),
    ray(grid, r, c, 1,  0),
    ray(grid, r, c, 1,  1),
  ]
  if (grid[r][c] === 'L' && !neighbors.filter(n => n === '#').length) {
    return '#';
  }
  else if (grid[r][c] === '#' && neighbors.filter(n => n === '#').length >= 5) {
    return 'L'
  }
  else {
    return grid[r][c];
  }
}

const compare = (grid1, grid2) => {
  let same = true;
  for (let x = 0; same && x < grid1.length; x++) {
    for (let y = 0; same && y < grid1.length; y++) {
      if (grid1[x][y] !== grid2[x][y]) {
        same = false;
      }
    }
  }
  return same;
}

const count = (grid) => {
  let c = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      if (grid[x][y] === '#') {
        c++;
      }
    }
  }
  return c;
}

const print = (grid) => {
  console.log('-------------');
  grid.map(row => console.log(row.join('')));
}


const solver = async () => {
  let grid = await gridReader('input.txt');

  let stable = false;
  let i = 0;
  while (!stable) {
    const nextGrid = grid.map((row, rix) => row.map((col, cix) => nextCell2(grid, rix, cix)));
    // print(nextGrid);

    stable = compare(grid, nextGrid);
    
    grid = nextGrid;
    console.log(i);
    i++;
  }

  const occ = count(grid);;

  console.log('occupied', occ);

}


solver();

