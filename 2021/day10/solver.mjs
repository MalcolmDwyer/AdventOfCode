import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);

const vals = {
  cp: 3,  // paren
  cs: 57, // square
  cb: 1197, // brace
  ca: 25137, // angle
};

let chars = [
  {
    open: '(',
    close: ')',
    corruptionValue: 3,
    completionValue: 1,
  },
  {
    open: '[',
    close: ']',
    corruptionValue: 57,
    completionValue: 2,
  },
  {
    open: '{',
    close: '}',
    corruptionValue: 1197,
    completionValue: 3,
  },
  {
    open: '<',
    close: '>',
    corruptionValue: 25137,
    completionValue: 4,
  },
];

const corruptionScore = (line) => {
  // console.log(line);
  let stack = [];
  let score = 0;

  for (let char of line.split('')) {
    // console.group('-------------------', char);
    chars.forEach(({open}) => {
      if (open === char) {
        stack.push(open);
        // console.log(stack.join(''));
      }
    });

    chars.forEach(({open, close, corruptionValue}) => {
      if (close === char) {
        if (stack[stack.length - 1] === open) {
          stack.pop();
          // console.log('POP', char)
        }
        else {
          // console.log('INVALID', char, stack.join(''));
          score = corruptionValue;
        }
      }
    });
    // console.groupEnd();

    if (score) {
      // console.log('BREAK with score', score);
      break;
    }
  }
  return score;
}

const completeLine = (line) => {
  let stack = [];
  
  for (let char of line.split('')) {
    chars.forEach(({open}) => {
      if (open === char) {
        stack.push(open);
      }
    });

    chars.forEach(({open, close, corruptionValue}) => {
      if (close === char) {
        if (stack[stack.length - 1] === open) {
          stack.pop();
        }
      }
    });
    console.groupEnd();
  }
  // console.log('stack', stack.join(''));

  let score = 0;
  while (stack.length) {
    score *= 5;
    let c = stack.pop();
    score += chars.find(({open}) => open === c).completionValue;
  }
  return score;
}

const solver = async () => {
  let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);

  const scores = lines.map(corruptionScore);

  // console.log(scores);


  console.log('p1', scores.reduce((a,n) => a + n, 0));
}

const solver2 = async () => {
  let lines = await lineReader('input.txt');

  const notCorruptLines = lines.filter((line) => !corruptionScore(line));

  // console.log('notCorrupt', notCorruptLines);

  const completionScores = notCorruptLines.map(completeLine);
  // console.log(completionScores);
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  // console.log('p2');

  const sorted = completionScores.sort((a,b) => a < b ? 1 : -1);
  // sorted.map((n, ix) => console.log(`${ix} ${n}`));
  // console.log(sorted);
  const index = Math.floor(sorted.length / 2);
  // console.log('index', index);
  console.log('p2',sorted[index]);
}


solver();
solver2();

/*

for (let i = 0; i < X; i++) {

}

for (let i = 0; i < X; i++) {
  for (let j = 0; j < Y; j++) {
  
  }
}


*/