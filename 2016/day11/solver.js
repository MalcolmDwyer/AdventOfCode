var astar = require('a-star')
var Immutable = require('immutable')

let testLabels = ['H', 'L']
let testInput = Immutable.fromJS([1,2,1,3,1]);
let testGoal  = Immutable.fromJS([4,4,4,4,4]);

// Elevator, Strontium, Plutonium, Thulium, Ruthenium, Curium
// 1: SG, SM, PG, PM
// 2:                 TG,     RG, RM, CG, CM
// 3:                     TM
let realLabels = ['S', 'P', 'T', 'R', 'C'];
let realInput = Immutable.fromJS(
  [1, 1, 1, 1, 1, 2, 3, 2, 2, 2, 2]
)
let realGoal = Immutable.fromJS(
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
);

// Part2 ... add elerium and dilithium to first floor
let realLabels2 = ['S', 'P', 'T', 'R', 'C', 'E', 'D'];
let realInput2 = Immutable.fromJS(
  [1, 1, 1, 1, 1, 2, 3, 2, 2, 2, 2, 1, 1, 1, 1]
)
let realGoal2 = Immutable.fromJS(
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
);


// let [labels, input, goal] = [testLabels, testInput, testGoal];
let [labels, input, goal] = [realLabels, realInput, realGoal];
// let [labels, input, goal] = [realLabels2, realInput2, realGoal2];

let nodePrinter = (node, ix) => {

  if (typeof ix !== 'undefined') {
    console.log('------------------------ step ', ix)
  }
  [4,3,2,1].forEach(f => {
    let str = 'F' + f + ' ';
    str += (node.get(0) === f) ? ' E  ' : '    ';
    str += node.slice(1).map((v, ix) =>
      (v !== f ? '. ' : (labels[Math.floor(ix/2)] + (ix%2 ? 'M' : 'G')) )
    ).join(' ')
    console.log(str);
  });
  console.log('')
}

let itemFloor = node => {
  return node
}

let itemIndexesOnFloor = (node, floor) => {
  let indexes = [];
  // node.slice(1).forEach((thing, index) => {
  //   if (thing === floor) {
  //     indexes.push(index + 1);
  //   }
  // })
  for (var i=1; i < node.size; i++) {
    if (node.get(i) === floor) {
      indexes.push(i);
    }
  }
  return indexes;
}

let itemCombinations = (items) => {
  // All combinations of 1 or 2 of the items in the list
  let combos = [];
  items.forEach((i, ix, list) => {
    combos.push([i]);
    if (ix < list.length - 1) {
      list.slice(ix + 1).forEach((j, jx) => {
        combos.push([i, j])
      });
    }
  })
  return combos;
}

let distance = (a,b) => {
  let cost = 0;
  const aFloors = itemFloor(a);
  const bFloors = itemFloor(b);
  aFloors.forEach((f, ix) => {
    // cost += Math.abs(f - bFloors[ix])
    cost += Math.abs(f - bFloors.get(ix))
  })
  return cost;
}

let heuristic = node => {
  // console.log('     heuristic:' , node.toJS(), distance(node, goal))
  return distance(node, goal)
}

let nodeIsValid = (node) => {
  let valid = true;
  // console.log('nodeIsValid() ?');
  // nodePrinter(node);

  [1,2,3,4].forEach(floor => {
    if (!valid) {
      return;
    }
    // console.log('Floor ' + floor);
    const items = itemIndexesOnFloor(node, floor);
    let chips = items.filter(i => i && (!(i%2)));
    let generators = items.filter(i => i && (i%2));
    // console.log('chips: ', chips);
    // console.log('genrs: ', generators);

    if (generators.length && chips.some(c => !generators.includes(c-1))) {
      valid = false;
    }
  })

  // console.log('=====> ' + valid);
  return valid;
}

let neighbor = node => {
  // console.log('');
  // console.log('neighbor()==============================');
  // console.log(node.toJS());
  // if (node.equals(Immutable.List([3, 4, 4, 3, 3]))) {
  //   console.log('FOUND ************************************************************')
  // }
  // nodePrinter(node)
  // console.log('=============')
  // Elevator up/down:
  let neighbors = [];
  // const floors = itemFloor(node);
  [-1, 1].forEach(elevatorDirection => {
    const oldFloor = node.get(0);
    const newFloor = node.get(0) + elevatorDirection;
    if ((newFloor > 4) || (newFloor < 1)) {
      return;
    }
    const newNode = node.set(0, newFloor)
    items = itemIndexesOnFloor(newNode, oldFloor)
    const combos = itemCombinations(items);
    combos.forEach(combo => {
      let newNode2 = newNode.set(combo[0], newFloor);
      if (combo.length > 1) {
        newNode2 = newNode2.set(combo[1], newFloor);
      }
      if (nodeIsValid(newNode2)) {
        // console.log(' ---> adding neighbors', newNode2.toJS())
        neighbors.push(newNode2)
      }
    });
  });

  // console.log('neighbors:');
  // neighbors.map(nodePrinter)
  return neighbors;
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

let hash = node => '' + node.hashCode();

var {path, status, cost} = astar({
  start: input,
  hash,
  neighbor,
  distance,
  heuristic,
  isEnd: node => hash(node) === hash(goal)
});

console.log('status: ' + status);

if (status == 'success') {
  path.map(nodePrinter);
  path.map(node => console.log(node.toJS()))
  console.log();
  console.log('steps: ' + (path.length - 1));
}
