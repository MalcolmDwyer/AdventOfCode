import { lineReader } from '../../common.mjs';

const parseLine = line => {

  if (line[0] === 'R') {
    return { dx: 1, dy: 0 }
  }
  if (line[0] === 'L') {
    return { dx: -1, dy: 0 }
  }
  if (line[0] === 'U') {
    return { dx: 0, dy: 1 }
  }
  return { dx: 0, dy: -1 }
};

const solver = async (length = 10) => {
  let lines = await lineReader('input.txt');

  let rope = [];
  for (let r = 0; r < length; r++) {
    rope[r] = {x: 0, y: 0};
  };

  let visited = new Set();

  lines.forEach((line) => {
    let {dx, dy} = parseLine(line);
    let n = parseInt(line.slice(2));
    while (n) {
      rope[0].x += dx;
      rope[0].y += dy;

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

await solver(2);
await solver(10);



