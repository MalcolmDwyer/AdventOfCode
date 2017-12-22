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
    if (line.length == 20) {
      // Done above manually
    }
    else {
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

const solver = (input) => {
  let rules = parseRules(input)
  let pattern = `.#./..#/###`
  let patternSize = 3;
  let iterations = 18;

  for (let i = 0; i < iterations; i++) {
    // console.log('')
    // console.log('')
    // console.log('')
    // console.log(i)
    console.log('================================================', patternSize);
    // pattern.split('/').forEach(s => console.log(s))

    let tiles = tileSplit(pattern, patternSize)

    let tileSolutions = tiles.map(t =>
      tileSolver(t, patternSize, rules)
    )

    patternSize = Math.sqrt(tileSolutions.join('').replace(/\//g, '').length)
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
  let rows = pattern.split('/');
  let cells = rows.map(r => r.split(''))
  let tiles = []
  let tileSize = (patternSize%2) ? 3 : 2
  let tileSide = Math.floor(rows.length / tileSize)

  for (let t = 0; t < tileSide * tileSide; t++) {
    let r = Math.floor(t / tileSide) * tileSize
    let c = (t % tileSide) * tileSize
    tiles[t] = cells.slice(r, r + tileSize).map(r => r.slice(c, c + tileSize).join('')).join('/')
  }
  return tiles
}

const tileJoin = (tiles, patternSize) => {
  // console.log('tileJoin > ', patternSize, tiles)
  // if (tiles.length == 1) { return tiles }
  let cells = Array(patternSize)
  for (let x = 0; x < patternSize; x++) {
    cells[x] = Array(patternSize).fill(' ')
  }

  let tileSize = patternSize = Math.sqrt(tiles[0].replace(/\//g, '').length)
  let tileSide = Math.sqrt(tiles.length)

  for (let t = 0; t < tiles.length; t++) {
    let r = Math.floor(t / tileSide) * tileSize
    let c = (t % tileSide) * tileSize

    let ch = tiles[t].split('/').map(s => s.split(''))
    for (let x = 0; x < tileSize; x++) {
      cells[r + x].splice(c, tileSize, ...ch[x])
    }
  }
  return cells.map(r => r.join('')).join('/')
}

const tileSolver = (pattern, patternSize, rules) => {

  let ruleSet = (patternSize % 2) ? 3 : 2

  let patternValues
  if (ruleSet == 3) {
    patternValues = flipRot3(parsePartial(pattern))
  }
  else {
    patternValues = rules[2].find(([_in]) => _in.includes(parsePartial(pattern)))[0]
  }

  let newRule = rules[ruleSet].find(([_in]) =>
    _in.some(i => patternValues.includes(i))
  )

  if (!newRule) {
    console.error('no match found')
  }
  return newRule && newRule[2].split(' => ')[1]
}

solver(lines(input))
