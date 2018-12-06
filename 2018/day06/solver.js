import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(getLines(data).map(l => l.split(',')))
    // solver(data)
  })
  .catch(err => {
    console.error(err)
  })

let solver = (lines) => {
  solver1(lines)
  solver2(lines)
}

let getData = lines => lines.map((line, ix) => {
  let pair = line.map((c) => parseInt(c))
  return {x: pair[0], y: pair[1], ix}
})

let getMinMax = data => {
  let minMax = data.reduce((acc, c) => {
    if (c.x < acc.xMin) {
      acc.xMin = c.x
    }
    if (c.x > acc.xMax) {
      acc.xMax = c.x
    }
    if (c.y < acc.yMin) {
      acc.yMin = c.y
    }
    if (c.y > acc.yMax) {
      acc.yMax = c.y
    }
    return acc
  }, {
    xMin: Infinity,
    yMin: Infinity,
    xMax: -Infinity,
    yMax: -Infinity
  })

  return minMax
}

let solver1 = (lines) => {
  // console.log('solver1', lines)
  let data = getData(lines)
  let minMax = getMinMax(data)

  // console.log(data.length)
  // console.log(minMax)

  let tests = []
  // let
  data.forEach((c, ix) => {
    if (c.x == minMax.xMin || c.x == minMax.xMax || c.y == minMax.yMin || c.y == minMax.yMax) {
      return
    }
    else {
      tests.push(ix)
      // let area =
    }
  })

  // console.log(tests)
  let coordinatesForPoint = Array(data.length)
  coordinatesForPoint.fill(0)

  for (let x = minMax.xMin; x < minMax.xMax; x++) {
    for (let y = minMax.yMin; y < minMax.yMax; y++) {
      let min = Infinity
      let minIndex = null
      for (let c = 0; c < data.length; c++) {
        let d = Math.abs(data[c].x - x) + Math.abs(data[c].y - y)
        if (d < min) {
          min = d
          minIndex = c
        }
      }
      // console.log(`${x},${y} min:${min} minIndex: ${minIndex}`)
      coordinatesForPoint[minIndex] += 1
    }
  }

  let maxTest = 0
  let maxTestIx = null
  tests.forEach(t => {
    if (coordinatesForPoint[t] > maxTest) {
      maxTest = coordinatesForPoint[t]
      maxTestIx = t
    }
  })
  console.log('*** 1:', maxTest)

  // console.log(coordinatesForPoint)
}

let solver2 = (lines) => {
  // console.log('solver2', lines)
  let data = getData(lines)
  let minMax = getMinMax(data)
  // console.log(data.length)
  // console.log(minMax)

  // let r = 32
  let r = 10000

  let area = 0

  for (let y = minMax.yMin - r; y < minMax.yMax + r; y++) {
    if (!(y%1000)) {
      console.log(y) // progress...
    }
    for (let x = minMax.xMin - r; x < minMax.xMax + r; x++) {
      let tally = 0
      let b = false
      for (let c = 0; !b && c < data.length; c++) {
        let d = Math.abs(data[c].x - x) + Math.abs(data[c].y - y)
        tally += d
        if (tally >= r) {
          b = true
        }
      }

      if (tally < r) {
        area++
      }
    }
  }
  console.log('*** 2:', area)
}

// 35039
