import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data)//.map(l => l.split(''))
    )
  })
  .catch(err => {
    console.error(err)
  })

const regRegex = /\[([\d]*), ([\d]*), ([\d]*), ([\d]*)\]/
const opRegex = /([\d]*) ([\d]*) ([\d]*) ([\d]*)/

const mathOps = ['add', 'mul', 'ban', 'bor']
const mathFn = [
  (a,b) => a + b,
  (a,b) => a * b,
  (a,b) => a & b,
  (a,b) => a | b
]
const setOps = ['set']
const setFn = [
  a => a
]
const predOps = ['gt', 'eq']
const predFn = [
  (a,b) => (a > b) ? 1 : 0,
  (a,b) => (a == b) ? 1 : 0
]


const allOps = [
  'addr', 'addi',
  'mulr', 'muli',
  'banr', 'bani',
  'borr', 'bori',
  'setr', 'seti',
  'gtir', 'gtri', 'gtrr',
  'eqir', 'eqri', 'eqrr'
]

const alu = (op, a, b, regs) => {
  const opcode = op[0]

  // console.log('op', op)
  let mathOpIndex = mathOps.findIndex(math => math == op.slice(0, 3))
  let predOpIndex = predOps.findIndex(pred => pred == op.slice(0, 2))
  let setOpIndex =  setOps.findIndex(set => set == op.slice(0, 3))
  // console.log('mathOpIndex', mathOpIndex, 'predOpIndex', predOpIndex)
  if (mathOpIndex >= 0) {
    let sb = op[3]
    let opA = regs[a]
    let opB = (sb == 'r') ? regs[b] : b
    let result = mathFn[mathOpIndex](opA, opB)
    // console.log(result)
    return result
  }
  else if (setOpIndex >= 0) {
    let sa = op[3]
    let opA = (sa == 'r') ? regs[a] : a
    let result = setFn[setOpIndex](opA)
    // console.log(result)
    return result
  }
  else if (predOpIndex >= 0) {
    let sa = op[2]
    let sb = op[3]
    let opA = (sa == 'r') ? regs[a] : a
    let opB = (sb == 'r') ? regs[b] : b
    let result = predFn[predOpIndex](opA, opB)
    // console.log(result)
    return result
  }
  else {
    console.error('BAD opcode', op, a, b, regs)
  }
}

const regTest = (exp, actual) => {
  return [0, 1, 2, 3].all(i => exp[i] == actual[i])
}

const getSamples = (lines) => {
  let data = []
  let done = false
  let i = 0
  while (!done) {
    if (lines[i * 3] && lines[i * 3][0] == 'B') {
      let b = regRegex.exec(lines[i*3]).slice(1, 5).map(d => parseInt(d))
      let op = opRegex.exec(lines[i*3 + 1]).slice(1, 5).map(d => parseInt(d))
      let a = regRegex.exec(lines[i*3 + 2]).slice(1, 5).map(d => parseInt(d))
      data[i] = {
        before: b,
        op,
        after: a
      }
    }
    else {
      done = true
    }
    i++
  }
  return data
}

const solver = (lines) => {
  solver1(lines)
  solver2(lines)
}

const solver1 = (lines) => {
  const samples = getSamples(lines)
  let count = 0
  samples.forEach(sample => {
    // console.log('Checking', sample)
    let matchingOps = allOps.filter(op => {
      let result = alu(op, sample.op[1], sample.op[2], sample.before)
      return result == sample.after[sample.op[3]]
    })
    // console.log('matchingOps', matchingOps)
    if (matchingOps.length >= 3) {
      count++
    }
  })
  console.log('s1', count)
}

const getInstructions = lines => {
  return lines.slice(2421).map(line => line.split(' ').map(d => parseInt(d)))
}

const solver2 = (lines) => {
  let opCodes = new Set([])
  const samples = getSamples(lines)

  const instructions = getInstructions(lines)

  samples.forEach(sample => {
    opCodes.add(sample.op[0])
  })

  let opMap = []
  Array.from(opCodes).forEach(opCode => {
    opMap[parseInt(opCode)] = new Set(allOps)
  })

  samples.forEach(sample => {
    const opCode = parseInt(sample.op[0])
    if (opMap[opCode].length <= 1) {
      return
    }
    let matchingOps = allOps.filter(op => {
      let result = alu(op, sample.op[1], sample.op[2], sample.before)
      return result == sample.after[sample.op[3]]
    })
    // console.log('matchingOps', matchingOps)
    allOps.forEach(op => {
      if (!matchingOps.includes(op)) {
        opMap[opCode].delete(op)
      }
    })

    if (opMap[opCode].size == 1) {
      // console.log(`**** Removing ${Array.from(opMap[opCode])[0]} from others`)
      opMap = opMap
        .map((set, index) => {
          if (index !== opCode) {
            set.delete(Array.from(opMap[opCode])[0])
          }
          return set
        })
    }
  })

  opMap = opMap.map((s, i) => Array.from(s)[0])

  // console.log(opMap)

  let registers = [0, 0, 0, 0]

  for (let t = 0; t < instructions.length; t++) {
    let inst = instructions[t]

    let result = alu(opMap[inst[0]], inst[1], inst[2], registers)
    registers[inst[3]] = result
  }
  console.log('s2', registers[0])
}
