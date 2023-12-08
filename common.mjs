import fs from 'fs'
import fetch from 'node-fetch';

export const readFile = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

export const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, {encoding: 'utf8'}, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}


export const getLines = input => {
  return input
    .split('\n')
    .filter(line => line)
}

export const lineReader = async (path = './input.txt', m = (v) => v, spl = '\n') => {
  const file = await readFile(path)
  return file
    .split(spl)
    .filter(line => line)
    .map(m);
}

export const jsonReader = async(path = './input.json') => {
  const file = await readFile(path);
  return JSON.parse(file);
};

export const gridReader = async (path = './input.txt', m = (v) => v, inLineSep = '') => {
  const file = await readFile(path)
  return file
    .split('\n')
    .filter(line => line)
    .map(line => line.split(inLineSep))
    .map(m);
}

export const gridReader2 = async (path = './input.txt', m = (v, {x, y}) => ({v, x, y}), inLineSep = '') => {
  const file = await readFile(path)
  return file
    .split('\n')
    .filter(line => line)
    .map((line, y) => line.split(inLineSep).map((c, x) => m(c, {x, y})));
}

export const minMax = (list, accessor) => {
  // accessor iterates over list items and can return single value or array to check
  //
  // Returns { min, max, minIndex, maxIndex, minSubIndex, maxSubIndex }
  let min = Infinity;
  let max = -Infinity;
  let minIndex = -1;
  let maxIndex = -1;
  let minSubIndex = -1;
  let maxSubIndex = -1; 

  list.forEach((item, ix) => {
    const valOrVals = accessor(item);
    if (Array.isArray(valOrVals)) {
      valOrVals.forEach((val, subIx) => {
        if (val < min) {
          min = val;
          minIndex = ix;
          minSubIndex = subIx;
        }
        if (val > max) {
          max = val;
          maxIndex = ix;
          maxSubIndex = subIx;
        }
      })
    }
    else {
      const val = valOrVals;
      if (val < min) {
        min = val;
        minIndex = ix;
      }
      if (val > max) {
        max = val;
        maxIndex = ix;
      }
    }
  });

  return {min, max, minIndex, maxIndex, minSubIndex, maxSubIndex};
};

/**
 * gridsMinMaxFromCoords
 * Takes `coords` array of `whatevers`, and using the `options.xAccessor` and `options.yAccessor`
 * (which default to `(c) => c.x` and `(c) => c.y`) it returns an gridBounds object
 * with minX, maxX, minY, maxY. `options.zeroMin` will override `minX`/`minY` if they
 * are greater than zero, and use `0` instead.
 * 
 * @param {*} coords 
 * @param {*} options 
 * @returns gridBounds
 */
export const gridsMinMaxFromCoords = (coords, {
  xAccessor = (c) => c.x,
  yAccessor = (c) => c.y,
  zeroMin = false, // if mins are greater than 0, use 0 instead
} = {}) => {
  const {min: minX, max: maxX} = minMax(
    coords, xAccessor
  );

  const {min: minY, max: maxY} = minMax(
    coords, yAccessor
  );

  const gridBounds = {
    minX: zeroMin ? Math.min(0, minX) : minX,
    maxX,
    minY: zeroMin ? Math.min(0, minY) : minY,
    maxY,
  };

  return gridBounds;
}

export const prepGrid = ({minX, maxX, minY, maxY}, initial = 0) => {
  const grid = [];
  for (let i = minY; i <= minY + maxY; i++) {
    grid[i] = [];
    for (let j = minX; j <= minX + maxX; j++) {
      grid[i][j] = initial;
    }
  }
  return grid;
}

export const printGrid = (
  grid,
  spacer = '',
  pad = 0,
) => {
  grid.forEach((row) => {
    console.log(row.map((c) => c.toString().padStart(pad, ' ')).join(spacer));
  });
};

export const printGrid2 = (grid, {
  spacer = '',
  pad = 0,
  cellPrint = (c) => c,
} = {}) => {
  grid.forEach((row) => {
    console.log(row.map(cellPrint).map((c) => c.toString().padStart(pad, ' ')).join(spacer));
  });
}

export const printFlatGrid = (grid, gridBounds, {fn, rowJoin = ''}) => {
  const { minX, maxX, minY, maxY } = gridBounds;
  for (let y = minY; y <= maxY; y++) {
    let row = [];
    for (let x = minX; x <= maxX; x++) {
      row.push(fn(grid.find(({x: gx, y: gy}) => gx == x && gy == y)))
    }
    console.log(row.join(''))
  }
};

export const gridForEach = (gridBounds, fn) => {
  const { minX, maxX, minY, maxY } = gridBounds;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      fn({x, y});
    }
  }
}

// Addition "factorial"
// n + (n-1) + (n-2) + ... + 1 <=> (n * (n+1)) / 2
export const gaussSum = (n) => {
  return (n * (n + 1)) / 2;
};


export const rangeOverlaps = (base, test) => {
  // console.group(`getOverlap check: [${base.b}, ${base.t}]  range: [${test.b}, ${test.t}]`);
  let aAndB = [];
  let aNotB = [];
  let bNotA = [];
  //       ********
  // a     +++           1 -> 2
  // b       +++         1 -> 3
  // c         ++++      1 -> 2
  // d     ++++++++      1 -> 1
  // e         ++++++++  1 -> 2 + add unmapped
  // f  +++++++          1 -> 2 + add unmapped
  // g     ++++++++++    1 -> 1 + add unmapped
  // h  +++++++++++      1 -> 1 + add unmapped
  // i  ++++++++++++++   1 -> 1 + add 2 unmapped
  // j  ++++             (f)
  // k            +++    (e)
  // l     +
  // m            +

  if (test.b > base.t || test.t < base.b) {
    aNotB.push({b: base.b, t: base.t });
    bNotA.push({b: test.b, t: test.t });
  }
  else if (test.b <= base.b) { // f, h, i  | a, g, d
    if (test.b < base.b) { // f h i
      bNotA.push({b: test.b, t: base.b - 1});
    }
    
    if (test.t < base.t) { // a, f
      aAndB.push({b: base.b, t: test.t});
      aNotB.push({b: test.t + 1, t: base.t});
    }
    else if (test.t === base.t) { // d, h
      aAndB.push({b: base.b, t: test.t});
    }
    else if (test.t > base.t) { // i, g
      aAndB.push({b: base.b, t: base.t});
      bNotA.push({b: base.t + 1, t: test.t})
    }
  }
  else { // b, c, e, k
    aNotB.push({b: base.b, t: test.b - 1});
    aAndB.push({b: test.b, t: Math.min(base.t, test.t)});

    if (test.t < base.t) {
      aNotB.push({b: test.t + 1, t: base.t});
    }
    else if (test.t > base.t) {
      bNotA.push({b: base.t + 1, t: test.t})
    }

  }

  return {
    aAndB,
    aNotB,
    bNotA,
  }
}

