// import { gridReader } from '../../common.mjs';
import computer from './computer.mjs';
import { lineReader } from '../../common.mjs';
// import computer from './computer.mjs';

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';

  let lines = await lineReader(file);
  let data = lines[0].split(',').map(n => parseInt(n));

  // grid = grid.map(line => line.map(value => value === '#' ? '⚪️' : '⬛️'));

  // Part 1
  run(data, 0);

  // Part 2
  run(data, 1);
}

solver();


const run = async (data, startValue) => {

  const cpu = await computer(data)();

  const dirs = ['^', '>', 'v', '<'];
  const cX = [0, 1, 0, -1];
  const cY = [-1, 0, 1, 0];
  const nextTurn = turn => (turn + 1) % 3; //  ['l', 's', 'r']
  const lTurns = [3, 0, 1, 2];
  const rTurns = [1, 2, 3, 0];

  let dir = 0;

  const paint = [];
  paint[0] = [];
  paint[0][0] = startValue ? '#' : '.';

  let x = 0;
  let y = 0;

  let done = false;
  let count = 0;

  let color = 0;

  while (!done) {

    console.log('----------------------------', x, y, dirs[dir]);
    cpu.next();

    if (!paint[y]) {
      paint[y] = [];
    }
    color = paint[y][x] == '#' ? 1 : 0;

    // console.log('next', color);
    let newColor = cpu.next(color);
    console.log('got newColor', newColor.value);
    let turn = cpu.next();
    console.log('got turn', turn.value);

    if (turn.done) {
      break;
    }

    if (!paint[y]) {
      paint[y] = [];
    }
    if (!paint[y][x]) {
      count++;
    }
    paint[y][x] = newColor.value ? '#' : '.';

    dir = turn.value
      ? rTurns[dir]
      : lTurns[dir]

    // console.log('newDir', dir, dirs[dir]);
    
    x = x + cX[dir];
    y = y + cY[dir];
  }

  // Part 1:
  console.log('count:', count);

  let minX = Infinity;
  let maxX = -Infinity;
  paint.forEach(line => {
    Array.from(line.keys()).forEach(zx => {
      if (zx < minX) {
        minX = zx;
      }
      if (zx > maxX) {
        maxX = zx;
      }
    })
  });
  paint.forEach(line => {
    let str = '';
    for(let lx = minX - 1; lx <= maxX + 1; lx++) {
      // if (typeof line[lx] !== 'undefined') {
      //   str += line[lx];
      // }
      if (line[lx] === '#') {
        str += line[lx];
      }
      else {
        str += ' ';
      }
    }
    console.log(str);
  })
};
