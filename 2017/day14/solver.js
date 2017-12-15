let Immutable = require('immutable')
let {knotHash} = require('../day10/solver_as_lib')
let {countGroups} = require('../day12/solver_as_lib')
let randomEmoji = require('random-emoji')
const testInput = 'flqrgnkx'
const puzzleInput = 'amgozmfv'

const input = puzzleInput;

const solver = (input) => {

  let grid = [];
  for (let i = 0; i < 128; i++) {
    let hashInput = input + '-' + i
    console.log('hashing', hashInput)
    grid.push(knotHash(hashInput))
  }

  printGrid(grid)

}

const coordsIndex = (i, j) => {
  return 128*i + j
}

const printGrid = grid => {
  let count = 0;
  let rows = [];
  rows[-1] = rows[-2] = '';
  let regions = Immutable.List();
  for (let i = 0; i < grid.length; i++) {
    let s = [];
    // console.log(grid[i]);
    for (let h = 0; h < grid[i].length / 4; h++) {

      let slices = [-4*h - 4, -4*h]
      if (!h) { slices = [-4]}
      // console.log('slices ', slices)
      let hex4 = grid[i].slice(...slices)
      // console.log('hex4', hex4);
      let n = parseInt('0x' + hex4, 16)
      // console.log('n', n)
      for (let j = 0; j < 16; j++) {
        let b = ((n >> j) & 0x0001)
        if (b) {
          s.unshift('#')
          count++
        }
        else {
          s.unshift('.')
        }
      }
      // console.log('b4', s.join(''))
    }
    rows.push(s.join(''))
    // console.log(s.join(''))

    // find subregions:
    let neighbors = [];
    s.map((n, x) => {
      if (n == '#') {
        let neighbors = ([[-1, 0], [0, -1]])
          .filter(coords => {
            // console.log(coords, rows.length - 1 + coords[0], x + coords[1])
            return rows[rows.length - 1 + coords[0]][x + coords[1]] == '#'
          })
          .map(coords => coordsIndex(i + coords[0], x + coords[1]))
        if (neighbors.length) { // check [-1, -1] if either above or left match
          if (rows[rows.length - 2][x - 1] == '#') {
            neighbors.push(coordsIndex(i - 1, x - 1))
          }
        }

        if (neighbors.length) {
          regions = regions.push(`${i*128 + x} <-> ${neighbors.join(', ')}`)
        }
        else {
          regions = regions.push(`${i*128 + x} <-> ${i*128 + x}`)
        }
      }
    })
  }
  console.log('count', count)
  // console.log(regions.toJS())
  console.log('regionCount', regions.size)
  let joinedRegions = countGroups(regions)
  // console.log('joinedRegions', joinedRegions)
  // Part 2 answer:
  console.log('joinedRegions', joinedRegions.size)
  // console.log(randomEmoji.random({count:5}).map(e => e.character))



  // Print grid with emojis to better show regions...
  /*
  let emojis = randomEmoji.random({count:joinedRegions.size}).map(e => e.character)
  rows.forEach((r, y) => {
    let str = ''
    r.split('').forEach((c, x) => {
      // console.log('jr index', coordsIndex(y, x), joinedRegions.findIndex(jr => jr.has(coordsIndex(y, x))))
      str += (c == '#' ?
      emojis[(joinedRegions.findIndex(jr => jr.includes(coordsIndex(y, x)))) % emojis.length] :
      '⬛️')
    })
    console.log(str)
  })
  */
}


solver(input);

// part 1
// > 8108

// part 2
// > 156
// < 6151
