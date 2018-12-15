import path from 'path'
import {readFile, getLines} from '../../common'

let input = 598701

const solver = () => {
  solver1()
  solver2()
}





const solver1 = () => {
  let array = [3, 7]
  let e1 = 0
  let e2 = 1

  while (array.length < input + 10) {
    let num = array[e1] + array[e2]
    let numS = String(num)

    if (num >= 10) {
      array.push(parseInt(numS[0]))
      array.push(parseInt(numS[1]))
    }
    else {
      array.push(parseInt(numS[0]))
    }

    e1 = (e1 + 1 + array[e1]) % array.length
    e2 = (e2 + 1 + array[e2]) % array.length
  }

  console.log('s1', array.slice(input, input + 10).join(''))
}

const solver2 = () => {
  let array = [3, 7]
  let e1 = 0
  let e2 = 1

  let i = String(input).split('')

  let sol
  while (true) {
    let num = array[e1] + array[e2]
    let numS = String(num)

    if (num >= 10) {
      array.push(parseInt(numS[0]))
      array.push(parseInt(numS[1]))

      if (
        (array[array.length - 2] == i[5]) &&
        (array[array.length - 3] == i[4]) &&
        (array[array.length - 4] == i[3]) &&
        (array[array.length - 5] == i[2]) &&
        (array[array.length - 6] == i[1]) &&
        (array[array.length - 7] == i[0])
      ) {
        sol = array.length - 7
        break
      }
    }
    else {
      array.push(parseInt(numS[0]))
    }

    e1 = (e1 + 1 + array[e1]) % array.length
    e2 = (e2 + 1 + array[e2]) % array.length

    if (
      (array[array.length - 1] == i[5]) &&
      (array[array.length - 2] == i[4]) &&
      (array[array.length - 3] == i[3]) &&
      (array[array.length - 4] == i[2]) &&
      (array[array.length - 5] == i[1]) &&
      (array[array.length - 6] == i[0])
    ) {
      sol = array.length - 6
      break
    }
  }
  console.log('s2', sol)
}

solver()
