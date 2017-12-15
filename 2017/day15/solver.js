var Immutable = require('immutable');

let test = [65, 8921]
let puzzle = [516, 190]

const solver = (aStart, bStart) => {

  let a = aStart
  let b = bStart
  const aMul = 16807
  const bMul = 48271

  const mod = 2147483647
  let count = 0

  Immutable.Range(0, 5000000)
    .forEach((n, ix) => {
      let newA, newB

      // Part 1
      // newA = (a * aMul) % mod
      // newB = (b * bMul) % mod
      // a = newA
      // b = newB

      // Part 2
      do {
        newA = (a * aMul) % mod
        a = newA
      } while ((newA & 0x3) !== 0x0)

      do {
        newB = (b * bMul) % mod
        b = newB
      } while ((newB & 0x7) !== 0x00)

      if ((newA & 0x0ffff) == (newB & 0x0ffff)) {
        count++
      }
    })

  console.log('count', count)
}


solver(...test)
