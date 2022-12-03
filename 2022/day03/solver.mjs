import { lineReader } from '../../common.mjs';

const parseLine = line => {
  return [
    line.slice(0, line.length/2).split(''),
    line.slice(line.length/2).split(''),
  ];
};

const priority = (c) => {
  const cc = c.charCodeAt(0);
  if (cc > 90) {
    return cc - 96;
  }
  else {
    return cc - 64 + 26;
  }
}


const solver = async () => {
  let sum = 0;
  const lines = await lineReader('input.txt', parseLine);

  lines.forEach(([bag1, bag2]) => {
    let match = null;
    bag1.forEach((v) => {
      if (!match && bag2.find(v2 => v2 == v)) {
        match = v;
      }
    });

    const p = priority(match);
    sum += p;
  });
  console.log('p1', sum);
}

const solver2 = async () => {
  let sum = 0;
  let lines = await lineReader('input.txt', parseLine);

  while (lines.length) {
    let [a, b, c, ...rest] = lines;

    let match;

    [...a[0], ...a[1]].forEach((x) => {
      if (!match && 
        [...b[0], ...b[1]].find((y) => x == y) &&
        [...c[0], ...c[1]].find((z) => x == z)
      ) {
        match = x;
      }
    })

    lines = rest;
    sum += priority(match);
  }

  console.log('p2', sum);
}


await solver();
await solver2();
