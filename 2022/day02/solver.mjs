import { lineReader, gridReader } from '../../common.mjs';


const parseLine = line => ({
  them: line.charCodeAt(0) - 'A'.charCodeAt(0) + 1,
  me: line.charCodeAt(2) - 'X'.charCodeAt(0) + 1,
});


const solver = async () => {
  let lines = await lineReader('input.txt', parseLine);

  let score = 0;

  lines.map(({them, me}) => {
    if (them === me) {
      score += (3 + me);
      // console.log(them, me, '=', 3 + me, score);
    }
    else if ((3 + me - them) % 3 === 1) {
      score += (6 + me);
      // console.log(them, me, 'win', 6 + me, score);
    }
    else {
      // console.log(them, me, 'loss', me, score);
      score += me;
    }
  });
  console.log('p1',  score);
}

const solver2 = async () => {
  let lines = await lineReader('input.txt', parseLine);
  let score = 0;

  lines.map(({them, me: goal}) => {
    if (goal === 2) { // draw
      score += (3 + them);
      // console.log(`them ${them} goal ${goal} : 3 + ${them} => ${score}`);
    }
    else if (goal === 1) { // lose
      score += ((3 + them - 1 - 1) % 3) + 1;
      // console.log(`them ${them} goal ${goal} : 0 + ${((3 + them - 1) % 3)} => ${score}`);
    }
    else {
      score += 6 + ((3 + them + 1 - 1) % 3) + 1;
      // console.log(`them ${them} goal ${goal} : 6 + ${((6 + them + 1) % 3)} => ${score}`);
    }
  });


  console.log('p2', score);
}


await solver();
await solver2();
