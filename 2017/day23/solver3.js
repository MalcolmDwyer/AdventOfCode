
// let regs = {
//   a:1, b:0, c:0, d:0, e:0, f:0, g:0, h:0
// };

let a = 1
let b = 108400
let c = b + 17000
let d = 0
let e = 0
let f = 0
let g = 0
let h = 0


do {
  f = 1
  d = 2
  do {
    e = 2
    do {
      g = d
      g *= e
      g -= b
      if (!g) {
        f = 0
      }
      e += 1
      g = e
      g -= b
    } while (g)
    d += 1
    g = d
    g -= b
  } while (g)
  if (!f) {
    h++;
    console.log('h', h, (new Date()))
  }
  g = b
  g -=  c
  b += 17
} while (g)

console.log('done h:', h, (new Date()))
