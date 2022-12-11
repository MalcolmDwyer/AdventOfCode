import { lineReader } from '../../common.mjs';

const parseLine = line => {
  const [inst, val] = line.split(' ');
  return [
    inst,
    parseInt(val),
  ]
};


const solver = async () => {
  let lines = await lineReader('input.txt');

  let cycle = 1;
  let x = 1;
  let sum = 0;
  let pc = 0;
  let ready = true;
  let pending = null;

  let screen = [];
  let scan = [];

  let done = false;

  while (!done) {
    let next = x;
    if ((cycle - 20)%40 === 0) {
      console.log('=====cycle', cycle, x);
      sum += cycle * x;
    }

    if (ready) {
      const [inst, num] = parseLine(lines[pc]);
      pc++;
      // console.log(inst, num);
      if (inst === 'addx') {
        ready = false;
        pending = num;
      }
    }
    else {
      next = x + pending;
      ready = true;
      pending = null;
    }

    console.log(`${cycle} x: ${x}`);

    scan[cycle-1] = Math.abs(x - ((cycle-1) % 40)) <= 1
      ? '#'
      : '.';

    if (!(cycle % 40)) {
      screen.push(scan);
      scan = [];
    }

    cycle++;
    if (cycle > 240) {
      done = true;
    }
    x = next;
  }
  console.log('p1', sum);

  screen.forEach((scan) => console.log(scan.join('')));
}

await solver();
