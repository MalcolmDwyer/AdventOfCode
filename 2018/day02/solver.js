var fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
input2 = require('./input_test.txt')
const lines = input => input
  .split('\n')
  .filter(line => line)
//-----------------------------------------------------------


const solver1 = (lines) => {
  const twosAndThrees = lines.reduce((acc, line) => {
    let charCounts = {}
    const chars = line.split('')
    chars.forEach(ch => {
      if (typeof charCounts[ch] === 'undefined') {
        charCounts[ch] = 0
      }
      charCounts[ch] = charCounts[ch] + 1
    })
    let did2 = false
    let did3 = false
    Object.keys(charCounts).forEach(key => {
        const value = charCounts[key]
        if (!did2 && value == 2) {
          acc.two = acc.two + 1
          did2 = true
        }
        if (!did3 && value == 3) {
          acc.three = acc.three + 1
          did3 = true
        }
    })
    return acc
  }, {
    two: 0,
    three: 0
  })

  console.log(twosAndThrees)
  return twosAndThrees.two * twosAndThrees.three
}

const solver2 = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (i !== j) {
        let a = lines[i]
        let b = lines[j]

        let diffs = 0;
        let diff = ''
        for (let k = 0; k < a.length; k++) {
          if (a[k] !== b[k]) {
            diffs++
            if (diffs > 1) {
              break
            }
            diff = a[k]
          }
        }
        if (diffs == 1) {
          return a.split('').filter(c => c !== diff).join('')
        }
      }
    }
  }
}

// let s1 = solver1(lines(input))
let s2 = solver2(lines(input))

// console.log('s1', s1)
console.log('s2', s2)
