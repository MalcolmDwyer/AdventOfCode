import { lineReader } from '../../common.mjs';

const parseLine = line => {
  const nodes = line.split(' -> ').map((x_y) => x_y.split(',').map(d => parseInt(d)));
  let lines = [];
  nodes.forEach((node, ix) => {
    if (ix) {
      lines.push([nodes[ix-1], node]);
    }
  });
  return lines;
};

const buildWalls = (lineGroups, addFloor) => {
  const world = [];
  let minX = Infinity, minY = 0, maxX = -Infinity, maxY = -Infinity;

  lineGroups.forEach((lineGroup) => {
    lineGroup.forEach((line) => {
      const [n1, n2] = line;
      const [x1, y1] = n1;
      const [x2, y2] = n2;

      if (x1 === x2) { // V
        if (x1 > maxX) maxX = x1;
        if (x1 < minX) minX = x1;
        const [ya, yb] = (y1 < y2) ? [y1, y2] : [y2, y1];

        for (let y = ya; y <= yb; y++) {
          if (!world[y]) {world[y] = [];}
          world[y][x1] = '█';
        }
        if (yb > maxY) maxY = yb;
      }
      else { // H
        if (y1 > maxY) maxY = y1;

        const [xa, xb] = (x1 < x2) ? [x1, x2] : [x2, x1];
        for (let x = xa; x <= xb; x++) {
          if (!world[y1]) {world[y1] = [];}
          world[y1][x] = '█';
        }
        if (xb > maxX) maxX = xb;
        if (xa < minX) minX = xa;
      }
    })
  });

  for (let y = 0; y <= maxY + 2; y++) {
    if (!world[y]) {
      world[y] = [];
    }
  }

  if (addFloor) {
    maxY += 2;
    for (let x = minX - 1000; x < maxX + 1000; x++) {
      world[maxY][x] = '█';
    }
  }

  // console.log('bounds', minX, maxX, minY, maxY);
  return {
    world,
    minX, maxX, minY, maxY,
  };
};

const pour = ({maxY, world}) => {
  let [x, y] = [500, 0];
  while (true) {
    if (y > maxY) {
      // console.log('~', x, y, ' <- done');
      world[y][x] = '∞';
      return true;
    }
    if (world[y+1]?.[x]) {
      if ((world[y+1]?.[x-1] ?? '') === '') {
        // console.log('L', x, y);
        x = x - 1;
        y = y + 1;
      }
      else if ((world[y+1]?.[x+1] ?? '') === '') {
        // console.log('R', x, y);
        x = x + 1;
        y = y + 1;
      }
      else {
        // console.log('S', x, y);
        world[y][x] = 'o';
        if (x === 500 && y === 0) {
          return true;
        }
        return false;
      }
    }
    else {
      // console.log('3', x, y);
      y++;
    }
  }
  return false;
};

const draw = ({world, minX, maxX, minY, maxY}) => {
  for (let y = minY; y <= maxY + 1; y++) {
    let line = [];
    for (let x = minX - 1; x <= maxX + 1; x++) {
      if (y === 0 && x === 500) {
        line.push('+');  
      }
      else {
        line.push(world[y]?.[x] || '.');
      }
    }
    console.log(line.join(''), y);
  }
}

const solver = async () => {
  let lines = await lineReader('input.txt', parseLine);
  let {world, minX, maxX, minY, maxY} = buildWalls(lines, false);

  let done = false;
  let count = 0;
  while (!done) {
    done |= pour({maxY, minY, world});
    count++;
    // console.log(count, '----------------------');
    // draw({
    //   world,
    //   minX, maxX,
    //   minY, //: maxY - 14,
    //   maxY
    // })
  }


  console.log('p1', count - 1);
}

// > 576 >577  > 592

const solver2 = async () => {
  let lines = await lineReader('input.txt', parseLine);
  let {world, minX, maxX, minY, maxY} = buildWalls(lines, true);

  // draw({world, minX, maxX, minY, maxY})

  let done = false;
  let count = 0;
  while (!done) {
    done |= pour({maxY, minY, world});
    count++;
    // console.log(count, '----------------------');
    // draw({world, minX, maxX, minY, maxY});
  }

  console.log('p2', count);
}


await solver();
await solver2();
