import computer from '../day15/computer.mjs';
import { lineReader } from '../../common.mjs';
import Map from '../day24/map.mjs';
const delay = time => new Promise(res=>setTimeout(res,time));
import prompts from 'prompts';

let screenLog = console;

const solver = async () => {
  const file = 'input.txt';

  let lines = await lineReader(file);
  let data = (lines[0] || '').split(',').map(n => parseInt(n));
  await run1(data, true);
}

solver();

const dirs = ['^', 'v', '<', '>'];
const cX = [0, 0, -1, 1];
const cY = [-1, 1, 0, 0];
const rTurns = [3, 2, 0, 1];
const lTurns = [2, 3, 1, 0];
const neighbors = [[-1, 0], [0, -1], [0, 1], [1, 0]]; // [y, x]

let map = new Map();

let lineBuffer;
let x;
let y;

const clearBuffer = () => {
  lineBuffer = '';
  x = 0;
  y = 0;
}

const getStrings = async (cpu, printPrefix) => {
  let done = false;
  let strs = [''];
  let strN = 0;
  while (!done) {
    let c = await cpu.next();
    if (c.value === 'INPUT') {
      done = true;
    }
    else if (c.value === 'DONE') {
      process.exit(0);
    }
    else if (c.value === 10) {
      if (printPrefix) {
        screenLog.log(`${printPrefix}| ${strs[strN]}`);
        await delay(0);
      }
      strN++;
      strs[strN] = '';
    }
    else {
      strs[strN] = strs[strN] + String.fromCharCode(c.value);
    }
  }

  return strs;
}

const run1 = async (program) => {
  screenLog.log('run1');
  let done = false;

  const getInput = async () => {
    let response = await prompts({
      message: '? ',
      type: 'text',
      name: 'val',
    });
    return response.val;
  }

  const sendInput = async (command) => {
    screenLog.log(`> _${command}_`)
    let ascii = [...command.split('').map(c => c.charCodeAt(0)), 10];
    for (let code of ascii) {
      await cpu.next(code);
    }
  }

  const sequences = {
    collect1: [
      'south', // to passages
      'take spool of cat6',
      'west',  // to kitchen
      'take space heater',
      'south',
      'take shell',
      'north',
      'north',
      'take weather machine',
      'north',
      'west',
      'west',
      'take whirled peas',
      'east',
      'east',
      'south',
      'west',
      'south',
      'east',
      'take candy cane',
      'west',
      'south',
      'take space law space brochure',
      'north',
      'north',
      'east',
      'south',
      'east',
      'east',
      'south',
      'take hypercube',
      'south',
      'south',
      'inv',
    ],
    solve: [
      'drop spool of cat6',
      'drop space heater',
      'drop space law space brochure',
      'drop whirled peas',
    ],
  };

  let cpu = computer(program, {
    name: 'cpu',
    logObj: screenLog,
  })();

  const opposites = {
    east: 'west',
    west: 'east',
    north: 'south',
    south: 'north',
  }

  const findWeight = async (dir) => {
    await sendInput('inv');
    let strings = await getStrings(cpu);
    let inv = strings.slice(1, -3).map(str => str.slice(2));
    let currentInv = Array(inv.length).fill(true);
    screenLog.log('Inventory length:', inv.length);
    inv.forEach(i => screenLog.log(`INV: [${i}]`));

    for (let control = 0; control < 2**inv.length; control++) {
      screenLog.log(`Control ${control}/${2**inv.length} l:${inv.length}`);
      let enables = control.toString(2).padStart(inv.length, '0').split('').map(s => s == '1');
      screenLog.log(`Control ${control}: ${enables.join('')}`);
      screenLog.log(`Current Inv ${currentInv.join('')}`);

      let ix = 0;
      for (let en of enables) {
        screenLog.log(`${ix} ${inv[ix]} => en:${en}/${currentInv[ix]}`)
        if (en && !currentInv[ix]) {
          await sendInput(`take ${inv[ix]}`);
          currentInv[ix] = true;
          strings = await getStrings(cpu);
          await delay(0);
        }
        else if (!en && currentInv[ix]) {
          await sendInput(`drop ${inv[ix]}`);
          currentInv[ix] = false;
          strings = await getStrings(cpu);
          await delay(0);
        }
        ix++;
      };

      screenLog.log(`sending "${dir}"`)
      await sendInput(dir);
      strings = await getStrings(cpu, '> ');
      await delay(10);

      if (strings.length > 8) {
        let tooHeavy = strings[8].indexOf('lighter') > 0;
        let tooLight = strings[8].indexOf('heavier') > 0;
        screenLog.log(`tooHeavy: ${tooHeavy} tooLight: ${tooLight}`);
        await delay(0);

        if (!tooHeavy && !tooLight) {
          screenLog.log(`Good weight with`);
          screenLog.log(currentInv.join(' '));
          break;
        }  
      }
      else {
        break;
      }
    }
    screenLog.log(`Good weight with`);
    screenLog.log(currentInv.join(' '));

    await delay(0);
  }

  let sequence = [];

  let t = 0;
  while (!done) {
    await delay(1);
    let strings = await getStrings(cpu, ' ');

    let val;
    if (sequence.length) {
      val = sequence.shift();
    }
    else {
      val = await getInput();
    }

    if (val === 'q') {
      process.exit(0);
    }
    else if (sequences[val]) {
      screenLog.log('Running sequence ', val);
      sequence = sequences[val];
      await sendInput(sequence.shift());
    }
    else if (val === 'check1') {
      await findWeight('east');
    }
    else {
      await sendInput(val);
    }
    t++;
  }
}