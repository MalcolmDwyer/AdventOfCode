import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
const parseLine = line => parseInt(line);

const bingoCard = (lines) => {
  console.log('LINES', lines);
  let d = [];
  lines.forEach((l, li) => l.split(' ').filter(Boolean).map((n) => parseInt(n)).forEach((n, ni) => {
    d.push({
      n,
      r: li,
      c: ni,
    });
  }));
  return d;
};

let sheets = [];

const markSheet = (ix, n) => {
  if (sheets[ix][0].hasWon) {
    return;
  }
  // if (sheet[0].hasWon) {
  //   return sheet;
  // }
  // sheet = sheet.map((b) => {
  //   if (b.n === n) {
  //     console.log('marking', b);
  //     return ({ ...b, marked: true });
  //   }
  //   return b;
  // });

  sheets[ix] = sheets[ix].map((b) => {
    if (b.n === n) {
      console.log('marking', ix, b);
      return ({ ...b, marked: true });
    }
    return b;
  });

  // console.log('marked sheet', sheet);
  // return sheet;
}

const checkSheet = (ix) => {
  let win = false;
  if (sheets[ix][0].hasWon) {
    return false;
  }
  // if (sheet[0].hasWon) {
  //   return false;
  // }

  // console.log('checkSheet', sheet);

  [0, 1, 2, 3, 4].forEach((r) => {
    const row = sheets[ix].filter((b) => b.r === r);
    if (row.every((b) => b.marked)) {
      win = true;
    }
  });

  [0, 1, 2, 3, 4].forEach((c) => {
    const col = sheets[ix].filter((b) => b.c === c);
    if (col.every((b) => b.marked)) {
      win = true;
    }
  });
  // console.log('win:', win);
  if (win) {
    // console.log('WIN', sheets[ix]);
    sheets[ix][0].hasWon = true;
    return true;
  }
  return false;
}

const solver = async () => {
  // let lines = await lineReader('test.txt');
  let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);

  

  const calls = lines[0].split(',').map((n) => parseInt(n));
  console.log('p1', calls);

  // let sheets = [];

  for (let i = 1; i < lines.length; i = i + 5) {
    sheets.push(bingoCard(lines.slice(i, i + 5)));
  }

  // console.log('sheets', sheets);

  let winnerP2 = false;

  let seq = [...calls];
  let winCount = 0;
  while (!winnerP2 && seq.length) {
    let n = seq.shift();

    console.log(`CALLING ${n} [rem ${seq.length}] wins:${winCount}/${sheets.length  - 1}`);

    // sheets = sheets.map((sheet) => markSheet(sheet, n));
    // sheets.forEach((sheet, ix) => markSheet(ix, n));
    for(let ix = 0; ix < sheets.length; ix++) {
      if (!sheets[ix][0].hasWon) {
        markSheet(ix, n);
      }
      
      const didWin = checkSheet(ix);


    // }

    // const winIndex = sheets.findIndex((sheet, ix) => checkSheet(ix));

    // // if (win) {
    // if (winIndex > 0) {
      if (didWin) {
        const win = sheets[ix];
        sheets[ix][0].hasWon = true;
        console.log('winner', sheets[ix]);

        const boardTotal = win.filter((b) => !b.marked).reduce((m, bn) => {
          return m + bn.n;
        }, 0);

        console.log('PART 1:', boardTotal, n, boardTotal * n);
        // break;

        winCount++;
        if (winCount === sheets.length) {
          // const boardTotal = win.filter((b) => !b.marked).reduce((m, bn) => {
          //   return m + bn.n;
          // }, 0);
          // console.log('PART 2:', boardTotal, n, boardTotal * n);
          console.log('PART 2 ^^^');
          winnerP2 = true;
          break;
        }
      }
    }
  }
  // console.log('sheets after', sheets);
}


solver();
