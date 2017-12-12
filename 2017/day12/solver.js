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

const solver = (input) => {
  // console.log(input.length)

  let zeroSet = new Set()
  let prevSetSize = -1;
  let iter = 0;

  while (zeroSet.size !== prevSetSize) {
    prevSetSize = zeroSet.size
    input.forEach((pipe, ix) => {
      let parts = /^([0-9-]*) <-> ([0-9, ]*)*$/.exec(pipe)
      let base = parseInt(parts[1])
      let ends = parts[2].split(',').map(s => parseInt(s))

      let nodes = [base, ...ends];
      // console.log('nodes', nodes)
      if (!ix) {
        nodes.forEach(n => zeroSet.add(n))
      }
      else {
        nodes.map(n => {
          if (zeroSet.has(n)) {
            nodes.forEach(n => zeroSet.add(n))
          }
        })
      }
    })
  }

  // console.log(zeroSet)
  console.log(zeroSet.size)
}
solver(lines(input))
