var fs = require('fs')
var _ = require('lodash')
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8')
}
input = require('./input.txt')
const lines = input => input
  .split('\n')
  .filter(a => a.length)

//-----------------------------------------------------------



let asmParser = (line) => {
  let parts = /^([a-z]*) ([a-z0-9-]*)[\ ]*([a-z0-9-]*)$/.exec(line)

  let opcode = parts[1]
  let x = parts[2]
  let y, xr, xn, yr, yn
  if (['set', 'add', 'mul', 'mod', 'jgz'].includes(opcode)) {
    y = parts[3]
  }

  return {
    opcode,
    x: isNaN(parseInt(x)) ? x : parseInt(x),
    y: y && (isNaN(parseInt(y)) ? y : parseInt(y))
  }
}

async function* program(id, instructions, myQueue, otherQueue) {
  let v = 0
  let pc = 0
  let regs = {p: id}
  let sentCount = 0

  const getReg = reg => regs[reg] || 0
  const getVal = x => isNaN(x) ? (getReg(x) || 0) : x
  const setReg = (reg, val) => { regs[reg] = val }


  while (pc >= 0 && pc < instructions.length) {
    let {opcode , x, y} = instructions[pc]

    if (opcode === 'jgz') {
      if (getVal(x) > 0) {
        pc += getVal(y)
        continue
      }
    }
    else if (opcode === 'snd') {
      let out = getVal(x)
      otherQueue.push(out)
      sentCount++
    }
    else if (opcode === 'rcv') {
      if (myQueue.length) {
        let rcv = myQueue.shift()
        setReg(x, rcv)
      }
      else {
        yield
        // ... Wait for other processor to add to myQueue

        if (!myQueue.length) {
          // Program finished - Waited for value
          // but other program never sent one.
          return sentCount
        }

        let rcv = myQueue.shift()
        setReg(x, rcv)
      }
    }
    else if (opcode === 'set') {
      setReg(x, getVal(y))
    }
    else if (opcode === 'add') {
      setReg(x, getVal(x) + getVal(y))
    }
    else if (opcode === 'mul') {
      setReg(x, getVal(x) * getVal(y))
    }
    else if (opcode === 'mod') {
      setReg(x, getVal(x) % getVal(y))
    }
    else {
      console.log('something is wrong')
      return sentCount
    }
    pc++
  }

  console.log(id, ' broke from while loop')
  return sentCount
}


async function run() {
  let instructions = lines(input).map(asmParser)

  let q0 = []
  let q1 = []
  let p0 = program(0, instructions, q0, q1)
  let p1 = program(1, instructions, q1, q0)

  let p0r, p1r

  do {
    p0r = await p0.next()
    p1r = await p1.next()
  } while( !p0r.done || !p1r.done)

  console.log(p1r && p1r.value)
}

run()
