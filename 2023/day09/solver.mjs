import { lineReader } from '../../common.mjs';

const solver = async () => {
  let lines = await lineReader('input.txt');
  let seqs = lines.map((line) => line.split(' ').map((s) => parseInt(s)));

  let total = 0;

  seqs.forEach((seq) => {
    let layers = [[...seq]];
    let d = 0;

    while (!layers[d].every((n) => n === 0)) {
      layers[d + 1] = [];
      for (let x = 0; x < layers[d].length - 1; x++) {
        layers[d + 1][x] = layers[d][x+1] - layers[d][x];
      }
      d++
    }

    layers[d].push(0);
    while (d !== 0) {
      layers[d - 1].push(layers[d-1].at(-1) + layers[d].at(-1));
      d--;
    }
    total += layers[0].at(-1);
  });

  console.log('p1', total);
}

const solver2 = async () => {
  let lines = await lineReader('input.txt');
  let seqs = lines.map((line) => line.split(' ').map((s) => parseInt(s)));

  let total = 0;

  seqs.forEach((seq) => {
    let layers = [[...seq]];
    let d = 0;

    while (!layers[d].every((n) => n === 0)) {
      layers[d + 1] = [];
      for (let x = 0; x < layers[d].length - 1; x++) {
        layers[d + 1][x] = layers[d][x+1] - layers[d][x];
      }
      d++
    }

    layers[d].push(0);
    while (d !== 0) {
      layers[d - 1].unshift(layers[d-1].at(0) - layers[d].at(0));
      d--;
    }
    total += layers[0].at(0);
  });
  console.log('p2', total);
}


await solver();
await solver2();
