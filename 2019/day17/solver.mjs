import computer from '../day15/computer.mjs';
// import blessed from 'neo-blessed';
import { lineReader } from '../../common.mjs';
import Map from '../day15/Map.mjs';

const dirs = ['^', 'v', '<', '>'];

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';

  let lines = await lineReader(file);
  let data = (lines[0] || '').split(',').map(n => parseInt(n));

  // Setup
  await runSetup(data, false);

  // Part 1
  await runPart1();

  // Part 2
  const route = await setupPart2();
  // await runPart2(data, route);
}

solver();

let map = new Map();
let bot;

const runSetup = async (program, part2) => {
  console.log('day17', program.length);

  let lineBuffer;
  let x;
  let y;

  const clearBuffer = () => {
    lineBuffer = '';
    x = 0;
    y = 0;
  }

  const handleChar = (c) => {
    if (c === 10) {
      // console.log(`c: ${c}  C: LINE_FEED`)
      // console.log(lineBuffer);
      lineBuffer = '';
      y++;
      x=0;
    }
    else {
      let cell = String.fromCharCode(c);
      // console.log(`c: ${c}  C: [${cell}]`)
      lineBuffer = lineBuffer + cell;
      // console.log(lineBuffer);
      map.writeCell(x, y, {s: cell})
      if (dirs.includes(cell)) {
        bot = {x, y, dir: dirs.indexOf(cell)};
      }
      x++
    }
  }

  const inputFn = () => {}

  const cpu = await computer(
    program, {
      // inputPromise,
      inputFn,
      // logObj: screenLog,
    }
  )();

  let done = false;
  clearBuffer();
  while (!done) {
    const c = await cpu.next();
    // console.log(c.value);

    if (c.done) {
      done = true;
    }
    else {
      handleChar(c.value);
    }
  }

  
}

const runPart1 = () => {
  console.log('Part 1------------------------------------------------------------------------------------------');
  map.draw();
  console.log('------------------------------------------------------------------------------------------');
  

  const intersections = findIntersections();
  // console.log(intersections);
  const total = intersections.reduce((acc, i) => acc + i.d, 0);
  console.log('part1:', total);

}

const setupPart2 = () => {
  // PATH
  let manualPath = [
    'L,10,R,8,R,6,R,10,', // top square
    'L,12,R,8,L,12,L,10,R,8,', // hits right side wall
    'R,6,R,10,' // ...
  ].join('');
  // 

  let fullPath = getFullPath(true);
  // console.log('fullPath');
  console.log(getFullPath());

  let segments = getSegments(fullPath);

  let route = buildRoute(fullPath, segments);
  
  // console.log(route);
  return route;
}

const runPart2 = async (program, route) => {
  console.log('runPart2()---------------------');
  console.log(route);
  program[0] = 2;
  let inputArray = route.main.join(',').split('').map(c => c.charCodeAt(0));
  inputArray.push(10);
  ['A','B','C'].forEach(k => {
    inputArray = [...inputArray, ...route[k].join(',').split('').map(c => c.charCodeAt(0))];
    inputArray.push(10);
  });

  inputArray.push('y'.charCodeAt(0));
  inputArray.push(10);


  const inputFn = () => {
    return inputArray.shift();
  };

  console.log(inputArray);

  const cpu = await computer(
    program, {
      // inputPromise,
      inputFn,
      // logObj: screenLog,
    }
  )();

  let outputBuffer = '';
  let final;
  let done = false;
  while (!done) {
    let output = await cpu.next();
    // console.log('OUTPUT', output);
    if (output.done) {
      done = true;
      console.log('Part 2:', output);
    }
    else {
      if (output.value === 10) {
        console.log(outputBuffer);
        outputBuffer = '';
      }
      else {
        outputBuffer = outputBuffer + String.fromCharCode(output.value);
        final = output.value;
      }
    }
  }
  console.log(final);
}

// const dirs = ['^', 'v', '<', '>'];
const cX = [0, 0, -1, 1];
const cY = [-1, 1, 0, 0];
const rTurns = [3, 2, 0, 1];
const lTurns = [2, 3, 1, 0];
const neighbors = [[-1, 0], [0, -1], [0, 1], [1, 0]]; // [y, x]
// const dirForNeighbor = [2, ]
// const nextDir = (dir) => rTurns[dir];

const getFullPath = (expanded) => {
  let path = [];
  let pathBot = {...bot};
  console.log(pathBot);

  let done = false;
  let currentRun = 0;

  while (!done) {
    let next = map.readCell(pathBot.x + cX[pathBot.dir], pathBot.y + cY[pathBot.dir]);
    if (!next || (next && next.s === '.')) {
      if (currentRun && !expanded) {
        path.push(`${currentRun}`);
      }
      currentRun = 0;
      let leftTurn = lTurns[pathBot.dir];
      let rightTurn = rTurns[pathBot.dir];
      let leftCell = map.readCell(pathBot.x + cX[leftTurn], pathBot.y + cY[leftTurn]);
      let rightCell = map.readCell(pathBot.x + cX[rightTurn], pathBot.y + cY[rightTurn]);
      if (leftCell && leftCell.s === '#') {
        pathBot.dir = leftTurn;
        path.push('L');
        currentRun = 0;
      }
      else if (rightCell && rightCell.s === '#') {
        pathBot.dir = rightTurn;
        path.push('R');
        currentRun = 0;
      }
      else {
        done = true;
      }
    }
    else if (next && next.s === '#') {
      pathBot.x = next.x;
      pathBot.y = next.y;
      currentRun++
      if (expanded) {
        path.push('.');
      }
    }
    
    // console.log(next);
  }
  if (expanded) {
    return path;
  }
  return path.join(',');
}

const findIntersections = () => {
  let intersections = [];

  for (let y = map.minY; y < map.maxY; y++) {
    for (let x = map.minX; x < map.maxX; x++) {
      const d = map.readCell(x, y);
      if (d && d.s === '#') {
        const isIntersection = neighbors.every(([dy, dx]) => {
          const d2 = map.readCell(x + dx, y + dy);
          if (d2 && d2.s === '#') {
            return true;
          }
          return false;
        });

        if (isIntersection) {
          intersections.push({x, y, d: x * y});
        }
      }
    }
  }
  return intersections;
}

const getSegments = (path) => {
  console.log(path.length, path.join(''));


  const maxSegmentLength = 120;
  const minSegmentLength = 20;
  let segments = {};

  for (let l = maxSegmentLength; l >= minSegmentLength; l--) {
    for (let i = 0; i < path.length - l; i++) {
      if (path[i] === '.') {
        continue;
      }
      if (path[i + l + 1] === '.') {
        continue;
      }
      for (let j = i + 1; j < path.length - l; j++) {
        if (path.slice(i, i + l).join('') === path.slice(j, j + l).join('')) {
          // Found match
          let key = path.slice(i, i + l).join('');
          if (!segments[key]) {
            segments[key] = [i];
          }
          segments[key].push(j);
        }
      }
    }
  }

  // console.log(segments);
  let keys = Object.keys(segments);
  // console.log('#', keys.length);

  keys.forEach(key => {
    let segmentStarts = segments[key];
    let removeStarts = [];
    for (let i = 1; i < segmentStarts.length; i++) {
      // Possible issue here... why remove this one... 
      // A > B > C > D (">" = overlaps)
      // Following code will remove b and d, and keep A and C... but
      // Keeping B and D might have been better... or A and D, or...
      if (segmentStarts[i] <= (segmentStarts[i-1] + key.length)) {
        removeStarts.push(segmentStarts[i]);
      }
      // sort of solution to above... only remove it if there's basically
      // no repeats left after trimming.
      if (segmentStarts.length - removeStarts.length < 2) {
        // console.log(`delete: ${key.length} : ${key} : ${segments[key].length} : ${segments[key].join(', ')}`)
        delete segments[key];
        continue;
      }
    }
  })

  keys = Object.keys(segments);

  // console.log('#', keys.length);

  const sortedKeys = keys.sort((a,b) => a.length > b.length ? -1 : 1);

  console.log(sortedKeys[0].length);
  sortedKeys.forEach(key => {
    // console.log(`${key.length} : ${key} : ${segments[key].length} : ${segments[key].join(', ')}`);

    console.log(`${key.length} : ${key} : ${
      segments[key].map(s => `${s}-${s + key.length}`).join('     ')
    }`)
  })
  return segments;
}

const buildRoute = (path, segments) => {
  let z = 0;
  const keys = Object.keys(segments).sort((a,b) => a.length > b.length ? -1 : 1);
  let done = false;
  let t = 0;

  let functions = {};
  let mainRoutine = [];

  const routeFrom = (n, abc1, route1) => {
    let abc = {...abc1};
    let route = [...route1];

    // console.log('abc', abc);
    // console.log(route);
    // console.group(`${n} ->`);
    const keysAtN = keys.filter(key => segments[key].includes(n));

    // for (let key of keysAtN) {
    for (let zz = 0; zz < keysAtN.length; zz++) {
      let key = keysAtN[zz];

      // console.log(Object.keys({...abc, [key]: segments[key]}).length)
      if (Object.keys({...abc, [key]: segments[key]}).length > 3) {
        continue;
      }
      if (n + key.length > path.length) {
        continue;
      }
      // console.log(`${key} -> ${n + key.length}`);

      let end = n + key.length;

      if (end === path.length - 1) {
        // console.log('done');
        done = true;
        abc[key] = segments[key];
        route.push(key);
        functions = {...abc};
        mainRoutine = [...route];
        // console.log(abc);
        // console.log(route);
        break;
      }
      
      console.group(`${n} ->  ${key} -> ${n + key.length}`);
      let deepRoute = routeFrom(end + 1, {...abc, [key]: segments[key]}, route.concat(key));
      console.groupEnd();

      if (done) {
        return false;
      }
      if(deepRoute) {
        abc[key] = segments[key];
        route.push(key);
        return deepRoute;
      }
    }

    return false;
  }

  // console.log('');
  // console.log('');
  // console.log('');
  // console.log('--------------------------------------------------------------------------------------------------');
  // console.log('');
  routeFrom(0, {}, []);

  // console.log(functions);
  // console.log(mainRoutine);

  let prog = {
    main: [],
  };

  mainRoutine.forEach(r => {
    let found = ['A','B','C'].find(k => prog[k] === r);

    if (found) {
      prog.main.push(found);
    }
    else {
      let k = ['A','B','C'].find(x => !prog[x]);
      prog[k] = r;
      prog.main.push(k);
    }
  });

  ['A', 'B', 'C'].forEach(k => {
    prog[k] = programConvert(prog[k]);
  });

  // console.log(prog);
  return prog;
}

const programConvert = (str) => {
  let count = 0;
  let ret = [];
  str.split('').forEach(c => {
    if (c === '.') {
      count++;
    }
    else {
      if (count) {
        ret.push(`${count}`);
      }
      ret.push(c);
      count = 0;
    }
  });
  ret.push(`${count + 1}`);
  return ret;
}