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


const rot3 = r => {

  // console.log((r & 0x1) << 2)
  // console.log((r & 0x2) << 4)
  // console.log((r & 0x4) << 6)
  //
  // console.log((r & 0x8) >> 2)
  // console.log((r & 0x10))
  // console.log((r & 0x20) << 2)
  //
  // console.log((r & 0x40) >> 6)
  // console.log((r & 0x80) >> 4)
  // console.log((r & 0x100) >> 2)

  return 0 +
    ((r & 0x1) << 2) +
    ((r & 0x2) << 4) +
    ((r & 0x4) << 6) +

    ((r & 0x8) >> 2) +
    ((r & 0x10)) +
    ((r & 0x20) << 2) +

    ((r & 0x40) >> 6) +
    ((r & 0x80) >> 4) +
    ((r & 0x100) >> 2)
}
const flip3 = r => {

  // console.log((r & 0x1 << 2))
  // console.log((r & 0x2))
  // console.log((r & 0x4 >> 2))
  //
  // console.log((r & 0x8 << 2))
  // console.log((r & 0x10))
  // console.log((r & 0x20 >> 2))
  //
  // console.log((r & 0x40 << 2))
  // console.log((r & 0x80))
  // console.log((r & 0x100 >> 2))

  return 0 +
    ((r & 0x1) << 2) +
    ((r & 0x2)) +
    ((r & 0x4) >> 2) +

    ((r & 0x8) << 2) +
    ((r & 0x10)) +
    ((r & 0x20) >> 2) +

    ((r & 0x40) << 2) +
    ((r & 0x80)) +
    ((r & 0x100) >> 2)
}

const flipRot3 = r => {
  let r1 = rot3(r)
  let r2 = rot3(r1)
  let r3 = rot3(r2)

  let s = Immutable.Set([r])
  s = s.add(flip3(r))
  s = s.add(r1)
  s = s.add(flip3(r1))
  s = s.add(r2)
  s = s.add(flip3(r2))
  s = s.add(r3)
  s = s.add(flip3(r3))

  return s.toArray()
}

const parseRules = (lines) => {
  let rules = {
    2: [
      [ [ 0 ], 415 ],
      [ [ 1, 2, 4, 8 ], 62 ],
      [ [3, 5, 10, 12], 187 ],
      [ [ 6, 9 ], 942 ],
      [ [ 7, 11, 13, 14 ], 186 ],
      [ [ 15 ], 40 ]
    ],
    3: []
  }

  lines.forEach(line => {
    let rule = parseRule(line)
    // console.log('---------rule', rule)
    if (line.length == 20) {
      // rules[2].push(rule)
      // rules[2].push(...rot2(rule))
    }
    else {
      // rules[3].push(rule)
      rules[3].push([flipRot3(rule[0]), rule[1], line])
    }
  })
  return rules
}

const parseRule = (line) => {
  // ##/## => .../#.#/...
  // .../.../... => .#../#.#./..##/.###

  // 8+4+2+1 (15) => 0+0+0+32+0+8+0+0+0 (40)
  // 0+0+0... => 0+16384 +

  let [_in, _out] = line
    .split(' => ')

  // console.log(`${_in}      =>       ${_out}`)

  let inVal = _in.replace('/', '').split('')
    .reduce((acc, ch, ix) => (acc + (ch == '#' ? (0x1<<ix) : 0)), 0)
  let outVal = _out.replace('/', '').split('')
    .reduce((acc, ch, ix) => (acc + (ch == '#' ? (0x1<<ix) : 0)), 0)



  // console.log(`${inVal} => ${outVal}`)
  return [inVal, outVal]
}

const initialPattern = `.#./..#/###`
const initialPatternValue = parseRule('.#./..#/### => ..../..../..../....')[0]


const solver = (input) => {
  let rules = parseRules(input)
  // console.log(rules[2])
  console.log(rules[3][3])

  let pattern = initialPattern;
  let patternSize = 3;
  let iterations = 1;

  for (let i = 0; i < iterations; i++) {

    console.log('----------------------');
    pattern.split('/').forEach(s => console.log(s))

    let patternValue = initialPatternValue;
    let patternValues = flipRot3(patternValue)
    let x;

    if (!(patternSize%2)) {
      rules[2].find(([_in, _out], ruleIx) => {
        // console.log(`checking ${pattern} against ${_in}`)
        // if (_in.includes(pattern)) {
        if (x = _in.some(i => patternValues.includes(i))) {
          console.log('[2] found match', ruleIx, patternValue, x)
        }
        else {
          // console.log('no match', pattern)
        }
      })
    }
    else {

      rules[3].find(([_in, _out, line], ruleIx) => {
        // console.log(`checking ${pattern} against ${_in}`)
        // if (_in.includes(pattern)) {
        if (x = _in.find(i => patternValues.includes(i))) {
          console.log('[3] found match', ruleIx, patternValue, x)
          console.log(_in, line)
        }
        else {
          // console.log('no match', pattern)
        }
      })
    }

    patternSize++
  }

}


solver(lines(input))
