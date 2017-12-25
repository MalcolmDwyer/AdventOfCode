
// let regs = {
//   a:1, b:0, c:0, d:0, e:0, f:0, g:0, h:0
// };

let a = 1
let b = 0
let c = 0
let d = 0
let e = 0
let f = 0
let g = 0
let h = 0

// set b 84
b = 84
// set c b
c = b
// jnz a 2
// jnz 1 5
// mul b 100
b = 8400
// sub b -100000
b = 108400
// set c b
c = b
// sub c -17000
c += 17000

do {
  // set f 1
  f = 1
  // set d 2
  d = 2

  do {
    // set e 2
    e = 2

    do {
      // set g d
      g = d
      // mul g e
      g *= e
      // sub g b
      g -= b
      // jnz g 2
      if (!g) {
        // set f 0
        f = 0
      }
      // sub e -1
      e += 1
      // set g e
      g = e
      // sub g b
      g -= b
      // jnz g -8
    } while (g)
    // console.log('x', x)
    // sub d -1
    d += 1
    // set g d
    g = d
    // sub g b
    g -= b
  // jnz g -13
  } while (g)
  // jnz f 2
  if (!f) {
    // sub h -1
    h++;
    console.log('h', h, (new Date()))
  }
  // set g b
  g = b
  // sub g c
  g -=  c
  // jnz g 2

  b += 17
} while (g)

console.log('done h:', h, (new Date()))
// jnz 1 3
// sub b -17
// jnz 1 -23
