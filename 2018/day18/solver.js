import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data).map(l => l.split(''))
    )
  })
  .catch(err => {
    console.error(err)
  })

  const solver = (lines) => {
    // solver1(lines, 10)
    solver1(lines, 1000000000)
  }

  const solver1 = (lines, time) => {
    // printMap(lines)
    let prevCounts
    for (let t = 0; t < time; t++) {

      let prev = [...lines.map(line => [...line])]

      // console.log(lines)
      // console.log('--------------------------------------------')
      // console.log(prev)

      //open ground (.), trees (|), or a lumberyard (#)
      for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
          let treeCount = 0
          let lumberCount = 0
          for (let m = -1; m <= 1; m++) {
            for (let n = -1; n <= 1; n++) {
              if (m || n) {
                if (prev[y + m] && prev[y + m][x + n] == '#') {
                  lumberCount++
                }
                if (prev[y + m] && prev[y + m][x + n] == '|') {
                  treeCount++
                }
              }
            }
          }

          if (prev[y][x] == '.') {
            if (treeCount >= 3) {
              lines[y][x] = '|'
            }
          }
          else if (prev[y][x] == '|') {
            if (lumberCount >= 3) {
              lines[y][x] = '#'
            }
          }
          else {
            if (
              (lumberCount >= 1) &&
              (treeCount >= 1)
            ) {
              lines[y][x] = '#'
            }
            else {
              lines[y][x] = '.'
            }
          }
        }
      }
      // console.log(`After ${t + 1} minutes`)
      // printMap(lines)

      let counts = totals(lines, prevCounts)
      let {treeCount, lumberCount} = counts
      console.log(`${t + 1}     ${treeCount} * ${lumberCount} => ${treeCount * lumberCount}`)
    }

    let counts = totals(lines, prevCounts)
    let {treeCount, lumberCount} = counts

    console.log(`s1 ${treeCount}*${lumberCount} = ${treeCount*lumberCount}`)
    prevCounts = counts
  }

  const totals = (lines, prev) => {
    let treeCount = 0
    let lumberCount = 0
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        if (lines[y][x] == '#') {
          lumberCount++
        }
        if (lines[y][x] == '|') {
          treeCount++
        }
      }
    }
    // if (prev) {
    //   console.log(`trees: ${prev.treeCount} => ${treeCount}  ^${treeCount - prev.TreeCount}`)
    //   console.log(`lumber: ${prev.lumberCount} => ${lumberCount}  ^${lumberCount - prev.lumberCount}`)
    // }
    // console.log(`*** ${treeCount}*${lumberCount} = ${treeCount*lumberCount}`)
    return {
      treeCount,
      lumberCount
    }
  }

// ! 204960
// ! 205220
// ! 201863
// ! 210184
// ! 214587
// ! 213239
// ! 204680

// repeats every 28
// 1000000000 % 28 = 20

// 3300 => 204756
// 1000000000 - 3300 = 999996700
// 999996700 % 28 = 24
// somethign else with %28 = 24
// ! 203814 (3296) ... that was 3297. off-by-one strikes again
// 211653 (3296!)

  const printMap = lines => {
    for (let y = 0; y < lines.length; y++) {
      let str = ''
      for (let x = 0; x < lines[y].length; x++) {
        str += lines[y][x] + ' '
      }
      console.log(str)
    }
  }
