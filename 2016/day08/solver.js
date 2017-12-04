var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

input = require('./input.txt');
let testInput = `
rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1
`

const screenDimInput = [50, 6];
const screenDimTest = [7, 3];

const screenDim = screenDimInput;

// input = testInput;


let lines = input.split('\n').filter(a => a.length);

let grid = Array(screenDim[1]);
for (let i = 0; i < screenDim[1]; i++) {
  grid[i] = Array(screenDim[0]);
  for (let j = 0; j < screenDim[0]; j++) {
    grid[i][j] = false
  }
}

// console.log(grid)

const gridPrinter = grid => {

  grid.forEach(r => {
    let line = r.map(c => {
      if (c) {
        return '#'
      }
      else {
        return '.'
      }
      /*(c ? '#' : '•')*/
      // log.debug('c: ' + c);
      // return '*'
    }).join('')
    console.log(line);
  })
}

gridPrinter(grid);

let rectReg = /^rect ([0-9]+)x([0-9]+)$/;
let rowReg = /^rotate row y=([0-9]+) by ([0-9]+)$/;
let colReg = /^rotate column x=([0-9]+) by ([0-9]+)$/;

let rot = (array, by, size) => {
  return (array.slice(size - by).concat(array.slice(0, size - by)))
}
// Array.prototype.rot = by => {
//
// }

lines.forEach(l => {
  console.log('----------------------------------------')
  if (l.indexOf('rect') >= 0) {
    let [t, dimX, dimY] = rectReg.exec(l);
    if (dimX && dimY) {
      dimX = parseInt(dimX, 10);
      dimY = parseInt(dimY, 10);
      console.log('rect ' + dimX + ' by ' + dimY);
      for (let i = 0; i < dimY; i++) {
        for (let j = 0; j < dimX; j++) {
          grid[i][j] = true
        }
      }
    }
  }

  else if (l.indexOf('rotate row') >= 0) {
    let [t, Y, by] = rowReg.exec(l);
    if (by) {
      Y = parseInt(Y, 10);
      by = parseInt(by, 10);
      console.log('rotate row ' + Y + ' by ' + by);
      grid[Y] = rot(grid[Y], by, screenDim[0]);
    }
  }

  else if (l.indexOf('rotate col') >= 0) {
    let [t, X, by] = colReg.exec(l);
    console.log('rotate col ' + X + ' by ' + by);
    if (by) {
      X = parseInt(X, 10);
      by = parseInt(by, 10);
      col = grid.map(r => r[X]);
      console.log('col: ', col)
      col = rot(col, by, screenDim[1]);
      grid.forEach((r, ix) => {
        grid[ix][X] = col[ix];
      })
    }
  }

  gridPrinter(grid);
})

let totalPixels = 0;
for (let i = 0; i < screenDim[1]; i++) {
  for (let j = 0; j < screenDim[0]; j++) {
    if (grid[i][j]) {
      totalPixels++;
    }
  }
}

console.log(totalPixels);
// 123
// AFBUPZBJPS
