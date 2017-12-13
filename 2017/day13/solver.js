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

let testInput = `0: 3
1: 2
4: 4
6: 4
`
// let i = testInput
let i = input

let layers = {};
lines(i).forEach(l => {
  let [a, depth, range] = /^(\d*): (\d*)$/.exec(l)
  layers[parseInt(depth)] = parseInt(range);
})
//-----------------------------------------------------------


const bounceMod = (v, m) => {
  let m2 = v % ((m-1)*2);
  let p = m2;
  if (m2 > m - 1) {
    p = m - (v % (m-1)) - 1;
  }
  return p
}

const solver = (layers, delay = 0) => {
  delay = parseInt(delay)
  let minRange = 0
  let maxRange = 100
  let total = Immutable.Range(0, maxRange)
    .reduce((acc, layer, ix, list) => {
      if (typeof layers[layer] === 'undefined') {
        return acc;
      }
      let d = layers[layer]
      let p = bounceMod(ix + delay, d)
      if (d && !p) {
        acc += (layer + delay) * layers[layer]
      }
      return acc;
    }, 0)
  return total;
}


let delay = 0;
while (solver(layers, delay)) {
  delay++;
}
console.log('delay:', delay)
