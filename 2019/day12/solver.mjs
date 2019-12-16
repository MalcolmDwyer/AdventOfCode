import { lineReader } from '../../common.mjs';
// import { lcm } from 'mathjs';
import math from 'mathjs';

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';

  let lines = await lineReader(file);
  let data = lines.map(n => parseLine(n));

  // Part 1 / 2
  run(data);
}

solver();

const parseLine = line => {
  let rx = /=([0-9-]+)/g;
  let x = parseInt(rx.exec(line)[1]);
  let y = parseInt(rx.exec(line)[1]);
  let z = parseInt(rx.exec(line)[1]);

  // console.log(`xyz ${x} ${y} ${z}`)
  return {
    x, y, z,
    vx: 0, vy: 0, vz: 0,
  };
}


const run = (data) => {
  console.log('run')
  console.log(data);

  let fingerPrints = {
    x: {},
    y: {},
    z: {},
  };

  let repeats = {
    x: false,
    y: false,
    z: false,
  }

  let t = 0;
  // for (let t = 0; t < 1000; t++) {
  while ((!repeats.x || !repeats.y || !repeats.z)) {
    

    for (let i1 = 0; i1 < 4; i1++) {
      for (let i2 = 0; i2 < 4; i2++) {
        if (i1 > i2) {
          let m1 = data[i1];
          let m2 = data[i2];
          ['x', 'y', 'z'].forEach(axis => {
            if (m1[axis] > m2[axis]) {
              m1[`v${axis}`] += -1;
              m2[`v${axis}`] += 1;
            }
            else if (m1[axis] < m2[axis]) {
              m1[`v${axis}`] += 1;
              m2[`v${axis}`] += -1;
            }
          });
        }
      }
    }

    for (let i1 = 0; i1 < 4; i1++) {
      let m1 = data[i1];
      ['x', 'y', 'z'].forEach(axis => {
        m1[axis] += m1[`v${axis}`];
      });
    }

    let energy = 0;
    for (let i1 = 0; i1 < 4; i1++) {
      let m1 = data[i1];
      let p = 0;
      let k = 0;
      ['x', 'y', 'z'].forEach(axis => {
        p += Math.abs(m1[axis]) 
        k += Math.abs(m1[`v${axis}`]);
      });
      energy += p*k;
    }

    ['x', 'y', 'z'].filter(axis => !repeats[axis]).forEach(axis => {
      let key = [0, 1, 2, 3].map(n => `${data[n][axis]}_${data[n][`v${axis}`]}`).join('_');
      // console.log('key', key);
      if (fingerPrints[axis][key]) {
        repeats[axis] = t;
        console.log(`${axis} repeats at ${t}`);
      }
      fingerPrints[axis][key] = true;
    })

    t++;

    if (t === 1000) {
      console.log('part 1 energy', energy);
    }
    
  }

  const repeat = math.lcm(repeats.x, repeats.y, repeats.z);
  console.log('part2:', repeat);

}
