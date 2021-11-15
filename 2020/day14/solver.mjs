import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };

const parseMask = (line) => {
  const parts =  /mask \= ([01X]*)$/.exec(line);
  // console.log('parts', parts);
  return parts[1];
}

const parseMem = (line) => {
  const parts = /^mem\[(\d*)\] \= (\d*)/.exec(line);
  return {
    addr: parts[1],
    val: BigInt(parts[2]),
  }
}


const solver = async () => {
  let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt');

  const maxMask = BigInt(Math.pow(2, 36) - 1);

  let mem = {};
  let mask = '';
  let maskOr = BigInt(0);
  let maskAnd = maxMask;

  console.log(' ', maskAnd.toString(2), maskAnd.toString(2).length);

  lines.forEach((line) => {
    if (line[1] === 'a') {
      // set mask
      mask = parseMask(line);

      maskAnd = maxMask;
      maskOr = 0;
      mask.split('').forEach((c, ix) => {
        let p = 35 - ix;
        if (c === '1') {
          maskOr = BigInt(maskOr) | (BigInt(1) << BigInt(p));
          // maskOr = maskOr | Math.pow(2, p);
          // console.log('maskOr', (maskOr >>> 0).toString(2));
          // console.log('maskOr ', maskOr.toString(2).padStart(36, '0'));
        }
        else if (c === '0') {
          maskAnd = BigInt(maskAnd) & ~(BigInt(1) << BigInt(p));
          // maskAnd = maskAnd & BigInt((~Math.pow(2, p) >>> 0));
          // console.log('maskAnd', (maskAnd >>> 0).toString(2));
          // console.log('maskAnd', maskAnd.toString(2).padStart(36, '0'));
        }
      });

      console.log('m', mask);
      console.log('|', maskOr.toString(2).padStart(36, '0'));
      console.log('&', maskAnd.toString(2).padStart(36, '0'));
    }
    else {
      // set mem

      const { addr, val } = parseMem(line);

      // const realVal = (val >>> 0) & (maskAnd >>> 0) | (maskOr >>> 0);
      const realVal = val & maskAnd | maskOr;
      console.log(`----------addr ${addr} val ${val}  ---> ${realVal}`);
      console.log(`V ${(val).toString(2).padStart(36, '0')}`);
      console.log(`M ${(mask).toString(2).padStart(36, '0')}`);
      console.log(`& ${(maskAnd).toString(2).padStart(36, '0')}`);
      console.log(`| ${(maskOr).toString(2).padStart(36, '0')}`);
      console.log(`> ${(realVal).toString(2).padStart(36, '0')}`);


      mem[`${addr}`] = (realVal);
    }
  });

  let sum = BigInt(0);
  Object.keys(mem).forEach((key) => {
    console.log(`mem[${key}] = ${(mem[key])})`);
    sum += (mem[key]);
  })

  console.log('p1', sum);
}


// solver();
// 104196715341
// 550873314125
// 554353463365


const solver2 = async () => {
  let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt');

  const maxMask = BigInt(Math.pow(2, 36) - 1);

  let mem = {};
  let mask = '';
  let maskOne = BigInt(0);
  let maskFloat = BigInt(0);

  lines.forEach((line) => {
    if (line[1] === 'a') {
      // set mask
      mask = parseMask(line);

      maskFloat = BigInt(0);
      maskOne = BigInt(0);
      mask.split('').forEach((c, ix) => {
        let p = 35 - ix;
        if (c === '1') {
          maskOne = BigInt(maskOne) | (BigInt(1) << BigInt(p));
        }
        else if (c === 'X') {
          maskFloat = BigInt(maskFloat) | (BigInt(1) << BigInt(p));
        }
      });

      console.log('m', mask);
      console.log('|', maskOne.toString(2).padStart(36, '0'));
      console.log('F', maskFloat.toString(2).padStart(36, '0'));
    }
    else {
      // set mem

      const { addr, val } = parseMem(line);

      const realAddr = BigInt(addr) | maskOne;

      let addresses = [realAddr];
      maskFloat.toString(2).padStart(36, '0').split('').forEach((b, ix) => {
        let p = 35 - ix;
        if (b === '1') {
          // console.log('float ', p)
          const bitmask = BigInt(0) | (BigInt(1) << BigInt(p));
          
          let newAddr = []
          addresses.forEach(ad => {
            newAddr.push(ad | bitmask);
            newAddr.push(ad & (~(bitmask)));
          });
          addresses = addresses.concat(newAddr);
        }
      });

      addresses.forEach((ad) => {
        // console.log(`mem[${ad}] = ${val}`)
        mem[`${ad}`] = (val);
      });

      // console.log('addresses', addresses.join(', '));

      // const realVal = (val >>> 0) & (maskAnd >>> 0) | (maskOne >>> 0);
      // const realVal = val & maskFloat | maskOne;
      // console.log(`----------addr ${addr} val ${val}  ---> ${realVal}`);
      // console.log(`V ${(val).toString(2).padStart(36, '0')}`);
      // console.log(`M ${(mask).toString(2).padStart(36, '0')}`);
      // console.log(`F ${(maskFloat).toString(2).padStart(36, '0')}`);
      // console.log(`| ${(maskOne).toString(2).padStart(36, '0')}`);
      // console.log(`> ${(realVal).toString(2).padStart(36, '0')}`);
    }
  });

  let sum = BigInt(0);
  Object.keys(mem).forEach((key) => {
    console.log(`mem[${key}] = ${(mem[key])})`);
    sum += (mem[key]);
  })

  console.log('p1', sum);
}


solver2();