import path from 'path'
import {readFile, getLines} from '../../common'

import {astar, Graph} from '../../astar'

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
  solver1(lines)
  // solver1(lines, true) // part2
}

const unitTypes = ['E', 'G']
const adjacentCells = [[-1, 0], [0, -1], [0, 1], [1, 0]]

const solver1 = lines => {
  let units = []
  let unitIndex = 0
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let c = lines[y][x]
      let cD = unitTypes.indexOf(c)
      if (cD >= 0) {
        units.push({
          x, y,
          id: unitIndex,
          type: c,
          hp: 200,
          attack: 3
        })
        unitIndex++
        // Fill in the track underneath the cart:
        lines[y][x] = '.'
      }
    }
  }

  // lines.forEach(line => {
  //   console.log(line.join(''))
  // })

  printMap(lines, units)

  let t = 0
  let done = false
  while (!done) {
    t++
    console.log(`************************************  ${t}`)
    // units.forEach(unit => {
    //   console.log(unit)
    // })
    done = runTurn(lines, units, t)


    printMap(lines, units)
  }

  // units.forEach(unit => {
  //   console.log(unit)
  // })
}

const printMap = (lines, units) => {
  lines.forEach((line, y) => {
    let str = ''
    let append = '  '
    line.forEach((cell, x) => {
      let unit = units.find(unit => (unit.x == x) && (unit.y == y))
      if (unit) {
        str += unit.type
        append += `${unit.type}(${unit.hp}), `
      }
      else {
        str += cell
      }
    })
    console.log(str, append)
  })
}

const unitSort = (a, b) => {
  if (a.y < b.y) { return -1 }
  else if (a.y > b.y) { return 1}
  else if (a.x < b.x) { return -1}
  else { return 1}
}

const runTurn = (lines, units, t) => {
  units = units.sort(unitSort)
  let done = false

  for (let u = 0; u < units.length; u++) {
    let unit = units[u]
    if (unit.hp <= 0) {
      continue
    }

    let hasTarget = runUnit(lines, units, unit)
    done |= !hasTarget
    if (!hasTarget) {
      console.log(`FINISHED during ${t} with ${u}`)
      let remainingHP = units.reduce((acc, unit) => acc + unit.hp, 0)
      console.log('remainingHP', remainingHP)
      break
    }
  }
  return done
}

const runUnit = (lines, units, unit) => {
  // console.log(`----------------Unit[${unit.id}] ${unit.type}:${unit.y},${unit.x}`)

  const targets = units.filter(unit2 => unit2.hp && (unit2.type !== unit.type))
  if (!targets.length) {
    console.log('UNIT has no targets')
    return false
  }
  let adjacentTargets = targets.filter(unit2 =>
    [[-1, 0], [0, -1], [0, 1], [1, 0]].some(adj =>
      (unit2.y == (unit.y + adj[0])) &&
      (unit2.x == (unit.x + adj[1]))
    )
  )
  // console.log('AdjacentTargets (before sort/filter)', adjacentTargets)
  const lowestHP = Math.min(...adjacentTargets.map(unit => unit.hp))

  adjacentTargets = adjacentTargets
    .filter(unit => unit.hp == lowestHP) // attack weakest
    .sort((a,b) => a.hp > b.hp).sort(unitSort) // tie break reading order

  if (adjacentTargets.length) {
    // console.log('AdjacentTargets', adjacentTargets)
    runCombat(lines, units, unit, adjacentTargets[0])
    return true
  }

  const targetAdjacentCells = Array.from(targets.reduce((cells, target) => {
    [[-1, 0], [0, -1], [0, 1], [1, 0]].forEach(adj => {
      let siteY = target.y + adj[0]
      let siteX = target.x + adj[1]
      if ((lines[siteY][siteX] == '.') && !units.some(unit2 =>
        unit2.hp && (unit2.x == siteX) && (unit2.y == siteY)
      )) {
        cells.add(`${siteY},${siteX}`)
      }
    })
    return cells
  }, new Set([]))).map(string => {
    let p = string.split(',')
    return {
      y: parseInt(p[0]),
      x: parseInt(p[1])
    }
  })

  // console.log('targetAdjacentCells', targetAdjacentCells)
  runMove(lines, units, unit, targetAdjacentCells)
  return true
}

const runCombat = (lines, units, unit, target) => {
  console.log(`Unit[${unit.id}] ${unit.type}:${unit.y},${unit.x}   ATTACK => ${target.type}[${unit.id}] ${target.y},${target.x}`)
  target.hp = Math.max(0, (target.hp - unit.attack))
}


const runMove = (lines, units, unit, targetAdjacentCells) => {
  let graph = graphBuilder(lines, units)
  // console.log('GRAPH')
  // console.log(graph.grid)
  let start = graph.grid[unit.y][unit.x]

  let paths = targetAdjacentCells.map(cell => {
    let end = graph.grid[cell.y][cell.x]
    const result = astar.search(graph, start, end)
    // console.log(`   ${cell.y},${cell.x} path:`, result.length)
    // result.forEach(path => console.log('   ', path.y, path.x))
    return result.map(n => ({x: n.y, y: n.x})) // Need to flip for some reason

    // path.map(c => `[${c.y}, ${c.x}]`).join(' '))
  })
    .filter(path => path.length) // no path found
    .sort((a,b) => {
      if (a.length < b.length) {
        return -1
      }
      else if (a.length > b.length) {
        return 1
      }
      else {
        // Tie break with reading-order sort of endpoints
        return unitSort(a[a.length-1], b[b.length-1])
      }
    })

  if (paths.length) {
    // console.log('Paths', paths.map(p => p.length).join(' '))
    // console.log(paths[0])
    console.log(`Unit[${unit.id}] ${unit.type}:${unit.y},${unit.x}   MOVING => ${paths[0][0].y},${paths[0][0].x}`)
    unit.x = paths[0][0].x
    unit.y = paths[0][0].y
  }
}

const graphBuilder = (lines, units) => {
  const weights = lines.map((line, y) => line.map((cell, x) => {
    if (cell == '#') {
      return 0
    }
    if (units.some(unit => (unit.x == x) && (unit.y == y))) {
      return 0
    }
    // return 1
    // Weight graph by reading-order... (?)
    return (
      ((lines.length - y)) +
      ((lines[0].length - x) * y)
    )
  }))
  return new Graph(weights)
}









// const runMove2 = (lines, units, unit, targetAdjacentCells) => {
//   let graph = graphBuilder(lines, units)
//   // console.log('GRAPH')
//   // console.log(graph.grid)
//   let start = graph.grid[unit.y][unit.x]
//
//   let paths = targetAdjacentCells.map(cell => {
//     let end = graph.grid[cell.y][cell.x]
//     const result = astar.search(graph, start, end)
//     console.log(`   ${cell.y},${cell.x} path:`, result.length)
//     result.forEach(path => console.log('   ', path.y, path.x))
//     return result.map(n => ({x: n.y, y: n.x})) // Need to flip for some reason
//
//     // path.map(c => `[${c.y}, ${c.x}]`).join(' '))
//   })
//     .filter(path => path.length) // no path found
//     .sort((a,b) => {
//       if (a.length < b.length) {
//         return -1
//       }
//       else if (a.length > b.length) {
//         return 1
//       }
//       else {
//         // Tie break with reading-order sort of endpoints
//         return unitSort(a[a.length-1], b[b.length-1])
//       }
//     })
//
//   if (paths.length) {
//     // console.log('Paths', paths.map(p => p.length).join(' '))
//     console.log(paths[0])
//     // Now path-find again based on which first step (toward the
//     // already selected endpoint) has the shortest path.
//     // The A* above picks one best path, but this algo needs to
//     // know about the ties from the first move.  If there is
//     // another path with the same length, but the first step
//     // is before the chosen path (in reading order), then that
//     // other path should be chosen.
//
//     // adjacentCells. ...
//
//     console.log(`   MOVING from ${unit.y},${unit.x} => ${paths[0][0].y},${paths[0][0].x}`)
//     unit.x = paths[0][0].x
//     unit.y = paths[0][0].y
//   }
//
// }
