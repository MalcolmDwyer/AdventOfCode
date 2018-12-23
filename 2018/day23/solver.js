import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data)// .map(l => l.split(''))
    )
  })
  .catch(err => {
    console.error(err)
  })

// pos=<117362168,28278199,43734987>, r=92552617
const rx = /^pos=\<([-\d]*),([-\d]*),([-\d]*)\>, r=([\d]*)$/
const getData = lines => {
  return lines.map(line => {

    const parts = rx.exec(line)
    // console.log('l', parts)
    return parts.slice(1, 5).map(d => parseInt(d))
  })
}


const solver = (lines) => {
  solver1(getData(lines))
}

const manDist = (a, b = [0, 0, 0]) => {
  return (
    Math.abs(a[0] - b[0]) +
    Math.abs(a[1] - b[1]) +
    Math.abs(a[2] - b[2])
  )
}

const half = (a, b) => Math.floor((a+b)/2)

const solver1 = (lines) => {
  console.log('s1')
  // console.log(lines.slice(5))

  let maxR = -Infinity
  let maxIx = null

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity

  lines.forEach((line, ix) => {
    if (line[3] > maxR) {
      maxR = line[3]
      maxIx = ix
    }

    if (line[0] < minX) { minX = line[0] }
    if (line[0] > maxX) { maxX = line[0] }
    if (line[1] < minY) { minY = line[1] }
    if (line[1] > maxY) { maxY = line[1] }
    if (line[2] < minZ) { minZ = line[2] }
    if (line[2] > maxZ) { maxZ = line[2] }
  })

  // console.log('max', maxR)

  console.log(`minX: ${minX}, maxX: ${maxX}, minY: ${minY}, maxY: ${maxY}, minZ: ${minZ}, maxZ: ${maxZ}`)

  // let botCount = 0

  // let max = lines[maxIx]

  // console.log('s1 count:', countNodesInRange(lines, lines[maxIx]))

  let bestNodes = [{n:[half(minX, maxX), half(minY, maxY), half(minZ, maxZ)], c: 0}]
  console.log('Starting at ', bestNodes[0])

  let bestNodeCount = -Infinity;

  const fibs = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296, 433494437]

  fibs.reverse().forEach(step => {
    console.log('STEP', step, '-----------------------------------------------')
    let nodeList = [...bestNodes]
    bestNodes.forEach((n, ix) => {
      for (let count = 0; count < 2000; count++) {
        let x = n.n[0] + Math.floor((2 * Math.random() - 1) * step)
        let y = n.n[1] + Math.floor((2 * Math.random() - 1) * step)
        let z = n.n[2] + Math.floor((2 * Math.random() - 1) * step)
        let c = countNodesInRange(lines, [x, y, z])
        // console.log(`      (${x}, ${y}, ${z}) ${c}`)
        nodeList.push({n:[x, y, z], c})
      }
    })

    // console.log(step, 'nodes')
    // console.log(nodeList.filter(n => n.c).map(n => `${n.c}, [${n.n.join(', ')}]`))

    bestNodes = nodeList.sort((a,b) => {
      if (a.c > b.c) {
        return -1
      }
      else if (a.c < b.c) {
        return 1
      }
      else {
        if (manDist(a.c) < manDist(b.c)) {
          return -1
        }
        else {
          return 1
        }
      }
    }).slice(0, 40)
    console.log('best', bestNodes.slice(0, 5).map(n => n.c).join(', '), ' ... ', bestNodes.slice(-1).map(n => n.c)[0], manDist(bestNodes[0].n))
  })

  // sort by distance to 0,0,0
  let sortedBestNodes = bestNodes.sort((a,b) => {
    let da = manDist(a.n)
    let db = manDist(b.n)
      //       Math.abs(line[1] - max[1]) +
      //       Math.abs(line[2] - max[2])
    if (da < db) {
      return -1
    }
    else {
      return 1
    }
  })

  sortedBestNodes.forEach((node, ix) => {
    console.log(`${ix} ${node.c} [${node.n.join(', ')}] ${manDist(node.n)}`)
  })

  let bestNode = sortedBestNodes[0]

  console.log('bestNode: ', bestNode)
  console.log(manDist(bestNode.n))

  // console.log('bestNode', bestNodeCount, bestNode)
  // console.log('d:', Math.abs(bestNode[0]) + Math.abs(bestNode[1]) + Math.abs(bestNode[2]))


  // > bestNode 902 [ 57879880, 47878800, 53994800 ] => 159753480
  // > bestNode:  { n: [ 57178057, 48770858, 53271947 ], c: 912 } => 159220862
  // bestNode:  { n: [ 56884088, 48771481, 53566539 ], c: 912 } =>159222108

  // ! 930, 160646352


  // >>>>>> 942 : 160646364

  // lines.forEach((line, ix) => {
  //   if (
  //     (
  //       Math.abs(line[0] - max[0]) +
  //       Math.abs(line[1] - max[1]) +
  //       Math.abs(line[2] - max[2])
  //     ) <= max[3]
  //   ) {
  //     botCount++
  //   }
  // })

  // console.log('s1 count:', botCount)
}

const countNodesInRange = (nodes, target) => {
  return nodes.reduce((acc, node) => acc + (nodeIsInRange(node, target) ? 1 : 0), 0 )
}

const nodeIsInRange = (node, target) => {
  let x = Math.abs(node[0] - target[0])
  if (x > node[3]) {
    return false
  }
  let y = Math.abs(node[1] - target[1])
  if ((y > node[3]) || ((x + y) > node[3])) {
    return false
  }
  let z = Math.abs(node[2] - target[2])
  if ((x + y + z) > node[3]) {
    return false
  }
  return true
  // return (
  //     Math.abs(line[0] - target[0]) +
  //     Math.abs(line[1] - target[1]) +
  //     Math.abs(line[2] - target[2])
  //   ) <= target[3]
  // )
}
