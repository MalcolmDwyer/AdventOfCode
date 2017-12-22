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
    ((r & 0x1) ? 0x4 : 0) +
    ((r & 0x2) ? 0x20 : 0) +
    ((r & 0x4) ? 0x100 : 0) +

    ((r & 0x8)  ? 0x2 : 0) +
    ((r & 0x10) ? 0x10 : 0) +
    ((r & 0x20) ? 0x80 : 0) +

    ((r & 0x40) ? 0x1 : 0) +
    ((r & 0x80) ? 0x8 : 0) +
    ((r & 0x100) ? 0x40 : 0)

  // return 0 +
  //   ((r & 0x1) << 2) +
  //   ((r & 0x2) << 4) +
  //   ((r & 0x4) << 6) +
  //
  //   ((r & 0x8) >> 2) +
  //   ((r & 0x10)) +
  //   ((r & 0x20) << 2) +
  //
  //   ((r & 0x40) >> 6) +
  //   ((r & 0x80) >> 4) +
  //   ((r & 0x100) >> 2)
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
    ((r & 0x1) ? 0x4 : 0) +
    ((r & 0x2) ? 0x2 : 0) +
    ((r & 0x4) ? 0x1 : 0) +

    ((r & 0x8)  ? 0x20 : 0) +
    ((r & 0x10) ? 0x10 : 0) +
    ((r & 0x20) ? 0x8 : 0) +

    ((r & 0x40)  ? 0x100 : 0) +
    ((r & 0x80)  ? 0x80 : 0) +
    ((r & 0x100) ? 0x40 : 0)

  // return 0 +
  //   ((r & 0x1) << 2) +
  //   ((r & 0x2)) +
  //   ((r & 0x4) >> 2) +
  //
  //   ((r & 0x8) << 2) +
  //   ((r & 0x10)) +
  //   ((r & 0x20) >> 2) +
  //
  //   ((r & 0x40) << 2) +
  //   ((r & 0x80)) +
  //   ((r & 0x100) >> 2)
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
  return line.split(' => ').map(str => parsePartial(str))
}

const parsePartial = (string) =>
  string
    .replace(/\//g, '')
    .split('')
    .reduce(
      (acc, ch, ix) => (acc + (ch == '#' ? (0x1<<ix) : 0))
      , 0
    )

const initialPattern = `.#./..#/###`
const initialPatternValue = parseRule('.#./..#/### => ..../..../..../....')[0]


const solver = (input) => {
  let rules = parseRules(input)
  // console.log(rules[2])
  // console.log(rules[3][3])

  let pattern = initialPattern;
  let patternValue = initialPatternValue;

  let patternSize = 3;
  let iterations = 5;

  for (let i = 0; i < iterations && pattern; i++) {
    console.log('----------------------');
    pattern.split('/').forEach(s => console.log(s))

    let tiles = tileSplit(pattern, patternSize)
    console.log('tiles', tiles)
    pattern = tileSolver(pattern, patternSize, rules)

    patternSize++
  }
}

const tileSplit = (pattern, patternSize) => {
  let rows = pattern.split('/');
  let cells = rows.map(r => r.split(''))
  // console.log(cells)
  let tiles = []
  let tileSize = (patternSize%2) ? 3 : 2
  let tileSide = Math.floor(rows.length / tileSize)
  // console.log(`tileSize: ${tileSize}  tileSide: ${tileSide}`)

  for (let t = 0; t < tileSide * tileSide; t++) {
    // console.log('----------------t', t)
    let r = Math.floor(t / tileSide) * tileSize
    let c = (t % tileSide) * tileSize
    // console.log(r, c)
    tiles[t] = cells.slice(r, r + tileSize).map(r => r.slice(c, c + tileSize).join('')).join('/')
  }
  return tiles
}

const tileJoin = (tiles, patternSize) => {
  console.log('tileJoin', tiles, patternSize)
  return;
}

const tileSolver = (pattern, patternSize, rules) => {

  let patternValues = flipRot3(parsePartial(pattern))

  let ruleSet = (patternSize % 2) ? 3 : 2
  let newRule = rules[ruleSet].find(([_in]) =>
    _in.some(i => patternValues.includes(i))
  )

  if (!newRule) {
    console.error('no match found')
  }
  return newRule && newRule[2].split(' => ')[1]
}


// solver(lines(input))

// console.log(tileSplit('abcdef/ghijkl/mnopqr/stuvwx/yz0123/456789', 6))
// console.log(tileSplit(
//   'abcdef---/ghijkl.../mnopqr___/stuvwx===/yz0123+++/456789)))/........./........./........./',
// 9))
//
console.log(tileJoin(tileSplit('abc/def/ghi', 3)))
