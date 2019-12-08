import { lineReader } from '../../common.mjs';
import computer from './computer.mjs';
import computerGen from './computerGen.mjs';
import permute from './permutations.mjs';

const runForInput = async (program, inputs) => {
  let o0 = await computer(program, [inputs[0], 0]);
  let o1 = await computer(program, [inputs[1], o0[0]]);
  let o2 = await computer(program, [inputs[2], o1[0]]);
  let o3 = await computer(program, [inputs[3], o2[0]]);
  let o4 = await computer(program, [inputs[4], o3[0]]);

  return o4[0];
}

function runGenForInput(program, inputs, first = 0) {
  
  let computer0 = computerGen(program, inputs[0], 'A')();
  let computer1 = computerGen(program, inputs[1], 'B')();
  let computer2 = computerGen(program, inputs[2], 'C')();
  let computer3 = computerGen(program, inputs[3], 'D')();
  let computer4 = computerGen(program, inputs[4], 'E')();

  let done = false;
  let input = first;

  while (!done) {
    let o0 = computer0.next(input);
    let o1 = computer1.next(o0.value);
    let o2 = computer2.next(o1.value);
    let o3 = computer3.next(o2.value);
    let o4 = computer4.next(o3.value);
    if (o4.done) {
      done = true;
      return input; // this was the last value from computer4 on previous iteration
    }
    if (typeof o4.value !== 'undefined') {
      input = o4.value;
    }
    
  }

}

async function solver() {
  const file =
    'input.txt';
    // 'test1.txt';
    // 'test2.txt';

  

  const lines = await lineReader(file);
  const program = lines[0].split(',').map(n => parseInt(n));

  // part1(program);
  part2(program);
}

async function part1(program) {

  let max = 0;
  let phases = [4,3,2,1,0];

  let perms = permute(phases, 5);

  perms.forEach(async inputs => {
    const out = await runForInput(program, inputs);
    if (out > max) {
      console.log('new max', out);
      max = out;
    }
  })
  
  console.log('max', max);
}

async function part2(program) {

  let max = 0;
  let phases = [5, 6, 7, 8, 9];

  let perms = permute(phases, 5);
  let bestPerm;

  perms.forEach(inputs => {
    console.log('-----------------------------------------------------', inputs);
    const out = runGenForInput(program, inputs);
    if (out > max) {
      console.log('new max', out);
      max = out;
      bestPerm = inputs;
    }
  })
  
  console.log('max', max);
  console.log('best', bestPerm);
}

solver();
