
const solver = (lines) => {
  solver1()
  solver2()
}

const cellPower = (x, y, input) => {
  let rackId = (x + 10)
  let p1 = (((rackId) * y) + input) * rackId
  let p2 = parseInt(Array.from(('' + p1)).reverse()[2] || 0)
  return p2 - 5
}

const solver1 = () => {
  console.log('solver1')
  let input = 7403

  let s = 300
  let p = []

  console.log('test (3, 5, 8)', cellPower(3, 5, 8))
  console.log('test (122,79, 57)', cellPower(122,79, 57))
  console.log('test (217, 196, 39)', cellPower(217, 196, 39))
  console.log('test (101, 153, 71)', cellPower(101, 153, 71))

  for (let y = 1; y <= s; y++) {
    p[y] = []
    for (let x = 1; x <= s; x++) {
      p[y][x] = cellPower(x, y, input)
    }
  }

  let max = 0
  let maxCoord = [-1, -1]

  console.log('1')

  for (let y = 1; y <= s - 3; y++) {
    for (let x = 1; x <= s - 3; x++) {
      let pz = p[y][x] + p[y][x + 1] + p[y][x + 2] +
              p[y+1][x] + p[y+1][x + 1] + p[y+1][x + 2] +
              p[y+2][x] + p[y+2][x + 1] + p[y+2][x + 2]
      if (pz > max) {
        max = pz
        maxCoord = [x, y]
      }
    }
  }

  console.log('1 ***: ', maxCoord[0], maxCoord[1], max)
}

//4,81

const solver2 = () => {
  console.log('solver1')
  let input = 7403

  // input  = 18

  let s = 300
  let p = []

  console.log('test', cellPower(3, 5, 8))

  for (let y = 1; y <= s; y++) {
    p[y] = []
    for (let x = 1; x <= s; x++) {
      p[y][x] = cellPower(x, y, input)
    }
  }

  let max = 0
  let maxX = -1
  let maxY = -1
  let maxSize = -1

  console.log('1')

  for (let size = 1; size <= 300; size++) {
    for (let y = 1; y <= s - size; y++) {
      for (let x = 1; x <= s - size; x++) {
        let pz = 0

        for (let y2 = 0; y2 < size; y2++) {
          for (let x2 = 0; x2 < size; x2++) {
            pz += p[y + y2][x + x2]
          }
        }

        // console.log(`PZ ${pz} ${x},${y},${size}`)

        if (pz > max) {
          console.log(`INPUT${input} setting max ${pz} ${x},${y},${size}   > ${max}`)
          max = pz
          maxX = x
          maxY = y
          maxSize = size
        }
      }
    }
  }

  // for (let y = 1; y <= s; y++) {
  //   for (let x = 1; x <= s; x++) {
  //     let pz = 0
  //     for (let size = 1; size < 300; size++) {
  //       for (let y2 = 0; y2 < size; y2++) {
  //         if (y + y2 + size >= s) {
  //           break
  //         }
  //         pz += p[y + y2][x + size - 1]
  //       }
  //       for (let x2 = 0; x2 < size; x2++) {
  //         if (x + x2 + size >= s) {
  //           console.log(`break at x:${x}, x2:${x2} size:${size}`)
  //           break
  //         }
  //         try {
  //           pz += p[y + size - 1][x + x2]
  //         } catch (e) {
  //           console.error(`X ${x},${y},${size}  x2: ${x2}`)
  //         }
  //       }
  //       try {
  //         pz -= p[y + size - 1][x + size - 1]
  //       }
  //       catch (e) {
  //         console.error(`Z ${x},${y},${size}`)
  //       }
  //
  //
  //       if (pz > max) {
  //         console.log(`INPUT${input} setting max ${pz} ${x},${y},${size}   > ${max}`)
  //         max = pz
  //         maxX = x
  //         maxY = y
  //         maxSize = size
  //       }
  //     }
  //   }
  // }


  console.log('2 ***: ', `${input} -- ${maxX},${maxY},${maxSize} (value: ${max})`)
}

solver()
