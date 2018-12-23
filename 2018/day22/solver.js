import {FgRed, FgBlue, FgGreen, BgWhite, FgBlack, Reset} from '../../console'

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

  // const FgRed = "\x1b[31m"
  // const Reset = "\x1b[0m"

  const printMap = (type, path = [], my, mx) => {
    for(let y = 0; y <= my; y++) {
      let str = ''
      for (let x = 0; x <= mx; x++) {
        let p = path && path.find(n => n.y == y && n.x == x)
        if (p) {
          if (p.e == 0) {
            str += FgRed
          }
          else if (p.e == 1) {
            str += FgBlue
          }
          else if (p.e == 2) {
            str += FgGreen
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

  const otherWay = [   // from_equip : { to_type: ... }
    [ /* 0 - neither */
      /* 0 - rocky  */ 7,
      /* 1 - wet    */ 1,
      /* 2 - narrow */ 1
    ],
    [ /* 1 - climbing */
      /* 0 - rocky  */ 1,
      /* 1 - wet    */ 1,
      /* 2 - narrow */ 7
    ],
    [ /* 2 - torch  */
      /* 0 - rocky  */ 1,
      /* 1 - wet    */ 7,
      /* 2 - narrow */ 1
    ]
  ]

  // const costBuilder = (cost, y, x, dir) => ({
  //   t: cost, distance: null, parent: null, y, x, dir
  // })

  const costBuilder = ({t, y, x, d, e, distance = null}) => {
    // console.log('costBuilder', t, y, x, d, e)
    return {
      t, distance: null, parent: null, y, x, d, e
    }
  }


  // const depth = 8103
  // const target = {x: 9, y: 758}

  const depth = 510
  const target = {x: 10, y: 10}

  console.log('depth', depth)

  let geo = []
  let erosion = []
  let type = []

  let equippedNodes = []

  // BFS info for transitions instead of cells
  // let ups = []
  // let downs = []
  // let lefts = []
  // let rights = []

  // let edges = []

  let totalRisk = 0

  // let printMap = true
  let mapView = []

  for (let y = 0; y <= target.y + 50; y++) {
    // let str = ''
    geo[y] = []
    erosion[y] = []
    type[y] = []

    // if (!edges[y]) {ups[y] = []}
    // if (!lefts[y]) {lefts[y] = []}
    // if (!downs[y]) {downs[y] = []}
    // if (!rights[y]) {rights[y] = []}

    for (let x = 0; x <= target.x + 50; x++) {
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

      // if (!y) {
      //   edges.push(...[Infinity, Infinity, Infinity].map((t,e) => costBuilder({t, y, x, d:0, e})))
      // }
      // else {
      //   edges.push(...costs[type[y-1][x]].map((t, e) => costBuilder({t, y, x, d:0, e})))
      // }
      //
      // if (!x) {
      //   edges.push(...[Infinity, Infinity, Infinity].map((t, e) => costBuilder({t, y, x, d:1, e})))
      // }
      // else {
      //   edges.push(...costs[type[y][x-1]].map((t, e) => costBuilder({t, y, x, d:1, e})))
      // }
      // edges.push(...costs[type[y][x]].map((t, e) => costBuilder({t, y: y-1, x, d:2, e})))
      // edges.push(...costs[type[y][x]].map((t, e) => costBuilder({t, y, x: x-1, d:3, e})))

      // console.log(`${x},${y} g:${geo[y][x]}  e: ${erosion[y][x]}  ty[e = ${type[y][x]}]}`)
      // if (printMap) {str += type[y][x] ? (type[y][x] == 1 ? '=' : '|') : '.'}
    }
    // if (printMap) {mapView.push(str)}
  }

  // if (printMap) {
  //   mapView.forEach(line => console.log(line))
  // }

  equippedNodes.push(
    {
      x: 0,
      y: 0,
      e: 2, // torch
      t: 0,
      visited: false
    }
  )

  let start = equippedNodes[0]

  // edges = edges.map(edge => {
  //   if (edge.x == 0 && edge.y == 0) {
  //     edge.distance = 0
  //   }
  //   return edge
  // })

  // ups[0][0] = ups[0][0].map(s => {
  //   s.distance = 0;
  //   return s;
  // })
  // lefts[0][0] = lefts[0][0].map(s => {
  //   s.distance = 0;
  //   return s;
  // })
  // lefts[0][0] = lefts[0][0].map(s => ({...s, distance: 0}))

  // console.log(ups[0][0])

  // const allEdgesForDistance = (distance) => (
  //   edges.filter(s => s.distance == 0)
  // )

  // console.log(allEdgesForDistance(0))
  const dirs = [{dy: -1, dx: 0}, {dy: 0, dx: -1}, {dy: 0, dx: 1}, {dy: 1, dx: 0}]

  let t = 0
  let foundTarget = false
  let bestPath
  while(!foundTarget && t < 100) {
    console.log('-------------t', t)
    equippedNodes.filter(n => ((n.t == t) && !n.visited)).forEach(n => {
      if (foundTarget) {
        return
      }
      console.log(`${t} : ${n.y},${n.x}  with ${n.e}`)
      n.visited = true
      dirs.forEach(dir => {
        let ny = n.y + dir.dy
        let nx = n.x + dir.dx
        if (nx < 0) { return }
        if (ny < 0) { return }

        if (n.y == target.y && n.x == target.x) {
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
        console.log(`  ${n.y},${n.x} => ${ny}, ${nx} type: ${nextType}`)
        const nextEquipment = nodeEquipment[nextType]
        console.log('      nextEquipment', nextEquipment)

        nextEquipment.forEach(ne => {
          if (!equippedNodes.some(n => (n.x == nx) && (n.y == ny) && (n.e == ne))) {
            const nt = t + ((n.e == ne) ? 1 : 8)
            console.log(`          ==> t${nt} with e${ne}`)
            equippedNodes.push(    {
              x: nx,
              y: ny,
              e: ne,
              t: nt,
              visited: false,
              parent: n
            })
          }
        })
        // const nextCosts = costs[nextType]
        // console.log('nextCosts', nextCosts)
      })
    })
    t++
  }

  console.log('found at t:', t)

  bestPath.forEach((n, ix, list) => {
    if (ix && list[ix-1] && (n.e !== list[ix-1].e)) {
      console.log(`   switched tools from ${printEquip(list[ix-1].e)} to ${printEquip(n.e)}`)
    }
    console.log(`${n.y.toString().padStart(3, ' ')},${n.x.toString().padStart(3, ' ')} ${printType(type[n.y][n.x])} with ${printEquip(n.e)}(${n.e}) at ${n.t}`)
  })

  printMap(type, bestPath, 14, 14)
  // console.log(
  //   ups.filter(s => s.distance == 0).length,
  //   lefts.filter(s => s.distance == 0).length,
  //   downs.filter(s => s.distance == 0).length,
  //   rights.filter(s => s.distance == 0).length
  // )
  // console.log([
  //   ...ups.filter(s => s.distance == 0),
  //   ...lefts.filter(s => s.distance == 0),
  //   ...downs.filter(s => s.distance == 0),
  //   ...rights.filter(s => s.distance == 0)
  // ])
})()
