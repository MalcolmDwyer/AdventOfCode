import computer from '../day15/computer.mjs';
import blessed from 'neo-blessed';
import { lineReader } from '../../common.mjs';
const delay = time => new Promise(res=>setTimeout(res,time));


const screenLog = console;
// let display = blessed.screen({
//   smartCSR: true
// });
// display.key(['escape', 'q', 'C-c'], function(ch, key) {
//   return process.exit(0);
// });

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

// let screenLog = blessed.log({
//   left: 44,
//   scrollable: true,
//   scrollbar: {
//     bg: 'blue'
//   },
//   height: '100%',
//   border: {
//     type: 'line',
//   },
// })

// display.append(boxDisplay);
// display.append(screenLog);
// boxDisplay.focus();
// display.render();

async function solver() {
  const file = 'input.txt';

  let lines = await lineReader(file);
  let data = (lines[0] || '').split(',').map(n => parseInt(n));

  // Setup
  // await runSetup(data, false);

  // Part 1
  await run(data);

  // Part 2
  // await run(data, true);
  // const route = await setupPart2();
  // await runPart2(data, route);
}

solver();

const run = async (program, part2) => {

  let cpus = [];
  let queues = [];
  let executionQueue = [0];

  const inputGeneratorBuilder = (cpuNum) => {
    return function* inputGenerator() {
      screenLog.log('booting', cpuNum);
      yield cpuNum;
      // yield delay(1000);
  
      while (true) {
        if (queues[cpuNum].length) {
          yield queues[cpuNum].shift();
        }
        else {
          // if (executionQueue[0] === cpuNum) {
          //   executionQueue.shift();
          //   screenLog.log(`new Queue: ${executionQueue.join(', ')}`);
          // }
          // withInput.shift();
          // withInput.delete(cpuNum);
          yield -1;
        }
      }
    }
  }

  let n = 50;

  for (let i = 0; i < n; i++) {
    queues[i] = [];
  }
  // let withInput = [0];
  // let withInput = new Set([0]);

  const inputPromise = (cpuNum) => {
    let init = false;
    return () => new Promise(async (resolve) => {
      screenLog.log(`${cpuNum} input promise`)
      if (!init) {
        screenLog.log(`${cpuNum} boot`);
        resolve(init);
        init = true;
      }
      else if (queues[cpuNum].length) {
        screenLog.log(`${cpuNum} resolve with ${queues[cpuNum][0]}`);
        resolve(queues[cpuNum].shift());
      }
      else {
        let int;
        screenLog.log(`${cpuNum} input with nothing ready... starting wait cycle`);
        screenLog.log(`Current queue: ${executionQueue.join(', ')}`);
        if (executionQueue[0] === cpuNum) {
          executionQueue.shift();
          screenLog.log(`new Queue: ${executionQueue.join(', ')}`);
        }
        const checkRespond = () => {
          console.log('checkRespond', cpuNum);
          if (queues[cpuNum].length) {
            clearInterval(int);
            resolve(queues[cpuNum].shift())
          }
        }
        int = setInterval(checkRespond, 500);
        resolve(-1);
      }
    });
  }

  const inputPromise2 = (cpuNum) => {
    screenLog.log(`${cpuNum} boot`);
    let init = false;
    let repeatEmpty = false;
    return () => new Promise(async (resolve) => {
      screenLog.log(`${cpuNum} wait`)
      // screenLog.trace();
      setTimeout(() => {
        let value;
        // await delay(1000);
        if (!init) {
          value = cpuNum;
          init = true;
        }
        else if (queues[cpuNum].length) {
          value = queues[cpuNum].shift()
          // withInput.add(cpuNum);
        }
        else {
          value = -1;
          if (repeatEmpty) {
            screenLog.log('REMOVING ', cpuNum);
            // withInput.delete(cpuNum);
            if (executionQueue[0] === cpuNum) {
              executionQueue.shift();
              screenLog.log(`new Queue: ${executionQueue.join(', ')}`);
            }
          }
          repeatEmpty = !repeatEmpty;
          // setTimeout(() => {
          // if (withInput.length) {
          //   screenLog.log(`REMOVING FROM ${withInput.join(',')}`)
          //   withInput.shift();
          // }
          // withInput = withInput.filter(q => q !== cpuNum);
          // withInput.delete(cpuNum);
          // }, 10000);
        }
        screenLog.log(`${cpuNum} inputFn ${value}`);
        resolve(value);
      }, 100);
    })
    // screenLog.log('booting', cpuNum);
  }


  let done = false;

  for (let i = 0; i < n; i++) {
    // setTimeout(async () => {
    let init = true;
    let repeatEmpty = false;
    let cpuNum = i;
      screenLog.log(`${i} init`)
      cpus[i] = await computer(program, {
        name: `cpu_${cpuNum}`,
        rerun: true,
        // inputGenerator: inputGeneratorBuilder(i),
        // inputFn: inputFn(i),
        // inputPromise: inputPromise(i),
        inputFn: () => {
          if (init) {
            init = false;
            return cpuNum;
          }
          else if (queues[cpuNum].length) {
            repeatEmpty = false;
            console.log(`${cpuNum} input ${queues[cpuNum][0]}`);
            return queues[cpuNum].shift();
          }
          else {
            if (executionQueue[0] === cpuNum && repeatEmpty) {
              executionQueue.shift();
              screenLog.log(`new Queue: ${executionQueue.join(', ')}`);
            }
            repeatEmpty = true;
            console.log(`${cpuNum} input -1`);
            return -1;
          }
        },
        logObj: screenLog,
      })();
    // }, 0);
  }

  while (!done) {

    // if (!withInput.size) {
    //   withInput.add(0);
    // }

    // const nextCpu = withInput[0];
    // const nextCpu = withInput.values().next().value;
    // const wI = Array.from(withInput.values());
    // const nextCpu = wI.sort((a, b) => queues[a].length > queues[b].length ? -1 : 1)[0];

    const nextCpu = executionQueue[0];

    // screenLog.log('NEXT CPU first of ', Array.from(withInput.values()).join(','));
    screenLog.log('NEXT CPU first of ', executionQueue.join(', '));

    let a = await cpus[nextCpu].next();
    console.log('a', a);
    let x = await cpus[nextCpu].next();
    let y = await cpus[nextCpu].next();

    screenLog.log(`${nextCpu} => ${a.value}: ${x.value},${y.value}`);

    await delay(1000);

    if (a.value === 255) {
      done = true;
    }
    else if (typeof a.value !== 'undefined') {
      screenLog.log(`pushing to ${a.value} queue: ${x.value},${y.value}`);
      if (!queues[a.value]) {
        done = true;
        screenLog.log(`No queue ${a.value}`)
        screenLog.log(queues);
      }
      queues[a.value].push(x.value);
      queues[a.value].push(y.value);

      if (!executionQueue.includes(a.value)) {
        executionQueue.push(a.value);
      }

      // // if (!withInput.length) {
      // queues.forEach((q, ix) => {
      //   if (q.length) {
      //     // withInput.push(ix);
      //     withInput.add(ix);
      //   }
      // });
      // }
    }
    else {
      screenLog.log(a);
      done = true;
    }
  }
/*
  for (let i = 0; i < n; i++) {
    let n = 20;

    // display.render();
    // n--;
    await delay(10);
    let a = await cpus[i].next();
    screenLog.log('a', a);
    // if (a.value === 'INPUT') {
    //   if (queues[i].length) {
    //     cpus[i].next(queues[i].shift());
    //   }
    //   else {
    //     cpus[i].next(-1);
    //   }
    //   continue;
    // }
    await delay(1000);
    let x = await cpus[i].next();
    // screenLog.log(x);
    await delay(1000);
    let y = await cpus[i].next();
    // screenLog.log(y);

    screenLog.log(`${i} => ${a.value}: ${x.value},${y.value}`);
    await delay(1000);

    if (a.value === 255) {
      done = true;
    }
    else if (typeof a.value !== 'undefined') {
      screenLog.log(`pushing to ${a.value} queue: ${x.value},${y.value}`);
      if (!queues[a.value]) {
        done = true;
        screenLog.log(`No queue ${a.value}`)
        screenLog.log(queues);
      }
      queues[a.value].push(x.value);
      queues[a.value].push(y.value);
    }
    else {
      screenLog.log(a);
      done = true;
    }
  }

  for (let i = 0; i < n; i++) {
    let n = 20;
    while (!done && n) {
      // display.render();
      // n--;
      await delay(1000);
      let a = await cpus[i].next();
      // screenLog.log(a);
      await delay(1000);
      let x = await cpus[i].next();
      // screenLog.log(x);
      await delay(1000);
      let y = await cpus[i].next();
      // screenLog.log(y);

      screenLog.log(`${i} => ${a.value}: ${x.value},${y.value}`);
      await delay(1000);

      if (a.value === 255) {
        done = true;
      }
      else if (typeof a.value !== 'undefined') {
        screenLog.log(`pushing to ${a.value} queue: ${x.value},${y.value}`);
        if (!queues[a.value]) {
          done = true;
          screenLog.log(`No queue ${a.value}`)
          screenLog.log(queues);
        }
        queues[a.value].push(x.value);
        queues[a.value].push(y.value);
      }
      else {
        screenLog.log(a);
        done = true;
      }
    }
    done = true;
    */
  // }
}