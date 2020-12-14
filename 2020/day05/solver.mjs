import { lineReader, gridReader } from '../../common.mjs';

const parseLine = (line) => {
  return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
};

const getSeatId = (line) => {
  const r = line.split('').slice(0,7).map((c) => c === 'F' ? 0 : 1).join('');
  const c = line.split('').slice(7).map((c) => c === 'L' ? 0 : 1).join('');
  const n = parseInt(`${r}${c}`, 2);
  return n;
}

const solver = async () => {
  let lines = await lineReader('input.txt');
     let max = 0;
  
  const all = lines.map((line) => {
    let n = getSeatId(line);
    console.log(line, n);
    if (n > max) {
      max = n
    }
    return n;
  })
  console.log('max', max);

  const sorted = all.sort((a, b) => a < b ? -1 : 1);

  for (let i = 0; i < sorted.length; i++) {
    if (i && (sorted[i] !== sorted[i-1] + 1)) {
      console.log('gap', sorted[i-1], sorted[i]);
    }
  }

}


solver();

