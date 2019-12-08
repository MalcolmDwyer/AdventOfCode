import { lineReader } from '../../common.mjs';


async function solver() {
  const orbits = await lineReader('./input.txt');
  // const orbits = await lineReader('./test3.txt');
  
  const lookup = {};

  orbits.forEach(orbit => {
    const [p, c] = orbit.split(')');
    // console.log(`${p}  )   ${c}`)

    if (!lookup[p]) {
      // if (p === 'COM') {
      //   lookup[p] = {
      //     c: [],
      //   }
      // }
      // else {
      lookup[p] = {
        c: [],
      };
      // }
    }

    if (!lookup[c]) {
      lookup[c] = {
        p,
        c: [],
      }
    }

    lookup[p].c.push(c);
    lookup[c].p = p;
  });
  


  let measure = (node, d) => {
    // console.group('Measuring', node);
    // console.log(lookup[node]);
    let sum = lookup[node].c.reduce((acc, n) => acc + measure(n, d) + 1, 0);
    
    lookup[node].d = d + sum;
    // console.log(`  sum at ${node} = ${d} + ${sum} => ${d + sum}`);
    // console.groupEnd();
    return sum;
  }

  measure('COM', 0);
  

  let sum = 0;
  Object.keys(lookup).forEach(node => {
    sum += lookup[node].d;
  })

  console.log('sum', sum);
  
  // PART 2
  let node = 'YOU';
  let yhops = 0;
  // let check = 100;
  while(lookup[node].p) {
    node = lookup[node].p;
    lookup[node].you = ++yhops;
  }

  console.log('hops COM ) YOU', yhops);

  node = 'SAN';
  let shops = 0;
  while(!lookup[node].you) {
    node = lookup[node].p;
    lookup[node].san = ++shops;
  }
  let transfers = lookup[node].you + shops - 2
  console.log('transfers', transfers);
}

solver();