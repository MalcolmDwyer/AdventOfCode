import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data)
        .map(l => l.split(' must be finished before step '))
        .map(v => [v[0].slice(-1), v[1][0]])
    )
    // solver(data)
  })
  .catch(err => {
    console.error(err)
  })

let solver = (lines) => {
  // solver1(lines)
  solver2(lines)
}

const getData = lines => lines.map((line, ix) => {

  return line
})

const abc = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ']
// const base = 60
const base = 0
const abcT = letter => abc.indexOf(letter) + base + 1

const solver1 = lines => {
  let data = getData(lines)
  console.log(data)

  let allSteps = new Set([...data.map(d => d[0]), ...data.map(d => d[1])])
  let doneSteps = []

  let iter = 10000
  while (allSteps.size) {
    // console.log('------')
    let readySteps = Array.from(allSteps).filter(step => {
      if (!data.some(d => d[1] === step)) {
        return true
      }
      if (data.filter(d => d[1] === step).every(d => doneSteps.includes(d[0]))) {
        return true
      }
      return false
    })
    console.log('   readySteps', readySteps)
    const done = Array.from(readySteps).sort()[0]

    doneSteps.push(done)
    allSteps.delete(done)
    console.log('   remaining ', allSteps)
    console.log('   :: done', doneSteps)
    iter--
  }

  console.log('1 ***: ', doneSteps.join(''))
}

const solver2 = lines => {
  let data = getData(lines)
  console.log(data)
  let time = 0

  let allSteps = new Set([...data.map(d => d[0]), ...data.map(d => d[1])])
  let doneSteps = []

  let iter = 10000
  while (allSteps.size) {
    // console.log('------')
    let readySteps = Array.from(allSteps).filter(step => {
      if (!data.some(d => d[1] === step)) {
        return true
      }
      if (data.filter(d => d[1] === step).every(d => doneSteps.includes(d[0]))) {
        return true
      }
      return false
    })
    console.log('   readySteps', readySteps)
    const done = Array.from(readySteps).sort()[0]

    doneSteps.push(done)
    allSteps.delete(done)
    console.log('   remaining ', allSteps)
    console.log('   :: done', doneSteps)
    iter--
  }




  console.log('2 ***: ', time)
}
