import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };
// const parseLine = line => parseInt(line);

const parseLine = line => {
  // return /([abcdefg]+)+ | ([abcdefg])+/.exec(line);
  const [d1, d2] = line.split('|');
  // console.log('d1/d2', d1, d2);
  const signals = d1.split(' ').filter(Boolean);
  // console.log('sig', signals);
  const digits = d2.split(' ').filter(Boolean);
  return ({
    signals,
    digits,
  });
};


const solver = async () => {
  let lines = await lineReader('input.txt', parseLine);
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);

  let count = 0;
  lines.forEach(({signals, digits}) => {
    // console.log(signals);
    // console.log(digits);
    digits.forEach((digit) => {
      if ([2, 3, 4, 7].includes(digit.length)) {
        count++;
      }
    })
  })
  console.log('p1', count);
}

const digitInfo = {
  '0': ['a', 'b', 'c', 'e', 'f', 'g'],
  '1': ['c', 'f'],
  '2': ['a', 'c', 'd', 'e', 'g'],
  '3': ['a', 'c', 'd', 'f', 'g'],
  '4': ['b', 'c', 'd', 'f'],
  '5': ['a', 'b', 'd', 'f', 'g'],
  '6': ['a', 'b', 'd', 'e', 'f', 'g'],
  '7': ['a', 'c', 'f'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
};

// 2: 1
// 3: 7
// 4: 4
// 5: 2, 3, 5
// 6: 0, 6, 9
// 7: 8

const deduceSegments = (signals) => {
  const sig_1 = signals.filter((s) => s.length === 2);
  const sig_7 = signals.filter((s) => s.length === 3);
  const sig_4 = signals.filter((s) => s.length === 4);
  const sig_8 = signals.filter((s) => s.length === 7);

  const sig_069 = signals.filter((s) => s.length === 6);
  const sig_235 = signals.filter((s) => s.length === 5);

  // console.log('1', sig_1, '4', sig_4, '7', sig_7, '8', sig_8, '069', sig_069, '235', sig_235);

  if (!sig_7.length) {
    console.error('NO SEVEN!!!')
  }
  if (!sig_1.length) {
    console.error('NO ONE!!!')
  }

  const ab = sig_1[0];
  const a = sig_7[0].split('').filter((c) => !sig_1[0].includes(c))[0];
  const cf = sig_7[0].split('').filter((c) => sig_1[0].includes(c));
  const bd = sig_4[0].split('').filter((c) => !cf.includes(c));

  const zero = sig_069.filter((sig) => !bd.every((b_d) => sig.includes(b_d)));
  if (!zero.length) {
    console.log('NO ZERO!');
  }
  // console.log('zero', zero);
  const d = bd.filter((b_d) => !zero[0].includes(b_d))[0];
  const b = bd.filter((b_d) => b_d !== d)[0];

  const six = sig_069.filter((sig) => !cf.every((c_f) => sig.includes(c_f)));
  if (!six.length) {
    console.log('NO ZERO!');
  }
  // console.log('6', six);
  const c = cf.filter((c_f) => !six[0].includes(c_f))[0];
  const f = cf.filter((c_f) => c_f !== c)[0];

  const eg = 'abcdefg'.split('').filter((x) => ![a,b,c,d,f].includes(x));

  const threefive = sig_235.filter((sig) => !eg.every((e_g) => sig.includes(e_g)));
  // console.log('threefive', threefive);

  const g = eg.filter((e_g) => threefive[0].includes(e_g))[0];
  const e = eg.filter((e_g) => e_g !== g)[0];
  // const e = eg.filter((e_g) => threefive.includes(e_g));

  // 6 and 9 have both bd, 0 has only b

  // const e = '_';
  // const g = '_';

  const segmentsMap = {
    a,
    b,
    c,
    d,
    f,
    // cf,
    // bd,
    // eg,
    e,
    g,
  };

  const numMap = {
    [[a, b, c, e, f, g].sort().join('')]: '0',
    [[c, f].sort().join('')]: '1',
    [[a, c, d, e, g].sort().join('')]: '2',
    [[a, c, d, f, g].sort().join('')]: '3',
    [[b, c, d, f].sort().join('')]: '4',
    [[a, b, d, f, g].sort().join('')]: '5',
    [[a, b, d, e, f, g].sort().join('')]: '6',
    [[a, c, f].sort().join('')]: '7',
    [[a, b, c, d, e, f, g].sort().join('')]: '8',
    [[a, b, c, d, f, g].sort().join('')]: '9',
  }

  console.log(segmentsMap);
  console.log(numMap);

  return numMap;
}

const solver2 = async () => {
  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  let lines = await lineReader('input.txt', parseLine);

  let sum = 0;

  lines.forEach(({signals, digits}) => {
    const numMap = deduceSegments(signals);
    console.log('digits', digits);
    const strval = digits.map(
      (digit) => {
        return numMap[digit.split('').sort().join('')]
      }
    );
    console.log('strval', strval.join(''));
    const numVal = Number(strval.join(''));
    console.log(numVal, typeof numVal);
    sum += numVal;
  });

  console.log('p2', sum);
}


// solver();
solver2();

/*

for (let i = 0; i < X; i++) {

}

for (let i = 0; i < X; i++) {
  for (let j = 0; j < Y; j++) {
  
  }
}


*/