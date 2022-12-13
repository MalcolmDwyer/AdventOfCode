import { lineReader } from '../../common.mjs';

const parseLine = line => JSON.parse(line);

const compare = (a, b) => {
  if (Number.isFinite(a) && Number.isFinite(b)) {
    if (a < b) {
      return 1;
    }
    else if (a > b) {
      return -1;
    }
    else {
      return 0;
    }
  }
  else if (Array.isArray(a) && Array.isArray(b)) {
    let aa = [...a];
    let bb = [...b];
    let v = 0;
    while(true) {
      if (aa.length && !bb.length) {
        v = -1;
        break;
      }
      else if (!aa.length  && bb.length) {
        v = 1;
        break;
      }
      else if (!aa.length && !bb.length) {
        v = 0;
        break;
      }
      let x = aa.shift();
      let y = bb.shift();
      v = compare(x, y);
      if (v) {
        break;
      }
    }
    return v;
  }
  else {
    if (Array.isArray(a) && Number.isFinite(b)) {
      return compare(a, [b]);
    }
    else if (Number.isFinite(a) &&  Array.isArray(b)) {
      return compare([a], b);
    }
  }
}


const solver = async () => {
  let lines = await lineReader('input.txt', parseLine);
  let i = 1;
  let sum = 0;
  while (lines.length) {
    const [a, b, ...rest] = lines;
    lines = rest;

    let result = compare(a, b);
    if (result === 1) {
      sum += i;
    }

    i++;
  }

  console.log('p1', sum);
}

const solver2 = async () => {
  let lines = await lineReader('input.txt', parseLine);

  lines = [...lines, [[2]], [[6]]];

  lines.sort((a, b) => -compare(a, b));

  let mul = 1;
  lines.forEach((line, ix) => {
    if (JSON.stringify(line) === `[[2]]` || JSON.stringify(line) === `[[6]]`) {
      mul *= ix + 1;  
    }
  });
  console.log('p2', mul);
}


await solver();
await solver2();
