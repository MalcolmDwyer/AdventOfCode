import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => {
  const parts = line.split(' ');
  let x = parts[1];
  let y = parts[2];

  if (Number.isFinite(parseInt(x))) {
    x = parseInt(x);
  }
  if (Number.isFinite(parseInt(y))) {
    y = parseInt(y);
  }
  return ({
    op: parts[0],
    x,
    y,
  });
};

const ops = {
  cpy: (regs, x, y) => {
    let v = Number.isFinite(x) ? x : regs[x]
    console.log(`${regs.pc}: CPY [${x}] ${v} => ${y}`);
    return {
      [y]: v,
    }
  }, 
  inc: (regs, x)  => {
    // console.log(`${regs.pc}: INC ${x}++ => ${regs[x] + 1}`);
    return {
      [x]: regs[x] + 1,
    }
  },
  dec: (regs, x)  => {
    // console.log(`${regs.pc}: DEC ${x}-- => ${regs[x] - 1}`);
    return {
      [x]: regs[x] - 1,
    }
  },
  jnz: (regs, x, y) => {
    if (regs[x] !== 0) {
      // console.log(`${regs.pc}: jump by ${y} to ${regs.pc + y}`)
      // regs.pc = regs.pc + y;
      return {
        pc: regs.pc + y,
      }
    }
    else {
      // console.log(`${regs.pc} - no jump`)
      return {}
    }
  },
};


const solver = async () => {
  let code = await lineReader('input.txt', parseLine);

  let regs = {
    a: 0, b: 0, c: 0, d: 0, pc: 0,
  };

  while (regs.pc < code.length) {
    const {op, x, y} = code[regs.pc];
    regs = {
      ...regs,
      pc: regs.pc + 1,
      ...ops[op](regs, x, y),
    };
  }

  console.log('p1', regs.a);
}

const solver2 = async () => {
  let code = await lineReader('input.txt', parseLine);

  let regs = {
    a: 0, b: 0, c: 1, d: 0, pc: 0,
  };

  while (regs.pc < code.length) {
    const {op, x, y} = code[regs.pc];
    regs = {
      ...regs,
      pc: regs.pc + 1,
      ...ops[op](regs, x, y),
    };
  }

  console.log('p2', regs.a);
}


// await solver();
await solver2();

/*

for (let i = 0; i < X; i++) {

}

for (let i = 0; i < X; i++) {
  for (let j = 0; j < Y; j++) {
  
  }
}


*/