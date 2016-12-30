var astar = require('a-star')
var Immutable = require('immutable')
// var common = require('../common')
// var input = common.getInputFile('./day11/input.txt')
// var lines = common.lines(input);

// console.log(lines);

let testInput = Immutable.fromJS([
  [false, null, null, null, null],
  [false, null, null, null, 'LG'],
  [false, null, 'HG', null, null],
  [true,  'HM', null, 'LM', null]
]);

let testGoal = Immutable.fromJS([
  [true, 'HM', 'HG', 'LM',  'LG'],
  [false, null, null, null, null],
  [false, null, null, null, null],
  [false, null, null, null, null]
])

let realGoal = Immutable.fromJS([
  [true, 'SG', 'SM', 'PG', 'PM', 'TG', 'TM', 'RG', 'RM', 'CG',  'CM'],
  [false, null, null, null, null, null, null, null, null, null,  null],
  [false, null, null, null, null, null, null, null, null, null,  null],
  [false, null, null, null, null, null, null, null, null, null,  null]
]);

let input = testInput;
let goal = testGoal;

let nodePrinter = node => {
  node.forEach((floor, fn) => {
    let str = 'F' + (4 - fn);
    str += floor.get(0) ? ' E ' : '   ';
    str += ' ' + floor.toJS().slice(1).map(v => (v ? v : '. ')).join(' ');
    console.log(str);
  })
}

let itemFloor = node => {
  let floors = Array(node.get(0).size)
  node.forEach((floor, fx) => {
    floor.forEach((slot, ix) => {
      if (slot) {
        floors[ix] = node.size - fx;
      }
    })
  })
  return floors;
}

let distance = (a,b) => {
  let cost = 0;
  const aFloors = itemFloor(a);
  const bFloors = itemFloor(b);
  aFloors.forEach((f, ix) => {
    cost += Math.abs(f - bFloors[ix])
  })
  return cost;
}

let heuristic = node => {
  return distance(node, goal)
}

let neighbor = node => {
  
}


console.log('-------------------');
nodePrinter(input);
// console.log(input.hashCode())
// console.log(itemFloor(input));
console.log('-------------------');
nodePrinter(goal);
// console.log(goal.hashCode())
// console.log(itemFloor(goal));
// console.log('cost: ' + distance(input, goal));
console.log('-------------------');

var {path, status, cost} = astar({
  start: input,
  hash: node => '' + node.hashCode(),
  neighbor: node => node,
  distance,
  heuristic,
  isEnd: node => (node.hashCode() === goal.hashCode())
});

console.log('status: ' + status);
