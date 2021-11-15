import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };


const solver = async () => {
  let grid = await gridReader('input.txt');
  // let lines = await lineReader('input.txt');

  // console.log(grid);
  let active = [];
  grid.forEach((row, y) => row.forEach((c, x) => {
    if (c === '#') {
      active.push({x, y, z: 0})
    }
  }));

  console.log(active);


  for (let t = 0; t < 6; t++) {
    console.log('-----------------------------', active.length);
    let ac = [...active];
    console.log(ac);

    active = [];

    let xMin = Infinity;
    let yMin = Infinity;
    let zMin = Infinity;
    let xMax = -Infinity;
    let yMax = -Infinity;
    let zMax = -Infinity;

    ac.forEach((c) => {
      xMin = Math.min(xMin, c.x);
      xMax = Math.max(xMax, c.x);
      yMin = Math.min(yMin, c.y);
      yMax = Math.max(yMax, c.y);
      zMin = Math.min(zMin, c.z);
      zMax = Math.max(zMax, c.z);
    });

    console.log(xMin, xMax, yMin, yMax, zMin, zMax);

    for (let z = zMin - 1; z <= zMax + 1; z++) {
      for (let y = yMin - 1; y <= yMax + 1; y++) {
        for (let x = xMin - 1; x <= xMax + 1; x++) {
          const self = ac.find((c) => (c.x === x) && (c.y === y) && (c.z === z)) ? 1 : 0;
          // console.group(`Neighbor check ${x} ${y} ${z}`);
          let neighbors = ac.filter((c) => {
            let xd = (Math.abs(c.x - x) <= 1) ? 1 : 0;
            let yd = (Math.abs(c.y - y) <= 1) ? 1 : 0;
            let zd = (Math.abs(c.z - z) <= 1) ? 1 : 0;
            // console.log(`ac[${c.x} ${c.y} ${c.z}] ==> xd/yd/zd  ${xd} ${yd} ${zd}   ${(xd + yd + zd == 3) ? '*' : ''}`);
            return (xd + yd + zd == 3);
          }).length - self;
          // console.groupEnd();
          // console.log(`${x},${y},${z}  self: ${!!self}   neighbors: ${neighbors}`);

          if (self && [2, 3].includes(neighbors)) {
            active.push({x, y, z});
          }
          if (!self && neighbors === 3) {
            active.push({x, y, z});
          }
        }
      }
    }

    console.log('active', active);
    console.log(xMin - 1, xMax + 1, yMin - 1, yMax + 1, zMin - 1, zMax + 1);

    for (let z = zMin - 1; z <= zMax + 1; z++) {
      console.group(`z=${z}`)
      for (let y = yMin - 1; y <= yMax + 1; y++) {
        let s = '';
        for (let x = xMin - 1; x <= xMax + 1; x++) {
          s = s.concat(
            (active.find((c) => (c.x === x) && (c.y === y) && (c.z === z)))
            ? '#'
            : '.'
          );
        }
        console.log(s);
      }
      console.groupEnd();
    }

    
  }
  console.log('p1', active.length);
}



const solver2 = async () => {
  let grid = await gridReader('input.txt');
  // let lines = await lineReader('input.txt');

  // console.log(grid);
  let active = [];
  grid.forEach((row, y) => row.forEach((c, x) => {
    if (c === '#') {
      active.push({x, y, z: 0, w:0})
    }
  }));

  console.log(active);


  for (let t = 0; t < 6; t++) {
    console.log('-----------------------------', active.length);
    let ac = [...active];
    console.log(ac);

    active = [];

    let xMin = Infinity;
    let yMin = Infinity;
    let zMin = Infinity;
    let wMin = Infinity;
    let xMax = -Infinity;
    let yMax = -Infinity;
    let zMax = -Infinity;
    let wMax = -Infinity;

    ac.forEach((c) => {
      xMin = Math.min(xMin, c.x);
      xMax = Math.max(xMax, c.x);
      yMin = Math.min(yMin, c.y);
      yMax = Math.max(yMax, c.y);
      zMin = Math.min(zMin, c.z);
      zMax = Math.max(zMax, c.z);
      wMin = Math.min(wMin, c.w);
      wMax = Math.max(wMax, c.w);
    });

    console.log(xMin, xMax, yMin, yMax, zMin, zMax, wMin, wMax);

    for (let w = wMin - 1; w <= wMax + 1; w++) {
      for (let z = zMin - 1; z <= zMax + 1; z++) {
        for (let y = yMin - 1; y <= yMax + 1; y++) {
          for (let x = xMin - 1; x <= xMax + 1; x++) {
            const self = ac.find((c) => (c.x === x) && (c.y === y) && (c.z === z) && (c.w === w)) ? 1 : 0;
            // console.group(`Neighbor check ${x} ${y} ${z}`);
            let neighbors = ac.filter((c) => {
              let xd = (Math.abs(c.x - x) <= 1) ? 1 : 0;
              let yd = (Math.abs(c.y - y) <= 1) ? 1 : 0;
              let zd = (Math.abs(c.z - z) <= 1) ? 1 : 0;
              let wd = (Math.abs(c.w - w) <= 1) ? 1 : 0;
              // console.log(`ac[${c.x} ${c.y} ${c.z}] ==> xd/yd/zd  ${xd} ${yd} ${zd}   ${(xd + yd + zd == 3) ? '*' : ''}`);
              return (xd + yd + zd + wd === 4);
            }).length - self;
            // console.groupEnd();
            // console.log(`${x},${y},${z}  self: ${!!self}   neighbors: ${neighbors}`);

            if (self && [2, 3].includes(neighbors)) {
              active.push({x, y, z, w});
            }
            if (!self && neighbors === 3) {
              active.push({x, y, z, w});
            }
          }
        }
      }
    }

    console.log('active', active);
    console.log(xMin - 1, xMax + 1, yMin - 1, yMax + 1, zMin - 1, zMax + 1);

    for (let z = zMin - 1; z <= zMax + 1; z++) {
      console.group(`z=${z}`)
      for (let y = yMin - 1; y <= yMax + 1; y++) {
        let s = '';
        for (let x = xMin - 1; x <= xMax + 1; x++) {
          s = s.concat(
            (active.find((c) => (c.x === x) && (c.y === y) && (c.z === z)))
            ? '#'
            : '.'
          );
        }
        console.log(s);
      }
      console.groupEnd();
    }

    
  }
  console.log('p2', active.length);
}


solver2();

