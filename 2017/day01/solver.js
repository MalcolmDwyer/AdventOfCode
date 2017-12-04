var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input.split('\n').filter(a => a.length)



const sample = [
  '1122', '1111', '1234', '91212129', '00005', '00550', '05550', '50055'
];
const sampleAnswers = [3, 4, 0, 9, 0, 5, 10, 10];


const solver = (str) => {
  // console.log(str)
  return str.split('').reduce((acc, ch, ix, list) => {
    let next = list[0];
    if (ix < list.length - 1) {
      next = list[ix + 1]
    }
    if (ch == next) {
      acc = acc + parseInt(ch)
    }
    // console.log(`   --- ${ch} ? ${next} -> ${acc}`)
    return acc
  }, 0)
}

const runSolver = (input, expected) => {
  const result = solver(input)

  if (typeof expected !== 'undefined') {
    console.log(`${
      result == expected ? '✅' : '❌'
    } Got: ${result}  Expected: ${expected}`)
  }
  else {
    console.log(`${'🔷'} Got: ${result}`)
  }
}

sample.map((input, ix) => runSolver(input, sampleAnswers[ix]))

runSolver(lines(input)[0])

// console.log(`${typeof input} ${input}`)
