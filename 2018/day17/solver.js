import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data)//.map(l => l.split(''))
    )
  })
  .catch(err => {
    console.error(err)
  })

const rx = /([xy])=([\d]*), [xy]=([\d]*)..([\d]*)/

const getData = lines => {
// x=495, y=2..7
// y=7, x=495..501

  return lines.map(line => {
    const parts = rx.exec(line)
    const dir = parts[1]
    const l = parseInt(parts[2])
    const min = parseInt(parts[3])
    const max = parseInt(parts[4])
    return {
      [dir]: l,
      m1: min,
      m2: max
    }
  })

}

const getMap = data => {

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  data.forEach(d => {
    if (d.y) {
      if (d.y < minY) {
        minY = d.y
      }
      if (d.y > maxY) {
        maxY = d.y
      }
      if (d.m1 < minX) {
        minX = d.m1
      }
      if (d.m2 > maxX) {
        maxX = d.m2
      }
    }
    else {
      if (d.x > maxX) {
        maxX = d.x
      }
      if (d.x < minX) {
        minX = d.x
      }
      if (d.m2 > maxY) {
        maxY = d.m2
      }
      if (d.m1 < minY) {
        minY = d.m1
      }
    }
  })

  minX-=1
  maxX+=1
  console.log(`X: [${minX} ${maxX}], Y: [${minY}, ${maxY}]`)

  let map = Array(maxY + 1)

  for (let y = 0; y <= maxY + 1; y++) {
    map[y] = []
    for (let x = minX; x <= maxX; x++) {
      map[y][x] = 0
    }
  }

  data.forEach(d => {
    if (d.y) {
      for (let x = d.m1; x <= d.m2; x++) {
        map[d.y][x] = 1
      }
    }
    else {
      for (let y = d.m1; y <= d.m2; y++) {
        map[y][d.x] = 1
      }
    }
  })

  // maxY = 200

  return {
    minX,
    maxX,
    minY,
    maxY,
    map
  }
}

const solver = (lines) => {
  solver1(getData(lines))
}

const FgRed = "\x1b[31m"
const Reset = "\x1b[0m"

const printMap = (data, sources) => {
  let {map, minX, maxX, minY, maxY} = data
  for (let y = 0; y <= maxY; y++) {
    let str = `${y}`.padStart(4, ' ')
    for (let x = minX; x <= maxX; x++) {
      if (sources && sources.find(s => s.x == x && s.y == y)) {
        str += FgRed
      }
      switch(map[y][x]) {
        case 0:
          str += '.'
          break
        case 1:
          str += '#'
          break
        case 2:
          str += '|'
          break
        case 3:
          str += '~'
          break
        default:
          str += map[y][x] // for safety check
      }
      str += Reset
    }
    console.log(str)
  }
}

const solver1 = lines => {
  // console.log(lines)
  let data = getMap(lines)
  let {map, minX, maxX, minY, maxY} = data

  // printMap(data)

  let sources = [
    {x: 500, y: 0, done: false}
  ]

  let t = 0
  let done = false
  while(!done) {
    t++

    sources.filter(s => !s.done).forEach(s => {
      let y = s.y + 1

      while (y <= maxY && (map[y][s.x] == 0)) {
        // console.log(`y ${y}`)
        map[y][s.x] = 2
        y++
      }
      s.done = true

      if (map[y][s.x] == 1 || map[y][s.x] == 3) {
        // console.log('floor at ', y)
        let newSource = false
        while(!newSource) {  // Climb water back up the reservoir until it spills
          y--
          map[y][s.x] = 3

          let minX2 = Infinity
          let maxX2 = -Infinity
          let walls = 0

          ;([1, -1]).forEach(dir => {
            let x = s.x + dir

            while (true) { // settle to left and right
              if (map[y][x] == 1) {
                // console.log('wall at ', y, x)
                walls++
                break
              }
              if (x < minX2) {
                minX2 = x
              }
              if (x > maxX2) {
                maxX2 = x
              }
              if (!map[y+1][x]) {
                map[y][x] = 2
                s.done = true
                // console.log('New source at ', y, x)
                sources.push({done: false, y, x})
                newSource = true
                break
              }
              map[y][x] = 3
              x += dir
            }
            // console.log('early debug break')
            // return

          })

          // console.log('WALLS:', walls, 'y:', y, minX2, maxX2)
          if (walls !== 2) {
            for(let x2 = minX2; x2 <= maxX2; x2++) {
              map[y][x2] = 2
            }
          }
        }
      }
    })
    done = !sources.some(s => !s.done)
  }
  printMap(data, sources)
  let count = 0
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX-1; x <= maxX+1; x++) {
      if (map[y][x] > 1) {
        count++
      }
    }
  }
  console.log(`x: ${minX}-${maxX} y: ${minY}-${maxY}`)
  console.log('s1', count)


  count = 0
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX-1; x <= maxX+1; x++) {
      if (map[y][x] == 3) {
        count++
      }
    }
  }

  console.log('s2', count)

}
