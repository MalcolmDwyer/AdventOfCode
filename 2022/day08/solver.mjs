import { gridReader } from '../../common.mjs';

const checkTree = (grid, r, c, w, h) => {
  const tree = grid[r][c];
  if (r == 0 || c == 0 || r == h-1 || c == w-1) {
    return true;
  }
    // up
  if (grid.map((row) => row[c]).slice(0, r).every((t) => t < tree)) {
    return true;
  }
  // down
  if (grid.map((row) => row[c]).slice(r + 1).every((t) => t < tree)) {
    return true;
  }
  // left
  if (grid[r].slice(0, c).every((t) => t < tree)) {
    return true;
  }
  if (grid[r].slice(c + 1).every((t) => t < tree)) {
    return true;
  }
  return false;
}

const checkView = (grid, r, c, w, h) => {
  const tree = grid[r][c];
  if (r == 0 || c == 0 || r == h-1 || c == w-1) {
    return 0;
  }

  const N = grid.map((row) => row[c]).slice(0, r).reverse();
  const S = grid.map((row) => row[c]).slice(r + 1);
  const W = grid[r].slice(0, c).reverse();
  const E = grid[r].slice(c + 1);

  let mul = 1;
  [N,S,W,E].forEach((trees) => {
    const blocker = trees.findIndex((t) => t >= tree);
    const view = trees.slice(
      0, 
      blocker === -1
        ? undefined
        : blocker + 1
    );
    mul = mul * view.length;
  })
  return mul;
}


const solver = async () => {
  const grid = await gridReader('input.txt');
  const w = grid[0].length;
  const h = grid.length;

  let count = 0;
  let bestView = 0;

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      // Part 1
      count += checkTree(grid, i, j, w, h) ? 1 : 0;

      // Part 2
      const view = checkView(grid, i, j, w, h);
      if (view > bestView) {
        bestView = view;
      }
    }
  }

  console.log('p1', count);
  console.log('p2', bestView);
}

await solver();
