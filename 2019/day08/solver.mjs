import { lineReader } from '../../common.mjs';

async function solver() {
  const file =
    'input.txt';

  const lines = await lineReader(file);
  const image = lines[0].split('').map(n => parseInt(n));

  part12(image);
}

solver();



const part12 = (data) => {

  let x = 25;
  let y = 6;
  let s = x * y;
  let n = (data.length / x) / y;

  console.log('n', n);

  let fewestZeros = Infinity;
  let fewestZerosLayer;
  let f1;
  let f2;

  let image = [
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  for (let l = 0; l < n; l++) {
    let zeroCount = 0;
    let oneCount = 0;
    let twoCount = 0;

    for (let r = 0; r < y; r++) {
      for (let p = 0; p < x; p++) {
        if (data[(l * s) + (r*x) + p] === 0) {
          zeroCount++;

          if (!image[r][p]) {
            image[r][p] = ' '
          }
        }
        if (data[(l * s) + (r*x) + p] === 1) {
          oneCount++;

          if (!image[r][p]) {
            image[r][p] = '*'
          }
          
        }
        if (data[(l * s) + (r*x) + p] === 2) {
          twoCount++;
        }
      }
    }
    if (zeroCount < fewestZeros) {
      fewestZeros = zeroCount;
      fewestZerosLayer = l;
      f1 = oneCount;
      f2 = twoCount;
    }
  }

  console.log('part1', fewestZeros, fewestZerosLayer, f1, f2, '::::', f1 * f2);

  image.forEach(line => {
    console.log(line.join(''));
  })

}