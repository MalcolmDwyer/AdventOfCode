var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input.split('\n').filter(a => a.length)



const sample = [
  '1212', '1221', '123425', '123123', '12131415'
];
const sampleAnswers = [6, 0, 4, 12, 4];


const solver = (str) => {
  // console.log(str)
  return str.split('').reduce((acc, ch, ix, list) => {
    let nextIndex = (ix + list.length/2)%list.length;
    let next = list[nextIndex];

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
