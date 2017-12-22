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


const rot3 = r => 0 +
    ((r & 0x1) ? 0x4 : 0) +
    ((r & 0x2) ? 0x20 : 0) +
    ((r & 0x4) ? 0x100 : 0) +

    ((r & 0x8)  ? 0x2 : 0) +
    ((r & 0x10) ? 0x10 : 0) +
    ((r & 0x20) ? 0x80 : 0) +

    ((r & 0x40) ? 0x1 : 0) +
    ((r & 0x80) ? 0x8 : 0) +
    ((r & 0x100) ? 0x40 : 0)

const flip3 = r => 0 +
    ((r & 0x1) ? 0x4 : 0) +
    ((r & 0x2) ? 0x2 : 0) +
    ((r & 0x4) ? 0x1 : 0) +

    ((r & 0x8)  ? 0x20 : 0) +
    ((r & 0x10) ? 0x10 : 0) +
    ((r & 0x20) ? 0x8 : 0) +

    ((r & 0x40)  ? 0x100 : 0) +
    ((r & 0x80)  ? 0x80 : 0) +
    ((r & 0x100) ? 0x40 : 0)


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
      [ [ 0 ], 415,             '../.. => ###/##./##.' ],
      [ [ 1, 2, 4, 8 ], 62,     '#./.. => .##/###/...' ],
      [ [3, 5, 10, 12], 187,    '##/.. => ##./###/#..' ],
      [ [ 6, 9 ], 942,          '.#/#. => .##/#.#/###' ],
      [ [ 7, 11, 13, 14 ], 186, '##/#. => .#./###/#..' ],
      [ [ 15 ], 40,             '##/## => .../#.#/...' ]
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

// const initialPattern =
// const initialPatternValue = parseRule('.#./..#/### => ..../..../..../....')[0]


const solver = (input) => {
  let rules = parseRules(input)
  // console.log(rules[2])
  // console.log(rules[3])
  // console.log(rules[3][3])

  let pattern = `.#./..#/###`
  // let patternValue = parsePartial(pattern)

  let patternSize = 3;
  let iterations = 18;

  // console.log('solver', pattern)

  for (let i = 0; i < iterations; i++) {
    // console.log('')
    // console.log('')
    // console.log('')
    // console.log(i)
    console.log('================================================', patternSize);
    // pattern.split('/').forEach(s => console.log(s))

    let tiles = tileSplit(pattern, patternSize)
    // console.log('tiles', tiles)

    let tileSolutions = tiles.map(t =>
      tileSolver(t, patternSize, rules)
    )
    // console.log('tileSolutions', tileSolutions.length, tileSolutions)

    // patternSize++
    patternSize = Math.sqrt(tileSolutions.join('').replace(/\//g, '').length)
    // console.log('new patternSize:', patternSize)
    pattern =
      tileJoin(
        tileSolutions,
        patternSize
      )
  }

  // console.log('===============================')
  // console.log(pattern)
  // pattern.split('/').forEach(s => console.log(s))

  console.log(pattern.replace(/[\/\.]/g, '').length)

}

const tileSplit = (pattern, patternSize) => {
  // console.log('tileSplit', patternSize, pattern)
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
  // console.log('tileSplit', tiles)
  return tiles
}

const tileJoin = (tiles, patternSize) => {
  // console.log('tileJoin > ', patternSize, tiles)
  // if (tiles.length == 1) { return tiles }
  let cells = Array(patternSize)
  for (let x = 0; x < patternSize; x++) {
    cells[x] = Array(patternSize).fill(' ')
  }
  // console.log(cells)

  let tileSize = patternSize = Math.sqrt(tiles[0].replace(/\//g, '').length)
  let tileSide = Math.sqrt(tiles.length)

  for (let t = 0; t < tiles.length; t++) {
    // console.log('----------------t', t)
    let r = Math.floor(t / tileSide) * tileSize
    let c = (t % tileSide) * tileSize

    let ch = tiles[t].split('/').map(s => s.split(''))
    // console.log('r', r, 'c', c, 't', t, 'tiles', tiles[t], 'ch', ch)
    for (let x = 0; x < tileSize; x++) {
      // console.log('    x', x)
      cells[r + x].splice(c, tileSize, ...ch[x])
      // console.log('cells', cells)
    }
  }
  // console.log('tileJoin < ', cells)
  return cells.map(r => r.join('')).join('/')
}

const tileSolver = (pattern, patternSize, rules) => {

  // console.log('--------tileSolver', pattern)
  let ruleSet = (patternSize % 2) ? 3 : 2

  let patternValues
  if (ruleSet == 3) {
    patternValues = flipRot3(parsePartial(pattern))
  }
  else {
    patternValues = rules[2].find(([_in]) => _in.includes(parsePartial(pattern)))[0]
  }
  // console.log('patternValues', patternValues)

  let newRule = rules[ruleSet].find(([_in]) =>
    _in.some(i => patternValues.includes(i))
  )


  if (!newRule) {
    console.error('no match found')
  }
  // console.log(newRule)
  return newRule && newRule[2].split(' => ')[1]
}




// console.log(tileSplit('abcdef/ghijkl/mnopqr/stuvwx/yz0123/456789', 6))
// console.log(tileSplit(
//   'abcdef---/ghijkl.../mnopqr___/stuvwx===/yz0123+++/456789)))/........./........./........./',
// 9))
//
// console.log(tileJoin(tileSplit('abc/def/ghi', 3)))

// console.log(tileJoin(tileSplit('abcdef/ghijkl/mnopqr/stuvwx/yz0123/456789', 6), 6))

// console.log(tileSplit('#..#/...#/##../####', 4))
// console.log(tileJoin(tileSplit('#..#/...#/##../####', 4), 4))

// let ts = tileSplit('#..#/...#/##../####', 4)
// console.log('ts', ts)
// let tj = tileJoin(ts, 4)
// console.log('tj', tj)
// let tj = tileJoin(['#..#/...#/##../####'], 4)
// console.log('tj', tj)
//
// console.log('--------------------------------------------------------')

solver(lines(input))
