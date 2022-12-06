import { lineReader } from '../../common.mjs';

const parseLine = line => parseInt(line);


const solver = async () => {
  let lines = await lineReader('input.txt');
  const inp = lines[0].split('');
  let start;

  for (let i = 3; i < inp.length; i++) {
    if (
      inp[i] !== inp[i-1]
      && inp[i] !== inp[i-2]
      && inp[i] !== inp[i-3]
      && inp[i-1] !== inp[i-2]
      && inp[i-1] !== inp[i-3]
      && inp[i-2] !== inp[i-3]
    ) {
      start = i + 1;
      break;
    }
  }

  console.log('p1', start + 1);
}

const solver2 = async () => {
  let lines = await lineReader('input.txt');
  const inp = lines[0].split('');
  let start;

  let n = 14;

  for (let i = n; i < inp.length && !start; i++) {
    let hash = {};
    let clean = true;
    inp.slice(i - n, i).forEach((c, ix) => {
      if (!clean) return;
      if (hash[c]) {
        clean = false;
      }
      else {
        hash[c] = 1;
      }
    });
    if (clean) {
      start = i;
    }
    hash = {};
  }

  console.log('p2', start);
}


await solver();
await solver2();
