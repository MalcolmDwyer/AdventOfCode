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

  let nodesList = input.map(pipe => {
    let parts = /^([0-9-]*) <-> ([0-9, ]*)*$/.exec(pipe)
    let base = parseInt(parts[1])
    let ends = parts[2].split(',').map(s => parseInt(s))

    let nodes = [base, ...ends];
    return nodes
  })

  nodesList.forEach((nodes, ix) => {
    if (!allSets.find(set => nodes.some(n => set.has(n)))) {
      // Create a new set
      allSets = allSets.push(Immutable.Set(nodes))
    }
    else {
      // Find all related nodes
      let allLinkedNodesSet =
        allSets
          .filter(set => nodes.some(n => set.has(n)))
          .reduce((all, set) => all.union(set), Immutable.Set())
          .union(nodes)

      // Clear any existing sets with those numbers, then add a new set with all of them
      allSets = allSets
        .filter(set => !set.some(n => allLinkedNodesSet.has(n)))
        .push(allLinkedNodesSet)
    }
  })

  console.log('Zero Group size:', allSets.find(set => set.has(0)).size)
  console.log('# of Groups:', allSets.size)
}
solver(lines(input))
