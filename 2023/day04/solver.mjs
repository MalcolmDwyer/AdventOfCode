import { lineReader, gridReader } from '../../common.mjs';

const parseLine = (line) => {
  const parts = /Card *(\d*): (.*)/.exec(line);  
  const [win, have] = parts[2].split('|');
  return ({
    n: parseInt(parts[1]),
    winners: win.split(' ').filter(Boolean).map((s) => parseInt(s.trim())).sort(),
    haves: have.split(' ').filter(Boolean).map((s) => parseInt(s.trim())).sort(),
    count: 1,
  })
};

const solver = async () => {
  let lines = await lineReader('input.txt', parseLine);

  const score = lines.reduce((acc, {n, winners, haves}) => {
    let partScore = 0;
    haves.forEach((have) => {
      if (winners.includes(have)) {
        partScore++;
      }
    });
    if (partScore) {
      return acc + Math.pow(2, partScore - 1);
    }
    return acc;
  }, 0);

  
  lines.forEach(({n, winners, haves, count}, ix, list) => {
    let winCount = haves.filter((have) => winners.includes(have)).length;
    for (let i = ix + 1; i <= ix + winCount; i++) {
      list[i].count += count
    }
  })

  const score2 = lines.reduce((acc, {count}) => acc + count, 0);

  console.log('p1', score);
  console.log('p2', score2);
}

await solver();

