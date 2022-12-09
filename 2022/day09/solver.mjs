import { lineReader, gridReader } from '../../common.mjs';

const parseLine = line => {
  const distance = parseInt(line.slice(2));
  if (line[0] === 'R') {
    return {
      dx: distance,
      dy: 0,
      nx: 1,
      ny: 0,
    }
  }
  if (line[0] === 'L') {
    return {
      dx: -distance,
      dy: 0,
      nx: -1,
      ny: 0,
    }
  }
  if (line[0] === 'U') {
    return {
      dx: 0,
      dy: distance,
      nx: 0,
      ny: 1,
    }
  }
  return {
    dx: 0,
    dy: -distance,
    nx: 0,
    ny: -1,
  }
};

const solver2 = async (length = 10) => {
  let lines = await lineReader('input.txt');

  let rope = [];
  for (let r = 0; r < length; r++) {
    rope[r] = {x: 0, y: 0};
  };

  let visited = new Set(['0__0']);

  lines.forEach((line) => {
    let {nx, ny} = parseLine(line);
    let n = parseInt(line.slice(2));
    while (n) {

      rope[0].x += nx;
      rope[0].y += ny;

      for (let r = 1; r < rope.length; r++) {
        let ox = rope[r-1].x - rope[r].x;
        let oy = rope[r-1].y - rope[r].y;

        let nx = ox / Math.abs(ox);
        let ny = oy / Math.abs(oy);

        if (Math.abs(ox) > 1 || Math.abs(oy) > 1) {
          rope[r].x += ox ? nx : 0;
          rope[r].y += oy ? ny : 0;
        }
      }

      visited.add(`${rope[length-1].x}__${rope[length-1].y}`);
      n--;
    }
  })
  console.log(visited.size);
};

await solver2(2);
await solver2(10);



