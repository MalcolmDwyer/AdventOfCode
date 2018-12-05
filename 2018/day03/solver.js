var fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input
  .split('\n')
  .filter(line => line)
//-----------------------------------------------------------

const test = `
#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
`

const rg = /#([\d]*) @ ([\d]*),([\d]*): ([\d]*)x([\d]*)/

const markFabric = (lines) => {
  let fabric = []
  for (let j = 0; j < 1000; j++) {
    fabric[j] = Array(1000)
  }

  lines.forEach(line => {
    const parts = rg.exec(line)
    let all, id, left, top, width, height
    [all, id, left, top, width, height] = parts.map(p => parseInt(p))

    for (let j = top; j < top + height; j++) {
      let row = fabric[j]
      for (let i = left; i < left + width; i++) {
        fabric[j][i] = (row[i] || 0) + 1
      }
    }
  })

  return fabric
}

const solver1 = (lines) => {
  let fabric = markFabric(lines)

  let count = 0
  for (let j = 0; j < fabric.length; j++) {
    for (let i = 0; i < fabric[j].length; i++) {
      if (fabric[j][i] > 1) {
        count++
      }
    }
  }
  return count
}

const solver2 = (lines) => {
  let fabric = markFabric(lines)

  let foundId = null
  lines.forEach(line => {
    let all1s = true
    // console.log('-----', line)
    const parts = rg.exec(line)
    let all, id, left, top, width, height
    [all, id, left, top, width, height] = parts.map(p => parseInt(p))

    for (let j = top; all1s && (j < top + height); j++) {
      for (let i = left; all1s && (i < left + width); i++) {
        if (fabric[j][i] !== 1) {
          // console.log(`eliminating ${id} at ${i},${j}`)
          all1s = false
        }
      }
    }
    if (all1s) {
      foundId = id
    }
  })
  return foundId
}

let s1 = solver1(lines(input))
let s2 = solver2(lines(input))

console.log('s1', s1)
console.log('s2', s2)
