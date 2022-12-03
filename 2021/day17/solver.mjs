// import { lineReader, gridReader } from '../../common.mjs';

// target area: x=281..311, y=-74..-54



// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);


const solver = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p1');
}

const solver2 = async () => {
  // const targetX = [20, 30];
  // const targetY = [-10, -5];
  const targetX = [281, 311];
  const targetY = [-74, -54];

  const rangeX = [1, 311];
  const rangeY = [-74, 500];

  const validVelocities = [];

  for (let y = rangeY[0]; y <= rangeY[1]; y++) {
    for (let x = rangeX[0]; x <= rangeX[1]; x++) {
      let prevX = -1;
      let px = 0;
      let py = 0;

      let mx = x;
      let my = y;

      while (
        (px <= targetX[1])
        && (py >= targetY[0])
        && (px !== prevX || py >= targetY[0])
      ) {
        px += mx;
        py += my;

        if (
          (px >= targetX[0] && px <= targetX[1])
          && (py >= targetY[0] && py <= targetY[1])
        ) {
          validVelocities.push(`${x}, ${y}`);
          break;
        }
        
        if (mx > 0) {
          mx--;
        }
        else if (mx < 0) {
          mx++;
        }
        my--;
        prevX = px;
      }
    }
  }


  console.log('p2', validVelocities.length);
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