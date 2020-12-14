import { lineReader, gridReader } from '../../common.mjs';

const parseLine = (line) => {
  return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
};

const checkSlope = (grid, m, n) => {
  let x = 0;
  let y = 0;
  let count = 0;

  while (y < grid.length) {
    count = count + ((grid[y][x] === '#') ? 1 : 0);
    y = y + n;
    x = x + m;
    x = x%grid[0].length;
  }

  return count;
}

const solver = async () => {
  let grid = await gridReader('input.txt');
   
  // console.log(grid);
  // lines.slice(0, 200000000).forEach(line => {
    // const [all, rangeMin, rangeMax, ch, pass] = parseLine(line);

  // });

  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  let results = 1;

  slopes.forEach((slope) => {
    const count = checkSlope(grid, slope[0], slope[1]);
    // console.log(count);
    results = results * count;
  })

  console.log(results);

  // const count = checkSlope(grid, 3, 1);

  // let x = 0;
  // let y = 0;
  // let count = 0;

  // while (y < grid.length) {
  //   count = count + ((grid[y][x] === '#') ? 1 : 0);
  //   y = y + 1;
  //   x = x + 3;
  //   x = x%grid[0].length;
  // }


}


solver();

