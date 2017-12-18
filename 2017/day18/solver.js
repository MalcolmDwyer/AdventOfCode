var fs = require('fs');
var Immutable = require('immutable');
var _ = require('lodash')
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./test_input.txt');
const lines = input => input
  .split('\n')
  .filter(a => a.length)
//-----------------------------------------------------------

let asmParser = (line) => {
  let parts = /^([a-z]*) ([a-z0-9-]*)[\ ]*([a-z0-9-]*)$/.exec(line);

  let ins = parts[1];
  let x = parts[2];
  let y, xr, xn, yr, yn
  if (['set', 'add', 'mul', 'mod', 'jgz'].includes(ins)) {
    y = parts[3];
  }

  return {
    ins,
    x: isNaN(parseInt(x)) ? x : parseInt(x),
    y: y && (isNaN(parseInt(y)) ? y : parseInt(y))
  }
}

const solver = (input) => {

  let out = null;
  let rcv = null;
  let rcv1 = null;
  let pc = 0;
  let regs = {};

  const getReg = reg => regs[reg] || 0
  const getVal = x => isNaN(x) ? (getReg(x) || 0) : x
  const setReg = (reg, val) => {
    console.log('setReg', reg, val)
    regs[reg] = val
  }

  let instructions = input.map(asmParser);

  while (pc >= 0 && pc < instructions.length) {
    let ix = instructions[pc];

    if (ix.ins === 'jgz') {
      if (getVal(ix.x) > 0) {
        pc += getVal(ix.y)
        continue
      }
    }
    else if (ix.ins === 'snd') {
      out = getVal(ix.x)
      console.log('___________Playing', out)
    }
    else if (ix.ins === 'rcv') {
      if (getVal(ix.x) !== 0) {
        rcv = out;
        console.log('___________Recover', rcv)
        if (rcv1 == null) {
          rcv1 = rcv;
          break;
        }
      }
    }
    else if (ix.ins === 'set') {
      setReg(ix.x, getVal(ix.y))
    }
    else if (ix.ins === 'add') {
      setReg(ix.x, getVal(ix.x) + getVal(ix.y))
    }
    else if (ix.ins === 'mul') {
      setReg(ix.x, getVal(ix.x) * getVal(ix.y))
    }
    else if (ix.ins === 'mod') {
      setReg(ix.x, getVal(ix.x) % getVal(ix.y))
    }
    else {
      console.log('something is wrong')
      return;
    }

    console.log(pc, ix)
    pc++;
  }

  console.log(regs)
  console.log('out', out)
  console.log('pc', pc)
  console.log('rcv', rcv)
  console.log('rcv1', rcv1)
}

solver(lines(input))
