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
  // solver1(lines)
  solver2(lines) // part2
}

const solver2 = (lines) => {
  let elfAttack = 3
  let result = true

  while (result && (elfAttack < 60)) {
    elfAttack++
    console.log('#################################################### ELF ATTACK:', elfAttack)
    const linesOrig = [...lines.map(line => [...line])]
    result = solver1(linesOrig, elfAttack, true)
  }
  console.log('elfAttack', elfAttack)
}

// 37272

const unitTypes = ['E', 'G']
// const adjacentCells = [[-1, 0], [0, -1], [0, 1], [1, 0]]
const adjacentCells = [{y: -1, x: 0}, {y: 0, x: -1}, {y: 0, x: 1}, {y: 1, x: 0}]

const solver1 = (lines, elfAttack = 3, breakOnElfDeath = false) => {
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
          attack: (c == 'G') ? 3 : elfAttack
        })
        unitIndex++
        // Fill in the map underneath the unit:
        lines[y][x] = '.'
      }
    }
  }
  console.log(units)

  // > 177510
  // > 185409
  // > 188352
  // 348744

  // lines.forEach(line => {
  //   console.log(line.join(''))
  // })

  printMap(lines, units)

  let t = 0
  let done = false
  // while(!done) {
  while (!done && t < 171) {
    t++
    console.log(`************************************  ${t}`)
    // units.forEach(unit => {
    //   console.log(unit)
    // })
    done = runTurn(lines, units, t)

    if (breakOnElfDeath && units.filter(unit => unit.type == 'E' && !unit.hp).length) {
      done = true
      console.log('Elf has died')
      return true
    }
    else {
      printMap(lines, units)
    }
  }
  return false
  // units.forEach(unit => {
  //   console.log(unit)
  // })
}

const printMap = (lines, units) => {
  lines.forEach((line, y) => {
    let str = ''
    let append = '  '
    line.forEach((cell, x) => {
      let unit = units.filter(unit => unit.hp).find(unit => (unit.x == x) && (unit.y == y))
      if (unit) {
        str += unit.type
        append += `${unit.type}[${unit.id}](${unit.hp}), `
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

    let hasTarget = runUnit(lines, units, unit, t)
    done |= !hasTarget
    if (!hasTarget) {
      console.log(`FINISHED during ${t} with ${u}`)
      let remainingHP = units.reduce((acc, unit) => acc + unit.hp, 0)
      console.log('remainingHP', remainingHP)

      const s1 = (t-1)*remainingHP
      console.log(`${t-1} * ${remainingHP} => ${s1}`)
      break
    }
  }
  return done
}

const runUnit = (lines, units, unit, t) => {
  console.log(`----------------Unit[${unit.id}] ${unit.type}:${unit.y},${unit.x}`)

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


  if (!adjacentTargets.length) {
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
    runMove2(lines, units, unit, targetAdjacentCells, t)
  }

  adjacentTargets = targets.filter(unit2 =>
    [[-1, 0], [0, -1], [0, 1], [1, 0]].some(adj =>
      (unit2.y == (unit.y + adj[0])) &&
      (unit2.x == (unit.x + adj[1]))
    )
  )

  const lowestHP = Math.min(...adjacentTargets.map(unit => unit.hp)) || -1

  adjacentTargets = adjacentTargets
    .filter(unit => unit.hp == lowestHP) // attack weakest
    .sort((a,b) => a.hp > b.hp).sort(unitSort) // tie break reading order

  if (adjacentTargets.length) {
    // console.log('AdjacentTargets', adjacentTargets)
    runCombat(lines, units, unit, adjacentTargets[0])
    return true
  }

  return true
}

const runCombat = (lines, units, unit, target) => {
  console.log(`Unit[${unit.id}] ${unit.type}:${unit.y},${unit.x}   ATTACK => ${target.type}[${target.id}] ${target.y},${target.x}`)
  target.hp = Math.max(0, (target.hp - unit.attack))

  if (!target.hp) {
    console.log(`                 --> KILLED [${target.id}] ${target.type}:${target.y},${target.x}`)
  }
}


const runMove = (lines, units, unit, targetAdjacentCells) => {
  let graph = new Graph(graphBuilder(lines, units))
  // console.log('GRAPH')
  // console.log(graph.grid)
  let start = graph.grid[unit.y][unit.x]

  let paths = targetAdjacentCells.map(cell => {
    let end = graph.grid[cell.y][cell.x]
    const result = astar.search(graph, start, end)
    // console.log(`   ${cell.x},${cell.y} path:`, result.length)
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
    if (units.filter(unit => unit.hp).some(unit => (unit.x == x) && (unit.y == y))) {
      return 0
    }
    return 1
    // Weight graph by reading-order... (?)
    let yScore = lines.length - y + 1
    let xScore = lines[0].length - x + 1
    let width = lines[0].length
    return (
      (yScore * width) + xScore
      // ((lines.length - y)) +
      // (xScore * y)
    )
  }))
  return weights
}

const printGraph = (graph, units, key) => graph.forEach((line, y) => {
  let str = ''
  let append = '  '
  line.forEach((cell, x) => {
    let unit = units.filter(unit => unit.hp).find(unit => (unit.x == x) && (unit.y == y))
    if (unit) {
      str += unit.type.padStart(3,' ')
      // append += `${unit.type}[${unit.id}](${unit.hp}), `
    }
    else {
      if (!cell.weight) {
        str += '  #'
      }
      else if ((cell[key] == null)) {
        str += '  .'
      }
      else {
        str += String(cell[key]).padStart(3,' ')
      }
    }
  })
  console.log(str, append)
})

const runMove2 = (lines, units, unit, targetAdjacentCells, t) => {
  // let visited =
  // console.log('GRAPH')
  // console.log(graph.grid)
  // let start = graph.grid[unit.y][unit.x]

  let map = graphBuilder(lines, units)

  let bestDistance = Infinity
  let bestPath = null
  let bestTarget = null

  for (let target of targetAdjacentCells) {
    //DETAIL_COMMENT console.log('targetAdjacentCell:', target.y, target.x)
    let graph = map.map((line, y) => line.map((cell, x) => ({
      weight: cell,
      visited: 0,
      distance: null,
      y, x
    })))
    let start = graph[unit.y][unit.x]
    // console.log('start', start)

    graph[unit.y][unit.x].distance = 0
    graph[unit.y][unit.x].visited = 1

    // console.log(graph)
    //DETAIL_COMMENT console.log('visited:')
    //DETAIL_COMMENT printGraph(graph, units, 'visited')
    //DETAIL_COMMENT console.log('distance')
    //DETAIL_COMMENT printGraph(graph, units, 'distance')
    //DETAIL_COMMENT console.log('weight')
    //DETAIL_COMMENT printGraph(graph, units, 'weight')
    // return

    let distance = 0
    let noPath = false

    let visitedAnything
    while(
      !noPath &&
      (distance < bestDistance) &&
      // (distance < 200) && // just in case... probably should remove
      graph.some(line => line.some(cell => !cell.visited && cell.weight))
    ) {
      let visited = []
      graph.forEach(line => line.forEach(cell => {
        if (cell.visited && cell.distance == distance) {
          visited.push(cell)
        }
      }))
      distance++
      // if (distance > bestDistance) {
      //   break
      // }
      //DETAIL_COMMENT console.log('=== finding distance', distance, '(best)', bestDistance)
      visitedAnything = false
      visited.forEach(cell => {
        //DETAIL_COMMENT console.log(`visited cell ${cell.y},${cell.x} ==>`)
        for (let a of adjacentCells) {
          let y = cell.y + a.y
          let x = cell.x + a.x

          //DETAIL_COMMENT console.log(`  adj cell ${y},${x} w${graph[y][x].weight} v${graph[y][x].visited}`)

          if (graph[y][x].weight && !graph[y][x].visited) {
            graph[y][x].distance = distance
            graph[y][x].visited = 1
            graph[y][x].parent = cell
            visitedAnything = true
            //DETAIL_COMMENT console.log('      --> visited')
          }

          if (target.y == y && target.x == x) {
            //DETAIL_COMMENT console.log(`FOUND hit at ${y},${x} from ${cell.y},${cell.x}`)
            if (distance < bestDistance) {
              //DETAIL_COMMENT console.log('new best', distance)
              bestDistance = distance
              bestTarget = target
              bestPath = [graph[y][x]]
              let parent = bestPath[0].parent
              while(parent !== start) {
                bestPath.unshift(parent)
                parent = bestPath[0].parent
              }
            }
          }
        }
      })
      if (!visitedAnything) {
        //DETAIL_COMMENT console.log('!!!!')
        noPath = true
        break
      }

      // console.log('visited:')
      // printGraph(graph, units, 'visited')
      //DETAIL_COMMENT console.log('distance')
      //DETAIL_COMMENT printGraph(graph, units, 'distance')
    }
  }

  if (bestPath) {
    //DETAIL_COMMENT console.log('bestDistance', bestDistance)
    //DETAIL_COMMENT console.log('bestPath')
    //DETAIL_COMMENT console.log(bestPath.map(p => `${p.y},${p.x}`).join(' => '))
    //DETAIL_COMMENT console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')

    unit.x = bestPath[0].x
    unit.y = bestPath[0].y
  }
  //DETAIL_COMMENT else {
    //DETAIL_COMMENT console.log('no path')
  //DETAIL_COMMENT }
}
