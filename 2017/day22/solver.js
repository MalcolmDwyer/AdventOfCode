var fs = require('fs');
var Immutable = require('immutable');
var _ = require('lodash')
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input
  .split('\n')
  .filter(a => a.length)
//-----------------------------------------------------------

const turn = ([down, right], left) => {

  if (left) {
    if (down  == -1) { return [0, -1] }
    if (right == -1) { return [1, 0] }
    if (down  ==  1) { return [0, 1] }
    if (right ==  1) { return [-1, 0] }
  }
  else {
    if (down  == -1) { return [0, 1] }
    if (right == -1) { return [-1, 0] }
    if (down  ==  1) { return [0, -1] }
    if (right ==  1) { return [1, 0] }
  }
}

const solver = (rows) => {
  let mid = (rows.length - 1) / 2
  let pc = [mid, mid]  // row, col
  let dir = [-1, 0] // up

  let iterations = 10000000
  let infections = 0

  for (let i = 0; i < iterations; i++) {
    // console.log('----------------------------', pc, dir)
    // rows.forEach((s, ix) => {
    //   if (ix == pc[0]) {
    //     console.log(
    //       s.slice(0, pc[1]).join(' ') +
    //       '[' + s[pc[1]] + ']' +
    //       s.slice(pc[1] + 1).join(' ')
    //     )
    //   }
    //   else {
    //     console.log(' ' + s.join(' '))
    //   }
    // })

    if (!rows[pc[0]]) {
      rows[pc[0]] = []
    }

    // Part 1
    // if (rows[pc[0]][pc[1]] == '#') {
    //   dir = turn(dir, false)
    //   rows[pc[0]][pc[1]] = '.'
    // }
    // else {
    //   dir = turn(dir, true)
    //   rows[pc[0]][pc[1]] = '#'
    //   infections++;
    // }

    // Part 2

    if (rows[pc[0]][pc[1]] == 'W') {
      // no turn
      rows[pc[0]][pc[1]] = '#'
      infections++;
    }
    else if (rows[pc[0]][pc[1]] == '#') {
      dir = turn(dir, false) // turn right
      rows[pc[0]][pc[1]] = 'F'
    }
    else if (rows[pc[0]][pc[1]] == 'F') {
      dir = [-1 * dir[0], -1* dir[1]] // turn back
      rows[pc[0]][pc[1]] = '.'
    }
    else {
      dir = turn(dir, true) // turn left
      rows[pc[0]][pc[1]] = 'W'

    }
    pc = [pc[0] + dir[0], pc[1] + dir[1]]
  }

  console.log(infections)
}


solver(lines(input).map(line => line.split('')))

// < 9978
// > 5231
