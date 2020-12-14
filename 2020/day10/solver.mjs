import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };


const solver = async () => {
  let lines = await lineReader('input.txt');
  let vs = lines.map((n) => parseInt(n));
  // let lines = await lineReader('input.txt');
  
  const ads = vs.sort((a,b) => a < b ? -1 : 1);
  console.log(vs, ads);

  let ones = 0;
  let threes = 0;

  ads.forEach((n, ix) => {
    if (ix) {
      let d = n - ads[ix-1];
      if (d === 1) {
        ones++;
      }
      else if (d === 3) {
        threes++;
      }
      else {
        console.log('?');
      }
    }
  });
  console.log(ones + 1, threes + 1);
  console.log((ones + 1) * (threes + 1));
}

const countChain = (start, end, chain) => {
  const nexts = chain.filter((a) => (a > start) && (a <= start + 3));
  // console.log(chain.join(', '), '    --> ', nexts.join(', '));
  let pathCount = 0; //nexts.length;

  nexts.forEach((next) => {
    if (next === end) {
      pathCount++;
    }
    const ix = chain.indexOf(next);
    const newChain = chain.slice(ix + 1);
    // console.log('next index ', ix);
    // console.log('newChain', newChain);
    pathCount += countChain(next, end, newChain);
  });
  return pathCount;
}

/*
12 => 12
[2] => [1]

123 ==> 
123
13
[3] => [2]


1234 ==> 
1234
124
134
14
[4] => [4]

12345 ==>
12345
1235
1245
1345
135
145
125
[5] => [7]

*/



const solver2 = async () => {
  let lines = await lineReader('input.txt');
  let vs = lines.map((n) => parseInt(n));
  // let lines = await lineReader('input.txt');
  
  const ads = vs.sort((a,b) => a < b ? -1 : 1);
  const dev = ads[ads.length-1] + 3;
  // const chain = [...ads, dev];
  const chain = [0, ...ads, dev];
  console.log('chain', chain.join(','));

  let t = 1;
  let miniChain = [];
  for (let i = 0; i< chain.length; i++) {
    if ((i < chain.length - 2) && chain[i] === chain[i+1] - 1) {
      miniChain.push(chain[i]);
    }
    else if (miniChain.length && chain[i] === chain[i + 1] - 3) {
      miniChain.push(chain[i]);
      console.log('m', miniChain.join(' '), ' ---> ', miniChain.length);
      

      if (miniChain.length == 3) {
        t *= 2;
      }
      else if (miniChain.length === 4) {
        t *= 4;
      }
      else if (miniChain.length === 5) {
        t *= 7;
      }

      miniChain = [];
    }
  }

  console.log(t);
}

solver2();
