import { lineReader, gridReader } from '../../common.mjs';
const parseLine = line => line.split(',').map((elf) => elf.split('-').map((n => parseInt(n))));


const solver = async () => {
  let lines = await lineReader('input.txt',parseLine);
  let count = 0;

  lines.forEach(([e1, e2]) => {
    if (
      (e2[0] >= e1[0] && e2[1] <= e1[1]) ||
      (e1[0] >= e2[0] && e1[1] <= e2[1])
    )  {
      count++;
    }
  })
  console.log('p1', count);
}

const solver2 = async () => {
  let lines = await lineReader('input.txt',parseLine);
  let count = 0;

  lines.slice(0).forEach(([e1, e2]) => {
    if (
      (e2[0] <= e1[1] && e2[0] >= e1[0]) ||
      (e2[1] <= e1[1] && e2[1] >= e1[0])||
      (
        (e2[0] >= e1[0] && e2[1] <= e1[1]) ||
        (e1[0] >= e2[0] && e1[1] <= e2[1])
      )
    )  {
      count++;
    }
  });
  
  console.log('p2', count);
}

await solver();
await solver2();
