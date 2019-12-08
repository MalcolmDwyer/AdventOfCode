import { lineReader } from '../../common.mjs';


async function solver() {
  // const lines = await lineReader('./input.txt');

  // if (!lines) {
  //   console.log('no input lines - bailing');
  //   return;
  // }
  const m = 146810;
  const n = 612564;

  let count = 0;
  for (let x = m; x <= n; x++) {
    if (test2(x)) {
      count++;
    }
  }

  console.log('count: ', count);
}

const test = x => {
  let chars = `${x}`.split('');

    let adj = false;
    let desc = false;

    for (let c = 1; c < chars.length; c++) {
      if (chars[c] == chars[c-1]) {
        adj = true;
      }
      if (parseInt(chars[c]) < parseInt(chars[c-1])) {
        desc = true;
      }
    }

    if (adj && !desc) {
      return true
    }
    return false;
}

const test2 = x => {
  // console.log(x, '==============');
  let chars = `${x}`.split('');

    let adj = false;
    let desc = false;

    for (let c = 1; c < chars.length; c++) {
      if (parseInt(chars[c]) < parseInt(chars[c-1])) {
        desc = true;
      }
    }

    if (desc) {
      return false;
    }

    let t;
    const reg = /(.)(\1+)/g
    while (t = reg.exec(`${x}`)) {
      if (t[0].length <= 2 && t[2].length <= 2) {
        adj = true;
      }
    }

    if (adj) {
      // console.log(x);
      return true
    }
    return false;
}

solver();

// console.log(test2(111111));
// console.log(test2(223450));
// console.log(test2(123789));

// console.log(test2(112233));
// console.log(test2(123444));
// console.log(test2(111122));
// console.log(test2(447778));
// ! 87910
// ! 127708

//2:

// ! 1194
// !668
// ! 804
// ! 992