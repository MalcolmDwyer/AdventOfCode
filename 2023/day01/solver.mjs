import { lineReader } from '../../common.mjs';

const parseLine = line => line.split('').filter(c => !Number.isNaN(parseInt(c)));


const solver = async () => {
  let lines = await lineReader('input.txt', parseLine);

  let sum = 0;

  lines.forEach((nums) => {
    sum += parseInt(`${nums.at(0)}${nums.at(-1)}`);
  })
  console.log('p1', sum);
}

const solver2 = async () => {
  let words = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ]
  let lines = await lineReader('input.txt');

  let sum = 0;

  lines.forEach((line) => {
    let digits = [];
    let i = 0;
    while(line[i]) {
      console.log('');
      console.log(i, line.slice(i))
      const n = parseInt(line[i]);
      if (!isNaN(n)) {
        digits.push(n);
        console.log('  digit ', n);
        i++;
        continue;
      }
      else {
        let ix = 0;
        let wn = null;
        for (let word of words) {
          console.log('  test', word);
          if (line.slice(i, i + word.length) === word) {
            // i += word.length;
            console.log('  word', word);
            wn = word;
            break;
          }
          ix++
        }
        if (wn) {
          digits.push(words.indexOf(wn) + 1);
          console.log(`     wn:${wn} ind: ${words.indexOf(wn)}     digits -> ${digits}`);
        }
        i++;
        continue;
      }
    }

    sum += parseInt(`${digits.at(0)}${digits.at(-1)}`);
  });

  console.log('p2', sum);
}


await solver();
await solver2();
