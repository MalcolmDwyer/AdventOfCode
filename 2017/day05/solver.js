var fs = require('fs');
var Immutable = require('immutable');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');


const lines = input => input
  .split('\n')
  .filter(a => a.length)
  .map(v => parseInt(v, 10))

const solver = (lines) => {
  let count = 0;


  lines.forEach(line => {
    console.log(typeof line, line);
  })

  let pointer = 0;

  while (pointer >= 0 && pointer <= lines.length) {
    let next = pointer + lines[pointer]
    if (lines[pointer] >= 3) { // Part 2 just adds this extra condition
      lines[pointer] -= 1;
    }
    else {
      lines[pointer] += 1;
    }

    // console.log('pointer', next, lines[pointer])
    pointer = next;
    count++;
  }

  console.log(count-1)
  return count;
}


solver(lines(input))
