import { lineReader } from '../../common.mjs';

const solver = async () => {
  // let lines = await lineReader('input.txt');
  // let data = lines.map((l) => parseInt(l));
  let data = await lineReader('input.txt', v => parseInt(v))

  let done = false;
  for (let i = 0; (i < data.length && !done); i++) {
    for (let j = i+1; (j < data.length && !done); j++) {
      for (let k = j+1; (k < data.length && !done); k++) {
        // console.log(i, j, k)
        // if (i === j || i == k || j == k) {
        //   continue;
        // }
        if ((data[i] + data[j] + data[k]) === 2020) {
          console.log('s2', data[i] * data[j] * data[k]);
          // done = true;
        }
      }
    }
  }
}


solver();

