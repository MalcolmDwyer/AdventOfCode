import { lineReader } from '../../common.mjs';
import {lcm} from 'mathjs';

const getMap = (lines) => {
  const mapLines = lines.slice(1).filter(Boolean).map((line) => {
    const parts = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/.exec(line);

    return {
      s: parts[1],
      l: parts[2],
      r: parts[3],
    }
  });

  const map = new Map();
  mapLines.forEach(({s,l,r}) => map.set(s, {s, l, r}));

  const allAs = mapLines.filter(({s}) => s[2] === 'A').map(m => m.s)

  return {map, allAs};
}

const solver = async () => {
  let lines = await lineReader('input.txt');
  const directions = lines[0].split('');

  const {map} = getMap(lines);

  let dirIx = 0
  let n = map.get('AAA');
  let count = 0;

  while (n.s !== 'ZZZ') {
    if (directions[dirIx] === 'L') {
      n = map.get(n.l)
    }
    else {
      n = map.get(n.r)
    }
    dirIx = (dirIx + 1)%directions.length
    count++;
  }

  console.log('p1', count);
}

const solver2 = async () => {
  let lines = await lineReader('input.txt');
  const directions = lines[0].split('');

  const {map, allAs} = getMap(lines);
  let dirIx = 0
  let ns = allAs.map((a) => map.get(a));
  let count = 0;
  let counts = [];

  while(!ns.every(({done}) => done)) {
    ns = ns.map(({s, l,r, done}, ix) => {
      if (done) {
        return {done: true}
      }
      if (s[2] === 'Z') {
        counts[ix] = count;
        return {done: true}
      }
      if (directions[dirIx] === 'L') {
        return map.get(l)
      }
      else {
        return map.get(r)
      }
    })

    
    dirIx = (dirIx + 1)%directions.length
    count++;
  }

  console.log('p2', lcm(...counts));
}


await solver();
await solver2();
