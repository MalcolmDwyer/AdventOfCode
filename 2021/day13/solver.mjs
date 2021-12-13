import {
  lineReader,
  prepGrid,
  printGrid,
  gridForEach,
  gridsMinMaxFromCoords,
} from '../../common.mjs';

const fold = (grid, fold, gridBounds) => {
  // console.log('fold', fold, gridBounds);
  let newGrid;
  const { minX, maxX, minY, maxY } = gridBounds;
  let count = 0;
  let newBounds;

  if (fold.x) {
    newBounds = {...gridBounds, maxX: fold.value};
    newGrid = prepGrid(newBounds, '.');
    gridForEach(newBounds, ({x, y}, ) => {
      const dot = (
        grid[y][x] === '#' 
        || grid[y][2 * fold.value - x] === '#'
      );
      newGrid[y][x] = dot
          ? '#'
          : '.';
      count += (dot ? 1 : 0);
    });
  }

  if (fold.y) {
    newBounds = {...gridBounds, maxY: fold.value};
    newGrid = prepGrid(newBounds, '.');
    // console.log('folding at y', fold.value);
    gridForEach(newBounds, ({x, y}, ) => {
      const dot = (
        grid[y][x] === '#'
          || grid[2 * fold.value - y][x] === '#'
      );
      newGrid[y][x] = dot
          ? '#'
          : '.';
      count += (dot ? 1 : 0);
    });
  }

  return [newGrid, count, newBounds];
};

const solver = async () => {
  let lines = await lineReader('input.txt');

  let coords = [];
  let folds = [];
  lines.forEach((l) => {
    if (l.startsWith('fold')) {
      folds.push({
        x: l[11] === 'x' ? true : false,
        y: l[11] === 'y' ? true : false,
        value: parseInt(l.slice(13)),
      })
    }
    else {
      const [x, y] = l.split(',').map((p) => parseInt(p));
      coords.push({x, y});
    }
  });

  const gridBounds = gridsMinMaxFromCoords(coords, { zeroMin: true });

  const grid = prepGrid(gridBounds, '.');

  coords.forEach(({x, y}) => {
    grid[y][x] = '#';
  });

  // console.log('coords', coords);
  // console.log('folds', folds);
  // printGrid(grid);

  let [gridF1, count] = fold(grid, folds[0], gridBounds);
  console.log('Part 1:', count);

  let gridF = grid;
  count = 0;
  let boundsF = gridBounds;
  folds.forEach((foldSpec) => {
    [gridF, count, boundsF] = fold(gridF, foldSpec, boundsF);
  });

  console.log('Part 2:');
  printGrid(gridF);
}

solver();
