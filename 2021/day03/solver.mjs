import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
// const parseLine = (line) => {
//   return /([a-z]*) (\d*)/.exec(line);
// };
const parseLine = line => parseInt(line);

const solver = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  let lines = await lineReader('input.txt');

  const c = lines[0].length;

  let counts = Array(c).fill(0);
  console.log('counts before', counts);
  lines.forEach((l) => {
    l.split('').forEach((char, i) => {
      if (char === '1') {
        counts[i] = counts[i] + 1;
      }
    })
  });
  console.log('p1', lines.length, counts);

  const epsExp = counts.map((x) => (x > lines.length/2) ? '1' : '0');
  const gamExp = counts.map((x) => (x > lines.length/2) ? '0' : '1');
  console.log('epsExp', epsExp);
  console.log('gamExp', gamExp);
  const eps = parseInt(epsExp.join(''), 2);
  const gam = parseInt(gamExp.join(''), 2);
  console.log('eps', eps);
  console.log('gam', gam);
  console.log(eps * gam);

  console.log('-----------------------');

  const oFilter = lines.filter((l) => l.split('')[0] === epsExp[0]);
  console.log(oFilter.length);
  console.log('-----------------------');

  let oR = lines;
  let ix = 0;
  let target = epsExp[0];
  while (oR.length > 1 && ix < c) {
    oR = oR.filter((l) => l.split('')[ix] === target);
    console.log('AFTER ', ix);
    console.log(oR);
    ix++;

    let tc = 0;
    let p = oR.length
    oR.forEach((l) => {
      if (l.split('')[ix] === '1') {
        tc = tc + 1;
      }
    });
    target = (tc >= (p / 2)) ? '1' : '0'
  }
  console.log('OR', oR);
  console.log('-----------------');

  let cR = lines;
  ix = 0;
  target = gamExp[ix]
  while (cR.length > 1 && ix < c) {
    console.log('  target:', target);
    cR = cR.filter((l) => l.split('')[ix] === target);
    console.log('AFTER ', ix);
    console.log('cR', cR);
    ix++;

    let tc = 0;
    let p = cR.length
    cR.forEach((l) => {
      if (l.split('')[ix] === '0') {
        tc = tc + 1;
      }
    });
    console.log(`TC/p ${tc}/${p}`);
    target = (tc <= (p / 2)) ? '0' : '1'
  }
  console.log(cR);

  const ox = parseInt(oR, 2);
  const co2 = parseInt(cR, 2);
  console.log(ox, co2, ox * co2);
}


solver();
