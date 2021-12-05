import { lineReader, gridReader } from '../../common.mjs';

const parseLine = (line) => {
  return /([a-z]*) (\d*)/.exec(line);
};
// const parseLine = line => parseInt(line);


const solver = async () => {
  let lines = await lineReader('input.txt', parseLine);
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p1');
  const instrs = lines.map((line) => ({d: line[1], distance: line[2]}));

  // console.log('lines');
  // console.log(lines);
  // console.log(instrs);

  const p = [0, 0];

  instrs.forEach(({d, distance}) => {
    const d2 = parseInt(distance);
    if (d === 'forward') {
      p[0] = p[0] + d2;
    }
    else if (d === 'up') {
      p[1] = p[1] - d2;
    }
    else if (d === 'down') {
      p[1] = p[1] + d2;
    }
  });

  console.log(p);

  console.log(p[0] * p[1]);
}

const solver2 = async () => {
  

  let lines = await lineReader('input.txt', parseLine);
  console.log('p2');

  const instrs = lines.map((line) => ({d: line[1], distance: line[2]}));
  // console.log(instrs);

  let h = 0;
  let depth = 0;
  let aim = 0;

  instrs.forEach(({d, distance}) => {
    const d2 = parseInt(distance);
    if (d === 'forward') {
      h += d2;
      depth += aim * d2;
    }
    else if (d === 'up') {
      aim -= d2;
    }
    else if (d === 'down') {
      aim += d2;
    }
  });

  console.log(aim, h, depth);

  console.log(h * depth);
}


solver();
solver2();
