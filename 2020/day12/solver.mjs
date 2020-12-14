import { lineReader, gridReader } from '../../common.mjs';

const parseLine = (line) => {
  return /^(\w)(\d*)$/.exec(line);
};

/*
const go = (_facing, _x, _y, inst, dist) => {
  let facing = _facing;
  let x = _x;
  let y = _y;
  if (inst === 'N') {
    y = y + dist;
  }
  else if (inst === 'S') {
    y = y - dist;
  }
  else if (inst === 'W') {
    x = x - dist;
  }
  else if (inst === 'E') {
    x = x + dist;
  }
  else if (inst === 'L') {
    facing = (facing + 360 - dist) % 360;
  }
  else if (inst === 'R') {
    facing = (facing + 360 + dist) % 360;
  }
  else if (inst === 'F') {
    if (facing === 0) {
      y = y + dist;
    }
    else if (facing === 90) {
      x = x + dist;
    }
    else if (facing === 180) {
      y = y - dist;
    }
    else if (facing === 270) {
      x = x - dist;
    }
  }

  return {
    facing,
    x,
    y,
  };
}
*/

const go2 = (_facing, _x, _y, inst, dist, _wx, _wy) => {
  let facing = _facing;
  let x = _x;
  let y = _y;
  let wx = _wx;
  let wy = _wy;

  if (inst === 'N') {
    wy = wy + dist;
  }
  else if (inst === 'S') {
    wy = wy - dist;
  }
  else if (inst === 'W') {
    wx = wx - dist;
  }
  else if (inst === 'E') {
    wx = wx + dist;
  }
  else if (inst === 'L') {
    while (dist) {
      let tx = wx;
      let ty = wy;

      wy = tx;
      wx = -ty;
      dist = dist - 90;
    }
    
  }
  else if (inst === 'R') {
    while (dist) {
      let tx = wx;
      let ty = wy;

      wy = -tx;
      wx = ty;
      dist = dist - 90;
    }
  }
  else if (inst === 'F') {
    x = x + (dist * wx);
    y = y + (dist * wy);
  }

  return {
    facing,
    x,
    y,
    wx,
    wy,
  };
}


const solver = async () => {
  let lines = await lineReader('input.txt');
  let parts = lines.map(parseLine);
  let data = parts.map(([_, inst, n]) => ({inst, n: parseInt(n)}));
  // let lines = await lineReader('input.txt');
  // console.log(data);

  let facing = 90;
  let x = 0;
  let y = 0;


  for (let i = 0; i < data.length; i++) {
    let newPos = go(facing, x, y, data[i].inst, data[i].n);
    ({x, y, facing} = newPos);
    // console.log(`${data[i].inst} ${data[i].n} -> ${x}, ${y}, ${facing}`);
  }

  console.log(Math.abs(x) + Math.abs(y));
  
}

const solver2 = async () => {
  let lines = await lineReader('input.txt');
  let parts = lines.map(parseLine);
  let data = parts.map(([_, inst, n]) => ({inst, n: parseInt(n)}));
  // let lines = await lineReader('input.txt');
  // console.log(data);

  let wx = 10;
  let wy = 1;
  let facing = 90;
  let x = 0;
  let y = 0;


  for (let i = 0; i < data.length; i++) {
    let newPos = go2(facing, x, y, data[i].inst, data[i].n, wx, wy);
    ({x, y, facing, wx, wy} = newPos);
    console.log(`${data[i].inst} ${data[i].n} -> ${x}, ${y}, ${facing}   W: ${wx} ${wy}`);
  }

  console.log(Math.abs(x) + Math.abs(y));
  
}



solver2();

// ! 15428
// ! 95338
