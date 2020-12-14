import { lineReader, gridReader } from '../../common.mjs';
import bignum from 'bignum';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };


const solver1 = async () => {
  let lines = await lineReader('input.txt');
  // let lines = await lineReader('input.txt');


  const depart = parseInt(lines[0]);
  const busses = lines[1].split(',').map((n) => {
    if (n != 'x') {
      return parseInt(n);
    }
    return null;
  }).filter(Boolean);

  // console.log(depart, busses);
  // const mods = busses.map((b) => depart % b);

  let m = Infinity;
  let mix = null;

  // busses.forEach((b, bix) => {
  //   if ((depart % b) < m) {
  //     m = b;
  //     mix = bix
  //   }
  // });

  for (let mix = depart; mix < 10000000000; mix++) {
    let bus = busses.find((b) => !(mix % b));
    if (bus) {
      console.log(mix, bus);
      console.log((mix - depart) * bus)
      break;
    }
  }

  // console.log(m, mix);
}

const solver2 = async (sorted) => {

  console.log('--');

  let done = false;
  let n = 1;
  let base;
  while (!done) {
    let d0m = n * sorted[0].mod;
    base = d0m - sorted[0].r;
    done = sorted.every(({mod, r}) => 0 === (base + r) % mod);
    n++;
  }

  console.log('solver 2', base);
}


// solver2();


const solver3 = async (sorted) => {
  console.log('--');
  console.log('');

  const sys = sorted.map(({mod, rr}) => ({mod: bignum(mod), r: bignum(rr)}));
  // console.log(sys);


  let base = 0;

  // let M = sys.reduce((p, bus) => p * bus.mod, bignum(1));
  let M = sys.reduce((p, bus) => p.mul(bus.mod), bignum(1));
  console.log('M', M.toString());

  const prodParts = sys.map((bus) => M.div(bus.mod));
  console.log('prodParts', prodParts.map(n => n.toString()));


  sys.forEach((bus, i) => {
    const reduced = prodParts[i].mod(bus.mod);
    console.log(`[${i}] ${bus.mod} reduced: ${reduced}`);
    if (reduced.eq(bus.r)) {
      return;
    }
    let f = bignum(1);
    // while (!(reduced.mul(f)).mod(bus.mod).eq(bus.r.mod(bus.mod))) { 
    while (!(reduced.mul(f)).mod(bus.mod).eq(bignum(1))) { 
      f++;
    }
    console.log(`[${i}] ${bus.mod}  f: ${f} * ${bus.r}`);
    prodParts[i] = prodParts[i].mul(f).mul(bus.r);
  });
  console.log('prodParts', prodParts.map(n => n.toString()));


  base = prodParts.reduce((s, p) => s.add(p))
  console.log('solver3:', base.toString());
  const baseM = base.mod(M);
  console.log('solver3 m:', baseM.toString());

  sys.forEach(({r, mod}) => {
    console.log(`${base} % ${mod} => ${base % mod}`);
  })

  sys.forEach(({r, mod}) => {
    console.log(`${baseM} % ${mod} => ${baseM % mod}`);
  })

  // sys.forEach(({r, mod}) => {
  //   console.log(`1261476 % ${mod} => ${bignum(1261476).mod(mod)}`);
  // })
  
}

// solver3();


const solver = async () => {
    let lines = await lineReader('input.txt');

    // let lines = [null, '1789,37,47,1889'];
    // let lines = [null, '67, 7, x, 59, 61'];

    const busses = lines[1].split(',').map((n, r) => {
      return {
        mod: n === 'x' ? null : parseInt(n),
        r,
        rr: n === 'x' ? null : parseInt(n) - r,
      };
    });

    let sorted = busses.sort((a, b) => {
      if (a.mod === '.') {
        return 2
      }
      if (a.mod < b.mod) {
        return 1
      }
      return -1;
    }).filter(({mod, r}) => mod);
    // sorted.forEach(({b, i}) => console.log(`${i}  ${b}`));

    // sorted = [
    //   {mod: 3, r: 2},
    //   {mod: 4, r: 2},
    //   {mod: 5, r: 1}
    // ];

    // solver2(sorted);
    solver3(sorted);

}

solver();