import { lineReader } from '../../common.mjs';

const b2v = (bits) => parseInt(bits.join(''), 2);

const printB = (bits) => bits?.length
  ? `${bits.slice(0, 40).join('')}${bits.length > 40 ? '...' : ''} ${bits.length}`
  : '___';

const parseLiteral = (bits) => {
  // console.group('parseLiteral', printB(bits));
  let valueBits = [];
  let i = 0;
  while (bits[i] === 1) {
    valueBits.push(...bits.slice(i + 1, i + 1 + 4));
    i += 5;
  }
  valueBits.push(...bits.slice(i + 1, i + 1 + 4));

  // console.log('valueBits', valueBits.join(''));
  const value = b2v(valueBits);
  // console.log('value:', value);
  const rest = bits.slice(i + 5);
  // console.log('rest', printB(rest));
  // console.groupEnd();
  return {
    value,
    rest,
  };
};

const alu = (op, params) => {
  console.log(`ALU _${op}_`, params)
  let value = 0;

  if (op === 0) {
    return params.reduce((acc, n) => acc + n, 0);
  }
  if (op === 1) {
    return params.reduce((acc, n) => acc * n, 1);
  }
  if (op === 2) {
    return Math.min(...params);
  }
  if (op === 3) {
    return Math.max(...params);
  }
  if (op === 5) {
    return (params[0] > params[1]) ? 1 : 0;
  }
  if (op === 6) {
    return (params[0] < params[1]) ? 1 : 0;
  }
  if (op === 7) {
    return (params[0] === params[1]) ? 1 : 0;
  }

  return value;
};

const str2b = (line) => line
  .split('')
  .map((c) => parseInt(c, 16))
  .map((n) => n.toString(2).padStart(4, '0'))
  .join('')
  .split('')
  .map((c) => parseInt(c, 2));

const parse = (bits) => {
  console.group('parse', printB(bits));
  let versions = 0;
  let value = 0;
  let [versionBits, opTypeBits, rest] = [
    bits.slice(0, 3),
    bits.slice(3, 6),
    bits.slice(6),
  ];

  const V = b2v(versionBits);
  const op = b2v(opTypeBits);

  versions += V;

  if (op === 4) {
    // console.log('Literal', rest.join(''))
    // let value;
    (
      {value, rest} = parseLiteral(rest)
    );

    console.groupEnd();
    return ({
      version: versions,
      value: value,
      rest,
    });
  }

  console.log(`V: ${V}`);
  console.log(`op ${op}`);

  const lengthTypeId = rest[0];
  rest = rest.slice(1);

  console.log('I', lengthTypeId);

  if (lengthTypeId === 0) {
    const subPacketLength = b2v(rest.slice(0, 15));
    rest = rest.slice(15);

    let subPackets = rest.slice(0, subPacketLength);
    rest = rest.slice(subPacketLength);

    let opParams = [];
    while(subPackets.length) {
      let {
        version: subVersion,
        value: subValue,
        rest: subP,
      } = parse(subPackets);
      opParams.push(subValue);
      subPackets = subP;
      versions += subVersion;
    }
    value = alu(op, opParams);
  }
  else { // lengthTypeId === 1
    let numberOfSubPackets = b2v(rest.slice(0, 11));
    rest = rest.slice(11);

    let opParams = [];
    while (numberOfSubPackets) {
      numberOfSubPackets--;
      let subVersion, subValue;

      ({
        version: subVersion,
        value: subValue,
        rest,
      } = parse(rest));
      // rest = r;
      opParams.push(subValue);
      versions += subVersion;
    }
    value = alu(op, opParams);
  }
  console.groupEnd();
  return {
    version: versions,
    value,
    rest,
  }

  // const [lengthTypeId, ]

  // const len = parseInt(lengthType.join(''), 2);
  // console.log('binary', binary.join(''));
  // console.log('version', V);
  // console.log('op', operator);
  // console.log('len', len);
  // console.log('rest', rest.join(''), rest.length);
};

const run = (line) => {
  console.log('====================================');
  printB(str2b(line));
  return parse(str2b(line));
}


const solver = async () => {
  // let lines = await lineReader('test.txt');
  let lines = await lineReader('input.txt');
  const input = lines[0];

  const result = run(input);
  // let lines = await lineReader('input.txt', parseLine);
  console.log('p1', result.version);
  console.log('p2', result.value);
}

const t1 = 'D2FE28';
const t2 = '38006F45291200';
const t3 = 'EE00D40C823060';
const t4 = '8A004A801A8002F478'; // 16
const t5 = '620080001611562C8802118E34'; // 12
const t6 = 'C0015000016115A2E0802F182340'; // 23
const t7 = 'A0016C880162017C3686B18A3D4780'; // 31
const t8 = 'C200B40A82' // 1 + 2 => 3
const t11 = 'CE00C43D881120';
const t15 = '9C0141080250320F1802104A08';
// let result = run(t11);

// console.log('---------------------');
// console.log(result);
await solver();
