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

export const gridReader = async (path = './input.txt', m = (v) => v, inLineSep = '') => {
  const file = await readFile(path)
  return file
    .split('\n')
    .filter(line => line)
    .map(line => line.split(inLineSep))
    .map(m);
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

export const printGrid = (grid, spacer = '') => {
  grid.forEach((row) => {
    console.log(row.join(spacer));
  });
};