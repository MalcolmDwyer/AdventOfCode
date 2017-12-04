var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input.split('\n').filter(a => a.length)



const sample = [
  '5 9 2 8',
  '9 4 7 3',
  '3 8 6 5'
];
const answer = 4 + 3 + 2;


const solver = (lines) => {
  console.log('lines', lines)
  return lines.reduce(
    (acc, line) => {
      let nums = line
        .split(/[^\d]/)
        .map(chars => parseInt(chars, 10))

      console.log('n', nums);
      // let lineVal = Math.max(...nums) - Math.min(...nums);
      let lineVal = 0;
      for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < nums.length; j++) {
          if (i == j) {
            continue;
          }
          if (!(nums[i] % nums[j])) {
            console.log('i % j', nums[i], nums[j])
            lineVal += nums[i] / nums[j]
          }
        }
      }
      console.log('lineVal:', lineVal)
      return acc + lineVal
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

runSolver(sample, answer);
// sample.map((input, ix) => runSolver(input, sampleAnswers[ix]))

runSolver(lines(input))

// console.log(`${typeof input} ${input}`)
