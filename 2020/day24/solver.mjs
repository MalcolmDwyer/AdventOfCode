import { lineReader, gridReader } from '../../common.mjs';

const parseLine = (line) => {
  let array = [];
  let c = line.split('');

  for (let i = 0; i < c.length; i++) {
    if (c[i] === 's' || c[i] === 'n') {
      array.push(`${c[i]}${c[i+1]}`);
      i++;
    }
    else {
      array.push(c[i]);
    }
  }
  return array
}

const hexDistance = (ne, e, se) => {
  let sorted = [ne, e, se].sort((a,b) => {
    return Math.abs(a) > Math.abs(b)
  })
  return sorted[1] + sorted[2];
}

const normalizeSteps = (steps) => {
  let e = 0;
  let ne = 0;
  let se = 0;

  steps.forEach((step) => {
    if (step === 'e') {
      e++;
    }
    else if (step === 'w') {
      e--;
    }
    if (step === 'se') {
      se++;
    }
    else if (step === 'nw') {
      se--;
    }
    if (step === 'ne') {
      ne++;
    }
    else if (step === 'sw') {
      ne--;
    }
  });

  // console.log('-------------')
  // console.log({e, ne, se});

  e = e + se;
  ne = ne - se;
  se = 0;
  // console.log({e, ne, se});


  return {e, ne};
};

const neighbors = (e, ne) => {
  return [
    {e: e, ne: ne+1},
    {e: e+1, ne: ne},
    {e: e+1, ne: ne-1},
    {e: e, ne: ne-1},
    {e: e-1, ne: ne},
    {e: e-1, ne: ne+1},
  ];
};

const parseTileKey = (str) => {
  let [_, _e, _ne] = /([-0-9]*)_([-0-9]*)/.exec(str);
  const e = parseInt(_e);
  const ne = parseInt(_ne);
  return {e, ne};
}


const solver = async () => {
  // let lines = await lineReader('test.txt');
  let lines = await lineReader('input.txt');
  // let lines = ['esenee'];

  let paths = lines.map(parseLine);
  let tiles = paths.map(normalizeSteps);

  let black = new Set([]);
  tiles.forEach(({e, ne}) => {
    let key = `${e}_${ne}`;
    if (black.has(key)) {
      black.delete(key);
    }
    else {
      black.add(key);
    }
  });

  console.log('p1', black.size);


  for (let t = 0; t < 100; t++) {
    let blackAndNeighbors = new Set([]);
    const prevBlack = new Set(Array.from(black));
    Array.from(black).forEach((tile) => {
      const { e, ne } = parseTileKey(tile);
      // console.log('____', e, ne);
      blackAndNeighbors.add(tile);
      neighbors(e, ne).forEach(({e, ne}) => {
        blackAndNeighbors.add(`${e}_${ne}`);  
      });
    });

    // console.log('prev', prevBlack.size);
    // console.log('Neighbors', blackAndNeighbors.size);

    Array.from(blackAndNeighbors).forEach((tile) => {
      const { e, ne } = parseTileKey(tile);
      let neighborCount = neighbors(e, ne).reduce((acc, {e, ne}) =>
          acc + (prevBlack.has(`${e}_${ne}`) ? 1 : 0), 0);
      // console.log(`${e} ${ne} black neighbors: ${neighborCount}`);
      if (prevBlack.has(tile)) {
        if (neighborCount === 0 || neighborCount > 2) {
          black.delete(`${e}_${ne}`);
        }
      }
      else {
        if (neighborCount === 2) {
          black.add(`${e}_${ne}`);
        }
      }
    });

    console.log(`T[${t}]:`, black.size);
  }


}


solver();

