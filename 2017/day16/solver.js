var fs = require('fs');
var Immutable = require('immutable');
var _ = require('lodash')
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const stepsSplit = input => input
  .split('\n')
  .filter(a => a.length)
  [0]
  .split(',')
//-----------------------------------------------------------

const solver = (dancers, steps) => {
  // console.log(dancers)
  // console.log(steps.length)

  let d = dancers

    steps.forEach(s => {
      if (s[0] == 's') {
        let l = parseInt(s.slice(1))
        // console.log(s, 'l:', l)
        d = d.slice(-l).concat(d.slice(0, d.size - l))
      }
      else if (s[0] == 'x') {
        let parts = s.slice(1).split('/').map(p => parseInt(p))
        // console.log(s, 'parts', parts)
        // console.log(d.get(parts[0]), d.get(parts[1]))
        d = d
          .set(parts[0], d.get(parts[1]))
          .set(parts[1], d.get(parts[0]))
      }
      else if (s[0] == 'p') {
        let parts = [s[1], s[3]]
        let ix = parts.map(p => d.findIndex(_d => _d == p))
        // console.log(s, parts, ix)
        d = d
          .set(ix[0], parts[1])
          .set(ix[1], parts[0])
      }
      else {
        console.error('problem...')
      }
      // console.log(d)
    })

  // console.log(d.join(''))
  return d;
}


let solver2 = (dancers, steps, repeat, last) => {

  let d = Immutable.List(dancers)
  let seen = Immutable.Set([d])
  let count
  for (count = 1; count <= repeat; count++) {
    d = solver(d, steps)

    console.log(count, 'd', d.join(''))

    if (!last && seen.has(d)) {
      console.log(count, ' found ', d.join(''))
      break;
    }

    seen.add(d)
  }

  if (count > repeat) {
    console.log('solved directly: ', d.join(''))
    return d;
  }

  if (!last) {
    console.log('MOD break-----------')
    let sol = solver2(dancers, steps, (repeat%(count)), true)
    console.log(sol.join(''))
  }
  return d;
}


let testDancers = 'abcde'
let testSteps = ['s1','x3/4', 'pe/b']


let realDancers = 'abcdefghijklmnop'
let realSteps = stepsSplit(input)

//
// let dancers = testDancers
// let steps = testSteps
//

let x = 1;
let dancers = x ? realDancers : testDancers
let steps = x ? realSteps : testSteps

// solver(dancers, steps, 1)
// solver(dancers, steps, 1000000000)


solver2(Immutable.List(dancers), steps, 1000000000)


// bmpcekidojhnglfa
// hdfoempiajglcnbk
// dckfegaobjinplmh
