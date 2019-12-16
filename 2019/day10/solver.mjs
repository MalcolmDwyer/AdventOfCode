import { gridReader } from '../../common.mjs';
// import computerGen from './computerGen.mjs';
// import { lineReader } from '../../common.mjs';


async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';

  let grid = await gridReader(file);

  // grid = grid.map(line => line.map(value => value === '#' ? '⚪️' : '⬛️'));
  part12(grid);
}

solver();



const part12 = async (grid) => {
  grid.map(line => console.log(line.join('')));
  
  let h = grid.length;
  let w = grid[0].length;

  let best = 0;
  let bestX;
  let bestY;
  let bestAngles;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {

      if (grid[y][x] !== '#') {
        continue;
      }
      let angles = {};

      for (let y2 = 0; y2 < h; y2++) {
        for (let x2 = 0; x2 < w; x2++) {
          if ((x == x2) && (y == y2)) {
            continue;
          }
          if (grid[y2][x2] === '#') {
            let dx = x2 - x;
            let dy = y2 - y;
            let angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 450) % 360;
            // console.log(`${x},${y} ==> ${x2},${y2}   slope: ${angle}`)
            if (!angles[angle]) {
              angles[angle] = [];
            }
            angles[angle].push({
              x: x2,
              y: y2,
              d: Math.sqrt((dx * dx) + (dy * dy))
            });
          }
        }
      }

      // console.log(slopes);
      

      let count = Object.keys(angles).length;
      // console.log(`${x},${y}  slopes ${count}`);

      if (count > best) {
        best = count;
        bestX = x;
        bestY = y;
        bestAngles = angles;
      }
    }
  }

  console.log('best', best);
  console.log(bestX, bestY);


  // Part 2
  const floatAngles = Object.keys(bestAngles).map(k => parseFloat(k));
  const sortedAngles = floatAngles.sort((a,b) => a < b ? -1 : 1);

  sortedAngles.forEach(angle => {
    bestAngles[angle] = bestAngles[angle].sort((a,b) => a.d < b.d ? -1 : 1);
  });

  let a = 1;
  let tx;
  let ty;
  let done = false;
  while (!done) {
    for(let sa = 0; sa < sortedAngles.length; sa++) {
      if (bestAngles[sortedAngles[sa]] && bestAngles[sortedAngles[sa]].length) {
        if (a === 200) {
          let b = bestAngles[sortedAngles[sa]][0];
          console.log(`200th blast at ${b.x}, ${b.y} => ${b.x * 100 + b.y}`)
          done = true;
          break;
        }
        bestAngles[sortedAngles[sa]].shift();
        a++;
      }
    }
  }
};


// !308
// !304