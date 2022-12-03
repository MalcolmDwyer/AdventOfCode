import { lineReader, gridsMinMaxFromCoords, printFlatGrid } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);

const neighbors = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1], [ 0, 0], [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const solver = async (T) => {
  let lines = await lineReader('input.txt');
  const algo = lines[0];

  const image = lines.slice(1).map(line => line.split(''));
  let grid = [];
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      if (image[y][x] === '#') {
        grid.push({x, y});
      }
    }
  }
  // console.log(grid);


  let gridCoords = gridsMinMaxFromCoords(grid);
  gridCoords = {
    minX: gridCoords.minX - 5,
    minY: gridCoords.minY - 5,
    maxX: gridCoords.maxX + 5,
    maxY: gridCoords.maxY + 5,
  };
  printFlatGrid(grid, gridCoords, {fn: (g) => g ? '#' : '.'});

  let nextGrid;
  for (let t = 0; t < T; t++) {
    nextGrid = [];
    console.log(`${t}/${T-1} -----------------------------`);
    const borders = grid.filter(({x, y}) => (
      x === gridCoords.minX
      || x === gridCoords.maxX
      || y === gridCoords.minY
      || y === gridCoords.maxY
    ));
    // console.log('borders.length', borders.length);

    // if (t && !borders.length) {
    if ((t%2)) {
      for (let x = gridCoords.minX; x <= gridCoords.maxX; x++) {
        grid.push({x, y: gridCoords.minY});
        grid.push({x, y: gridCoords.maxY});
      }
      for (let y = gridCoords.minY + 1; y < gridCoords.maxY; y++) {
        grid.push({x: gridCoords.minX, y});
        grid.push({x: gridCoords.maxX, y});
      }

      // console.log('extended:');
      // printFlatGrid(grid, gridCoords, {fn: (g) => g ? '#' : '.'});
    }
    else {
      // console.log('Expanded but not extended:');
      gridCoords = {
        minX: gridCoords.minX - 2,
        minY: gridCoords.minY - 2,
        maxX: gridCoords.maxX + 2,
        maxY: gridCoords.maxY + 2,
      };
      // printFlatGrid(grid, gridCoords, {fn: (g) => g ? '#' : '.'});
    }
    

    // console.log('gridCoords', gridCoords);

    for (let y = gridCoords.minY; y <= gridCoords.maxY; y++) {
      for (let x = gridCoords.minX; x <= gridCoords.maxX; x++) {
        const sourceStr = neighbors.map(([yo, xo]) => {
          return grid.find((g) => g.x === x + xo && g.y === y + yo)
            ? 1
            : 0
        }).join('');
        const sourceVal = parseInt(sourceStr, 2);
        const lookup = algo[sourceVal];
        // console.log(y, x, 'sourceStr', sourceStr, sourceVal, '-->', lookup);

        if (lookup === '#') {
          nextGrid.push({
            x, y
          });
        }
      }
    }
    grid = nextGrid.filter(({x, y}) => (
         x > gridCoords.minX
      && x < gridCoords.maxX
      && y > gridCoords.minY
      && y < gridCoords.maxY
    ));

    console.log('nextgrid:');
    printFlatGrid(grid, gridCoords, {fn: (g) => g ? '#' : '.'});
  }
  
  // gridForEach(gridCoords, ({x, y}) => {
  //   return grid.find((g) => g.x === x + xo && g.y + yo === y)
  //     ? '#'
  //     : '.'
  // });

  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);

  // gridCoords = {
  //   minX: gridCoords.minX + 2,
  //   minY: gridCoords.minY + 2,
  //   maxX: gridCoords.maxX - 2,
  //   maxY: gridCoords.maxY - 2,
  // };

  // grid = grid.filter(({x, y}) => (
  //      x >= gridCoords.minX
  //   && x <= gridCoords.maxX
  //   && y >= gridCoords.minY
  //   && y <= gridCoords.maxY
  // ));
  console.log(T, grid.length);
  // console.log('algo', algo);
  // console.log(image);
  // console.log('');
  // printGrid2(image);

  printFlatGrid(grid, gridCoords, {fn: (g) => g ? '#' : '.'});

}



// await solver(2);
// < 5713
await solver(50);
// < 20622

/*

for (let i = 0; i < X; i++) {

}

for (let i = 0; i < X; i++) {
  for (let j = 0; j < Y; j++) {
  
  }
}


*/