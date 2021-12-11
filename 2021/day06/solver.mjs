import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => line.split(',').map((c) => parseInt(c));


const solver = async () => {
  let fish = (await lineReader('test.txt', parseLine))[0];
  // let fish = (await lineReader('input.txt', parseLine))[0];
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p1', fish);

  let d = 0;
  while (d != 256) {
    let add = 0;
    for (let f = 0; f < fish.length; f++) {
      if (fish[f] === 0) {
        add++;
        fish[f] = 6;
      }
      else {
        fish[f]--;
      }
    }
    if (add) {
      for (let f = 0; f < add; f++) {
        fish.push(8);
      }
    }
    // console.log(d, fish.join(','));
    d++;
  }

  console.log('p1', fish.length);
}


const solver2 = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  

  let fish = (await lineReader('input.txt', parseLine))[0];

  // console.log('p2', fish);

  let fishCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((n) => fishCounts[n] = 0);


  fish.forEach((f) => fishCounts[ f ]++);
  // console.log('0', fishCounts.join(', '));

  let d = 0;
  while (d != 256) {
    const nextFishCounts = [];
    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((n) => nextFishCounts[n] = 0);

    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((c) => {
      // 8 <== 0
      // 7 <== 8
      // 6 <== 7 + 0
      // 5 <== 6
      // 4 <== 5
      // 3 <== 4
      // 2 <== 3
      // 1 <== 2
      // 0 <== 1
      if (c === 8) {
        nextFishCounts[8] = fishCounts[0];
      }
      else if (c === 6) {
        nextFishCounts[6] = fishCounts[0] + fishCounts[7];
      }
      else {
        nextFishCounts[c] = fishCounts[c + 1]
      }
      
    });
    
    fishCounts = nextFishCounts;

    d++;
    // console.log(d, fishCounts.join(', '));
  }
  
  const sum = fishCounts.reduce((a, n) => a + n, 0);
  console.log('end', fishCounts, sum);
}


// solver();
solver2();

/*

for (let i = 0; i < X; i++) {

}

for (let i = 0; i < X; i++) {
  for (let j = 0; j < Y; j++) {
  
  }
}


*/