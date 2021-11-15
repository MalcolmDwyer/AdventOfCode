import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };

class Cup {
  constructor(v, next = null, prev = null) {
    this.v = v;
    // this.prev = prev;
    this.next = next;
  }
}

const build = (numString, targetMax) => {
  let vals = numString.split('').map((c) => parseInt(c));
  let maxValue = vals[0];
  console.log('vals', vals);

  let first = new Cup(vals[0]);
  let current = first;
  let last = first;
  let map = {
    [vals[0]]: first,
  };
  for (let i = 1; i < vals.length; i++) {
    if (vals[i] > maxValue) {
      maxValue = vals[i];
    }
    current.next = new Cup(vals[i], null, current);
    map[vals[i]] = current.next;
    current = current.next;
  }
  while (maxValue !== targetMax) {
    maxValue++;
    current.next = new Cup(maxValue, null, current);
    map[maxValue] = current.next;
    current = current.next;
  }

  current.next = first;
  // first.prev = current;

  // console.log('START');
  // printRing(first);

  return [first, maxValue, map];
}

const printRing = (ring) => {
  let f = ring;
  let s = `${f.v}`;
  let n = f.next;
  while (n !== f) {
    s = s + ` ${n.v}`;
    n = n.next;
  }
  console.log(`RING: ${s}`);
  // console.log(ring.v, ring.next.v, ring.next.next.v, ring.next.next.next.v, ring.next.next.next.next.v, ring.next.next.next.next.next.v);
  // console.log(ring.v, ring.prev.v, ring.prev.prev.v);
}

const takeTurn = (ring, maxValue, map) => {
  
  const currentV = ring.v;
  let splice = ring.next;
  ring.next = splice.next.next.next;
  // ring.next.prev = ring;

  const spliceValues = [splice.v, splice.next.v, splice.next.next.v];

  let target = currentV - 1;
  // console.log('target', target, 'splice values:', spliceValues.join(','));

  while (target === 0 || spliceValues.includes(target)) {
    target = target - 1;
    if (target < 1) {
      // console.log('TARGET >> MAX', maxValue);
      target = maxValue;
    }
  }

  // console.log('  final target:', target);

  // let targetNode = ring;
  // while(targetNode.v !== target) {
  //   targetNode = targetNode.next;
  // }
  const targetNode = map[target];
  // console.log('targetNode', targetNode.v);
  const tempNext = targetNode.next;
  targetNode.next = splice;
  splice.next.next.next = tempNext;
  // tempNext.prev = splice.next.next.next;
  // splice.prev = targetNode;

  // printRing(ring);
  
  return ring.next;
}

const finishGame = (ring) => {
  let start = ring;
  while (start.v !== 1) {
    start = start.next;
  }

  start = start.next;
  let arr = [];
  while (start.v !== 1) {
    arr.push(start.v);
    start = start.next;
  }
  console.log('ARR', arr);
  return arr;
}

const solver = async () => {

  let testInput = '389125467';
  let input = '962713854';

  let [ring, maxValue] = build(input);
  console.log('MAX', maxValue);

  // let lines = await lineReader('test.txt');
  // let lines = await lineReader('input.txt');

  for(let t = 0; t < 100; t++) {
    console.log('Take turn---------------------------------', t + 1);
    ring = takeTurn(ring, maxValue);
  }

  console.log(finishGame(ring).join(''));
  
}

const finishGame2 = (ring) => {
  let start = ring;
  while (start.v !== 1) {
    start = start.next;
  }

  start = start.next;
  let value = start.v * start.next.v; 
  return value;
}

const solver2 = async () => {
  let testInput = '389125467';
  let input = '962713854';
  let [ring, maxValue, map] = build(input, 1_000_000);
  // console.log('MAX', maxValue);

  for(let t = 0; t < 10_000_000; t++) {
    // if (!(t%1000)) {
    //   console.log('Take turn---------------------------------', t + 1);
    // }
    ring = takeTurn(ring, maxValue, map);
  }

  console.log(finishGame2(ring));

}


solver2();

