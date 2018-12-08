import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data).map(l => l.split(' '))
    )
  })
  .catch(err => {
    console.error(err)
  })

const getData = lines => lines.map((line, ix) => {
  return line.map(d => parseInt(d))
})

const solver = (lines) => {
  solver1(lines)
  solver2(lines)
}

const solver1 = lines => {
  let data = getData(lines)[0]
  let {sum, tree} = nodeMetadata(data)
  console.log('1 ***: ', sum)
}

const solver2 = lines => {
  let data = getData(lines)[0]
  let {sum, tree} = nodeMetadata2(data)

  console.log('2 ***: ', sum)
}

const nodeMetadata = tree => {
  let sum = 0
  let n = tree[0]
  let m = tree[1]

  for (let i = 0; i < n; i++) {
    let tSum
    ({tree, sum: tSum} = nodeMetadata(tree.slice(2)))
    sum += tSum
  }

  let mParts = tree.splice(2, m)
  for (let i = 0; i < m; i++) {
    sum += mParts[i]
  }
  return {tree, sum}
}




const nodeMetadata2 = tree => {
  let sum = 0
  let n = tree[0]
  let m = tree[1]

  let nParts = []

  for (let i = 0; i < n; i++) {
    let tSum
    ({tree, sum: tSum} = nodeMetadata2(tree.slice(2)))
    nParts.push(tSum)
  }

  let mParts = tree.splice(2, m)

  if (n) {
    for (let i = 0; i < m; i++) {
      let mI = mParts[i] - 1 // 1-index -> 0-index
      sum += (nParts[mI] || 0)
    }
  }
  else {
    for (let i = 0; i < m; i++) {
      sum += mParts[i]
    }
  }
  return {tree, sum}
}
