import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data)// .map(l => l.split(' '))
    )
  })
  .catch(err => {
    console.error(err)
  })

const getData = lines => lines.map((line, ix) => {
  let rules = line.split('').slice(0, 5).reduce((obj, d, ix2) => {
    obj[ix2 - 2] = (d == '#' ? true : false)
    return obj
  }, {})
  rules.out = line.split('').slice(-1)[0]
  return rules
})

const solver = (lines) => {
  solver1(lines)
  solver2(lines)
}

const solver1 = lines => {
  // console.log('s1', lines)
  let rules = getData(lines.slice(1))
  let total
  let lastTotal = 0
  let init = lines[0].slice(15).split('')
  // console.log('init', init)
  let data = init.reduce((obj, d, ix2) => {
    obj[ix2] = (d == '#' ? true : false)
    return obj
  }, {})
  // console.log('1 ***: ', data)
  // console.log(rules[0])

  console.log('T', 0, printData(data))

  // data = Object.assign({}, next)
  let ruleKeys = [-2, -1, 0, 1, 2]

  let t
  for (t = 1; t <= 1000; t++) {
    const next = {}
    // console.log('T', t, printData(data))
    // console.log(data)
    let dataKeys = Object.keys(data).filter(key => key !== 'out')
    let minX = Math.min(...dataKeys.map(key => parseInt(key)))
    let maxX = Math.max(...dataKeys.map(key => parseInt(key)))
    for (let x = minX - 2; x <= maxX + 2; x++) {
      // console.log('key', key)
      let c = data[x] || false
      let ci = x
      // console.log(` ci ${ci}     c ${c ? '#' : '.'}`)

      let alreadyMatched = false
      rules.forEach(rule => {
        let ruleMatch = ruleKeys.every(ruleKey => {
          let dataPart = data[x + ruleKey] || false
          return dataPart == rule[ruleKey]
        })
        if (ruleMatch) {
          // if (alreadyMatched) {
          //   console.log('*********** dupe match!!!!')
          //   console.log('ruleMatch', printData(rule), 'at', x, ' => ', rule.out)

          next[x] = rule.out == '#' ? true : false
          alreadyMatched = true
        }
      })
    }
    data = Object.assign({}, next)


    total = 0
    Object.keys(data).map(key => {
      if (key && data[key]) {
        // console.log(`${total} += ${parseInt(key)}   .... ${total + parseInt(key)}  << ${data[key]}`)
        total += parseInt(key)
      }
    })
    // console.log('1 ***: ', total)


    // console.log('T', t, total/*, printData(data)*/)
    console.log(`T ${t}: ${total} <= ${lastTotal} (${total - lastTotal})`)
    lastTotal = total
  }

  const s2 = 50000000001
  console.log('50B', (s2 - t) * (62) + total)

  // let total = 0
  // Object.keys(data).map(key => {
  //   if (key && data[key]) {
  //     // console.log(`${total} += ${parseInt(key)}   .... ${total + parseInt(key)}  << ${data[key]}`)
  //     total += parseInt(key)
  //   }
  // })
  // console.log('1 ***: ', total)
}

// < 8910

// > 3100000000231

const printData = data => {
  let dataKeys = Object.keys(data).filter(key => key !== 'out')
  let minX = Math.min(...dataKeys.map(key => parseInt(key)))
  let maxX = Math.max(...dataKeys.map(key => parseInt(key)))
  if (Object.keys(data).length > 50) {
    minX = -20
    maxX = 150
  }
  let str = ''
  for (let x = minX; x <= maxX; x++) {
    if (data[x]) {
      str += '#'
    }
    else {
      str += '.'
    }
  }
  return str + `   ${minX}-${maxX}`
}

const solver2 = lines => {

}


// 3,100,000,000,293
