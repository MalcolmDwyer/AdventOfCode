import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data)
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

const getInstructions = lines => {
  return lines.slice(1).map(line => line.split(' ').map((d, ix) => {
    if (ix) {
      return parseInt(d)
    }
    return d
  }))
}


const solver = lines => {
  solver1(lines, 0)
  // solver1(lines, 1)
}

const solver1 = (lines, r0 = 0) => {

  // console.log(lines)
  let instructions = getInstructions(lines)

  let ip = 0
  let ipp = parseInt(lines[0].slice(-1))
  let regs = [r0, 0, 0, 0, 0, 0]
  // console.log('IP', ip)
  // console.log(instructions[4])
  // instructions[4] = ['seti', 1, 0, 4]
  // return

  const printSetSize = 20
  let print = 0
  let t = 0
  while (ip >= 0 && ip < instructions.length) {

    let str
    if (!(t%10)) {
      print = printSetSize
      console.log('--------------')
    }
    t++
    regs[ipp] = ip
    let instr = instructions[ip]
    if (print) {
      print = Math.max(0, print - 1)
      // str = `${t} ip=${ip} [${regs.join(', ')}] ${instr.join(' ')} `
      str = `${t} ip=${ip} ${instr.join(' ')} `
    }
    let result = alu(instr[0], instr[1], instr[2], regs)
    if (print) {
      str += `[${regs.join(', ')}]`
      console.log(str)
    }
    regs[instr[3]] = result
    ip = regs[ipp]
    ip++

  }

  console.log('s1', regs[0])

}
