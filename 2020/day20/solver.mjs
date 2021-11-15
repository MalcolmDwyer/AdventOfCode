import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };

const encodeBorder = (arr, reverse) => {
  let r = 0;
  let a = reverse ? [...arr].reverse() : arr;
  a.forEach((v, ix) => {
    r += (v === '#') ? Math.pow(2, ix) : 0;
  })
  return r;
};

const printGrid = (grid) => {
  grid.forEach((line) => {
    console.log(line.join(''));
  })
}

const search = (stitchGrid, searchPattern) => {
  let sh = stitchGrid.length;
  let sw = stitchGrid[0].length;
  
  let h = searchPattern.length;
  let w = searchPattern[0].length;

  let found = false;

  for (let y = 0; y < sh - h; y++) {
    for (let x = 0; x < sw - w; x++) {
      let all = true;
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          if (searchPattern[py][px] === '#') {
            if (stitchGrid[y + py][x + px] !== '#') {
              all = false;
            }
          }
        }
      }
      if (all) {
        console.log(`found monster at ${x},${y}`);
        found = true;

        for (let py = 0; py < h; py++) {
          for (let px = 0; px < w; px++) {
            if (searchPattern[py][px] === '#') {
              stitchGrid[y + py][x + px] = 'O';
            }
          }
        }
      }
    }
  }
  
  // console.log(`Search: ${sw} x ${sh}  <== ${w} x ${h}`);
  return found;
};

let printStitch = (stitch) => {
  let keys = Object.keys(stitch);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  keys.forEach((key) => {
    const [_, _x, _y] = /^([-0-9]*)__([-0-9]*)$/.exec(key);
    const x = parseInt(_x);
    const y = parseInt(_y);
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  });

  let grid = [];

  console.log(`    ${minX}     ${maxX}`)
  for(let y = minY; y <= maxY; y++) {
    let s = '';
    grid[y - minY] = [];
    for (let x = minX; x <= maxX; x++) {
      s = s + (stitch[`${x}__${y}`] || 'x');
      grid[y-minY][x-minX] = (stitch[`${x}__${y}`] || 'x');
    }
    console.log(`${String(y).padStart(5, ' ')}  ${s}`);
  }
  return grid;
}

let orient = (grid, rot = 0, flipX = false, flipY = false) => {
  return grid;
};

let paint = (stitch, gridId, grid, x, y, rot, flipX, flipY) => {
  console.log(`paint ID:${gridId} (${x}, ${y}) r:${rot} fx:${flipX} fy:${flipY}`);
  let paintGrid = orient(grid, rot, flipX, flipY);

  paintGrid.slice(1, 9).forEach((row, rix) => row.slice(1, 9).forEach((cell, cix) => {
    stitch[`${x*8 + cix}__${y*8 + rix}`] = cell;
  }));

  printStitch(stitch);
}

let nextX = (bix) => {
  if (bix === 1) return 1;
  if (bix === 3) return -1;
  return 0;
}

let nextY = (bix) => {
  if (bix === 0) return -1;
  if (bix === 2) return 1;
  return 0;
}

let nextRfXY = (bix, bix2) => {

// 0 -> 5   r: 3
// 1 -> 7   r: 0  fx: T, fy: T
  let rot = 0;
  let flipX = false; // 1 -> [1, 7]  3 -> [3, 5]  (same or 8 - same) ;  0 -> 2, 2 -> 0
  let flipY = false; // 1 -> [1, ]

  switch(`${bix}_${bix2}`) {
    case '0_0': return [0, false, true];
    case '0_1': return [1, true, false];
    case '0_2': return [0, true, false];
    case '0_3': return [1, false, true];
    case '0_4': return [2, false, false];
    case '0_5': return [3, false, false];
    case '0_6': return [0, false, false];
    case '0_7': return [1, false, false];
    case '1_0': return [1, true, false];
    case '1_1': return [0, false, true];
    case '1_2': return [1, false, true];
    case '1_3': return [0, false, true];
    case '1_4': return [3, false, false];
    case '1_5': return [0, false, false];
    case '1_6': return [1, false, false];
    case '1_7': return [2, false, false];
    case '2_0': return [0, true, false];
    case '2_1': return [3, true, false];
    case '2_2': return [0, false, true];
    case '2_3': return [1, true, false];
    case '2_4': return [0, false, false];
    case '2_5': return [1, false, false];
    case '2_6': return [2, false, false];
    case '2_7': return [3, false, false];
    case '3_0': return [1, false, true];
    case '3_1': return [0, false, true];
    case '3_2': return [3, false, true];
    case '3_3': return [0, false, true];
    case '3_4': return [1, false, false];
    case '3_5': return [2, false, false];
    case '3_6': return [3, false, false];
    case '3_7': return [0, false, false];
  };

  return [rot, flipX, flipY];
}

const rotateGridActual = (grid) => {
  let result = [];
  let h = grid.length;
  let w = grid[0].length;
  for (let y = 0; y < w; y++) {
    for (let x = 0; x < h; x++) {
      if (!result[y]) {
        result[y] = [];
      }
      result[y][x] = grid[h-1-x][y];
    }
  }
  return result;
}

const rotateGrid = (grids, connects, gridId) => {
  console.log('ROTATE', gridId);
  grids[gridId].forEach((line) => console.log(line.join('')));
  // console.log(grids[gridId]);

  const copy = [];
  let bordersCopy = [...grids[gridId].borders];
  let connectsCopy = [...connects[gridId]];

  grids[gridId].borders[0] = bordersCopy[3];
  grids[gridId].borders[1] = bordersCopy[0];
  grids[gridId].borders[2] = bordersCopy[1];
  grids[gridId].borders[3] = bordersCopy[2];
  grids[gridId].borders[4] = bordersCopy[5];
  grids[gridId].borders[5] = bordersCopy[6];
  grids[gridId].borders[6] = bordersCopy[7];
  grids[gridId].borders[7] = bordersCopy[4];

  connects[gridId][0] = connectsCopy[3];
  connects[gridId][1] = connectsCopy[0];
  connects[gridId][2] = connectsCopy[1];
  connects[gridId][3] = connectsCopy[2];

  for (let y = 0; y < 10; y++) {
    // console.log('CCCC', [...grids[gridId][y]]);
    copy[y] = [...grids[gridId][y]];
    // console.log(copy[y].join(''));
  }

  console.log('rotated:');

  for (let y = 0; y < 10; y++) {
    grids[gridId][y] = [];
    for (let x = 0; x < 10; x++) {
      // console.log('1', grids[gridId][y][x]);
      // console.log('2', copy[9-x].join(''));
      // console.log('3', copy[9-x][y]);
      grids[gridId][y][x] = copy[9-x][y];
    }

    console.log(grids[gridId][y].join(''));
  }

};

const flipXGrid = (grids, connects, gridId) => {
  console.log('FLIPX', gridId);
  const copy = [];
  let bordersCopy = [...grids[gridId].borders];
  let connectsCopy = [...connects[gridId]];

  grids[gridId].borders[0] = bordersCopy[4];
  grids[gridId].borders[1] = bordersCopy[5];
  grids[gridId].borders[2] = bordersCopy[6];
  grids[gridId].borders[3] = bordersCopy[7];
  grids[gridId].borders[4] = bordersCopy[0];
  grids[gridId].borders[5] = bordersCopy[1];
  grids[gridId].borders[6] = bordersCopy[2];
  grids[gridId].borders[7] = bordersCopy[3];

  connects[gridId][0] = connectsCopy[0];
  connects[gridId][1] = connectsCopy[3];
  connects[gridId][2] = connectsCopy[1];
  connects[gridId][3] = connectsCopy[0];

  for (let y = 0; y < 10; y++) {
    // console.log('CCCC', [...grids[gridId][y]]);
    copy[y] = [...grids[gridId][y]];
    // console.log(copy[y].join(''));
  }

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      grids[gridId][y][x] = copy[y][9-x];
    }
    // grids[gridId][y] = [...copy[9-y]];
  }
};

const flipYGrid = (grids, connects, gridId) => {
  console.log('FLIPY', gridId);
  const copy = [];
  let bordersCopy = [...grids[gridId].borders];
  let connectsCopy = [...connects[gridId]];

  grids[gridId].borders[0] = bordersCopy[6];
  grids[gridId].borders[1] = bordersCopy[5];
  grids[gridId].borders[2] = bordersCopy[4];
  grids[gridId].borders[3] = bordersCopy[7];
  grids[gridId].borders[4] = bordersCopy[2];
  grids[gridId].borders[5] = bordersCopy[1];
  grids[gridId].borders[6] = bordersCopy[0];
  grids[gridId].borders[7] = bordersCopy[3];

  connects[gridId][0] = connectsCopy[2];
  connects[gridId][1] = connectsCopy[1];
  connects[gridId][2] = connectsCopy[0];
  connects[gridId][3] = connectsCopy[3];

  for (let y = 0; y < 10; y++) {
    // console.log('CCCC', [...grids[gridId][y]]);
    copy[y] = [...grids[gridId][y]];
    // console.log(copy[y].join(''));
  }

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      grids[gridId][y][x] = copy[9-y][x];
    }
  }
};

const transformGrid = (grids, connects, gridId, rot, flipX, flipY) => {
  console.log('transform grid', gridId, rot, flipX, flipY);

  for (let r = 0; r < rot; r++) {
    rotateGrid(grids, connects, gridId);
  }

  if (flipX) {
    flipXGrid(grids, connects, gridId);
  }

  if (flipY) {
    flipYGrid(grids, connects, gridId);
  }

};

let stitchNeighbors = (stitch, grids, connects, gridId, isDone, x = 0, y = 0, r = 0, flipX = false, flipY = false) => {
  if (isDone.has(gridId)) {
    return;
  }
  console.group(`================== stitchNeighbors ${gridId} r:${r} x:${x} y:${y}`)
  // printGrid(grids[gridId]);
  let g = grids[gridId];
  paint(stitch, gridId, g, x, y, r, flipX, flipY);
  isDone.add(gridId);
  console.log('isDone', Array.from(isDone).join(', '));

  let c = connects[gridId];
  console.log(gridId, 'Connections:', c);

  c.forEach((connection, cix) => {
    if (connection !== undefined) {
      console.log(gridId, 'connection', cix, connection);

      transformGrid(grids, connects, connection.g, ...nextRfXY(cix, connection.b));

      const normalizedCix = (cix + r) % 4;
      console.log('Normalized Cix', normalizedCix);

      stitchNeighbors(
        stitch,
        grids,
        connects,
        connection.g,
        isDone,
        x + nextX(normalizedCix),
        y + nextY(normalizedCix),
        0,
        0,
        0,
      );

      // stitchNeighbors(
      //   stitch, grids, connects, connection.g, nextX(x, normalizedCix), nextY(y, normalizedCix), ...nextRfXY(normalizedCix, connection.b), newIsDone,
      // );
    }
  })
  console.groupEnd();
  // stitchNeighbors();
};


const solver = async () => {
  let gridLines = await lineReader('test.txt', a => a, '\n\n');
  // let lines = await lineReader('input.txt');
  
  console.log('gc', gridLines.length);

  const grids = {};
  
  gridLines.forEach((group) => {
    let lines = group.split('\n');
    let p = /Tile (\d+):/.exec(lines[0]);
    let id = parseInt(p[1]);
    let grid = lines.slice(1).map((line => line.split('')));
    grids[id] = grid;
  });

  let ids = Object.keys(grids);

  ids.forEach((id) => {
    let g = grids[id];
    let borders = [];

    // clockwise, T, R, B, L
    borders.push(encodeBorder(g[0]));
    borders.push(encodeBorder(g.map(r => r[9])));
    borders.push(encodeBorder(g[9], true));
    borders.push(encodeBorder(g.map(r => r[0]), true));
    // counterclockwise, T, L, B, R
    borders.push(encodeBorder(g[0], true));
    borders.push(encodeBorder(g.map(r => r[0])));
    borders.push(encodeBorder(g[9]));
    borders.push(encodeBorder(g.map(r => r[9]), true));

    grids[id].borders = borders;
  });

  // console.log(grids[ids[0]].borders);

  let onlyTwo = [];

  const connects = {};

  ids.forEach((id) => {
    let g = grids[id];

    // console.group('id', id);

    let matchedBorders = 0;
    connects[id] = [];

    g.borders.slice(0, 4).forEach((border, bix) => {
      let count = 0;
      ids.forEach((id2) => {
        if (id === id2) {
          return;
        }
        count += grids[id2].borders.filter((b2) => b2 === border).length;

        // Part 2:
        
        grids[id2].borders.forEach((b2, bix2) => {
          if (b2 === border) {
            // console.log(`connects[${id}][${bix}] = {g: ${id2}, b: ${bix2}}`);
            connects[id][bix] = ({g: id2, b: bix2});
          }
        });
        // connects[id] = connects;
      });
      // console.log(`grid[${id}] B${bix} matches ${count} other borders`);
      if (count) {
        matchedBorders++;
      }
    });
    // console.log(`   []   ${matchedBorders}`);
    if (matchedBorders === 2) {
      onlyTwo.push(id);
    }

    console.groupEnd();
  });

  let p1 = onlyTwo.reduce((ac, v) => ac*v, 1);
  console.log('p1', p1);

  /// PART 2

  console.log('onlyTwo[1]', onlyTwo[1]);
  // console.log(grids[onlyTwo[1]]);


  // console.log('connects');
  // console.log(connects);
  let stitch = {};
  // 12 x 12 - 8 x 8 ==> 96 x 96
  // stitchNeighbors(stitch, grids, connects, ids[0]);
  let isDone = new Set([]);
  stitchNeighbors(stitch, grids, connects, onlyTwo[1], isDone);

  // console.log('stitch');
  // console.log(stitch);

  const stitchGrid = printStitch(stitch);

  const searchPatternStrings = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   '
  ];

  const searchPattern = searchPatternStrings.map((s) => s.split(''));
  const searchPatternF = searchPatternStrings.map((s) => {
    let sx = s.split('');
    sx.reverse();
    return sx;
  });

  let r1 = rotateGridActual(searchPatternStrings);
  let r2 = rotateGridActual(r1);
  let r3 = rotateGridActual(r2);

  let fr1 = rotateGridActual(searchPatternF);
  let fr2 = rotateGridActual(fr1);
  let fr3 = rotateGridActual(fr2);
  // printGrid(searchPattern);
  // printGrid(searchPatternF);
  // printGrid(fr1);

  const searchPatterns = [
    searchPattern,
    r1,
    r2,
    r3,
    searchPatternF,
    fr1,
    fr2,
    fr3,
  ];
  // console.log(searchPattern);
  
  // printGrid(searchPattern);
  // printGrid(r1);

  searchPatterns.forEach((searchPattern, ix) => {
    console.log('searching pattern ', ix);
    let found = search(stitchGrid, searchPattern);
    if (found) {
      printGrid(stitchGrid);
    }
  });

  let solutionRight = rotateGridActual(stitchGrid);
  printGrid(solutionRight);
}


solver();

