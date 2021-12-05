import { lineReader, gridReader, minMax, prepGrid, printGrid } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
// const parseLine = line => parseInt(line);
const parseLine = line => {
  const parts = /(\d+),(\d+) -> (\d+),(\d+)/.exec(line);

  return ({
    x1: parseInt(parts[1]),
    y1: parseInt(parts[2]),
    x2: parseInt(parts[3]),
    y2: parseInt(parts[4]),
  });
}


const solver = async () => {
  // let lines = await lineReader('test.txt', parseLine);
  // let lines = await lineReader('test2.txt', parseLine);
  let lines = await lineReader('input.txt', parseLine);

  const {
    min: minX,
    max: maxX
  } = minMax(lines, (line) => [line.x1, line.x2]);
  const {
    min: minY,
    max: maxY
  } = minMax(lines, (line) => [line.y1, line.y2]);

  const grid = prepGrid({minX, maxX, minY, maxY}, 0);

  // grid.forEach((gl) => console.log(gl.join(' ')));


  const vLines = lines.filter(({x1, x2}) => x1 === x2);
  const hLines = lines.filter(({y1, y2}) => y1 === y2);
  const dLines = lines.filter(({y1, y2, x1, x2}) => y1 !== y2 && x1 !== x2);

  // console.log('dlines', dLines);

  const hv = [...hLines, ...vLines];
  let overlapsP1 = 0;
  let overlapsP2 = 0;

  vLines.forEach((line) => {
    const x = line.x1;
    // console.log('x', x);
    for (let y = Math.min(line.y1, line.y2); y <= Math.max(line.y1, line.y2); y++) {
      grid[y][x]++;

      if (grid[y][x] === 2) {
        overlapsP1++;
        overlapsP2++;
      }
    }
  });
  hLines.forEach((line) => {
    const y = line.y1;
    // console.log('y', y);
    for (let x = Math.min(line.x1, line.x2); x <= Math.max(line.x1, line.x2); x++) {
      grid[y][x]++;

      if (grid[y][x] === 2) {
        overlapsP1++;
        overlapsP2++;
      }
    }
  });

  dLines.forEach((line) => {
    let x1, x2, y1, y2;
    let dir = 1;
    if (
      (line.x1 < line.x2 && line.y1 < line.y2)
      || (line.x1 > line.x2 && line.y1 > line.y2)
    ) { //    \
      x1 = Math.min(line.x1, line.x2); x2 = Math.max(line.x1, line.x2);
      y1 = Math.min(line.y1, line.y2); y2 = Math.max(line.y1, line.y2);
      // console.log('\\ line', line, x1, x2, y1, y2);

      for (let i = y1, j = x1; i <= y2; i++, j++) {
        grid[i][j]++;
        if (grid[i][j] === 2) {
          overlapsP2++;
        }
      }
    }
    else { // /
      x1 = Math.min(line.x1, line.x2); x2 = Math.max(line.x1, line.x2);
      y1 = Math.max(line.y1, line.y2); y2 = Math.min(line.y1, line.y2);
      // console.log('/ line', line, x1, x2, y1, y2);

      for (let i = y1, j = x1; i >= y2; i--, j++) {
        grid[i][j]++;
        if (grid[i][j] === 2) {
          overlapsP2++;
        }
      }
    }
  });

  console.log('----------------');
  if (grid.length < 20) {
    printGrid(grid, ' ');
  }
  
  
  
  console.log('p1', overlapsP1);
  console.log('p2', overlapsP2);

}


solver();
