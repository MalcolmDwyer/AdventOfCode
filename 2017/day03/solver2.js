// import thing from './solver'
let distance = require('./solver.js')



let solver = (n) => {
  console.log('solver2 n', n, typeof n)




  let index = 2;
  let val = 1;
  let grid = [[1]];
  let x = 0;
  let y = 0;
  let dirX = 0;
  let dirY = -1;
  console.log(`[${x},${y}]: ${val}`);
  x = 1;
  let latest = 1;
  while(val <= n) {

    if (!grid[x]) {
      grid[x] = [];
    }
    if (!grid[x+1]) {
      grid[x+1] = [];
    }
    if (!grid[x-1]) {
      grid[x-1] = [];
    }

    val = (
      (grid[x-1][y-1] || 0) +
      (grid[x-1][y] || 0) +
      (grid[x-1][y+1] || 0) +
      (grid[x][y-1] || 0) +
      (grid[x][y+1] || 0) +
      (grid[x+1][y-1] || 0) +
      (grid[x+1][y] || 0) +
      (grid[x+1][y+1] || 0)
    )
    console.log(`[${x},${y}]: ${val}`);
    grid[x][y] = val;
    latest = val;


    let {
      sideNum,
      positionOnSide,
      maxSide
    } = distance(index);
    // console.log('coord info', sideNum, positionOnSide, maxSide)
    if (positionOnSide == maxSide) {
      if (sideNum == 0) { // up the right side, turn left
        dirX = -1;
        dirY = 0;
      }
      else if (sideNum == 1) { // left across top, turn down
        dirY = 1;
        dirX = 0;
      }
      else if (sideNum == 2) { // down left side, turn right
        dirY = 0;
        dirX = 1;
      }
    }
    else if (positionOnSide == 0 && sideNum == 0) {
      dirY = -1;
      dirX = 0;
    }


    x += dirX;
    y += dirY;
    index++;
    val++;
  }

  // console.log(grid)

  console.log('latest: ', latest)
}

// 1 3  5   7   9   11
// 1 9  25  49  81  121
//  8 16  24  32  40
//

solver(parseInt(process.argv[2]))
