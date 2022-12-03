import {gaussSum, lineReader, writeFile, jsonReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);

const readReport = (lines) => {
  const scanners = {};
  let current = null;
  lines.forEach((line) => {
    if (line.slice(0, 3) === '---') {
      let s = parseInt(line.split(' ')[2]);
      scanners[s] = {
        s,
        x: null,
        y: null,
        beacons: [],
        adjustedBeacons: [],
        beaconsSortedBy: {},
        links: {},
      };
      current = s;
    }
    else {
      const [x, y, z] = line.split(',').map((t) => parseInt(t));
      scanners[current].beacons.push({
        x,
        nx: -x,
        y,
        ny: -y,
        z,
        nz: -z,
        s: current,
        origS: current,
      });
    }
  });
  return scanners;
};

const prepScanners = (scanners) => {
  // console.group('prepScanners');
  Object.values(scanners).forEach((scanner) => {
    // console.group(`scanner ${scanner.s}`);
    ['x', 'y', 'z'].forEach((dim) => {
      // console.group(`DIM ${dim}`);
      scanner.beaconsSortedBy[dim] = [...scanner.beacons]
        .sort((a, b) => (a[dim] < b[dim]) ? -1 : 1);
      scanner.beaconsSortedBy[`n${dim}`] = [...scanner.beacons]
        .sort((a, b) => (a[dim] > b[dim]) ? -1 : 1);
      
      // console.log('sortedBy ', dim, ':', scanner.beaconsSortedBy[dim].map((t) => `${t[dim]}`.padStart(5, ' ')).join(', '));
      // console.log('sortedBy', `n${dim}`, ':', scanner.beaconsSortedBy[`n${dim}`].map((t) => `${t[dim]}`.padStart(5, ' ')).join(', '));
    })
    
    // console.groupEnd();
  });
  // console.groupEnd();
};

const overlap = 11;

const alignScanners = (scanners) => {
  const scannerKeys = Object.keys(scanners);

  for (let key1 of scannerKeys) {
    for (let key2 of scannerKeys) {
      if (parseInt(key1) >= parseInt(key2)) {
        continue;
      }
      console.group('Scanners: ', key1, key2);
      ['x', 'y', 'z' /*, 'nx', 'ny', 'nz' */].forEach((dim1) => {
        ['x', 'y', 'z', 'nx', 'ny', 'nz'].forEach((dim2) => {
          const d1 = scanners[key1].beaconsSortedBy[dim1];
          const d2 = scanners[key2].beaconsSortedBy[dim2]
          // console.log(`Comparing ${key1}:${dim1} with ${key2}:${dim2}`);
          // console.log(d1.map((t) => `${t[dim1]}`.padStart(5, ' ')).join(', '));
          // console.log(d2.map((t) => `${t[dim2]}`.padStart(5, ' ')).join(', '));

          // const minMin = Math.min(d1[0][dim1], d1[d1.length - 1][dim1], d2[0][dim2], d2[d2.length-1][dim2]);
          // const maxMax = Math.max(d1[0][dim1], d1[d1.length - 1][dim1], d2[0][dim2], d2[d2.length-1][dim2]);
          // const maxR = maxMax - minMin;

          const minOffset = d1[0][dim1] - d2[d2.length - overlap][dim2];
          const maxOffset = d1[d1.length - overlap][dim1] - d2[0][dim2];
          // const minOffset = -3000;
          // const maxOffset = 3000;
          // console.log('offsets: ', minOffset, maxOffset);
          // console.log('minmin', minMin, 'maxMax', maxMax, 'maxR', maxR);
          
          for (let o = minOffset; o <= maxOffset; o++) {
            let matchCount = 0;
            for (let i = 0; i < d1.length; i++) {
              for (let j = 0; j < d2.length; j++) {
                if (d1[i][dim1] === d2[j][dim2] + o) {
                  matchCount++;
                }
              }  
            }
            if (matchCount >= 12) {
              console.log(matchCount, 'MATCHES at', key1, dim1, ' and ', key2, dim2, o);
              if (!scanners[key1].links[key2]) {
                scanners[key1].links[key2] = {};
              }
              scanners[key1].links[key2][dim1] = {
                // from: dim1,
                to: dim2,
                // scanner: key2,
                offset: o,
              };

              // Set up reverse link
              if (!scanners[key2].links[key1]) {
                scanners[key2].links[key1] = {}  
              }
              if (dim2.startsWith('n')) {
                scanners[key2].links[key1][dim2.slice(1)] = {
                  to: `n${dim1}`,
                  offset: o,
                };
              }
              else {
                scanners[key2].links[key1][dim2] = {
                  to: dim1,
                  offset: -o,
                };
              }
            }
          }
          
          // ex: 6
          // min
          //                                  1  2  3  4  5  6 7 8 9...
          // 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
          // max
          // 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
          //                                  1  2  3  4  5  6
        });
      });

      console.groupEnd();
    }
  }
};

const fileRoot = 'test';

const solver = async () => {
  let lines = await lineReader(`${fileRoot}.txt`);
  const scanners = readReport(lines);


  
  prepScanners(scanners);
  alignScanners(scanners);

  await writeFile(`./${fileRoot}_data.json`, JSON.stringify(scanners, null, '  '));

  Object.values(scanners).forEach((scanner) => {
    console.log(scanner.s, '  ___________________');
    console.log(scanner.links);
  });


  console.log('p1');
}

const solverNext = async () => {
  console.log('solverNext');
  const scanners = await jsonReader(`./${fileRoot}_data.json`);

  const beacons = new Set();

  const linkDepths = [{s: 0, d: 0}];
  const check = [0];
  scanners[0].x = 0;
  scanners[0].y = 0;
  scanners[0].z = 0;
  while (check.length) {
    let s = check.pop();
    Object.entries(scanners[s].links).forEach(([key, linkSet]) => {
      console.log('Scanner', s, ' --> ', key);
      console.table(linkSet);
      if (linkDepths[key] === undefined) {
        let d = linkDepths[s].d + 1
        check.push(key);
        linkDepths[key] = {s: parseInt(key), d};

        // Find scanner locations:
        ['x', 'y', 'z'].forEach((dir) => {
          if (linkSet[dir].to[0] === 'n') {
            scanners[key][linkSet[dir].to[1]] = scanners[s][dir] - linkSet[dir].offset;
          }
          else {
            scanners[key][linkSet[dir].to[0]] = scanners[s][dir] + linkSet[dir].offset;
          }
        });
      }
    })
  }
  // console.log('linkDepths');
  // console.log(linkDepths);
  const scannersSortedByDepth = linkDepths.sort((a,b) => a.d < b.d ? 1 : -1).map(({s}) => s);

  scannersSortedByDepth.forEach((ss, ix) => {
    const scanner = scanners[ss];
    // scanner.adjustedBeacons = [...scanner.beacons];
    // console.log('-----------------------------------------------');
    // console.log('SCANNER', scanner.s, `ix: [${ix}]`);

    // if (ix !== 1) {
    //   console.log('SKIPPING', ix);
    //   return; // TEMP!!!!
    // }
    // console.log(scanner.s, '  ___________________');
    Object.entries(scanner.links).forEach(([key, linkSet]) => {
      // console.log('key', key, Object.keys(linkSet));
      // console.table(linkSet);
      scanners[key].beacons.forEach((b, bix) => {
        const x = b[linkSet.x.to] + linkSet.x.offset;
        const y = b[linkSet.y.to] + linkSet.y.offset;
        const z = b[linkSet.z.to] + linkSet.z.offset;
        if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
          console.log('NAN', `${key}[${bix}]`, linkSet.x.to, linkSet.y.to, linkSet.z.to, b[linkSet.x.to], b[linkSet.y.to], b[linkSet.z.to], linkSet.x.offset, linkSet.y.offset, linkSet.z.offset);
          console.log(b);
        }
        // console.log(`Adjusting ${key}[${bix}] (${b.x}, ${b.y}, ${b.z}) => (${x}, ${y}, ${z})`);
        scanners[scanner.s].beacons.push({x, y, z, nx: -x, ny: -y, nz: -z, s: parseInt(key), origS: b.origS});
        // scanners[key].adjustedBeacons.push({x, y, z });
        // scanner.beacons.forEach((b) => beacons.add(`${x}, ${y}, ${z}`));
      });
    });

    if (ss === 0) {
      scanner.beacons.forEach((b) => beacons.add(`[${b.origS}] ${b.x}, ${b.y}, ${b.z}`));
    }
    
    // console.log(scanner.links);
  });

  console.log('BEACONS:');
  console.table(beacons.size);
  console.table(beacons);

  console.log('part 2...');

  // const scannersSortedByDepth2 = linkDepths.sort((a,b) => a.d < b.d ? -1 : 1).map(({s}) => s);
  // console.log(scannersSortedByDepth2);
  console.table(scanners, ['x', 'y', 'z']);


  // [0, 1, 2, 3, 4].forEach((k) => {
  //   console.log(`S${k} Beacons`);
  //   console.table(scanners[k].beacons, ['x', 'y', 'z', 's']);
  // });
}

const solver2 = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p2');
}


// await solver();
await solverNext();
// await solver2();
