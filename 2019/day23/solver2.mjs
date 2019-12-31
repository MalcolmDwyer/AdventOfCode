import computer from '../day15/computer.mjs';
import blessed from 'neo-blessed';
import { lineReader } from '../../common.mjs';
const delay = time => new Promise(res=>setTimeout(res,time));

let display = blessed.screen({
  smartCSR: true,
  autoPadding: true,
  cursor: {
    artificial: true,
  }
});
display.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// let boxDisplay = blessed.log({
//   // left: 0,
//   // top: 0,
//   width: 40,
//   height: '100%',
//   border: {
//     type: 'line',
//   },
//   style: {
//     fg: 'white',
//     bg: 'blue',
//     border: {
//       fg: '#f0f0f0'
//     },
//     // hover: {
//     //   bg: 'green'
//     // }
//   }
// });

let screenLog = blessed.log({
  top: 0,
  left: 120,
  right: 4,
  scrollable: true,
  alwaysScroll: true,
  focused: true,
  scrollbar: {
    style: {
      bg: 'red'
    },
  },
  bg: 'black',
  fg: 'white',
  focus: {
    bg: 'blue',
  },
  hover: {
    bg: 'green',
  },
  height: '100%',
  border: {
    type: 'line',
  },
});

// screenLog.on('click', () => {
//   screenLog.log('clicked');
//   screenLog.focus();
// });

let tLog = blessed.log({
  border: {
    type: 'line',
  },
  bottom: 1,
  height: 3,
  left: 2,
  width: 10,
});

let outLog = blessed.log({
  border: {
    type: 'line',
  },
  bottom: 1,
  left: 20,
  height: 3,
  width: 50,
});

// display.append(boxDisplay);
display.append(screenLog);
display.append(tLog);
display.append(outLog);
screenLog.focus();
// boxDisplay.focus();
// display.render();

const solver = async () => {
  const file = 'input.txt';

  let lines = await lineReader(file);
  let data = (lines[0] || '').split(',').map(n => parseInt(n));
  await run1(data, true);
}

const run1 = async (program, part2) => {
  // console.log('solver2');
  
  let cpus = [];
  let inputQueues = [];
  let executionQueue = [0];
  let boxes = [];
  let queueBoxes = [];

  let nat = {};
  let sentNats = new Set();

  for (let cpuNum = 0; cpuNum < 50; cpuNum++) {
    inputQueues[cpuNum] = [cpuNum];
    await delay(1);
    cpus[cpuNum] = await computer(program, {
      name: `cpu_${cpuNum}`,
      // rerun: true,
      logObj: screenLog,
    })();

    boxes[cpuNum] = blessed.box({
      left: Math.floor(cpuNum/5) * 12,
      top: (cpuNum%5) * 10,
      width: 10,
      height: 1,
      bg: 'blue',
      focus: {
        bg: 'red',
      },
      fg: 'white',
    });
    display.append(boxes[cpuNum]);
    // display.render();
    boxes[cpuNum].setLine(0, `  ${cpuNum}`);

    queueBoxes[cpuNum] = blessed.list({
      top: (cpuNum%5) * 10 + 1,
      left: Math.floor(cpuNum/5) * 12,
      width: 10,
      height: 10,
      bg: 'black',
      fg: 'white',
    });
    display.append(queueBoxes[cpuNum]);
    display.render();
  }

  let updateDisplay = (t, didSomething) => {
    for (let cpuNum = 0; cpuNum < 50; cpuNum++) {
      queueBoxes[cpuNum].setItems(inputQueues[cpuNum].map(n => `${n}`));
      // boxes[executionQueue[0]].focus();
      display.render();
    }
    tLog.setLine(0, `${t} ${didSomething ? 'y' : 'n'}`);
    
  }

  updateDisplay(0);

  let done = false;
  let t = 0;

  while (!done && t < 50) {
    let didSomething = false;
    screenLog.log(`t ${t} ----------------------`);
    for (let cpuNum = 0; cpuNum < 50; cpuNum++) {
    // for (let cpuNum of [0, 21, 25, 46]) {
      // screenLog.log(`CPU ${cpuNum} ------`);
      // boxes[cpuNum].focus();
      display.render();
      let nextA;
      setTimeout(async () => {
        try {

          // screenLog.log(` CPU(d) ${cpuNum}---`);
          let a;

          a = await cpus[cpuNum].next(-1);
          while (a.value === 'INPUT') {
            // screenLog.log(`cpu_${cpuNum}    INPUT WHILE LOOP`);
            if (a.value !== 'INPUT') {
              break;
            }
            if (inputQueues[cpuNum].length) {
              const val = inputQueues[cpuNum].shift();
              // screenLog.log(`cpu_${cpuNum} sending in -> ${val}`);
              a = await cpus[cpuNum].next(val);
              queueBoxes[cpuNum].setItems(inputQueues[cpuNum].map(n => `${n}`));
              await delay(0);
              display.render();
              // screenLog.log(`cpu_${cpuNum} a after sending in ${val} -> ${a.value}`);
              didSomething = true;
            }
            else {
              // screenLog.log(`cpu_${cpuNum} input queue empty, sending in -> -1`);
              a = await cpus[cpuNum].next(-1);
              break;
            }
          }

          // screenLog.log(`cpu_${cpuNum} a after handling inputs: ${a.value}`);
          if (a.value === 'INPUT') {
            return;
          }

          let x = await cpus[cpuNum].next();
          // await delay(1005);
          let y = await cpus[cpuNum].next(-1);
          // await delay(1005);

          if (a.value && a.value === 255) {
            done = true;
            outLog.setLine(0, `   [${x.value},${y.value}]`)
            nat.x = x.value;
            nat.y = y.value;
          }

          screenLog.log(`cpu_${cpuNum} pushing to ${a.value} queue: ${x.value},${y.value}`);
          if (a.value < 0 || a.value > 49) {
            // throw new Error('bad push');
            return;
          }
          inputQueues[a.value].push(x.value);
          inputQueues[a.value].push(y.value);
          didSomething = true;
          queueBoxes[cpuNum].setItems(inputQueues[cpuNum].map(n => `${n}`));
          tLog.setLine(0, `${t} ${didSomething ? 'y' : 'n'}`);
          await delay(1);
          display.render();
          



          // screenLog.log(` CPU(d) ${cpuNum}---`);
          // let a = await cpus[cpuNum].next(-1);
          // screenLog.log('a:');
          // screenLog.log(a);
          // if (a.value && a.value === 'INPUT') {
          //   nextA = await handleInput(cpuNum);
          //   if (nextA.value === 'INPUT') {
          //     return;
          //   }
          //   screenLog.log(`cpu_${cpuNum} nextA ${nextA.value}`);
          //   a = nextA;
          // }
          // // else {
          //   if (a.value && a.value === 255) {
          //     done = true;
          //   }
          //   else if (a.value) {
          //     let x = await cpus[cpuNum].next();
          //     await delay(1005);
          //     let y = await cpus[cpuNum].next();
          //     await delay(1005);
          //     if (!x || !y) {
          //       screenLog('no x / y');
          //     }
          //     screenLog.log(`pushing to ${a.value} queue: ${x.value},${y.value}`);
          //     if (a.value < 0 || a.value > 49) {
          //       throw new Error('bad push');
          //     }
          //     inputQueues[a.value].push(x.value);
          //     inputQueues[a.value].push(y.value);
          //     queueBoxes[cpuNum].setItems(inputQueues[cpuNum].map(n => `${n}`));
          //     display.render();
          //     await delay(0);
          //   }
          //   else {
          //     screenLog.log(`cpu_${cpuNum} no a`);
          //   }
            
          // // }
          // screenLog.log(`cpu_${cpuNum} yielded ${a.value}`);
          // await delay(1005);
        } catch(e) {
          screenLog.log(`ERROR ${e}`)
        }
      }, 0);
    }

    // if (t && !didSomething) {
    //   done = true;
    //   screenLog.log(`t:${t} did nothing`)
    // }

    // queueBoxes[0].setItems([...inputQueues[0].map(n => `${n}`), `${t}`])
    // display.render();
    // screenLog.focus();
    updateDisplay(t, didSomething);
    await delay(500);
    t++;
  }

  updateDisplay(t);



}

solver();