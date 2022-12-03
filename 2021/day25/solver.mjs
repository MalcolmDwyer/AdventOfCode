import { printGrid2, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);


const solver = async () => {
  let grid = await gridReader('input.txt');

  console.log('Start --------------------');
  // console.table(grid);
  printGrid2(grid);
  const w = grid[0].length;
  const h = grid.length;
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);

  let didMove = true;
  let t = 0;

  while (didMove) {
    let nextGrid = [];
    for (let i = 0; i < h; i++) {
      nextGrid[i] = [];
      for (let j = 0; j < w; j++) {
        nextGrid[i][j] = '.';
      }
    }

    didMove = false;

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        if (grid[i][j] === '>') {
          if (grid[i][ (j + 1) % w ] === '.') {
            didMove = true;
            nextGrid[i][ (j + 1) % w ] = '>';
          }
          else {
            nextGrid[i][j] = '>';
          }
        }
        else if (grid[i][j] === 'v') {
          nextGrid[i][j] = 'v';
        }
      }
    }

    grid = nextGrid;

    // console.log('next');
    // printGrid2(nextGrid);
    console.log(`T ${t} a ----------------------------`);
    printGrid2(grid);

    nextGrid = [];
    for (let i = 0; i < h; i++) {
      nextGrid[i] = [];
      for (let j = 0; j < w; j++) {
        nextGrid[i][j] = '.';
      }
    }

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        if (grid[i][j] === 'v') {
          if (grid[ (i + 1) % h ][j] === '.') {
            didMove = true;
            nextGrid[ (i + 1) % h ][j] = 'v';
          }
          else {
            nextGrid[i][j] = 'v';
          }
        }
        else if (grid[i][j] === '>') {
          nextGrid[i][j] = '>';
        }
      }
    }
    grid = nextGrid;

    console.log(`T ${t} b ----------------------------`);
    printGrid2(grid);

    t++;
  }
  console.log('p1', t);

  printGrid2(grid);

}

const solver2 = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p2');
}


await solver();
// await solver2();

/*

for (let i = 0; i < X; i++) {

}

for (let i = 0; i < X; i++) {
  for (let j = 0; j < Y; j++) {
  
  }
}


*/