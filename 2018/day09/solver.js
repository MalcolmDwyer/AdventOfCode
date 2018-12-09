import {List} from 'immutable'


const ringMod = (a, b, l) => {
  let m = ((a + b) % l)
  if (m < 0) {
    return l + m
  }
  else {
    return m
  }
}

const solver1 = (players, lastMarble) => {
  // Array method was replaced by solver2 below
  // This was good enough for part 1 but too slow
  // for part 2

  let array = [0]
  let pc = 0

  let player = 0

  let playerTotals = new Array(players)
  playerTotals.fill(0)

  for (let i = 1; i <= lastMarble; i++) {
    if (!(i % 23)) {
      playerTotals[player] += i
      let rm = ringMod(pc, -7, array.length)

      let spl = parseInt(array.splice(rm, 1))
      playerTotals[player] += spl
      pc = rm
    }
    else {
      pc = (pc + 1) % array.length
      array.splice(pc + 1, 0, i)
      pc++
    }

    player = (player + 1) % players

    // console.log(
    //   `[${i}]_${pc}_`,
    //   array.map((v, i) => {
    //     if (i == pc) {
    //       return '(' + v + ')'
    //     }
    //     return v
    //   }).join(' ')
    // )
  }

  let max = 0
  let maxIndex = 0

  playerTotals.forEach((v, i) => {
    if (v > max) {
      max = v
      maxIndex = i
    }
  })


  console.log('1 ***: ', max)
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

class N {
  // Ring node
  constructor(v, l, r) {
    this.v = v
    this.l = l
    this.r = r
  }
}

const solver2 = (players, lastMarble) => {
  let n = new N(0, null, null)
  n.l = n
  n.r = n
  let pc = n
  let top = 0
  let player = 0

  let playerTotals = new Array(players)
  playerTotals.fill(0)

  for (let i = 1; i <= lastMarble; i++) {
    if (!(i % 23)) {
      playerTotals[player] += i
      // Move left 7
      for (let x = 0; x < 7; x++) {
        n = n.l
      }
      // Player gets that marble value
      playerTotals[player] += n.v

      // detach marble from ring
      let nl = n.l
      let nr = n.r
      nl.r = nr
      nr.l = nl

      // set new pointer
      n = nr
    }
    else {
      // Move right by 1
      let nl = n.r
      let nr = nl.r

      // Insert new node there
      let newNode = new N(i, nl, nr)
      nl.r = newNode
      n = newNode
      nr.l = newNode
    }

    player = (player + 1) % players
  }

  let max = 0

  playerTotals.forEach(v => {
    if (v > max) {
      max = v
    }
  })
  console.log('2 ***: ', max)
}


const solver = () => {

  let input

  // input = [9, 25] => 32
  // input = [9, 50] => 63
  // input = [10, 1618] => 8317
  // input = [13, 7999]
  // input = [17, 1104]
  // input = [21, 6111]
  // input = [30, 5807]
  input = [439, 71307]

  solver2(...input)

  input = [439, 7130700]
  solver2(...input)

  solver2(9, 50)
}


solver()
