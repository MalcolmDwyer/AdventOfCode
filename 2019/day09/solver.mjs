import { lineReader } from '../../common.mjs';
// import computerGen from './computerGen.mjs';
import computer from './computer.mjs';


async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test3.txt';

  const lines = await lineReader(file);
  const program = lines[0].split(',').map(n => parseInt(n));

  part1(program);
}

solver();



const part1 = async (program) => {
  console.log('part1');

  let out = await computer(program, [2]);

  console.log('out', out);
}