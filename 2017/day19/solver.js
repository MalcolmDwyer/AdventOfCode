var fs = require('fs');
var Immutable = require('immutable');
var _ = require('lodash')
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input
  .split('\n')
//-----------------------------------------------------------


const solver = (lines) => {
  console.log(lines.length)

  let phrase = Immutable.List()

  let map = lines.map(line => line.split(''))
  map.push([])
  map[-1] = []

  // console.log(map)

  let x = map[0].findIndex(c => c == '|')
  let y = 0;
  let down = 1;
  let right = 0;
  let c = true; // can Continue
  let v = ['|']
  let next = map[y][x];
  let count = 0;

  // console.log('first', map[y + down][x + right])

  while (c) {
    do {
      if (
        ((y + down) >= map.length) ||
        ((x + right) >= map[y].length) ||
        ((y + down) < 0) ||
        ((x + right) < 0)
      ) {
        console.error('breaking at edge', x, y, down, right, map.length, map[0].length)
        return {phrase, count}
        // break;
      }

      if (/[A-Z]/.test(next)) {
        if (phrase.find(p => p == next)) {
          console.log('*E* ', next, down, right)
          return {phrase, count}
        }
        phrase = phrase.push(next)
        console.log('*** ', next, down, right)
      }

      x += right;
      y += down;

      next = map[y][x];
      count++


    } while (next !== '+' && next !== ' ')

    if (down) {
      let r = map[y][x + 1] || null
      let l = map[y][x - 1] || null
      if (/[A-Z\-]/.test(r)) {
        // console.log('->')
        right = 1;
        down = 0;
      }
      else if (/[A-Z\-]/.test(l)) {
        // console.log('<-')
        right = -1;
        down = 0;
      }
      else {
        console.error(`[1] lost ${down} ${right} ${next}`)
        c = false;
        return {phrase, count}
      }
    }
    else if (right) {
      let d = map[y+1] && map[y + 1][x] || null
      let u = map[y-1] && map[y - 1][x] || null
      if (/[A-Z|]/.test(d)) {
        // console.log('v', map[y + 1][x])
        right = 0;
        down = 1;
      }
      // else if (map[y-1][x] !== ' ') {
      else if (/[A-Z|]/.test(u)) {
        // console.log('^')
        right = 0;
        down = -1;
      }
      else {
        console.error(`[2] lost ${down} ${right} ${next}`)
        c = false;
        return {phrase, count}
      }
    }
    else {
      console.error(`[3] lost (or done) ${down} ${right} ${next}`)
      c = false;
      return {phrase, count}
    }
    x += right;
    y += down;
    next = map[y][x]
    count++;

    // console.log('   next after turn', next, )
  }


  return {phrase, count}
}

let {phrase, count} = solver(lines(input))
console.log(count, phrase && phrase.join(''))


// < 19364
// < 19363
