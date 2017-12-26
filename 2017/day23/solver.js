var fs = require('fs');
var Immutable = require('immutable');
var _ = require('lodash')
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input2.txt');
const lines = input => input
  .split('\n')
  .filter(a => a.length)
//-----------------------------------------------------------

let asmParser = (line) => {
  let parts = /^([a-z]*) ([a-z0-9-]*)[\ ]*([a-z0-9-]*)$/.exec(line);

  let ins = parts[1];
  let x = parts[2];
  let y, xr, xn, yr, yn
  if (['set', 'add', 'mul', 'sub', 'jnz'].includes(ins)) {
    y = parts[3];
  }

  return {
    ins,
    x: isNaN(parseInt(x)) ? x : parseInt(x),
    y: y && (isNaN(parseInt(y)) ? y : parseInt(y))
  }
}




const solver = (input) => {

  let pc = 0;
  let regs = {
    a:1, b:0, c:0, d:0, e:0, f:0, g:0, h:0
  };

  const getReg = reg => regs[reg] || 0
  const getVal = x => isNaN(x) ? (getReg(x) || 0) : x
  const setReg = (reg, val) => {
    // console.log('setReg', reg, val)
    regs[reg] = val
  }

  let mulCount = 0;

  let instructions = input.map(asmParser);

  // console.log(instructions)
  // return

  while (pc >= 0 && pc < instructions.length) {
    let ix = instructions[pc];

    if (ix.ins === 'jnz') {
      if (getVal(ix.x) != 0) {
        pc += getVal(ix.y)
        continue
      }
    }
    else if (ix.ins === 'set') {
      setReg(ix.x, getVal(ix.y))
    }
    else if (ix.ins === 'add') {
      setReg(ix.x, getVal(ix.x) + getVal(ix.y))
    }
    else if (ix.ins === 'sub') {
      setReg(ix.x, getVal(ix.x) - getVal(ix.y))
    }
    else if (ix.ins === 'mul') {
      setReg(ix.x, getVal(ix.x) * getVal(ix.y))
      mulCount++
    }

    if (pc == 14) {
    // if (ix.ins === 'jnz') {
      console.log(pc, 'jnz----------')
      console.log(regs)
    }

    pc++;
  }
  console.log('mulCount:', mulCount, 'H:', regs.h)

}

// solver(lines(input))


const solver2 = () => {
  let count = 0;
  let a = 108400;
  let b = 108400 + (17 * 1001)
  Immutable.Range(a, b, 17).forEach(n => {
    let p = 2
    let comp = false;
    do {
      if (!(n%p)) {
        comp = true;
      }
      p++
    } while ((p < n/2) && !comp)

    if (comp) {
      count++
    }
  })
  console.log('count', count)
}

solver2()
// !15542

// ! 1
// ! 4
// ! 5
// ! 6
// ! 1000
// ! 1001
// ! 999

// !942 (from solver4.c)
// !943
// !941
