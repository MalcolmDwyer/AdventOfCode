var fs = require('fs');
var Immutable = require('immutable');
var _ = require('lodash')

var {rangePrinter} = require('./util')

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');



const lines = input => input
  .split('\n')
  .filter(a => a.length)

const parts = line => line.split(',').map(v => parseInt(v, 10))

const solver1b = (list, _ring) => {
  let pc = 0;
  let skip = 0;
  let ring = Immutable.List(_ring)

  let totalRot = 0;

  // let sring = String.fromCharCode(..._ring)
  // console.log('sring', sring)

  list.forEach((size, ix) => {

    let offset = size + skip;
    let rotRing = ring.concat(ring).slice(pc, pc + ring.size);
    totalRot = totalRot + pc;

    ring = ring.slice(0, offset).reverse().concat(ring.slice(offset))
    console.log(`${ix} ${rangePrinter(ring)}`)

    pc = (pc + offset) % ring.size;
    skip = (skip + 1) % ring.size;
  });

  // console.log('totalRot', totalRot)
  totalRot = totalRot % ring.size;
  console.log('totalRot', totalRot)

  console.log('=====> ring', rangePrinter(ring))
  console.log(ring.get(totalRot) * ring.get(totalRot + 1))
}

const solver = (list, _ring, pc = 0, skip = 0) => {
  // console.log('list', list)
  // console.log('ring', _ring)

  // pc = 0;
  // skip = 0;
  let ring = Immutable.List(_ring)

  list.forEach(size => {
    // console.log('')
    // console.log('')
    // console.log('')
    // console.log(`--------------pc: ${pc}   skip: ${skip}   size: ${size}`)
    // console.log(`ring: ${rangePrinter(ring)}`)

    let rotRing = ring.concat(ring).slice(pc, pc + ring.size);

    // console.log('')
    // console.log('rotRing', rangePrinter(rotRing))
    let a = rotRing.slice(0, size).reverse()
    let b = rotRing.slice(size)
    // let c = rotRing.slice(0, size).reverse().concat(ring.slice(size)).slice(0, ring.size)
    let c = a.concat(b)
    let d = c.concat(c).slice(ring.size - pc).slice(0, ring.size)
    // console.log('a: ', rangePrinter(a))
    // console.log('b: ', rangePrinter(b))
    // console.log('c: ', rangePrinter(c))
    // console.log('d: ', rangePrinter(d))
    ring = d;

    // ring = rotRing.slice(0, size).reverse().concat(rotRing.slice(size)).slice(0, ring.size)
    // ring = rotRing.concat(rotRing).slice(rotRing.size - pc).slice(0, rotRing.size)

    pc = (pc + size + skip) % ring.size;
    skip = (skip + 1) % ring.size;

    // console.log('ring', rangePrinter(ring))
    // console.log(`--------------`)
  })

  // Part 1:
  // console.log('=====> ring', rangePrinter(ring))
  // console.log(ring.get(0) * ring.get(1))

  return {ring, pc, skip}

}

const solver2 = (input) => {
  let list = input.split('').map(c => c.charCodeAt(0)).concat([17, 31, 73, 47, 23])
  // console.log(list)

  let ring = _.range(0, 256)
  let pc = 0, skip = 0;

  for (let c = 0; c < 64; c++) {
    ({ring, pc, skip} = solver(list, ring, pc, skip))
    // console.log(c, pc, skip)
  }

  // console.log(ring, pc, skip)

  let denseHash = ''
  _.range(0, 16).map(hashPart => {
    let xor = xorCompress(ring.slice(hashPart*16, hashPart*16 + 16))
    // console.log('xor', xor, xor.toString(16))
    let hexString = xor.toString(16)
    denseHash += (hexString.length == 1) ? '0' + hexString : hexString;
  })

  console.log(`denseHash: ${denseHash} from "${input}"`)
}

let xorCompress = (list16 => {
  return list16.reduce((acc, v) => {
    return acc ^ v
  },0)
})


let testInput = [3, 4, 1, 5]

// solver(parts(lines(input)[0]), _.range(0, 256))

// solver2(lines(input)[0], _.range(0, 256))
// solver2('1,2,3', _.range(0, 5))
// solver2(lines(input)[0])

solver2('')
solver2('AoC 2017')
solver2('1,2,3')
solver2('1,2,4')
solver2('192,69,168,160,78,1,166,28,0,83,198,2,254,255,41,12')

// solver([192,69], _.range(0, 256))
// solver(testInput, _.range(0, 5))
// console.log('---------------------------------------------------------------------- solver2')
// solver2(testInput, _.range(0, 5))

// Attempts:
// > 10302 (101*102)
// > 18786 (101*186)
// != 27060
// 48705 --> original solver ... 191*255

// Part2 attempts:
// 1c46642b6f2bc21db2a2149daeeae5d // damn you zero padding!
// 1c46642b6f2bc21db2a2149d0aeeae5d -> correct
