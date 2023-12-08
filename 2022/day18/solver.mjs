import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => line.split(',').map((n) => parseInt(n));

const d = (a, b) => Math.abs(a - b);
const d3d = (a, b) => d(a[0], b[0]) + d(a[1], b[1]) + d(a[2], b[2]);
const cubeEq = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

const buf = 1;

const surfaceArea = (cubes) => {
  const edgesXY = new Map();
  const edgesXZ = new Map();
  const edgesYZ = new Map();

  cubes.forEach(([x, y, z]) => {
    edgesXY.set(`${x}_${y}_${z - 1}`, (edgesXY.get(`${x}_${y}_${z - 1}`) ?? 0) + 1);
    edgesXY.set(`${x}_${y}_${z}`, (edgesXY.get(`${x}_${y}_${z}`) ?? 0) + 1);

    edgesXZ.set(`${x}_${y - 1}_${z}`, (edgesXZ.get(`${x}_${y-1}_${z}`) ?? 0) + 1);
    edgesXZ.set(`${x}_${y}_${z}`, (edgesXZ.get(`${x}_${y}_${z}`) ?? 0) + 1);

    edgesYZ.set(`${x-1}_${y}_${z}`, (edgesYZ.get(`${x-1}_${y}_${z}`) ?? 0) + 1);
    edgesYZ.set(`${x}_${y}_${z}`, (edgesYZ.get(`${x}_${y}_${z}`) ?? 0) + 1);
  });

  const ones = Array.from(edgesXY.values()).reduce((acc, n) => acc += (n === 1) ? 1 : 0, 0)
    + Array.from(edgesXZ.values()).reduce((acc, n) => acc += (n === 1) ? 1 : 0, 0)
    + Array.from(edgesYZ.values()).reduce((acc, n) => acc += (n === 1) ? 1 : 0, 0);
  return ones;
}

const solver = async (file) => {
  let cubes = await lineReader(file, parseLine);

  // const edgesXY = new Map();
  // const edgesXZ = new Map();
  // const edgesYZ = new Map();

  // cubes.forEach(([x, y, z]) => {
  //   edgesXY.set(`${x}_${y}_${z - 1}`, (edgesXY.get(`${x}_${y}_${z - 1}`) ?? 0) + 1);
  //   edgesXY.set(`${x}_${y}_${z}`, (edgesXY.get(`${x}_${y}_${z}`) ?? 0) + 1);

  //   edgesXZ.set(`${x}_${y - 1}_${z}`, (edgesXZ.get(`${x}_${y-1}_${z}`) ?? 0) + 1);
  //   edgesXZ.set(`${x}_${y}_${z}`, (edgesXZ.get(`${x}_${y}_${z}`) ?? 0) + 1);

  //   edgesYZ.set(`${x-1}_${y}_${z}`, (edgesYZ.get(`${x-1}_${y}_${z}`) ?? 0) + 1);
  //   edgesYZ.set(`${x}_${y}_${z}`, (edgesYZ.get(`${x}_${y}_${z}`) ?? 0) + 1);
  // });

  // const ones = Array.from(edgesXY.values()).reduce((acc, n) => acc += (n === 1) ? 1 : 0, 0)
  //   + Array.from(edgesXZ.values()).reduce((acc, n) => acc += (n === 1) ? 1 : 0, 0)
  //   + Array.from(edgesYZ.values()).reduce((acc, n) => acc += (n === 1) ? 1 : 0, 0);
  const sa = surfaceArea(cubes);
  console.log('p1', sa);

  let minX = 50, maxX = -50, minY = 50, maxY = -50, minZ = 50, maxZ = -50;
  cubes.forEach(([x, y, z]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  });

  const quickCubes = cubes.map(([x, y, z]) => `${x}_${y}_${z}`);
  const voidGroups = [];
  for (let x = minX - buf; x < maxX + buf; x++) {
    for (let y = minY - buf; y < maxX + buf; y++) {
      for (let z = minZ - buf; z < maxZ + buf; z++) {
        if (!quickCubes.some((c) => c === `${x}_${y}_${z}`)) {
          voidGroups.push([[x, y, z]]);
        }
      }
    }
  }

  console.log('voids', voidGroups);

  let n = 0;
  let done = false;
  while (!done) {
    let found = false;
    done = true;
    for (let g1 = 0; g1 < voidGroups.length; g1++) {
      // const checkGroups = voidGroups.slice(g1);

      for (let g2 = g1 + 1; g2 < voidGroups.length; g2++) {
      // while (checkGroups.length) {
        // const vg2 = checkGroups.shift();
        // console.log('Comparing G1/G2', g1, g2);
        let matchedGroups = false;
        for (let v = 0; !matchedGroups && v < voidGroups[g1].length; v++) {
          for (let v2 = 0; !matchedGroups && v2 < voidGroups[g2].length; v2++) {
            let vg1 = voidGroups[g1][v];
            let vg2 = voidGroups[g2][v2]
            if (d3d(vg1, vg2) === 1) {
              // neighbors
              // console.log('neighbors', vg1, vg2);
              matchedGroups = true;
              done = false;
            }
          }
        }
        if (matchedGroups) {
          voidGroups[g1] = [...voidGroups[g1], ...voidGroups[g2]];
          voidGroups.splice(g2, 1);
          g2--;
        }
      }
    }
    if (!found) {
      break;
    }

    

    n++;
  }
  console.log('after grouping');
  console.log(voidGroups);

  const outerSA1 = surfaceArea([...cubes, ...voidGroups.slice(1).flat()]);

  let everythingButOuterVoid = [];
  for (let x = minX - buf; x < maxX + buf; x++) {
    for (let y = minY - buf; y < maxX + buf; y++) {
      for (let z = minZ - buf; z < maxZ + buf; z++) {
        if (!voidGroups[0].some((c) => cubeEq(c, [x, y, z]))) {
          everythingButOuterVoid.push([[x, y, z]]);
        }
      }
    }
  }

  console.log(minX, maxX, minY, maxY, minZ, maxZ)

  console.log(everythingButOuterVoid);
  const outerSA2 = surfaceArea(everythingButOuterVoid);

  console.log('p2', outerSA1, outerSA2);
}

await solver('input.txt');

// > 2318

// < 21925