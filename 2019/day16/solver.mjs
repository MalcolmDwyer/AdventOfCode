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

const run = (data, part2, offset) => {
  // console.log('day16');
  let phaseCount = 100;
  let blowup = 10000;

  let vals = [...data];
  if (part2) {
    vals = [];
    for (let x = 0; x < blowup; x++) {
      vals.push(...data);
    }
  }

  let sliceOffset = 0;

  if (part2) {
    sliceOffset = parseInt(data.slice(0, 7).join(''));
    // sliceOffset = 79990; // 000; /////////////// ************************************************ REMOVE
    console.log('sliceOffset:', sliceOffset);
  }
  
  // console.log('start', vals.join(''));
  vals = vals.slice(sliceOffset);
  // console.log('start', vals.join(''));

  let prevT = new Date();
  for (let t = 0; t < phaseCount; t++) {
    let now = new Date();
    console.log('PHASE', t, vals.length, now.valueOf() - prevT.valueOf());
    prevT = now;
    let newVals = [];

    for (let s = vals.length - 1; s >= 0; s--) {
      // let p = new Pattern(s + 1);
      // let n;

      let sum = (newVals.length ? newVals[0] : 0) + vals[s];

      newVals.unshift(sum%10);
      // if (!(s%1000)) {
      //   console.log(`${s}    ${newVals.length}`);
      // }
    }

    /*
    for (let s = sliceOffset; s < vals.length + sliceOffset; s++) {
      let p = new Pattern(s + 1);
      let sum = 0;
      let n;

      n = p.skip(sliceOffset);

      let innerDone = false;
      let vRemain = vals.length;
      let vp = 0;
      while (!innerDone) {
        const {factor, repeat} = p.nextSequence();
        let count = Math.min(vRemain, repeat);
        if (factor) {
          let innerSum = vals.slice(vp, vp + count).reduce((acc, d) => acc + d);
          if (factor === -1) {
            sum -= innerSum;
          }
          else {
            sum += innerSum;
          }
        }
        vRemain -= count;
        vp += count;
        if (!vRemain) {
          innerDone = true;
        }
      }
      

      // console.log('sum', sum);

      // sumStr = sum%10;
      // newVals.push(Math.abs(sum%10));
      // sumStr = `${sum}`;
      sumStr = '' + sum;
      newVals.push(parseInt(sumStr[sumStr.length - 1]));
      // console.groupEnd();
    }
    */

    // console.log('newVals', newVals.join(''));
    // vals = [...newVals];
    vals = newVals;
    
    // console.groupEnd();
    console.log(t, vals.slice(0, 8).join(''));
    // console.log(t, vals.slice(sliceOffset, sliceOffset + 8).join('') vals.slice(sliceOffset, sliceOffset + 8).join(''));
    // console.log(t, 'slice', vals.slice(sliceOffset, sliceOffset + 8).join(''));

  }

  console.log('D:', vals.slice(0, 8).join(''));
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

  skip(n) {
    for (let t = 0; t < n; t++) {
      this.repeatCount--;

      if (this.repeatCount === 0) {
        this.pointer = (this.pointer + 1) % 4;
        this.repeatCount = this.repeat;
      } 
    }
  }

  nextSequence() {
    let ret = {
      factor: this.pattern[this.pointer],
      repeat: this.repeatCount,
    };
    this.repeatCount = this.repeat;
    this.pointer = (this.pointer + 1) % 4;

    return ret;
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

  p = new Pattern(3);
  p.skip(4);
  console.log(p.next(), p.next(), p.next(), p.next());


  console.log('sequence test');
  p = new Pattern(3);
  console.log(p.nextSequence(),p.nextSequence(),p.nextSequence(),p.nextSequence(),p.nextSequence());
}