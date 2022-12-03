import { lineReader, minMax } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => {
  // on x=10..12,y=10..12,z=10..12

  const [p, coords] = line.split(' ');
  const rangeStrings = coords.split(',');
  let bounds = {};
  rangeStrings.forEach((rs) => {
    const [axis, vs] = rs.split('=');
    const values = vs.split('..').map((v) => parseInt(v));
    bounds[`${axis}Min`] = values[0];
    bounds[`${axis}Max`] = values[1];
  });
  return ({
    p: (p === 'on' ? true : false),
    ...bounds,
  });
};


const solver = async () => {
  let ranges = await lineReader('input.txt', parseLine);


  const { min: minX, max: maxX } = minMax(ranges, (d) => [d.xMin, d.xMax]);
  const { min: minY, max: maxY } = minMax(ranges, (d) => [d.yMin, d.yMax]);
  const { min: minZ, max: maxZ } = minMax(ranges, (d) => [d.zMin, d.zMax]);

  const cubeBounds = { minX, maxX, minY, maxY, minZ, maxZ };

  const cells = new Set();

  ranges.forEach((range, ix, all) => {
    console.log(`${ix}/${all.length - 1}`)
    for (let x = range.xMin; x <= range.xMax; x++) {
      if (range.xMin < -50 || range.xMax > 50) {
        return;
      }
      for (let y = range.yMin; y <= range.yMax; y++) {
        if (range.yMin < -50 || range.yMax > 50) {
          return;
        }
        for (let z = range.zMin; z <= range.zMax; z++) {
          if (range.zMin < -50 || range.zMax > 50) {
            return;
          }
          if (range.p) {
            // console.log('Adding', `${x}_${y}_${z}`);
            cells.add(`${x}_${y}_${z}`);
          }
          else {
            // console.log('Removing', `${x}_${y}_${z}`);
            cells.delete(`${x}_${y}_${z}`);
          }
        }
      } 
    }
  });

  // console.log(cells);

  // console.log(ranges);

  // console.log(cubeBounds);
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p1', cells.size);
}

const solver2 = async () => {
  let ranges = await lineReader('test2.txt', parseLine);


  const { min: minX, max: maxX } = minMax(ranges, (d) => [d.xMin, d.xMax]);
  const { min: minY, max: maxY } = minMax(ranges, (d) => [d.yMin, d.yMax]);
  const { min: minZ, max: maxZ } = minMax(ranges, (d) => [d.zMin, d.zMax]);

  const cubeBounds = { minX, maxX, minY, maxY, minZ, maxZ };

  let count = 0;

  ranges.forEach((range) => {
    if (range.p) {
      count += (range.xMax - range.xMin + 1)
        * (range.yMax - range.yMin + 1)
        * (range.zMax - range.zMin + 1);
    }
    else {
      count -= (range.xMax - range.xMin + 1)
        * (range.yMax - range.yMin + 1)
        * (range.zMax - range.zMin + 1);
    }
  });

  console.log('p2', count);
}


// await solver();
await solver2();

/*

for (let i = 0; i < X; i++) {

}

for (let i = 0; i < X; i++) {
  for (let j = 0; j < Y; j++) {
  
  }
}


*/