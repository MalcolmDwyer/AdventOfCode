import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };


const solver = async () => {
  let groups = await lineReader('input.txt', undefined, '\n\n');

  // console.log(groups.length);
  let total = 0;
  groups.forEach(group => {
    let g = 0;

    const lines = group.split('\n');
    const s = new Set([]);
    lines.forEach((line) => {
      line.split('').forEach(c => {
        s.add(c);
      });
    });
    const count = Array.from(s).length;
    // console.log(count);
    total += count;
  });
  console.log('t', total);
}

const solver2 = async () => {
  let groups = await lineReader('input.txt', undefined, '\n\n');

  // console.log(groups.length);
  let total = 0;
  groups.forEach(group => {
    let g = 0;
    // console.log('g----------')

    const lines = group.split('\n');
    // const s = new Set([]);
    const s = {};

    let most = 1;
    lines.forEach((line) => {
      line.split('').forEach(c => {
        // s.add(c);
        if (!s[c]) {
          s[c] = 1;
        }
        else {
          const n = s[c] + 1;
          s[c] = n;
          if (n > most) {
            most = n
          }
        }
      });
    });
    // console.log(s);
    // // const count = Array.from(s).length;
    // let all = true;
    let count = 0;
    Object.keys(s).forEach((c) => {
      if (s[c] === lines.length) {
        count++;
      }
    })
    // console.log('all', all);
    // if (all) {
    //   total += most;
    // }
    
    // console.log(count);
    total += count;
  });
  console.log('t', total);
}
// !241


solver2();

