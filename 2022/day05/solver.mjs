import { lineReader } from '../../common.mjs';

const solver = async () => {
  let lines = await lineReader('input.txt');

  const stacks = ['blank'];

  const process = (q, from, to) => {
    let move = stacks[from].slice(-q);
    move.reverse();
    stacks[to] = [...stacks[to], ...move];
    stacks[from] = stacks[from].slice(0, stacks[from].length - q);
  };

  lines.forEach((line) => {
    if (line[0] !== 'm') {
      const stack = line.split(' ');
      stacks.push(stack);
    }
    else {
      const parts = line.split(' ');
      process(parts[1], parts[3], parts[5]);
    }
  });

  console.log('p1', stacks.slice(1).map((s) => s[s.length - 1]).join(''));
}

const solver2 = async () => {
  let lines = await lineReader('input.txt');
  const stacks = ['blank'];

  const process = (q, from, to) => {
    let move = stacks[from].slice(-q);
    // move.reverse();
    stacks[to] = [...stacks[to], ...move];
    stacks[from] = stacks[from].slice(0, stacks[from].length - q);
  };

  lines.forEach((line) => {
    if (line[0] !== 'm') {
      const stack = line.split(' ');
      stacks.push(stack);
    }
    else {
      const parts = line.split(' ');
      process(parts[1], parts[3], parts[5]);
    }
  });

  console.log('p2', stacks.slice(1).map((s) => s[s.length - 1]).join(''));
}


await solver();
await solver2();
