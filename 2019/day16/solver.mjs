import { lineReader } from '../../common.mjs';
// import { lcm } from 'mathjs';
// import math from 'mathjs';

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';

  let lines = await lineReader(file);
  let data = lines[0].split('').map(n => parseInt(n));

  // Part 1
  // run(data);

  // Part 2
  run(data, true);

  // test();
}

solver();

const run = (data, part2) => {
  // console.log('day16');
  let phaseCount = 100;
  let blowup = 10000;
  let sumStr;

  let vals = [...data];
  if (part2) {
    vals = [];
    for (let x = 0; x < blowup; x++) {
      vals.push(...data);
    }
  }

  let prevT = new Date();
  for (let t = 0; t < phaseCount; t++) {
    let now = new Date();
    console.log('PHASE', t, vals.length, now.valueOf() - prevT.valueOf());
    prevT = now;
    let newVals = [];
    for (let s = 0; s < vals.length; s++) {
      let p = new Pattern(s + 1);
      // let slices = vals.map(v => {
      //   return v * p.next();
      // });
      // const sum = slices.reduce((acc, v) => acc + v, 0);
      // const sum = vals.reduce((acc, v) => acc + (v * p.next()), 0);

      // const sum = vals.reduce((acc, v) => {
      //   let n = p.next();
      //   if (!n) {
      //     return acc;
      //   }
      //   return acc + (n * v);
      // }, 0);

      let sum = 0;
      let n;
      for (let v = 0; v < vals.length; v++) {
        n = p.next();
        if (!n) continue;
        if (n == 1) {
          sum = sum + vals[v];
        }
        else {
          sum = sum - vals[v];
        }
      }

      // sumStr = sum%10;
      // newVals.push(Math.abs(sum%10));
      // sumStr = `${sum}`;
      sumStr = '' + sum;
      newVals.push(parseInt(sumStr[sumStr.length - 1]));
      // console.log(`sum ${sum} ==> [${sumStr[sumStr.length - 1]}] ==> [${parseInt(sumStr[sumStr.length - 1])}]`);
      
      // newVals.push(parseInt(sumStr.slice(-1)));
      // console.groupEnd();
    }

    // console.log('newVals', newVals.join(''));
    // vals = [...newVals];
    vals = newVals;
    
    // console.groupEnd();
  }

  let offset = 0;

  if (part2) {
    offset = parseInt(data.slice(0, 7).join(''))
  }
  console.log(vals.slice(offset, 8).join(''));
};


const getPattern = (pattern, repeat) => {
  
    let phasePattern = [];
    pattern.forEach(p => {
      for (let r = 0; r < repeat; r++) {
        phasePattern.push(p);
      }
    })
    const [first, ...rest] = phasePattern;
    return [...rest, first];


    // 0, 1, 0, -1
    //
    // 1, 0, -1, 0, 1, 0, -1, 0, 1, ...
    // 0, 1, 1, 0, 0, -1, -1, 0, 0, ...
    // 0, 0, 1, 1, 1, 0, 0, 0, -1, -1, -1, 0,...
}

const getPatternPart = (repeat, index) => {
  (index - 1) % (repeat * 4)
}

class Pattern {
  constructor(repeat = 1) {
    this.repeat = repeat;
    this.pattern = [0, 1, 0, -1];
    this.repeatCount = this.repeat;
    this.pointer = 0;

    this.next(); // skip first
  }

  next() {
    
    let retval = this.pattern[this.pointer];
    this.repeatCount--;

    if (this.repeatCount === 0) {
      this.pointer = (this.pointer + 1) % 4;
      this.repeatCount = this.repeat;
    }
    

    return retval;
  }
  
}

const test = () => {
  let p;
  p = new Pattern(1);
  console.log(p.next(), p.next(), p.next(), p.next(), p.next(), p.next(), p.next(), p.next());

  p = new Pattern(2);
  console.log(p.next(), p.next(), p.next(), p.next(), p.next(), p.next(), p.next(), p.next());

  p = new Pattern(3);
  console.log(p.next(), p.next(), p.next(), p.next(), p.next(), p.next(), p.next(), p.next());
}