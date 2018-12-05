var fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
testInput = require('./input_test.txt')

const lines = input => input
  .split('\n')
  .filter(line => line)
//-----------------------------------------------------------

const processLines = (line, letter) => {
  line = Array.from(line)
  if (letter) {
    line = line.filter(l => (l !== letter) && (l !== letter.toLowerCase()))
  }

  let done = false
  while (!done) {
    // console.log('line', line.join(''))
    for (let i = 0; i < line.length; i++) {
      if (i &&
        (line[i].toLowerCase() == line[i-1].toLowerCase()) &&
        line[i] !== line[i-1]
      ) {
        line.splice(i - 1, 2)
        break
      }
      if (i == line.length - 1) {
        done = true
      }
    }
  }

  return line
}

const solver1 = lines => {
  let data = processLines(lines[0])

  return data.length
}

const solver2 = lines => {
  let min = Infinity
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
    let data = processLines(lines[0], letter)
    if (data.length < min) {
      min = data.length
    }
    console.log(letter, data.length)
    return data.length

  })
  return min
}

const s1 = solver1(lines(input))
console.log('s1', s1)

const s2 = solver2(lines(input))
console.log('s2', s2)
