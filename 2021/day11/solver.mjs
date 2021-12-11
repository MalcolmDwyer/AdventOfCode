import { printGrid } from '../../common.mjs';
import { gridReader2 } from '../../common.mjs';

const neighbors = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const step = (grid) => {
  const maxY = grid.length - 1;
  const maxX = grid[0].length - 1;
  // console.log('--------');
  let tens = [];
  let flashes = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j]++;

      if (grid[i][j] === 10) {
        tens.push([i,j]);
        flashes++;
      }
    }
  }

  while (tens.length) {
    const [i, j] = tens.pop();
    neighbors.forEach(([y, x]) => {
      if ( (i + y >= 0)
        && (i + y <= maxY)
        && (j + x >= 0)
        && (j + x <= maxX)
      ) {
        grid[i + y][j + x]++;
        if (grid[i + y][j + x] === 10) {
          flashes++;
          tens.push([i + y, j + x]);
        }
      }
    });
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] > 9) {
        grid[i][j] = 0;
      }
    }
  }

  // console.log('flashes', flashes);
  // printGrid(grid, ' ', 3);
  // printGrid(grid);
  // console.log('---');
  return flashes;
}

const solver = async () => {
  let grid = await gridReader2('input.txt', (c) => parseInt(c));
  // printGrid(grid, ' ', 3);

  let flashes = 0;
  let cycle = 0;
  while (cycle < 100) {
    const newFlashes = step(grid);
    // console.log('newFlashes', newFlashes);
    flashes += newFlashes;
    cycle++;
  } 
  console.log('p1', flashes);
}

const solver2 = async () => {
  let grid = await gridReader2('input.txt', (c) => parseInt(c));
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  // printGrid(grid, ' ', 3);

  const all = grid.length * grid[0].length;
  let cycle = 0;
  while (true) {
    const newFlashes = step(grid);
    cycle++;
    if (newFlashes === all) {
      console.log('p2', cycle);
      break;
    }
  }
}


solver();
solver2();
