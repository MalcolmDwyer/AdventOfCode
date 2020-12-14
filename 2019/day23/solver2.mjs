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

display.append(screenLog);
display.append(tLog);
display.append(outLog);
screenLog.focus();

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
  let idleCount = 0;

  let nat = {};
  let sentNats = new Set();
  let prevNatY = -Infinity;

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

  let updateDisplay = (t) => {
    for (let cpuNum = 0; cpuNum < 50; cpuNum++) {
      queueBoxes[cpuNum].setItems(inputQueues[cpuNum].map(n => `${n}`));
      // boxes[executionQueue[0]].focus();
      display.render();
    }
    tLog.setLine(0, `${t} ${idleCount}`);
    
  }

  updateDisplay(0);

  let done = false;
  let t = 0;

  let cpusToRun = new Set(Array(50).fill().map((n,ix) => ix));

  const runCycle = async (cpuNum) => {
    let didSomething = false;
    try {
      // screenLog.log(` CPU(d) ${cpuNum}---`);
      let a;

      a = await cpus[cpuNum].next(-1);
      while (a.value === 'INPUT') {
        // screenLog.log(`cpu_${cpuNum}    INPUT WHILE LOOP`);
        if (a.value !== 'INPUT') {
          cpusToRun.add(cpuNum);
          break;
        }
        if (inputQueues[cpuNum].length) {
          const val = inputQueues[cpuNum].shift();
          // screenLog.log(`cpu_${cpuNum} sending in -> ${val}`);
          a = await cpus[cpuNum].next(val);
          // queueBoxes[cpuNum].setItems(inputQueues[cpuNum].map(n => `${n}`));
          // screenLog.log(`cpu_${cpuNum} a after sending in ${val} -> ${a.value}`);
          didSomething = true;
        }
        else {
          // screenLog.log(`cpu_${cpuNum} input queue empty, sending in -> -1`);
          a = await cpus[cpuNum].next(-1);
          cpusToRun.delete(cpuNum);
          break;
        }
      }

      // screenLog.log(`cpu_${cpuNum} a after handling inputs: ${a.value}`);
      if (a.value === 'INPUT') {
        return didSomething;
      }

      let x = await cpus[cpuNum].next();
      let y = await cpus[cpuNum].next(-1);

      if (a.value && a.value === 255) {
        if (!part2) {
          done = true;
        }
        outLog.setLine(0, `   [${x.value},${y.value}]  prev: [${prevNatY}]`)
        nat.x = x.value;
        nat.y = y.value;
        return didSomething;
      }

      screenLog.log(`cpu_${cpuNum} pushing to ${a.value} queue: ${x.value},${y.value}`);

      inputQueues[a.value].push(x.value);
      inputQueues[a.value].push(y.value);
      didSomething = true;
      queueBoxes[cpuNum].setItems(inputQueues[cpuNum].map(n => `${n}`));
      cpusToRun.add(a.value);
      cpusToRun.add(cpuNum);
      tLog.setLine(0, `${t} ${idleCount}`);
      return didSomething;
    } catch(e) {
      screenLog.log(`ERROR ${e}`)
      return didSomething;
    }
  }

  while (!done && t < Infinity) {
    screenLog.log(`t ${t} ---------------------- ${Array.from(cpusToRun).join(',')}`);

    let didThings = await Promise.all(Array.from(cpusToRun).map(async cpuNum => {
      return await runCycle(cpuNum);
    }));

    if (!didThings.length) {
      idleCount++;
    }
    else {
      idleCount = 0;
    }

    if (idleCount > 5) {
      inputQueues[0].push(nat.x);
      inputQueues[0].push(nat.y);
      cpusToRun.add(0);
      screenLog.log(`NAT pushing to 0 queue: ${nat.x},${nat.y}`);
      if (nat.y === prevNatY) {
        done = true;
        screenLog.log(`Repeated Y sent from NAT: ${nat.y}`)
      }
      prevNatY = nat.y;
    }

    updateDisplay(t);
    await delay(0); // allow display to draw;
    t++;
  }

  updateDisplay(t);



}

solver();


// Part 2: not 16674