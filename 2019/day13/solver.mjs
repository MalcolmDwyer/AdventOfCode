import computer from './computer.mjs';
import blessed from 'neo-blessed';
import { lineReader } from '../../common.mjs';

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';

  let lines = await lineReader(file);
  let data = lines[0].split(',').map(n => parseInt(n));

  // Part 1
  run(data, true);
}

solver();


let display = blessed.screen({
  smartCSR: true
});
display.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

const run = async (data, pay) => {

  let boxDisplay = blessed.box({
    // left: 0,
    // top: 0,
    width: 44,
    height: 28,
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      bg: 'magenta',
      border: {
        fg: '#f0f0f0'
      },
      // hover: {
      //   bg: 'green'
      // }
    }
  });

  let segmentDislay = blessed.box({
    top: 30,
    width: 44,
    height: 3,
    border: {
      type: 'line',
    },
  })

  let screenLog = blessed.log({
    left: 50,
    height: '100%',
    border: {
      type: 'line',
    },
  })

  display.append(boxDisplay);
  display.append(screenLog);
  display.append(segmentDislay);
  boxDisplay.focus();
  display.render();

  const screen = [];
  let done = 0;
  let segment = '';

  let program = data;
  if (pay) {
    program[0] = 2;
  }

  let joystick = 0;
  let ballX = 0;
  let paddleX = 0;

  let inputFn = () => {
    joystick = 0;
    if (ballX !== paddleX) {
      joystick = ((ballX - paddleX) > 0)
        ? 1
        : -1
    }
    screenLog.log(`Input: Ball: ${ballX}   paddle: ${paddleX}  => joystick: ${joystick}`)
    return joystick;
  }

  const inputPromise = () => (
    new Promise((resolve, reject) => {
      // setTimeout(() => {
        joystick = 0;
        if (ballX !== paddleX) {
          joystick = ((ballX - paddleX) > 0)
            ? 1
            : -1
        }
        screenLog.log(`Input: Ball: ${ballX}   paddle: ${paddleX}  => joystick: ${joystick}`)
        resolve(joystick);
      // }, 1);
    })
  );

  const cpu = await computer(
    program, {
      // inputPromise,
      inputFn,
      logObj: screenLog,
    })();

  while (!done) {
    let xo = cpu.next();
    let x = xo.value;
    let yo = cpu.next();
    let y = yo.value;
    let ko = cpu.next();
    let k = ko.value;

    if (xo.done || yo.done || ko.done) {
      done = true;
      break;
    }

    if (x === -1 && y === 0) {
      segment = k;
      segmentDislay.setContent(`${segment}`);
    }

    if (k === 3) {
      paddleX = x;
    }

    if (k === 4) {
      ballX = x;
    }

    if (!screen[y]) {
      screen[y] = [];
    }

    screen[y][x] = k;
    drawScreen(screen, segment, joystick, { blessedBox: boxDisplay, blessedScreen: display });
    display.render();
  }

  drawScreen(screen, segment, joystick, { blessedBox: boxDisplay, blessedScreen: display });

  // process.stdout.write("\u001b[2J\u001b[0;0H");

  // let count = 0;
  // screen.forEach(line => {
  //   let str = '';
  //   // console.log(line.join(''));
  //   line.forEach(c => {
  //     if (c === 0) {
  //       str += ' ';
  //     }
  //     if (c === 1) {
  //       str += '#';
  //     }
  //     if (c === 2) {
  //       // count++;
  //       str += 'X';
  //     }
  //     if (c === 3) {
  //       str += '_';
  //     }
  //     if (c === 4) {
  //       str += 'O';
  //     }
  //   })
  //   console.log(str);
  // });
  // console.log(`[ ${segment} ]`);

  // console.log('p1', count);

};

const drawScreen = (screen, segment, joystick, {blessedBox, blessedScreen}) => {
  // let content = [];
  if (blessedBox) {
    screen.forEach((line, ix) => {
      let str = '';
      line.forEach(c => {
        if (c === 0) {
          str += ' ';
        }
        if (c === 1) {
          str += '#';
        }
        if (c === 2) {
          str += 'X';
        }
        if (c === 3) {
          str += '_';
        }
        if (c === 4) {
          str += 'O';
        }
      })
      // console.log(str);
      // content.push(str);
      blessedBox.setLine(ix, str);
    });
    // blessedScreen.render();
    // box.setContent(content);
    // console.log(`[ ${segment} ]   J: ${joystick}`);
  }
  else {
    process.stdout.write("\u001b[2J\u001b[0;0H");
    screen.forEach(line => {
      let str = '';
      line.forEach(c => {
        if (c === 0) {
          str += ' ';
        }
        if (c === 1) {
          str += '#';
        }
        if (c === 2) {
          str += 'X';
        }
        if (c === 3) {
          str += '_';
        }
        if (c === 4) {
          str += 'O';
        }
      })
      console.log(str);
    });
    console.log(`[ ${segment} ]   J: ${joystick}`);
  }
  // console.log(`[ ${segment} ]   J: ${joystick}`);
}


// !14726 (37 * 398)