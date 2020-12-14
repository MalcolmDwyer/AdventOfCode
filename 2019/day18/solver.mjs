import { lineReader } from '../../common.mjs';
import Map from '../day15/Map.mjs';

// import { lcm } from 'mathjs';
// import math from 'mathjs';

async function solver() {
  const file =
    'input.txt';
    // 'test.txt';
    // 'test2.txt';
    // 'test3.txt';
    // 'test4.txt';
    // 'test5.txt';

  let lines = await lineReader(file);
  // let data = lines[0].split('').map(n => parseInt(n));


  setup(lines);
  // Part 1
  // run();
  runb();

  // Part 2
  // run(data, true);

  // test();
}

let map = new Map({});
let start;
let doors = {};
let allKeys = {};

solver();

const setup = (lines) => {
  lines.forEach((line, y) => {
    line.split('').forEach((c, x) => {
      let key = /[a-z]/.test(c);
      let door = /[A-Z]/.test(c);
      let wall = c === '#';
      map.writeCell(x, y, {
        s: c,
        key,
        door,
        wall,
      });
      if (key) {
        allKeys[c] = {x, y, found: false};
      }
      if (door) {
        doors[c.toLowerCase()] = {x, y, open: false};
      }
      if (c === '@') {
        start = {x, y};
      }
    })
  });

  map.draw();
  console.log('doors', doors);
  console.log('allKeys', allKeys);
  console.log('start', start);
}

const dirs = ['^', 'v', '<', '>'];
const cX = [0, 0, -1, 1];
const cY = [-1, 1, 0, 0];
const rTurns = [3, 2, 0, 1];
const lTurns = [2, 3, 1, 0];
const neighborDirs = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}];



const keysFrom = (node, gotKeys = [], pathKey, cost = 0) => {
  let keys = [];
  let toCheck = [];
  // console.log(`keysFrom() ${node.x},${node.y}  gotKeys: [${gotKeys.join(',')}]`)

  const inner = (cost, spot) => {
    map.writeCell(spot.x, spot.y, {
      [pathKey]: cost,
    });

    if (spot.key && !gotKeys.includes(spot.s)) {
      // console.log(`Found key ${spot.s} at ${spot.x},${spot.y}`);
      keys.push(map.readCell(spot.x, spot.y));
    }

    const neighbors = neighborDirs
      .map(neighborDir => map.readCell(spot.x + neighborDir.x, spot.y + neighborDir.y))
      .filter(cell => !cell.wall)
      .filter(cell => (typeof cell[pathKey] === 'undefined'))
      .filter(cell => !cell.door || gotKeys.includes(cell.s.toLowerCase()));
    
    // if (!neighbors.length) {
      // console.log('   no neighbors');
    // }
    // neighbors.forEach(neighbor => console.log(`  neighbor ${neighbor.s} at ${neighbor.x},${neighbor.y}`))

    toCheck.push(...neighbors);
  
    let next;
    while (next = neighbors.pop()) {
      // console.group(`-> ${next.x},${next.y}`)
      inner(cost + 1, next);
      // console.groupEnd();
    }
  }
  
  inner(cost, node);
  
  return keys;
  
}

const run = () => {
  

  let bestFinish = Infinity;
  // let routesToCheck = [];

  const inner = (cost, spot, keys) => {

    if (keys.length === Object.keys(allKeys).length) {
      if (cost < bestFinish) {
        bestFinish = cost;
        console.log(`new best ${bestFinish} keys: [${keys.join(', ')}]`)
      }
    }

    let pathKey = `${spot.x}_${spot.y}_${keys.sort().join('_')}`;
    let keyRoutes = keysFrom(spot, keys, pathKey, cost);

    keyRoutes.forEach(keyRoute => {
      // console.group(`FROM ${keyRoute.s}`);
      inner(keyRoute[pathKey], keyRoute, [...keys, keyRoute.s]);
      // console.groupEnd();
    });

    // console.log('keyRoutes:', keyRoutes);
  }

  inner(0, start, []);
  console.log(map.d);

  console.log('bestFinish:', bestFinish);
}


const runb = () => {
  const distanceTable = {}
  
}


// 5388 too high
