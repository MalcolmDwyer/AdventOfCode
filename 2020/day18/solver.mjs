import { lineReader, gridReader } from '../../common.mjs';


const evaluate = (str) => {
  console.group('*-           ', str.join(''));

  const ch = str.pop();
  let v = parseInt(ch);

  if (ch === ')') {
    let p = 1;
    let index = str.length - 1;
    while (p) {
      console.log('    ::: ', index, str[index]);
      if (str[index] === ')') {
        p++;
      }
      else if (str[index] === '(') {
        p--;
      }
      index--;
    }
    console.log('(...) ix', index, str.slice(index + 2).join(''));
    const sub = evaluate(str.slice(index + 2));
    console.log('     --> ', sub);
    v = sub;
    str = str.slice(0, index + 1);
  }

  if (Number.isFinite(v)) {
    console.log('v', v);
    const op = str.pop();
    console.log('op', op);
    if (op === '+') {
      console.log(`------ ${v} plus ...`)
      console.groupEnd();
      return v + evaluate(str);
    }
    if (op === '*') {
      console.groupEnd();
      return v * evaluate(str);
    }
    console.groupEnd();
    return v;
  }
  // console.log(' ############################## this should not happen');
  console.groupEnd();
}

const evaluate2 = (str) => {
  console.group('*-           ', str.join(''));

  let ch;
  let v;
  // const ch = str.pop();
  // let v = parseInt(ch);
  const chIndex = str.join('').search(/([0-9]+)$/);
  if (chIndex >= 0) {
    ch = str.slice(chIndex);
    str = str.slice(0, chIndex);
    console.log(`chIndex ${chIndex}    ch |${ch.join('')}|     str  |${str.join('')}|`)
    v = parseInt(ch.join(''));
  }
  else {
    ch = str.pop();
    v = parseInt(ch);
  }
  
  if (ch === ')') {
    let p = 1;
    let index = str.length - 1;
    while (p) {
      // console.log('    ::: ', index, str[index]);
      if (str[index] === ')') {
        p++;
      }
      else if (str[index] === '(') {
        p--;
      }
      index--;
    }
    console.log('(...) ix', index, str.slice(index + 2).join(''));
    const sub = evaluate2(str.slice(index + 2));
    console.log('     --> ', sub);
    v = sub;
    str = str.slice(0, index + 1);
  }

  if (Number.isFinite(v)) {
    console.log('v', v);
    const op = str.pop();
    console.log('op', op);
    if (op === '+') {
      console.log(`------ ${v} plus ...`)
      // let v2 = str.pop();
      // let v2 = str[str.length-1];
      // console.log('v2', v2);

      const chIndex = str.join('').search(/([0-9]+)$/);
      if (chIndex >= 0) {
        ch = str.slice(chIndex);
        str = str.slice(0, chIndex);
        console.log(`chIndex ${chIndex}    ch |${ch.join('')}|     str  |${str.join('')}|`)
        let v2 = parseInt(ch.join(''));
        let s = v + v2;
        console.log('new thing', `|${[...str, s]}|`);

        return evaluate2([...str, s]);
        // return v + v2 + evaluate2(str);
      }




      
      // return evaluate2(`(${str.join('')}+${v})`.split(''));
      // return v + evaluate2(str);
      // let v2 = evaluate2(`(${str})`.split(''))
      console.groupEnd();
      return v + evaluate2(str);
      // return v + v2;
    }
    if (op === '*') {
      console.log('MULT', str.join(''));
      let v2 = evaluate2(`(${str})`.split(''))
      console.groupEnd();
      // return v * evaluate2(str);
      return v * v2;
    }
    console.groupEnd();
    return v;
  }
  // console.log(' ############################## this should not happen');
  console.groupEnd();
}


const solver = async () => {
  // let lines = await lineReader('test.txt');
  let lines = await lineReader('input.txt');

  // const i = '1 + (2 * 3) + (4 * (5 + 6))'
  const i = '1 + 2 * 3 + 4 * 5 + 6';
  // const i = '2 + 5';
  // const i = '2 + (5 * 3)';
  // const i = '(2 + 5) * 3';
  // const i = '7 * 3 + (4 * 5)';
  // const i = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2';
  // lines = [i];

  let sum = 0;


  // lines.forEach((line) => {
  //   const str = Array.from(line.replace(/\ /gi, ''));

  //   console.log('------------------------------------', str.join(''));
  //   const result = evaluate(str);

  //   console.log('result', result);
  //   sum += result;
  // })

  // console.log('p1', sum);
  
  lines.forEach((line) => {
    let str = Array.from(line.replace(/\ /gi, '')).join('');

    console.log('------------------------------------', str);
    str = str.replace(/\(/g, '(((');
    str = str.replace(/\)/g, ')))');
    str = str.replace(/\*/g, '))*((');
    str = str.replace(/\+/g, ')+(');
    str = '((' + str + '))';

    let arr = str.split('');
    const result = evaluate(arr);

    console.log('result', result);
    sum += result;
  })

  console.log('p2', sum);
}


solver();

