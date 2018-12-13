import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data).map(l => l.split(''))
    )
  })
  .catch(err => {
    console.error(err)
  })

const solver = (lines) => {
  // solver1(lines)
  solver1(lines, true) // part2
}

const cartDirs = ['^', '>', 'v', '<']
const cX = [0, 1, 0, -1]
const cY = [-1, 0, 1, 0]
const cT = ['|', '-', '|', '-']
// direction to go next if hitting each slash (from each cartDir)
const cSlash = [1, 0, 3, 2] // '>', '^', '<', 'v'
const cBackslash = [3, 2, 1, 0] // '<', 'v', '>', '^'

const nextTurn = turn => (turn + 1) % 3 //  ['l', 's', 'r']

const lTurns = [3, 0, 1, 2]
const rTurns = [1, 2, 3, 0]

const cartSort = (a, b) => {
  if (a.y < b.y) { return -1 }
  else if (a.y > b.y) { return 1}
  else if (a.x < b.x) { return -1}
  else { return 1}
}

const solver1 = (lines, part2 = false) => {
  let cartIndex = 0
  let carts = []
  // Find all the carts
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let c = lines[y][x]
      let cD = cartDirs.indexOf(c)
      if (cD >= 0) {
        carts.push({
          x, y,
          dir: cD,
          turn: 0,
          id: cartIndex
        })
        cartIndex++
        // Fill in the track underneath the cart:
        lines[y][x] = cT[cD]
      }
    }
  }

  // console.log(carts)
  // lines.forEach(line => console.log(line.join('')))

  while(true) {
    carts = carts.sort(cartSort)

    // console.log('sorted carts')
    // carts.forEach(cart => console.log(`${cart.id} ${cart.y} ${cart.x}`))
    let collision

    for (let c = 0; c < carts.length; c++) {
      let cart = carts[c]
      if (cart.dead) {
        continue
      }
      let nextY = cart.y + cY[cart.dir]
      let nextX = cart.x + cX[cart.dir]
      let nextPos = lines[nextY][nextX]

      cart.y = nextY
      cart.x = nextX

      for (let c2 = 0; c2 < carts.length; c2++) {
        let cart2 = carts[c2]
        if (
          (c2 !== c) &&
          !cart2.dead &&
          (cart2.x == cart.x) &&
          (cart2.y == cart.y)
        ) {
          collision = [cart.x, cart.y]

          if (part2) {
            // console.log(`Removing ${c}, and ${c2}`)
          }
          console.log(`Collision ==> ${cart.x},${cart.y}`)
          // carts = carts.filter(cart => (cart.id !== c) && (cart.id !== c2))
          cart.dead = true
          cart2.dead = true
          // carts.forEach(cart => console.log(`${cart.id} ${cart.x},${cart.y} ${cart.dead ? ' DEAD' : ''}`))
          break
        }
      }

      if (!part2 && collision) {
        break
      }

      if (nextPos == '\\') {
        cart.dir = cBackslash[cart.dir]
      }
      else if (nextPos == '/') {
        cart.dir = cSlash[cart.dir]
      }
      else if (nextPos == '+') {
        if (cart.turn == 0) { // left
          cart.dir = lTurns[cart.dir]
        }
        else if (cart.turn == 2) { // right
          cart.dir = rTurns[cart.dir]
        }
        cart.turn = nextTurn(cart.turn)
      }
    }

    if (collision && !part2) {
      break
    }

    if (part2 && carts.filter(cart => !cart.dead).length === 1) {
      let cart = carts.filter(cart => !cart.dead)[0]
      console.log('lastCart', cart, `==> ${cart.x},${cart.y}`)
      break
    }

  }
}
