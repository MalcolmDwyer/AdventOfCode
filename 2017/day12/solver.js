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
  let allSets = Immutable.List();

  let prevSetSize = -1;
  let prevAllSets = -1;
  let iter = 0;

  let nodesList = input.map(pipe => {
    let parts = /^([0-9-]*) <-> ([0-9, ]*)*$/.exec(pipe)
    let base = parseInt(parts[1])
    let ends = parts[2].split(',').map(s => parseInt(s))

    let nodes = [base, ...ends];
    return nodes
  })

  while (!allSets.equals(prevAllSets) || !iter) {
    prevAllSets = allSets

    nodesList.forEach((nodes, ix) => {
      let pix = allSets.findIndex(set => nodes.some(n => set.has(n)))

      if (pix < 0) {
        allSets = allSets.push(Immutable.Set(nodes))
      }
      else {
        let allLinkedNodesSet =
          allSets
            .filter(set => nodes.some(n => set.has(n)))
            .reduce((all, set) => all.union(set), Immutable.Set())
            .union(nodes)

        allSets = allSets
          .filter(set => !set.some(n => allLinkedNodesSet.has(n)))
          .push(allLinkedNodesSet)
      }
    })
    iter++
  }

  console.log('zeroSet size:', allSets.find(set => set.has(0)).size)
  console.log('allSets:', allSets.size)
}
solver(lines(input))
