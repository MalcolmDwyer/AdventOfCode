var fs = require('fs');
var Immutable = require('immutable');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');



const lines = input => input
  .split('\n')
  .filter(a => a.length)

const blocks = line => line.split(/\t/).map(v => parseInt(v, 10))


const solver = (_blocks) => {
  let blocks = Immutable.List(_blocks)
  let history = Immutable.List([blocks])

  let iterCount = 0;
  let loopStart;

  while(true) {
    // console.log('-------------------------------------------------')
    // console.log('history', history)
    // console.log('blocks', blocks);
    // console.log('----------------')
    let max = blocks.max()
    let maxIx = blocks.findIndex(b => b == max)
    // console.log(`max[${maxIx}]: ${max}`)
    // console.log(blocks)
    let newBlocks = blocks.set(maxIx, 0);
    for (let i = 0; i < max; i++) {
      let ix = (i + maxIx + 1) % newBlocks.size;
      // console.log(`       ${ix} -> ${newBlocks.get(ix) + 1}`)
      newBlocks = newBlocks.set(ix, newBlocks.get(ix) + 1)
      // console.log(ix, newBlocks)
    }

    // console.log('Adding newBlocks', newBlocks);
    iterCount++;
    if (history.includes(newBlocks)) {
      // console.log('<<<<<')
      loopStart = history.findIndex(h => h.equals(newBlocks));
      break;
    }
    history = history.push(newBlocks)
    blocks = newBlocks;

    if (!(history.size % 1000)) {
      console.log(history.size)
    }

    // console.log('history', history)

  }

  console.log('iterCount',iterCount)
  console.log('loopSize', iterCount - loopStart)

}

solver(blocks(lines(input)[0]))
