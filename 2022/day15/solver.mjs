import { lineReader, gridsMinMaxFromCoords, prepGrid, printGrid2 } from '../../common.mjs';

const parseLine = (line) => {
  const parts = /Sensor at x=(-?\d*), y=(-?\d*): closest beacon is at x=(-?\d*), y=(-?\d*)/.exec(line);
  return ([{
    x: parseInt(parts[1]),
    y: parseInt(parts[2]),
  }, {
    x: parseInt(parts[3]),
    y: parseInt(parts[4]),
  }]);
};


const solver = async (file, checkRow) => {
  let sensorBeacons = await lineReader(file, parseLine);
  let clean = new Set([]);

  sensorBeacons.forEach(([sensor, beacon]) => {
    // console.group(sensor, beacon);
    const dx = Math.abs(sensor.x - beacon.x);
    const dy = Math.abs(sensor.y - beacon.y);
    const md = dx + dy;
    // console.log(dx, dy, ' => ', md);

    const rowDiff = Math.abs(checkRow - sensor.y);
    // console.log('rowDiff', rowDiff);
    if (rowDiff < md) {
      const colDiff = Math.abs(md - rowDiff);
      for(let x = sensor.x - colDiff; x <= sensor.x + colDiff; x++) {
        // console.log('  ', x);
        clean.add(x);
      }
    }
    // console.groupEnd();
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

  for (let y = 0; y <= checkRange; y++) {
    if (!(y % 10)) { console.log(y);}
    const checkRow = y;
    let clean = new Set([]);

    sensorBeacons.forEach(([sensor, beacon]) => {
      // console.group(sensor, beacon);
      const dx = Math.abs(sensor.x - beacon.x);
      const dy = Math.abs(sensor.y - beacon.y);
      const md = dx + dy;
      // console.log(dx, dy, ' => ', md);
  
      const rowDiff = Math.abs(checkRow - sensor.y);
      // console.log('rowDiff', rowDiff);
      if (rowDiff < md) {
        const colDiff = Math.abs(md - rowDiff);
        let minX = Math.max(0, sensor.x - colDiff);
        let maxX = Math.min(checkRange, sensor.x + colDiff);
        for (let x = minX; x <= maxX; x++) {
          // console.log('  ', x);
          clean.add(x);
        }
      }
      // console.groupEnd();
      
    });
    // console.log(checkRow, 'clean:', clean.size);
    if (clean.size === checkRange) { // only one that is not checkRange+1
      console.log('y:', checkRow);

      for (let x = 0; x <= checkRange; x++) {
        if (!clean.has(x)) {
          console.log('x', x);
          const freq = (x * 4000000) + checkRow;
          console.log('p2', freq);
          break;
        }
      }

      break;
    }
  }

  console.log('p2');
}


// await solver('test.txt', 10);
// await solver('input.txt', 2000000);
// await solver2('test.txt', 20);
await solver2('input.txt', 4000000);
