import { lineReader } from '../../common.mjs';

const getInput = async (file) => {
  const lines = await lineReader(file);

  const seeds = lines[0].slice(7).split(' ').map(s => parseInt(s));

  const maps = {};

  let n = 1;

  let source;
  let destination;

  while(n < lines.length) {
    const line = lines[n];
    if (line.includes('map')) {
      [source, destination] = line.split('-to-');
      destination = destination.slice(0, -5);
      maps[source] = {
        source,
        destination,
        mappings: [],
      };
    }
    else if (line.length) {
      const [d, s, r] = line.split(' ').map((s) => parseInt(s));
      if (!maps[source]) {
        console.log(line, source);
      }
      maps[source].mappings.push({
        d, s, r,
        b: s,
        t: s + r - 1,
        offset: d - s,
      });
    }
    
    n++;
  }

  return {
    seeds,
    maps,
  }
}

const followMappings = ({from='seed', to='location', n, maps}) => {

  const dest = maps[from].destination;
  const mapping = maps[from].mappings.find(({s,r}) => (n >= s && n < s + r));
  let val;
  if (mapping) {
    val = n + mapping.d - mapping.s;
    
  }
  else {
    val = n;
  }
  if (dest === to) {
    return val;
  }

  return followMappings({
    from: dest,
    to,
    n: val,
    maps,
  })
}


const solver = async () => {
  const {seeds, maps} = await getInput('test.txt');
  // console.log(seeds);

  let locations = seeds.map((seed) => followMappings({n: seed, maps}))
  console.log('p1', Math.min(...locations));
}

const solver2 = async () => {
  const {seeds, maps} = await getInput('input.txt');
  const seedRanges = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push({n: seeds[i], r: seeds[i + 1]});
  }

  let min = Infinity;

  for (let r = 0; r < seedRanges.length; r++) {
    console.log('Range', r, '/', seedRanges.length - 1);
    const range = seedRanges[r];
    for (let x = range.n; x < range.n + range.r; x++) {
      let n = followMappings({n: x, maps});
      if (n < min) {
        console.log('new min', n);
        min = n;
      }
    }
  }

  console.log('p2', min);
};


await solver();
await solver2();
