import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data).map(l => l.split(','))
    )
  })
  .catch(err => {
    console.error(err)
  })

const getData = lines => lines.map(line => line.map(d => parseInt(d)))

const solver = lines => {
  solver1(getData(lines))
}

const checkPoints = (p1, p2, threshold = 3) => {
  return (
    (
      Math.abs(p2[0] - p1[0]) +
      Math.abs(p2[1] - p1[1]) +
      Math.abs(p2[2] - p1[2]) +
      Math.abs(p2[3] - p1[3])
    ) <= threshold
  )
}

const solver1 = lines => {

  let constellations = []

  lines.forEach(line => {
    let matches = constellations.filter(constellation => (
      constellation.some(point => checkPoints(line, point))
    ))

    if (matches.length > 1) {
      matches.slice(1).forEach(constellation => {
        constellation.forEach(point => matches[0].push(point))
      })
      matches[0].push(line)
      constellations = constellations.filter(constellation => !matches.slice(1).includes(constellation))
    }
    else if (matches.length == 1) {
      matches[0].push(line)
    }
    else {
      constellations.push([line])
    }
  })

  console.log('s1', constellations.length)
}
