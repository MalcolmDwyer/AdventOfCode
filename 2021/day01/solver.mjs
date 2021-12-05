import { lineReader, gridReader } from '../../common.mjs';

const parseLine = line => parseInt(line);

const solver = async () => {
  // let lines = await lineReader('test.txt');
  let nums = await lineReader('input.txt', parseLine);
  let count = 0;
  // console.log(nums[0], nums[nums.length-1]);
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i-1]) {
      count++;
    }
  }
  console.log('part1', count);
}
//1615


solver();

const solver2 = async () => {
  // let lines = await lineReader('test.txt');
  const nums = await lineReader('input.txt', parseLine);
  // const nums = lines.map((l) => parseInt(l));
  let count = 0;
  // console.log(nums[0], nums[nums.length-1]);
  for (let i = 3; i < nums.length; i++) {
    if ((nums[i] + nums[i-1] + nums[i-2]) > (nums[i-1] + nums[i-2] + nums[i-3])) {
      count++;
    }
  }
  console.log('part2', count);
}

solver2();
