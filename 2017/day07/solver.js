var fs = require('fs');
var Immutable = require('immutable');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');

const lines = input => input
  .split('\n')
  .filter(a => a.length)

const solver = (lines) => {

  nodes = Immutable.Map({})

  lines.forEach(line => {
    let parts = /^([a-z]*) \((\d*)\)(\s*\->\s*([a-z, ]*))?/.exec(line)
    if (!parts) {
      console.error('parts', parts.length, parts)
      throw(Error('regex failed'))
    }

    let name = parts[1]
    let weight = parseInt(parts[2])
    let childrenString = parts[4]

    let node = Immutable.Map({name, weight})
    if (childrenString) {
      node = node.set('children', Immutable.List(childrenString.split(', ')))
    }
    nodes = nodes.set(name, node)
  });

  const nodeWeight = node => {
    const childrenWeight = (node.children) ?
      node.children.reduce((sum, child) => {
        return sum + nodeWeight(nodes.get(child).toJS())
      }, 0) :
      0;
    const nodeTotalWeight = node.weight + childrenWeight
    nodes = nodes.setIn([node.name, 'total'], nodeTotalWeight);
    return nodeTotalWeight;
  }

  const nodeImbalance = node => {
    if (!node.get(children)) {
      return 0
    }
  }

  const findImbalance = (nodeIm, diff) => {
    let childNodes = nodeIm.get('children').map(childName => nodes.get(childName));
    let groupedByWeights = childNodes.groupBy(c => c.get('total'))

    if (groupedByWeights.size > 1) {
      // console.log('children differ on ' + nodeIm.get('name'))
      let oddNode = groupedByWeights.find(v => v.size == 1).first();
      let otherWeight = groupedByWeights.find(v => v.size > 1).first().get('total')
      let weightError = oddNode.get('total') - otherWeight;

      findImbalance(oddNode, weightError)
    }
    else {
      console.log(nodeIm.get('name'))
      console.log(`Weight is ${nodeIm.get('weight')}, but should be ${nodeIm.get('weight') - diff}`)
    }
  }

  let root = 'mkxke';

  // let root = 'tknk'; // (test data root)

  nodeWeight(nodes.get(root).toJS())
  findImbalance(nodes.get(root))
}

solver(lines(input))
