var fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input
  .split('\n')
  .filter(line => line)
//-----------------------------------------------------------

const solver = (lines) => {
  console.log('solver')
  const total = lines.reduce((acc, line) =>
    acc + parseInt(line),
    0
  )

  return total
}

let total = solver(lines(input))
console.log('1', total)

const solver2 = (lines) => {
  let history = new Set([0])
  let freq = 0

  while (true) {
    for (let i = 0; i < lines.length; i++) {
      freq = freq + parseInt(lines[i])
      if (history.has(freq)) {
        return freq
      }
      history.add(freq)
    }
  }
}

let repeat = solver2(lines(input))
console.log('2', repeat)
