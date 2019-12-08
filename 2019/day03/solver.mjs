import { lineReader } from '../../common.mjs';

const segment = str => ({
  d: str[0],
  n: parseInt(str.slice(1)),
});

const pathBuilder = line => {
  // console.log('pb line:', line);
  const parts = line.split(',');
  // console.log('parts', parts);
  let x = 0;
  let y = 0;
  let paths = {
    v: {},
    h: {}
  };
  for (let p = 0; p < parts.length; p++) {
    const {d, n} = segment(parts[p]);

    // console.log(`d: ${d} n: ${n}`)
    if (d === 'U' || d === 'D') {
      if (!paths.v[x]) {
        paths.v[x] = []
      }
      const newN = (d === 'U')
        ? y - n
        : y + n;
      // paths.v[x].push({
      //   a: y,
      //   b: newN
      // })
      paths.v[x].push([y, newN].sort((a, b) => a < b))
      y = newN;
    }
    else {
      if (!paths.h[y]) {
        paths.h[y] = []
      }
      const newN = (d === 'L')
        ? x - n
        : x + n
      // paths.h[y].push({
      //   a: x,
      //   b: newN
      // })
      paths.h[y].push([x, newN].sort())
      x = newN;
    }
  }

  return paths;
}

const intersections = (paths1, paths2) => {
  const ints = [];

  let p1ys = Object.keys(paths1.h).map(m => parseInt(m)); // y's for horzs
  let p1xs = Object.keys(paths1.v).map(m => parseInt(m)); // x's for verts
  let p2ys = Object.keys(paths2.h).map(m => parseInt(m));
  let p2xs = Object.keys(paths2.v).map(m => parseInt(m));
  // console.log('x y x y', p1xs, p1ys, p2xs, p2ys);

  p1xs.forEach(x => {
    // console.log('-----', x);
    // console.log(paths1.v[x]);

    paths1.v[x].forEach(p => {
      p2ys.forEach(y => {
        // console.log('   y', y, paths2.h[y]);
        if (y > p[0] && y < p[1]) {
          paths2.h[y].forEach(p2 => {
            // console.log('          p2 ', y, p2);
            if (x > p2[0] && x < p2[1]) {
              ints.push([x, y]);
            }
          })
        }
      })
    })
  })

  p2xs.forEach(x => {
    // console.log('-----', x);
    // console.log(paths2.v[x]);

    paths2.v[x].forEach(p => {
      p1ys.forEach(y => {
        // console.log('   y', y, paths1.h[y]);
        if (y > p[0] && y < p[1]) {
          paths1.h[y].forEach(p2 => {
            // console.log('          p2 ', y, p2);
            if (x > p2[0] && x < p2[1]) {
              ints.push([x, y]);
            }
          })
        }
      })
    })
  })
  // console.log('x y x y', p1xs, p1ys, p2xs, p2ys);

  // console.log('ints');
  // console.log(ints);
  return ints;
}

let minmax = (paths1, paths2, key, min = Infinity, max = -Infinity) => {
  Object.keys(paths[key]).map(x => parseInt(x)).forEach(x => {
    if (x < min) {
      min = x;
    }
    if (x > max) {
      max = x;
    }
  });
  return [min, max];
}

async function solver() {
  const lines = await lineReader('./input.txt');
  // const lines = await lineReader('./test1.txt');
  // console.log('lines', lines[0]);

  let paths1 = pathBuilder(lines[0]);
  let paths2 = pathBuilder(lines[1]);

  // console.log('p1', paths1);
  // console.log('p2', paths2);


  let ix = intersections(paths1, paths2);

  let least = Infinity;

  ix.forEach(int => {
    // console.log('-----', int)
    let d = Math.abs(int[0]) + Math.abs(int[1]);
    if (d < least) {
      least = d;
    }
  })

  console.log('result1:', least);


  /// PART 2:

  let grid = [];

  // let x = 0;
  // let y = 0;
  let length = 1;

  pathFollower(lines[0], (x, y) => {
    if (!grid[y]) {
      grid[y] = [];
    }
    grid[y][x] = length;
    length++;
  });

  // console.log(grid);

  let shortestCombinedLength = Infinity;

  length = 1;
  pathFollower(lines[1], (x, y) => {
    if (!grid[y]) {
      grid[y] = [];
    }

    if (grid[y][x]) {
      let combined = grid[y][x] + length;
      // console.log(`int at ${x}, ${y}  ${grid[y][x]} + ${length} => ${combined}`);
      if (combined < shortestCombinedLength) {
        shortestCombinedLength = combined;
      }
    }
    length++;
  })

  console.log('shortestCombinedLength:', shortestCombinedLength);

}

solver();


const pathFollower = (path, cellFn) => {
  let x = 0;
  let y = 0;
  path.split(',').forEach(s => {
    let {d, n} = segment(s);
    while(n--) {
      if (d === 'U') {
        y--;
      }
      else if (d === 'D') {
        y++;
      }
      else if (d === 'L') {
        x--;
      }
      else if (d === 'R') {
        x++;
      }
      cellFn(x, y);
    }
 })
}