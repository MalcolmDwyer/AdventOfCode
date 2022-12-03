import { lineReader, gridReader } from '../../common.mjs';

const parseLine = line => {
  return line
    .split('')
    .map((c) => {
      // if (Number.isNaN(parseInt(c))) {
      if (c === '[' || c === ']') {
        return c;
      }
      else if (c === ',') {
        return null;
      }
      else {
        return parseInt(c);
      }
    })
    .filter((c) => c !== null);
};

const add = (a, b) => ['[', ...a,...b, ']'];

const reduce = (inp) => {
  // console.log('');
  // console.log('REDUCE____', inp.join(''))
  let s = [...inp];
  let lBracketCount = 0;
  let prevValueIndex = -1;
  let nextValueIndex = -1;
  let explodeIndex = null;

  // Check for explode
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '[') {
      lBracketCount++;
    }
    else if (s[i] === ']') {
      lBracketCount--;
    }
    if (Number.isFinite(s[i]) && lBracketCount >= 5) {
      explodeIndex = i;
      // console.log('explode at ', i);
      break;
    }
    else if (Number.isFinite(s[i])) {
      prevValueIndex = i;
    }
  }

  if (explodeIndex) {
    const left = s[explodeIndex];
    const right = s[explodeIndex + 1];
    for (let i = explodeIndex + 2; i < s.length; i++) {
      if (Number.isFinite(s[i])) {
        nextValueIndex = i;
        break;
      }
    }

    if (prevValueIndex >= 0) {
      s[prevValueIndex] += left;
    }
    if (nextValueIndex >= 0) {
      s[nextValueIndex] += right;
    }

    s.splice(explodeIndex - 1, 4, 0);
    // console.log('after explode:', s.length);
    // console.log(s.join(''));
    s = reduce(s);
  }
  else {
    let splitIndex = -1;
    for (let i = 0; i < s.length; i++) {
      if (s[i] >= 10) {
        splitIndex = i;
        break;
      }
    }
    
    if (splitIndex >= 0) {
      // console.log('splitIndex', splitIndex, s[splitIndex]);
      const nl = Math.floor(s[splitIndex] / 2);
      const nr = Math.ceil(s[splitIndex] / 2)
      s.splice(splitIndex, 1, '[', nl, nr, ']');
      // console.log('after split:', s.length);
      // console.log(s.join(''));
      s = reduce(s);
    }
  }
  return s;
};

const magnitude /* POP POP! */ = (inp) => {
  let s = [...inp];
  let maxDepth = 0;
  let maxDepthIndex = null;
  let lBracketCount = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '[') {
      lBracketCount++;
    }
    else if (s[i] === ']') {
      lBracketCount--;
    }
    if (lBracketCount > maxDepth) {
      maxDepth = lBracketCount;
      maxDepthIndex = i;
    }
  }

  if (maxDepth) {
    let l = s[maxDepthIndex + 1];
    let r = s[maxDepthIndex + 2];
    // console.log('mag @', maxDepthIndex, l, r);
    s.splice(maxDepthIndex, 4, (l*3 + 2*r))
    // console.log(s.join(''));
    s = magnitude(s);
  }
  return s;
}

const solver = async () => {
  let lines = await lineReader('input.txt', parseLine);
  let v = lines[0];
  for (let i = 1; i < lines.length; i++) {
    // console.log(`add "${v}" + "${lines[i]}"`);
    v = add(v, lines[i]);
    // console.log(v.join(''));
    v = reduce(v);
    
  }

  // console.log('-', v.join(''));
  // console.log(lines[0]);
  // let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p1', magnitude(v)[0]);


  // console.log('----------------------------------------')
  // console.log('MAG...', magnitude(parseLine('[[1,2],[[3,4],5]]')));
}

const solver2 = async () => {
  let lines = await lineReader('input.txt', parseLine);

  let max = 0;

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (i == j) {
        continue;
      }

      let v = add(lines[i], lines[j]);
      v = reduce(v);
      let m = magnitude(v);

      if (m[0] > max) {
        max = m[0];
      }
    }
  }
  console.log('p2', max);
}


solver();
solver2();
