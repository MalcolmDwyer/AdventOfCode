
var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};


// let input =
// `ULL
// RRDDD
// LURDL
// UUUUD`
let input = require('./input.txt');
let instructions = input.split('\n').filter(a => a.length).map(a => a.split(''))

// console.log(instructions.length, instructions[0].length, instructions[1].length);

// 1 2 3   [0,0] [0,1] [0,2]
// 4 5 6   [1,0] [1,1] [1,2]
// 7 8 9   [2,0] [2,1] [2,2]

// Part 1:
let current = [1,1];
let limit = n => Math.min(2, Math.max(n, 0))
let limit2 = ([n,m]) => ([limit(n), limit(m)])
let update = ([n,m], [y,x]) => (limit2([n+y, m+x]))
let decode = (i) => {
  switch (i) {
    case 'U': return [-1, 0];
    case 'D': return [ 1, 0];
    case 'L': return [ 0,-1];
    case 'R': return [ 0, 1];
  }
}
let encode = ([y,x]) => 3*y + x + 1

// Part 2:
//     1                  [0,2]
//   2 3 4           [1,1][1,2][1,3]
// 5 6 7 8 9    [2,0][2,1][2,2][2,3][2,4]
//   A B C           [3,1][3,2][3,3]
//     D                  [4,2]

current = [2,0];
let limitFn = (r) => {
  let d = 2 - Math.abs(r-2); // distance from center allowed in this row/col [0,1,2]
  return (x) => Math.min(2 + d, Math.max(2-d, x)) // fn to limit to [0,1,2,3,4] based on d
}
encode = ([y,x]) => {
  switch(y) {
    case 0: return 1;
    case 1: return 1 + x;
    case 2: return 5 + x
    case 3: {
      switch(x) {
        case 1: return 'A';
        case 2: return 'B';
        case 3: return 'C';
        default: return 'X'
      }
    }
    case 4: return 'D';
    default: return 'x'
  }
}

update = ([n,m], [y,x]) => {
  if (x) { // L or R - limits depend on y, n is const
    return [n, limitFn(n)([m+x])]
  }
  else { // U or D - limits depend on x, m is const
    return [limitFn(m)([n+y]), m]
  }
}


/////////////////////////////////////////////
// Common to part 1 and 2:

let code = instructions.map(line => line.reduce((prev, x) => {
    current = update(prev, decode(x))
    return current;
  }, current)
)

console.log('Code: ' + code.map(encode).join(''))
