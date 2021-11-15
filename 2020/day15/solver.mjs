import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };


const play = (list, end) => {
  // let list = [..._list].reverse();

  const lastSeen = {};
  list.slice(0, -1).forEach((n, ix) => {
    lastSeen[n] = ix;
  })

  // console.log(lastSeen);

  // console.log('list', list);
  let t = list[list.length - 1];
  for (let i = list.length; i < end; i++) {
    // console.log(''); console.log('');
    // console.log(`[${i}]  --------------------------------- T: ${t}`);

    const last = lastSeen[t];
    lastSeen[t] = i - 1;
    // let p = list.findIndex((n, ix) => ix && (n === list[0]));
    // let t = list[0];
    if (last === undefined) {
      // console.log(`${t} not found`)
      // lastSeen[0] = i;
      t = 0;
      // console.log(`lastSeen[${t}] <= ${i}`);
    }
    else {
      // console.log(`Last seen at ${last} .... ${i - 1} - ${last} => ${i - 1 - last}`);
      t = i - 1 - last;
      // console.log(`${t} <= ${i} - ${lastSeen[t]}      ==> ${t}`)
      // lastSeen[t] = i;
      // console.log(`lastSeen[${t}] <= ${i}`);
    }

    // console.log(`[${i+1}th] :  ${t}`);
    // console.log(lastSeen);
    // if (p === -1) {
    //   // console.log(`${list[0]} not found`);
    //   list.unshift(0)
    // }
    // else {
    //   // console.log(`${list[0]} found at ${p + 1}`);
    //   list.unshift(p);
    // }
    // console.log(`[${i}]   ${list[0]}                    ${list.join(', ')}`);
    // console.log(`[${i}]   ${list[0]}`);

    if (!((i + 1) % 1000000)) {
      console.log(`[${i+1}th] :  ${t}`);
    }
  }
  console.log(`[last] :  ${t}`);
  // console.log(list[0]);
}

const input = [8,13,1,0,18,9];
const test0 = [0, 3, 6];
const test1 = [1, 3, 2];
const test6 = [3, 1, 2];

const solver = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');


  // play(test0, 10);
  // play (test6, 2020);
  play(input, 30000000);
}


solver();

