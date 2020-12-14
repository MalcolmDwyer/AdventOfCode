import { lineReader, gridReader } from '../../common.mjs';

const required = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
];

const optional = [
  'cid',
];

const rules = {
  byr: (v) => {
    const n = parseInt(v);
    // console.log('n', n, v);
    return Number.isFinite(n) && (n >= 1920) && (n <= 2002)
  },
  iyr: (v) => {
    const n = parseInt(v);
    // console.log('n', n, v);
    return Number.isFinite(n) && (n >= 2010) && (n <= 2020)
  },
  eyr: (v) => {
    const n = parseInt(v);
    // console.log('n', n, v);
    return Number.isFinite(n) && (n >= 2020) && (n <= 2030)
  },
  hgt: (v) => {
    const parts = /(\d*)([cm|in]*)/.exec(v);
    console.log('hgt', parts[1], '|', parts[2]);
    if (parts[1] && parts[2]) {
      const n = parseInt(parts[1]);
      if (parts[2] === 'in') {
        return (n >= 59 && n <= 76)
      }
      else if (parts[2] === 'cm') {
        return (n >= 150 && n <= 193)
      }
    }
    return false;
  },
  hcl: (v) => {
    return /^#[0-9a-f]{6}$/.test(v);
  },
  ecl: (v) => {
    return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v);
  },
  pid: (v) => {
    return /^[0-9]{9}$/.test(v);
  }
}
//! 151

const solver = async () => {
  const records = await lineReader('./input.txt');

  console.log(records[0]);

  const valid = records.filter((record) => required.every((key) => record.includes(`${key}:`)));

  console.log('v', valid.length);
}

const solver2 = async () => {
  const lineGroups =  await lineReader('./input.txt');
  const records = lineGroups.map(lineGroup => lineGroup.split('\n').join(' '));
  console.log(records);

  const valid = records.filter(
    (record) => {
      const fields = record.split(' ');
      // let valid = true;
      return required.every(
        (key) => {
          if (!record.includes(`${key}:`)) {
            return false;
          }
          const s = record.indexOf(`${key}:`);
          const r = record.slice(s).split(' ')[0].split(':')[1]
          return rules[key](r);
        }
      );
    }
  );
  console.log('v2', valid.length);

}

solver2();
