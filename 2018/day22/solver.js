import {BgRed, BgCyan, BgYellow, BgWhite, FgBlack, Reset} from '../../console'
import {astar, Graph} from '../../astar'
import {flattenDeep} from 'lodash'

/*
depth: 8103
target: 9,758
*/

// Tools
// rocky  : climbing or torch    3
// wet    : climbing or neither  1
// narrow : torch or neither     2

// equip:   neither:             0
//          climbing:            1
//          torch:               2


// cost:
// (from)(equipped) -> (to)
// r(0)(1) -> r(0) = 1   000100 001 //
// r(0)(2) -> r(0) = 1   001000 001 //
// r(0)(1) -> w(1) = 1   000101 001
// r(0)(2) -> w(1) = 7 * 001001 111
// r(0)(1) -> n(2) = 7 * 000110 111
// r(0)(2) -> n(2) = 1   001010 001

// w(1)(0) -> r(0) = 7 * 010000 111
// w(1)(1) -> r(0) = 1   010100 001
// w(1)(0) -> w(1) = 1   010001 001 //
// w(1)(1) -> w(1) = 1   010101 001 //
// w(1)(0) -> n(2) = 1   010010 001
// w(1)(1) -> n(2) = 7 * 010110 111

// n(2)(0) -> r(0) = 7 * 100000 111
// n(2)(2) -> r(1) = 1   101000 001
// n(2)(0) -> w(1) = 1   100001 001
// n(2)(2) -> w(1) = 7 * 101001 111
// n(2)(0) -> n(2) = 1   100010 001 //
// n(2)(2) -> n(2) = 1   101010 001 //
(() => {

  const nodeEquipment = [[1,2], [0, 1], [0, 2]]

  const otherEquipment = [[null, 2, 1], [1, 0, null], [2, null, 0]]

  const printMap = (type, path = [], my, mx) => {
    for(let y = 0; y <= my; y++) {
      let str = ''
      for (let x = 0; x <= mx; x++) {
        let p = path && path.find(n => n.y == y && n.x == x)
        if (p) {
          if (p.e == 0) {
            str += BgRed + FgBlack
          }
          else if (p.e == 1) {
            str += BgCyan + FgBlack
          }
          else if (p.e == 2) {
            str += BgYellow + FgBlack
          }
        }
        if (y == target.y && x == target.x) {
          // str += 'T'
          str += BgWhite
          str += FgBlack
        }
        str += type[y][x] ? (type[y][x] == 1 ? '=' : '|') : '.'
        str += Reset
      }
      console.log(str)
    }
  }

  const printEquip = e => {
    if (!e)     { return 'neither  '}
    if (e == 1) { return 'climbing '}
    if (e == 2) { return 'torch    '}
  }

  const printType = t => {
    if (!t)     { return 'rocky  '}
    if (t == 1) { return 'wet    '}
    if (t == 2) { return 'narrow '}
  }

  const treeFlat = (ys) => {
    let l = []
    Object.values(ys)
      .map(y => Object.values(y)
        .map(x => Object.values(x)
          .map(e => l.push(e)
        )
      )
    )
    return l
  }

  const costs = [
    // to_type: { from:equip }
    [ // to rocky
      /* 0 - neither  */ 7,
      /* 1 - climbing */ 1,
      /* 2 - torch    */ 1
    ],
    [ // to wet
      /* 0 - neither  */ 1,
      /* 1 - climbing */ 1,
      /* 2 - torch    */ 7
    ],
    [ // to narrow
      /* 0 - neither  */ 1,
      /* 1 - climbing */ 7,
      /* 2 - torch    */ 1
    ]
  ]

  const costBuilder = ({t, y, x, d, e, distance = null}) => {
    // console.log('costBuilder', t, y, x, d, e)
    return {
      t, distance: null, parent: null, y, x, d, e
    }
  }


  const depth = 8103
  const target = {x: 9, y: 758, e: 2}
  const maxX = 200
  const maxY = 850

  // const depth = 11739
  // const target = {x: 11, y: 718, e: 2}
  // const maxX = 100
  // const maxY = 800

  // const depth = 510
  // const target = {x: 10, y: 10, e: 2}
  // const maxX = 20
  // const maxY = 20

  console.log('depth', depth)

  let geo = []
  let erosion = []
  let type = []

  let equippedNodes = []

  let eqMapNodes = {} // [y][x][e]

  // let edges = []

  let totalRisk = 0

  // let printMap = true
  let mapView = []

  for (let y = 0; y <= maxY; y++) {
    // let str = ''
    geo[y] = []
    erosion[y] = []
    type[y] = []

    for (let x = 0; x <= maxX; x++) {
      if (x == target.x && y == target.y) {
        geo[y][x] = 0
      }
      else if (!y && !x) {
        geo[y][x] = 0
      }
      else if (!y) {
        geo[y][x] = (x * 16807)
      }
      else if (!x) {
        geo[y][x] = (y * 48271)
      }
      else {
        geo[y][x] = erosion[y][x-1] * erosion[y-1][x]
      }
      erosion[y][x] = (geo[y][x] + depth) % 20183
      type[y][x] = erosion[y][x] % 3
      totalRisk += type[y][x]

      // console.log(`${x},${y} g:${geo[y][x]}  e: ${erosion[y][x]}  ty[e = ${type[y][x]}]}`)
      // if (printMap) {str += type[y][x] ? (type[y][x] == 1 ? '=' : '|') : '.'}
    }
    // if (printMap) {mapView.push(str)}
  }

  // if (printMap) {
  //   mapView.forEach(line => console.log(line))
  // }

  // printMap(type, [], maxY, maxX)

  equippedNodes.push(
    {
      x: 0,
      y: 0,
      e: 2, // torch
      t: 0,
      visited: false
    }
  )

  eqMapNodes[0] = {}
  eqMapNodes[0][0] = {}
  eqMapNodes[0][0][2] = {
    x: 0,
    y: 0,
    e: 2, // torch
    t: 0,
    // visited: false
  }

  console.log('eqMapNodes', JSON.stringify(eqMapNodes))

  // console.log('treeflat', treeFlat({'0': {'4': {'0': {a: '040'}, '1': {a: '041'}}}, '1': {'8': {'1': {a:'181'}}}}))
  console.log('eqMapNodes', treeFlat(eqMapNodes))

  // let start = equippedNodes[0]
  let start = eqMapNodes[0][0][2]

  const dirs = [{dy: -1, dx: 0}, {dy: 0, dx: -1}, {dy: 0, dx: 1}, {dy: 1, dx: 0}]

  let t = 0


  let bestPath = []

  let foundTarget = false

  while(!foundTarget && t < 1050) {
    if (!(t%100)) {
      console.log(`${t}t --------- ${treeFlat(eqMapNodes).filter(n => n && (n.t == t)).length}/${treeFlat(eqMapNodes).filter(n => n).length}`)
    }

    treeFlat(eqMapNodes).filter(n => n && ((n.t == t))).forEach(n => {
      // console.log('eqMapNode', n)
      // if (foundTarget) {
      //   return
      // }
      if ((n.x == target.x) && (n.y == target.y) && (n.e == target.e)) {
        console.log('******************************************************************', t)
        foundTarget = true
        bestPath = [n]
        let p = n.parent
        while (p !== start) {
          bestPath.unshift(p)
          p = p.parent
        }
        bestPath.unshift(p)
        // return
      }
      // if (foundTarget) {
      //   return
      // }
      // console.log(`${t} : ${n.y},${n.x}  with ${n.e}`)
      n.v = 'V'

      let nt = type[n.y][n.x]
      // console.log('otherEquipment', otherEquipment[type[n.y][n.x]][n.e])
      let neighbors = [
        [n.y, n.x, otherEquipment[nt][n.e]]
      ]
      dirs.forEach(dir => {
        let ny = n.y + dir.dy
        let nx = n.x + dir.dx
        if (nx < 0) { return }
        if (ny < 0) { return }
        neighbors.push([ny, nx, n.e])
      })
      // console.log('neighbors', neighbors)
      // console.log('all  ')
      // eqMapNodes.forEach(nny => console.log(nny) )

      neighbors.forEach(([y, x, e]) => {
        if (!eqMapNodes[y]) {
          eqMapNodes[y] = {}
        }
        if (!eqMapNodes[y][x]) {
          eqMapNodes[y][x] = {}
        }
        if (!eqMapNodes[y][x][e]) {
          let nt = type[y][x]
          if ((typeof nt !== 'undefined') && nodeEquipment[nt].includes(e)) {
            eqMapNodes[y][x][e] = {
              x, y, e,
              t: (e !== n.e) ? t + 7 : t + 1,
              parent: n
            }
          }
        }
        // else {
        //   console.log(`Already visited ${y}, ${x}, ${e}`)
        // }
      })
      // console.log('after')
      // eqMapNodes.forEach(nny => console.log(nny) )
      // console.log('neighbors', neighbors)
      // foundTarget = true


    })

    /*
    equippedNodes.filter(n => ((n.t == t) && !n.visited)).forEach(n => {
      if (foundTarget) {
        return
      }
      // console.log(`${t} : ${n.y},${n.x}  with ${n.e}`)
      n.visited = true



      dirs.forEach(dir => {
        let ny console.log('******************************************************************', t)= n.y + dir.dy
        let nx = n.x + dir.dx
        if (nx < 0) { return }
        if (ny < 0) { return }

        if (n.y == target.y && n.x == target.x && n.e == 2 && !foundTarget) {
          foundTarget = t
          console.log('******************************************************************')

          bestPath = [n]
          let p = n.parent
          while (p !== start) {
            bestPath.unshift(p)
            p = p.parent
          }
          bestPath.unshift(p)
          return
        }

        const nextType = type[n.y + dir.dy][n.x + dir.dx]
        // console.log(`  ${n.y},${n.x} => ${ny}, ${nx} type: ${nextType}`)
        const nextEquipment = nodeEquipment[nextType]
        if (!nextEquipment) {
          return
        }

        const thisAvailableEquipment = nodeEquipment[type[n.y][n.x]]
        // console.log('thisAvailableEquipment:', thisAvailableEquipment, 'next...', nextEquipment, ' => ', nextEquipment.filter(ne => thisAvailableEquipment.includes(ne)))




        nextEquipment.filter(ne => thisAvailableEquipment.includes(ne)).forEach(ne => {
          if (!equippedNodes.find(n2 => (n2.x == nx) && (n2.y == ny) && (n2.e == ne))) {
            const nt = t + ((n.e == ne) ? 1 : 8)
            // console.log(`          ==> t${nt} with e${ne}`)
            equippedNodes.push(    {
              x: nx,
              y: ny,
              e: ne,
              t: nt,
              visited: false,
              parent: n
            })
          }
          // else {
          //   console.log(`already visited ${ny}, ${nx} with ${printEquip(ne)}`)
          // }
        })
        // const nextCosts = costs[nextType]
        // console.log('nextCosts', nextCosts)
      })
    })
    */

    if (foundTarget) {
      break
    }



    t++
  }

// part 2:
// < 1062
// < 1046
// < 1045


  // console.log('found at t:', t)
  //
  // // > 1078
  //

  bestPath.forEach((n, ix, list) => {
    if (ix && list[ix-1] && (n.e !== list[ix-1].e)) {
      console.log(`   switched tools from ${printEquip(list[ix-1].e)} to ${printEquip(n.e)}`)
    }
    console.log(`${n.y.toString().padStart(3, ' ')},${n.x.toString().padStart(3, ' ')} ${printType(type[n.y][n.x])} with ${printEquip(n.e)}(${n.e}) at ${n.t}`)
  })

  printMap(type, bestPath, maxY, maxX)

  if (eqMapNodes[target.y] && eqMapNodes[target.y][target.x]) {
    console.log(`Found target at ${t}`)
  }
  else {
    console.log('NO PATH at ', t)
  }
})()
