import { gridReader2 } from '../../common.mjs';

const gridParser = (v, {x, y}) => {
  let height;
  let cost = Infinity;
  let start = false;
  let end = false;
  if (v === 'S') {
    height = 0;
    cost = 0;
    start = true;
  }
  else if (v === 'E') {
    height = 25;
    end = true;
  }
  else {
    height = v.charCodeAt(0) - 97;
  }
  return ({
    height,
    x,
    y,
    cost,
    start,
    end,
  })
};


const getNeighbors = ({x, y}, maxX, maxY) => {
  let n = [];
  if (y > 0) {
    n.push({x, y: y-1});
  }
  if (x > 0) {
    n.push({x: x-1, y});
  }
  if (x < maxX)  {
    n.push({x: x + 1, y});
  }
  if (y  < maxY) {
    n.push({x, y: y+1});
  }

  return n;
};


const solver = async () => {
  let sx, sy;
  let gx, gy;
  let grid = await gridReader2('input.txt', gridParser);

  let queue = [];
  let maxX = grid[0].length - 1;
  let maxY = grid.length - 1;

  grid.forEach((line, i) => line.forEach((cell, j) => {
    if (cell.start) {
      sx = j;
      sy = i;
    }
    else if (cell.end) {
      gx = j;
      gy = i;
    }
  }));

  queue.push(grid[sy][sx]);
  
  while (queue.length) {
    let {x, y, cost, height} = queue.shift();
    const neighbors = getNeighbors({x, y}, maxX, maxY);
    neighbors.forEach((nc) => {
      const n = grid[nc.y][nc.x];
      if ((n.height <= height + 1) && (n.cost > cost + 1)) {
        grid[n.y][n.x].cost = cost + 1;
        queue.push(grid[n.y][n.x]);
      }
    })
  }

  console.log('p1', grid[gy][gx].cost);
}

const resetGrid = (grid) => {
  grid.forEach((line) => line.forEach((cell) => {
    cell.cost = Infinity;
  }));
};

const solver2 = async () => {
  let gx, gy;
  let grid = await gridReader2('input.txt', gridParser);

  let queue = [];
  let maxX = grid[0].length - 1;
  let maxY = grid.length - 1;

  let starts = [];
  let bestCost = Infinity;

  grid.forEach((line, i) => line.forEach((cell, j) => {
    if (cell.height === 0) {
      starts.push({x: cell.x, y: cell.y});
    }
    else if (cell.end) {
      gx = j;
      gy = i;
    }
  }));

  for (let s = 0; s < starts.length; s++) {
    let S = grid[starts[s].y][starts[s].x];
    S.cost = 0;
    queue.push(S);
  
    while (queue.length) {
      let {x, y, cost, height} = queue.shift();
      const neighbors = getNeighbors({x, y}, maxX, maxY);
      neighbors.forEach((nc) => {
        const n = grid[nc.y][nc.x];
        if ((n.height <= height + 1) && (n.cost > cost + 1)) {
          grid[n.y][n.x].cost = cost + 1;
          queue.push(grid[n.y][n.x]);
        }
      })
    }

    if (grid[gy][gx].cost < bestCost) {
      bestCost = grid[gy][gx].cost;
    }

    resetGrid(grid);
  }
  console.log('p2', bestCost);
}


await solver();
await solver2();
