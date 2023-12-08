import { lineReader } from '../../common.mjs';

const parseLine = line => {
  // console.log('-----------------------')
  // console.log(line);
  
  const parts = /Valve ([A-Z][A-Z]) has flow rate=(\d*); [a-z\ ]* ([A-Z, ]*)/gm.exec(line);
  const valve = parts[1];
  const rate = parseInt(parts[2]);
  const tunnels = parts[3].split(', ');

  return ({
    valve,
    rate,
    tunnels
  })
};

const solver = async (file) => {
  let valves = await lineReader(file, parseLine);
  let max = 0;

  let maxT = 30;

  const map = {};
  valves.forEach(({valve, rate, tunnels}) => {
    map[valve] = {rate, tunnels};
  });

  valves.forEach(({valve}) => {
    map[valve].tunnels.sort((a, b) => map[a].rate < map[b].rate ? -1 : 1);
  })
  console.log(map);

  ////////////////////////////////////////////////////////////////////////

  let queue = [
    {n: 'AA', minute: 1, openValves: {}, completed: new Set([]), history: []},
  ];

  let sumOpenValves = (t, openValves) => {
    let sum = 0;
    for (let x in openValves) {
      // sum += (t - openValves[x]) * map[x].rate;
      sum += openValves[x] * map[x].rate;
    }
    return sum;
  }

  let explore = ({n, minute, openValves, completed: _completed, history}) => {
    const completed = new Set(_completed);
    completed.add(`${n}_${JSON.stringify(openValves)}`);

    // console.log(`explore ${n} ${minute} open: ${JSON.stringify(openValves)} completed: ${[...completed].join(', ')} history: ${history.join(' ')}`);
    if  (minute >= maxT) {
      const total = sumOpenValves(minute, openValves);
      if (total > max) {
        console.log('');
        console.log('-----new max', total, queue.length);
        console.log(`history: ${history.join(' ')}`);
        console.log(`open: ${JSON.stringify(openValves)}`);
        console.log(`completed: ${[...completed].join(', ')}`)
        // console.log(`explore ${n} ${minute} open: ${JSON.stringify(openValves)} completed: ${[...completed].join(', ')}`);
        max = total;
      }
      return;
    }

    let nextSteps = [];
    // const isComplete = (openValves[n])
    //   && map[n].tunnels.every((t) => (openValves[t]));
    if (openValves[n] === undefined) {
      nextSteps.push({
        n,
        minute: minute + 1,
        openValves: {
          ...openValves,
          [n]: maxT - minute,
        },
        // completed: {
        //   ...completed,
        //   ...(isComplete ? {[n]: true } : {})
        // },
        completed,
        history: [...history, `${minute} ()${n}`],
      });
    }
    map[n].tunnels.forEach((tunnel) => {
      // if (!openValves[tunnel]) {
      if (_completed.has(`${tunnel}_${JSON.stringify(openValves)}_${completed.keys()}`)) {
        console.log('already happend', _completed.has(`${tunnel}_${JSON.stringify(openValves)}_${completed.keys()}`));
      }
      if (!_completed.has(`${tunnel}_${JSON.stringify(openValves)}_${completed.keys()}`)) {
        nextSteps.push({
          n: tunnel,
          minute: minute + 1,
          openValves: {...openValves},
          // completed: {
          //   ...completed,
          //   ...(isComplete ? {[n]: true } : {}),
          // }
          completed,
          history: [...history, `${minute} ->${tunnel}`],
        });
      }
    });

    nextSteps.sort((a, b) => map[b.n].rate - map[a.n].rate);
    // console.log('sorted nextSteps');
    // console.log(nextSteps);
    queue.unshift(...nextSteps);

    // queue.push({
    //   n,
    //   minute: maxT,
    //   openValves: {...openValves},
    //   completed: {...completed},
    // });
  };

  while(queue.length) {
    const next = queue.shift();
    explore(next);
  };
  
  
  console.log('p1', max);
}

// const solver2 = async () => {
//   // let lines = await lineReader('test.txt');
//   // let lines = await lineReader('input.txt');
//   // let lines = await lineReader('input.txt', parseLine);
//   console.log('p2');
// }

const solver1b = async (file) => {
  let valves = await lineReader(file, parseLine);
  let max = 0;

  let maxT = 30;

  const map = {};
  valves.forEach(({valve, rate, tunnels}) => {
    map[valve] = {rate, tunnels};
  });

};

await solver1b('test.txt');
// await solver2();

