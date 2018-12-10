import path from 'path'
import {readFile, getLines} from '../../common'

const rx = /position=<\s*([-0-9]*),\s*([-0-9]*)>\s*velocity=<\s*([-0-9]*),\s*([-0-9]*)>/

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data).map(l => {
        const parts = rx.exec(l)
        if (parts) {
          return parts.slice(1).map(d => parseInt(d))
        }
      })
    )
  })
  .catch(err => {
    console.error(err)
  })

const solver = lines => {
  let data = lines
  let t = 0

  let minSep = Infinity

  while(true) {
    lines = lines.map(line => {
      return [line[0] + line[2], line[1] + line[3], line[2], line[3]]
    })

    let minX = Infinity
    let maxX = -Infinity
    lines.forEach(line => {
      if (line[0] < minX) {
        minX = line[0]
      }
      if (line[0] > maxX) {
        maxX = line[0]
      }
    })
    if ((maxX - minX) < minSep) {
      minSep = (maxX - minX)
    }
    else {
      break
    }
    t++
  }

  // back up 1 step
  lines = lines.map(line => {
    return [line[0] - line[2], line[1] - line[3], line[2], line[3]]
  })

  // Draw it:
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  lines.forEach(line => {
    if (line[0] < minX) {
      minX = line[0]
    }
    if (line[0] > maxX) {
      maxX = line[0]
    }
    if (line[1] < minY) {
      minY = line[1]
    }
    if (line[1] > maxY) {
      maxY = line[1]
    }
  })

  console.log('1 ***: ')
  for (let y = minY; y <= maxY; y++) {
    let str = ''
    for (let x = minX; x <= maxX; x++) {
      if (lines.find(line => (line[0] == x) && (line[1] == y))) {
        str += '#'
      }
      else {
        str += ' '
      }
    }
    console.log(str)
  }

  console.log('2 ***: ', t)
}
