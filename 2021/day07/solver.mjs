import { lineReader, gaussSum } from '../../common.mjs';


const parseLine = line => line.split(',').map((n) => parseInt(n));

const solver = async () => {
  let crabs = (await lineReader('input.txt', parseLine))[0];
  // let crabs = (await lineReader('test.txt', parseLine))[0];

  let min = Math.min(...crabs);
  let max = Math.max(...crabs);
  let bestCost = Infinity;
  let bestI;

  for (let i = min; i < max; i++) {
    const cost = crabs.reduce((t, n) => t + Math.abs(n - i), 0);
    if (cost < bestCost) {
      bestI = i;
      bestCost = cost;
    }
  }

  console.log('p1', bestI, bestCost);
}

const solver2 = async () => {
  let crabs = (await lineReader('input.txt', parseLine))[0];

  let min = Math.min(...crabs);
  let max = Math.max(...crabs);
  let bestCost = Infinity;
  let bestI;

  for (let i = min; i < max; i++) {
    const cost = crabs.reduce((t, n) => t + gaussSum(Math.abs(n - i)), 0);
    if (cost < bestCost) {
      bestI = i;
      bestCost = cost;
    }
  }
  
  console.log('p2', bestI, bestCost);
}


solver();
solver2();
