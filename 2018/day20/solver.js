import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data)[0].slice(1, -1)//.map(l => l.split(''))
    )
  })
  .catch(err => {
    console.error(err)
  })

class Node {
  // Ring node
  constructor(y, x, {N, S, E, W} = {}) {
    this.x = x
    this.y = y
    this.N = N
    this.S = S
    this.E = E
    this.W = W
    this.visited = false
    this.distance = null
    this.back = null
  }
}

const dirs = ['N', 'S', 'W', 'E']
const dy = {N: -1, S: 1, W: 0, E: 0}  //[-1, 1, 0, 0]
const dx = {N:  0, S: 0, W: -1, E: 1} // [0, 0, -1, 1]
const back = {N: 'S', S: 'N', W: 'E', E: 'W'}
// const back = [1, 0, 3, 2]

let minX = Infinity
let maxX = -Infinity
let minY = Infinity
let maxY = -Infinity

const solver = rx => {
  // console.log('rx', rx)

  let x = 0
  let y = 0
  let loc = {x:0, y:0}
  let stack = []
  let tree = new Node(0, 0, {})
  let start = tree
  start.start = true
  start.distance = 0
  start.visited = true
  let current = tree
  // let map = [
  //   [tree]
  // ]
  let map = {
    0: {0: tree}
  }

  let allNodes = [start]

  // console.log('start-------')
  // console.log(map)
  // console.log('----')
  // console.log(tree)
  // console.log('^^^^^^^^^^^^^^^^^')

  // Build map:
  for (let r = 0; r < rx.length; r++) {
    let c = rx[r]
    // console.log(`--------------------- ${c}`)

    if (dirs.includes(c)) {
      const nextY = tree.y + dy[c]
      const nextX = tree.x + dx[c]

      minX = Math.min(minX, nextX)
      maxX = Math.max(maxX, nextX)
      minY = Math.min(minY, nextY)
      maxY = Math.max(maxY, nextY)

      // console.log(`y: ${nextY}, x: ${nextX}`)
      if (!map[nextY]) {
        map[nextY] = []
      }
      if (!map[nextY][nextX]) {
        map[nextY][nextX] = new Node(nextY, nextX)
        allNodes.push(map[nextY][nextX])
      }
      map[nextY][nextX][back[c]] = tree
      tree[c] = map[nextY][nextX]
      tree = tree[c]
    }
    else if (c == '(') {
      stack.push(tree)
    }
    else if (c == ')') {
      tree = stack.pop(tree)
    }
    else if (c == '|') {
      tree = stack[stack.length - 1]
    }
  }


  // console.log('allnodes', allNodes)
  // Explore map:
  let distance = 0
  let maxDistance = -Infinity
  let endpoint
  let count1000 = 0
  while(true) {
    let dNodes = allNodes.filter(n => n.distance === distance)
    if (!dNodes.length) {
      distance--
      break
    }
    distance++
    dNodes.forEach(n => {
      dirs.forEach(dir => {

        if (n[dir] && !n[dir].visited) {
          console.log(`Visiting ${n[dir].y},${n[dir].x}`)
          n[dir].visited = true
          n[dir].distance = distance
          n[dir].back = n
          if (distance > maxDistance) {
            maxDistance = distance
            endpoint = n[dir]
          }
          if (distance >= 1000) {
            count1000++
          }
        }
      })
    })

  }

  printMap(map)
  console.log('Distance: ', distance)
  console.log('1000+: ', count1000)


  // console.log(start)
}

// > 8527

const printMap = (map) => {
  const FgRed = "\x1b[31m"
  const Reset = "\x1b[0m"
  // console.log(`MIN/MAX X: ${minX} ${maxX}  Y: ${minY} ${maxY}`)
  console.log('')

  console.log(''.padStart(2*(maxX - minX + 1) + 1, '#'))
  for (let y = minY; y <= maxY; y++) {
    let str = '#'
    for (let x = minX; x <= maxX; x++) {
      str += map[y][x] ? (map[y][x].start ? (FgRed + 'X' + Reset) : '.') : '@'
      str += map[y][x].E ? '|' : '#'
    }
    console.log(str)
    str = '#'
    for (let x = minX; x <= maxX; x++) {
      str += map[y][x].S ? '-' : '#'
      str += '#'
    }
    console.log(str)
  }
  console.log('')
}
