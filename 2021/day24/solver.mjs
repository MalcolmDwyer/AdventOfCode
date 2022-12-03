import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);

const A_ = [ 1,  1,  1,  1,  26,  1,  1, 26,  1, 26, 26,  26, 26, 26];
const B_ = [15, 11, 10, 12, -11, 11, 14, -6, 10, -6, -6, -16, -4, -2];
const C_ = [ 9,  1, 11,  3,  10,  5,  0,  7,  9, 15,  4,  10,  4,  9];

const p = (n, l = 4) => n.toString().padStart(l, ' ');

const run = (n) => {
  const inputs = n.toString().split('').map((d) => parseInt(d));
  if (inputs.some((n) => !n)) {
    return 1;
  }

  let w = 0;
  let x = 0;
  let y = 0;
  let z = 0;

  const A = [ 1,  1,  1,  1,  26,  1,  1, 26,  1, 26, 26,  26, 26, 26];
  const B = [15, 11, 10, 12, -11, 11, 14, -6, 10, -6, -6, -16, -4, -2];
  const C = [ 9,  1, 11,  3,  10,  5,  0,  7,  9, 15,  4,  10,  4,  9];

  // console.log(`---------------- ${n}`)

  let i = 0;
  while (i < 14) {
    w = inputs[i];
    // x = 0;
    y = 25;
    // x = z;
    x = z % 26;
    // x = z;
    const a = A[i];
    const b = B[i];
    const c = C[i];

    if (a !== 1) {
      z = Math.floor( z / a);
    }

    x += b;
    x = (x === w)
      ? 0
      : 1;

    y = x ? 26 : 1;
    // y = 1;
    z *= y;
    y = w + c;
    y *= x;
    z += y;

    // console.log(`${w} a:${p(a)} b: ${p(b)} c: ${p(c)} ----- z: ${p(z, 16)} z%26: ${p(z % 26)}`)
    i++;
  }
  
  // console.log('run', inputs.join(','), z);
  return z < 26;
}


const solver = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);

  let x = 99999999999999;

  let t = 0;
  let valid = false;
  while (
    !valid
    // && t < 1
  ) {


    valid = run(x) === 0;
    
    t++;
    if (!(t % 1000000)) {
      console.log('t', t, x);
    }
    x--;
  }

  console.log('p1', x);
}

const solver2 = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p2');
}


await solver();
// await solver2();

/*

for (let i = 0; i < X; i++) {

}

for (let i = 0; i < X; i++) {
  for (let j = 0; j < Y; j++) {
  
  }
}


*/