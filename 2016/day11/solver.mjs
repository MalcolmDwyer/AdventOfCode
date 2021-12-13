const costTree = ({
  initialState,
  goalState,
  getNextStatesAndCosts = () => [],
  initialCost = 0,
}) => {
  const record = new Map();
  record.set(initialState, initialCost);

  const costTreeCheck = ({
    state,
  }) => {
    const nextStates = getNextStatesAndCosts(state);

    for(let i = 0; i < nextStates.length; i++) {
      const ns = nextStates[i];
      let min = Infinity;
      let c;
      if (record.has(ns)) {
        c = record.get(ns);
      }
      else {
        c = costTreeCheck({
          state: c,
        })
      }
      if (c < min) {
        min = c;
      }

    }
  };


  console.log(record);
};


const solver = () => {
  console.log('p1');

  const testInput = [
    // The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
    // The second floor contains a hydrogen generator.
    // The third floor contains a lithium generator.
    // The fourth floor contains nothing relevant.
    ['HM', 'LC'],
    ['HG'],
    ['LG'],
    [],
  ];

  // Elevator, HG, HM, LG, LM
  const labels = ['E', 'HG', 'HM', 'LG', 'LM'];
  const initialState = [1, 2, 1, 3, 1];
  const goalState = [4, 4, 4, 4, 4];
  const floorMin = 1;
  const floorMax = 4;

  const getNextStatesAndCosts = (state) => {
    let next = [];
    let dirs = [];
    const e = state[0];
    let indexesItemsWithElevator = [];
    for (let i = 1; i < state.length; i++) {
        if (itemFloor === e) {
          indexesItemsWithElevator.push(i);
        }
    }
    console.log(indexesItemsWithElevator);
    if (e > floorMin) { // elevator can go down
      dirs.push(-1);
    }

    if (e < floorMax) { // elevator can go up
      dirs.push(1);
    }

    dirs.forEach((dir) => {

    });
  };

  const steps = costTree({
    initialState,
    goalState,
    getNextStatesAndCosts,
  });
};

solver();


