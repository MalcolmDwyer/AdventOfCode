import computer from '../day15/computer.mjs';
// import blessed from 'neo-blessed';
import { lineReader } from '../../common.mjs';
import Map from '../day18/Map.mjs';

const dirs = ['^', 'v', '<', '>'];

async function solver() {
  const file = 'input.txt';

  let lines = await lineReader(file);
  let data = (lines[0] || '').split(',').map(n => parseInt(n));

  // Setup
  // await runSetup(data, false);

  // Part 1
  await runPart1(data);

  // Part 2
  // const route = await setupPart2();
  // await runPart2(data, route);
}

solver();

let map = new Map();

const runPart1 = async (program) => {
  console.log(program.length);

  // for (let y = 0; y < 50; y++) {
  //   for (let x = 0; x < 50; x++) {

  //   }
  // }i
  
  let min = 1346; /* 1348! */


  let size = 120;
  let max = min + size;

  // x = 99, y = 79 is mid-beam
  // let a = Math.atan(99/79);
  // console.log('a: ', a);

  /*
  -------------X[1566 - 1715]----Y[1350 - 1499]---
     0123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789
   0 ####################################################################################################.
  */


  // let slant = 1/a;
  let slant = 99/85.3;
  console.log('slant', slant);
  
  let y = min;
  let minX = Math.floor(min * slant);
  let maxX = minX + size;
  let x = minX-1;
  let isX = true;
  let inputDone = false;
  let done = false;

  let count = 0;

  const inputFn = () => {
    let r;
    if (isX) {
      x++;
    }
    if (x === maxX) {
      x = minX;
      y++;
    }
    if (y === (max-1) && x == (maxX-1)) {
      inputDone = true;
    }
    if (isX) {
      r = x;
    }
    else {
      r = y;
    }
    isX = !isX;
    return r;
  }


  const cpu = await computer(
    program, {
      // inputPromise,
      inputFn,
      rerun: true,
      // logObj: screenLog,
    }
  )();

  while (!inputDone) {
    let c = await cpu.next();
    // console.log(c);

    // if (c.done) {
    //   done = true;
    //   // console.log('done value', c.value);
    // }
    // else {
    // console.log(`At ${x},${y} got ${c.value}`);
    map.writeCell(x, y, {
      s: c.value ? '#' : '.'
    });

    if (c.value) {
      count++;
    }
    await cpu.next(); // Reset
    // }
  }

  map.draw();

  console.log(count);

  // X[1564 - 1713]----Y[1348 - 1497]

  console.log(1564*10000 + 1348)

}

// 1565348 too low