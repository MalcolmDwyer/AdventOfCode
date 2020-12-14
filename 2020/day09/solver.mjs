import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };


const solver = async () => {
  let lines = await lineReader('input.txt');
  let data = lines.map(line => parseInt(line));

  // console.log('d', data.length);
  // console.log(data);




  const preamble = 25;   //////////////////////////////////////////






  let wrong;
  let i;
  for (i = preamble; (i < data.length - preamble) && !wrong; i++) {
    // console.log('checking', data[i]);
    let found = false;
    for (let x = 0; x < preamble && !found; x++) {
      for (let y = 0; y < preamble && !found; y++) {
        if (x === y) {
          continue;
        }
        if ((data[i-preamble+x] + data[i-preamble+y]) === data[i]) {
          found = true;
          // console.log(`Found: ${data[i-preamble+x]} + ${data[i-preamble+y]} === ${data[i]}`)
        }
      }
    }
    if (!found) {
      // console.log('NOT FOUND', data[i]);
      wrong = data[i];
    }
  }

  i--;
  console.log('p1', wrong, i);

  let found = false;
  for (let x = 0; x < i && !found; x++) {
    for (let y = x + 1; y < i && !found; y++) {
      if (x === y) {
        continue;
      }
      let s = data.slice(x, y).reduce((acc, n) => acc + n, 0);
      if (s === data[i]) {
      // if ((data[i-preamble+x] + data[i-preamble+y]) === data[i]) {
        found = true;
        console.log(`2 Found: ${x}-${y} -- ${data[x]} >> ${data[y]} === ${data[i]}`)
        console.log('slice', data.slice(x, y))
        const ss = data.slice(x, y).sort();
        console.log('s slice', data.slice(x, y))
        console.log('p2:', ss[0] + ss[ss.length-1]);
      }
    }
  }
  if (!found) {
    // console.log('NOT FOUND', data[i]);
    wrong = data[i];
  }
}


solver();

