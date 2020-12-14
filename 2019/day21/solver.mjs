import computer from '../day15/computer.mjs';
import blessed from 'neo-blessed';
import { lineReader } from '../../common.mjs';


let display = blessed.screen({
  smartCSR: true
});
display.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

let boxDisplay = blessed.log({
  // left: 0,
  // top: 0,
  width: 40,
  height: '100%',
  border: {
    type: 'line',
  },
  scroll: true,
  style: {
    fg: 'white',
    bg: 'blue',
    border: {
      fg: '#f0f0f0'
    },
    // hover: {
    //   bg: 'green'
    // }
  }
});

let screenLog = blessed.log({
  left: 44,
  height: '100%',
  border: {
    type: 'line',
  },
})

display.append(boxDisplay);
display.append(screenLog);
boxDisplay.focus();
display.render();

async function solver() {
  const file = 'input.txt';

  let lines = await lineReader(file);
  let data = (lines[0] || '').split(',').map(n => parseInt(n));

  // Setup
  // await runSetup(data, false);

  // Part 1
  // await run(data);

  // Part 2
  await run(data, true);
  // const route = await setupPart2();
  // await runPart2(data, route);
}

solver();

const run = async (program, part2) => {

const springScript = part2 ?
`OR A T
AND B T
AND C T
NOT T J
AND D J
NOT H T
NOT T T
OR E T
AND T J
RUN
` :
`OR A T
AND B T
AND C T
NOT T J
AND D J
WALK
`;

/*

`OR A T
AND B T
AND C T
NOT T J
AND D J
NOT A T
OR T J
RUN

  ____ no jump
   ___ jump
    __ jump
     _ jump
       jump (won't happen)
  _    no jump
  __   no jump
  ___  no jump
  _ __ jump
  _  _ jump
  __ _ jump
    _  ... should have already jumped
   _ _ jump
   __  ... should have already jumped
  _ _  no jump
  _ __ jump
  ____ 

  Jump if (D && (!C || !B || !A))
       => (D && !(C && B && A))
  
  part 2... 
  And H OR E
  
  OR A T
  AND B T
  AND C T
  NOT T J
  AND D J
*/

  function* inputGenerator() {
    const ssText = springScript.split('').map(c => c.charCodeAt(0));

    screenLog.log('inputGenerator ssText', ssText);

    while (ssText.length) {
      yield ssText.shift();
    }
  }

  const cpu = await computer(
    program, {
      inputGenerator,
      logObj: screenLog,
    }
  )();

  // screenLog.log('hello');

  let done = false;
  let final;
  let outputBuffer = '';

  while (!done) {
    let c = await cpu.next();
    screenLog.log(c);
    if (c.done) {
      done = true;
    }
    else {
      if (c.value == 10) {
        boxDisplay.log(outputBuffer);
        outputBuffer = '';
      }
      else if (c.value) {
        outputBuffer = outputBuffer + String.fromCharCode(c.value);
      }
    }
  }


}