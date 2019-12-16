import { lineReader } from '../../common.mjs';
// import { lcm } from 'mathjs';
// import math from 'mathjs';

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';

  let lines = await lineReader(file);
  let data = lines.map(n => parseLine(n));

  // Part 1 / 2
  run(data);
}

const parseLine = line => {
  let [input, output] = line.split(' => ');
  let inputStrs = input.split(', ')
  
  let inputs = inputStrs.map(str => {
    let rx = /([0-9]+) ([A-Z]+)/g;
    let parts = rx.exec(str.trim())
    let q = parseInt(parts[1]);
    let type = parts[2];
    return { q, type};
  });

  let rx2 = /(\d*) (\w*)/g;
  let outParts = rx2.exec(output);
  let q = parseInt(outParts[1]);
  let type = outParts[2];

  return {
    inputs,
    q,
    type,
  };
}

solver();

const run = (data) => {
  // console.log(data);

  let ore = 0;

  const d = {};

  data.forEach( obj => {
    d[obj.type] = obj;
    d[obj.type].avail = 0;
  });

  console.log(d);
  // console.log(JSON.stringify(d, null, '  '));

  // let done = false;
  // while (!done) {

  // }

  // part 1
  // ore = getFuel('FUEL', d);
  // console.log('ore', ore);
  // console.log(data);

  let supply = 1000000000000;
  let remain = supply;
  let count = 0;
  let lastProd;
  while (remain > 0) {
    remain -= getFuel('FUEL', d);
    if (!(count % 100000)) {
      let production = supply / ((supply - remain) / count);
      let diff = lastProd - production;
      console.log(remain, count, `${production}`, diff);
      lastProd = production;
    }
    
    count++;
  }
  console.log('FUEL', count - 1);
  // ore = getFuel('FUEL', d);
  // console.log('ore', ore);
};

const getFuel = (node, d) => {
  // console.group(`Making ${d[node].q} ${node}`)
  let oreUsed = d[node].inputs.reduce((acc, input) => {
    if (input.type === 'ORE') {
      // console.log(`USING ${input.q} ORE`)
      acc = acc + input.q;
    }
    else {
      while (d[input.type].avail < input.q) { // d[input.type].q
        // console.log(`need ${input.q} ${input.type} (${d[input.type].avail} available)`);
        let ou = getFuel(input.type, d);
        acc += ou;
        // console.log(`   Used ${ou} ORE`);
        d[input.type].avail += d[input.type].q;
      }
      d[input.type].avail -= input.q;
      // console.log(`    Avail: ${input.type}: ${d[input.type].avail}`)
    }
    return acc;
  }, 0);
  // console.log('oreUsed: ', oreUsed);
  // console.groupEnd();
  return oreUsed;
}