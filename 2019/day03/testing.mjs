import { lineReader, gridReader } from '../../common.mjs';


async function solver() {
  const lines = await lineReader('./lines.txt');
  const grid = await gridReader('./grid.txt');

  console.log('l', lines.length);
  console.log('g', g.length, 'x', g[0] && g[0].length);
  // console.log(lines);
}

solver();
