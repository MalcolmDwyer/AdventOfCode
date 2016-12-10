var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

input = require('./input.txt');
let testInput = `(11x2)(5x3)ABCDEFGHIJKL(5x4)MNOPQRSTUVWXYZ`
// testInput = 'X(8x2)(3x3)ABCY'
testInput = `
(3x3)XYZ
X(8x2)(3x3)ABCY
`

input = testInput;

let lines = input.split('\n').filter(a => a.length);

// console.log(lines[0].length)

// let stuff = [t, ...foo] = /\(([0-9]+)x([0-9]+)*\)/.exec(lines[0]);
// console.log(t)
// console.log(foo)

// let reg = /([^0-9]+([0-9])*)+/;
// let stuff = [t, ...foo] = reg.exec(lines[0]);
// console.log(t)
// console.log(foo)
// console.log(input.split(/[^]/).join(''))


// Part 1:
return;
lines.map(l => {
  console.log('---------------------------------------------------');
  console.log(l);
  let output = '';
  let count = 0;
  let groupSize = 0;
  let n = 0;
  // (Size x N)
  let accN = false;
  let accSize = false;

  l.split('').forEach(c => {
    if (!n && c === '(') {
      accSize = [];
      return;
    }
    else if (!n && c === 'x') {
      groupSize = parseInt(accSize.join(''), 10)
      accSize = false;
      accN = [];
      console.log('groupSize: ' + groupSize);
      return;
    }
    else if (!n && c === ')') {
      n = parseInt(accN.join(''), 10);
      accN = false;
      console.log('n: ' + n);
      return;
    }
    else if (!n && isFinite(c)) {
      if (accSize) {
        accSize.push(c)
      }
      else if (accN) {
        accN.push(c)
      }
      else {
        console.error('no accumulator');
      }
    }
    else {
      count += 1;
      output += c;


      if (n) {
        console.log(c + ' -------------');
        console.log('n: ' + n);
        for (let i = n-1; i; i--) {
          console.log('   i:' + i);
          count++;
          output += c;
          console.log(output);
        }
      }

      groupSize--;
      groupSize = Math.max(0, groupSize);
      if (!groupSize) {
        n = 0;
      }

    }
  })
  console.log(count);
})

 // 56725: too low --> 183269: correct
// console.log(output);
