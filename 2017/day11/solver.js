var fs = require('fs');
var Immutable = require('immutable');
var _ = require('lodash')
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input
  .split('\n')
  .filter(a => a.length)
//-----------------------------------------------------------

const hexDistance = (ne, n, se) => {
  let sorted = [n, ne, se].sort((a,b) => {
    return Math.abs(a) > Math.abs(b)
  })
  return sorted[1] + sorted[2];
}

const solver = input => {
  let jumps = input.split(',')
  // console.log(jumps.slice(0, 10) + ' ... ' + jumps.slice(jumps.length - 10))

  let ne = 0;
  let n = 0;
  let se = 0;

  let max = 0;

  jumps.forEach((j, ix) => {
    if (j == 'ne') {
      ne++
    }
    else if (j == 'sw') {
      ne--;
    }
    else if (j == 'n') {
      n++;
    }
    else if (j == 's') {
      n--;
    }
    else if (j == 'se') {
      se++;
    }
    else if (j == 'nw') {
      se--;
    }
    else {
      console.error(`|${j}|`, typeof j, ix)
    }
    max = Math.max(max, hexDistance(ne, n, se))
  })

  console.log(`d: ${hexDistance(ne, n, se)}`)
  console.log(`max: ${max}`)
}

solver(lines(input)[0])
