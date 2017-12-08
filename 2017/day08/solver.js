var fs = require('fs');
var Immutable = require('immutable');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');

const lines = input => input
  .split('\n')
  .filter(a => a.length)

const registers = {};
let maxVal = -Infinity;

const solver = (lines) => {
  lines.forEach(line => {
    let parts = /^([a-z]*) (\w*) ([0-9-]*) if ([a-z]*) ([><=!]*) ([0-9-]*)$/.exec(line)

    const out = parts[1]
    const inc = parts[2] == 'inc' ? parseInt(parts[3], 10) : -1 * parseInt(parts[3], 10)
    const t = parts[4]
    const cond = parts[5]
    const tval = parseInt(parts[6], 10)

    let op = `${registers[t] || 0} ${cond} ${tval}`
    // console.log('op', op);
    if (eval(op)) {
      let newVal = (registers[out] || 0) + inc
      // console.log(`   update ${out} -> ${registers[out] || 0} + ${inc} -> ${newVal}`)
      registers[out] = newVal
      if (registers[out] > maxVal) {
        maxVal = registers[out]
      }
    }
  })

  console.log('max at end', Immutable.Map(registers).max())
  console.log('max ever', maxVal)

}

solver(lines(input))
