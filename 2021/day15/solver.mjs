import { lineReader, gridReader2, printGrid2 } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);

const solver = async () => {
  const grid = await gridReader2(
    'input.txt',
    (n, {x, y}) => ({
      v: parseInt(n),
      c: Infinity,
      x,
      y,
    }),
  )
  // printGrid2(grid, {cellPrint: (o) => o.v });
  // console.log(grid)

  const flatGrid = grid.flat();
  // console.log(flatGrid);

  const end = {y: grid.length - 1, x: grid[0].length - 1};

  // console.log('end', end);

  const getNeighbors = (x, y) => {
    return [[ x, y - 1], [x, y + 1, x], [x - 1, y], [x + 1, y]]
      // .map(([x, y]) => {console.log(`x ${x} y ${y}`); return [x, y];})
      .filter(([x, y]) => (
        y >= 0
        && y <= end.y
        && x >= 0
        && x <= end.x
      ))
      .map(([x, y]) => ({ x, y }));
  };

  grid[0][0].c = 0;

  let safety = 500000;
  const check = ['0_0'];

  while(check.length && safety) {
    const [ x, y ] = check.shift().split('_').map(n => parseInt(n));
    // console.log('----------CHECKING', x, y);
    const neighbors = getNeighbors(x, y);
    // console.log('neighbors', neighbors);

    neighbors.forEach(({ x: nx, y: ny }) => {
      const fromNeighborCost = grid[ny][nx].c + grid[y][x].v;
      if (fromNeighborCost < grid[y][x].c) {
        // Cheaper way to get here
        grid[y][x].c = fromNeighborCost;
        // console.log(`Setting cost at ${x},${y} = ${grid[y][x].c} (from ${nx},${ny})`);
      }
    });

    check.push(
      ...neighbors
        .filter(({ x: nx, y: ny }) => (
          (grid[ny][nx].c > grid[y][x].c + grid[ny][nx].v)
          && !check.includes(`${nx}_${ny}`)
        ))
        .map(({ x, y }) => `${x}_${y}`)
    );

    // console.log('check', check);
    
    safety--;
  }

  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p1', grid[end.y][end.x].c);
}

const solver2 = async () => {
  const grid = await gridReader2(
    'input.txt',
    (n, {x, y}) => ({
      v: parseInt(n),
      c: Infinity,
      x,
      y,
    }),
  );

  let end = {y: grid.length - 1, x: grid[0].length - 1};

  // console.log(end);

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (!y && !x) {
        continue;
      }
      const bump = y + x;
      for (let i = 0; i <= end.y; i++) {
        const ny = y * (end.y + 1) + i;
        if (!grid[ny]) {
          grid[ny] = [];
        }

        for (let j = 0; j <= end.x; j++) {
          const nx = x * (end.x + 1) + j;
          grid[ny][nx] = {
            v: ((grid[i][j].v - 1 + bump) % 9) + 1,
            x: nx,
            y: ny,
            c: Infinity,
          };
        }
      }
    }
  }

  end = {y: grid.length - 1, x: grid[0].length - 1};

  // printGrid2(grid, {cellPrint: (o) => o.v });
  // console.log(grid)

  

  // console.log('end', end);

  const getNeighbors = (x, y) => {
    return [[ x, y - 1], [x, y + 1, x], [x - 1, y], [x + 1, y]]
      // .map(([x, y]) => {console.log(`x ${x} y ${y}`); return [x, y];})
      .filter(([x, y]) => (
        y >= 0
        && y <= end.y
        && x >= 0
        && x <= end.x
      ))
      .map(([x, y]) => ({ x, y }));
  };

  grid[0][0].c = 0;

  let safety = 50000000;
  const check = ['0_0'];

  while(check.length && safety) {
    const [ x, y ] = check.shift().split('_').map(n => parseInt(n));
    // console.log('----------CHECKING', x, y);
    const neighbors = getNeighbors(x, y);
    // console.log('neighbors', neighbors);

    neighbors.forEach(({ x: nx, y: ny }) => {
      const fromNeighborCost = grid[ny][nx].c + grid[y][x].v;
      if (fromNeighborCost < grid[y][x].c) {
        // Cheaper way to get here
        grid[y][x].c = fromNeighborCost;
        // console.log(`Setting cost at ${x},${y} = ${grid[y][x].c} (from ${nx},${ny})`);
      }
    });

    check.push(
      ...neighbors
        .filter(({ x: nx, y: ny }) => (
          (grid[ny][nx].c > grid[y][x].c + grid[ny][nx].v)
          && !check.includes(`${nx}_${ny}`)
        ))
        .map(({ x, y }) => `${x}_${y}`)
    );

    // console.log('check', check);
    
    safety--;
  }

  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p2', grid[end.y][end.x].c);
}


await solver();
await solver2();
