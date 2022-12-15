import { lineReader } from '../../common.mjs';

const parseLine = (line) => {
  const parts = /Sensor at x=(-?\d*), y=(-?\d*): closest beacon is at x=(-?\d*), y=(-?\d*)/.exec(line);
  const sx = parseInt(parts[1]);
  const sy = parseInt(parts[2]);
  const bx = parseInt(parts[3]);
  const by = parseInt(parts[4]);
  return ([{
    x: sx,
    y: sy,
  }, {
    x: bx,
    y: by,
  },
  ((Math.abs(sx - bx) + Math.abs(sy - by))),
]);
};


const solver = async (file, checkRow) => {
  let sensorBeacons = await lineReader(file, parseLine);
  let clean = new Set([]);

  sensorBeacons.forEach(([sensor, _, md]) => {
    const rowDiff = Math.abs(checkRow - sensor.y);
    if (rowDiff < md) {
      const colDiff = Math.abs(md - rowDiff);
      for(let x = sensor.x - colDiff; x <= sensor.x + colDiff; x++) {
        clean.add(x);
      }
    }
  });

  sensorBeacons.forEach(([_, beacon]) => {
    if (beacon.y === checkRow) {
      clean.delete(beacon.x);
    }
  })

  console.log('p1', clean.size);
}



const solver2 = async (file, checkRange) => {
  let sensorBeacons = await lineReader(file, parseLine);
  const boundaries = new Set([]);
  sensorBeacons.forEach(([sensor, _, md]) => {
    // NE
    for (let x = sensor.x, y = sensor.y - md - 1; x < sensor.x + md + 1; x++, y++) {
      if (x < 0 || x > checkRange || y < 0 || y > checkRange) {
        continue;
      }
      if (!sensorBeacons.some(([s2, _, md2]) => (
        Math.abs(s2.x - x) + Math.abs(s2.y - y) <= md2
      ))) {
        console.log('p2', x * 4000000 + y);
      }
    }
    // SE, SW, NW ? ... no need apparently
  });
};

await solver('input.txt', 2000000);
await solver2('input.txt', 4000000);
