import { lineReader } from '../../common.mjs';

const parseLine = line => line;

const solver = async () => {
  let nums = await lineReader('input.txt', parseLine);

  let maxMax = 0;
  let  max = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == 'x') {
      max = 0;
    }
    else {
      max += parseInt(nums[i]);
      console.log('max', max);
      if (max >= maxMax) {
        maxMax = max;
      }
    }
  }
  console.log('part1', maxMax);
}

const solver2 = async () => {
  let nums = await lineReader('input.txt', parseLine);
  
  let maxes = [];

  let maxMax = 0;
  let  max = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == 'x') {
      maxes.push(max);
      max = 0;
    }
    else {
      max += parseInt(nums[i]);
      console.log('max', max);
      if (max >= maxMax) {
        maxMax = max;
      }
    }
  }

  maxes.sort((a,b) => a - b);

  console.log(maxes.slice(-3));
}

solver2();
