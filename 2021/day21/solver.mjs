// import { lineReader, gridReader } from '../../common.mjs';
// import memoize from 'memoizee';
// Player 1 starting position: 8
// Player 2 starting position: 2

// const mapKey = (p0, p1) => ({p0, p1});
// const mapKey = (p0, p1) => ([ p0, p1 ]);
// const mapKey = (p0, p1, s0, s1) => ([ p0, p1, s0, s1 ]);
const mapKey = (p0, p1, s0, s1) => `${p0}_${p1}_${s0}_${s1}`;

const mkm = mapKey;
// const mkm = memoize(mapKey, { length: 4, primitive: true });

const solver = async () => {

  // const playerPositions = [4, 8];      // TEST
  const playerPositions = [8, 2];     // INPUT
  const playerScores = [0, 0];
  let player = 0;

  const firstDieVal = 1;
  const maxDieRoll = 100;

  let dieVal = firstDieVal;
  let t = 0;

  let rollsCount = 0;

  while (playerScores[0] < 1000 && playerScores[1] < 1000) {

    const dieRolls = [];
    let d = 0;
    while (d < 3) {
      dieRolls.push(dieVal);
      dieVal += 1;
      if (dieVal === 101) {
        dieVal = 1;
      }
      d++;
    }

    const prev = playerPositions[player]
    const nextPosition = prev + dieRolls[0] + dieRolls[1] + dieRolls[2];
    
    playerPositions[player] = ((nextPosition - 1) % 10) + 1;
    playerScores[player] += playerPositions[player];
    console.log(`Player ${player + 1} rolls ${dieRolls.join(' + ')} and moves ${prev} to ${playerPositions[player]} for a score of ${playerScores[player]}`)
    rollsCount += 3;
    player = (player + 1) % 2;
  }

  console.log(playerPositions);
  console.log(playerScores);
  console.log(rollsCount);

  console.log('p1', Math.min(...playerScores) * rollsCount);
}

// const key = (pos, score) => `${score}_${pos}`

// const playerPositions = [4, 8];      // TEST
const playerPositions = [8, 2];     // INPUT

let target = 21;
const probs = {
  3: 1,
  4: 3,
  5: 6,
  6: 7,
  7: 6,
  8: 3,
  9: 1,
};
const players = [0, 1];


// let target = 10;
// const probs = {
//   2: 1,
//   3: 2,
//   4: 1,
// };
// const players = [0];

const f = new Intl.NumberFormat('en-US').format;

const solver2 = async () => {
  const wins = [0, 0];

  let universe = new Map();
  universe.set(mkm(...playerPositions, 0, 0), 1);

  let done = false;
  let t = 0;
  let player = 0;
  let notDone;
  // while (!done && t < 20) {
  while (!done) {
    // console.log(t, '-----------------------');
    let nextUniverse = new Map();
    notDone = false;
    // universe.forEach((count, keyString) => {
    //   const [p0, p1, s0, s1] = keyString.split('_').map((n) => parseInt(n));
    //   console.log(`| ${s0} ${p0} | ${s1} ${p1} | ${count}`);
    // });
    universe.forEach((count, keyString) => {
      const [p0, p1, s0, s1] = keyString.split('_').map((n) => parseInt(n));
      const playerScores = [s0, s1];
      const playerPositions = [p0, p1];
      const boardPosition = playerPositions[player];
      const score = playerScores[player];

      Object.entries(probs).forEach(([diceSum, probability]) => {
        const ds = parseInt(diceSum);
        // console.log(`p[${player}] - count:${count} of [on ${boardPosition} with ${score} ] prob: ${probability}, ds: ${ds}`);
        const bp = ((boardPosition + ds - 1) % 10) + 1;
        // console.log(`((${boardPosition} + ${ds} - 1) % 10) + 1 ==> ${bp}`);
        const ns_orig = score + bp
        const ns = Math.min(target, ns_orig);
        // console.log(`D${ds}, B${bp}, S${ns_orig} -> ${ns}`);
        const bps = player
          ? [p0, bp]
          : [bp, p1];
        const nss = player
          ? [s0, ns]
          : [ns, s1];
        
        const nextVal = count * probability;

        if (ns >= target) {
          wins[player] += nextVal;
        }
        else {
          // console.log(`D${ds}, B${bp}, S${ns_orig} -> ${ns}`);
          notDone = true;
          let nextTotal = nextVal;
          if (nextUniverse.has(mkm(...bps, ...nss))) {
            nextTotal = nextTotal + nextUniverse.get(mkm(...bps, ...nss))
          }
          nextUniverse.set(mkm(...bps, ...nss), nextTotal)
          // console.log('Set', mkm(...bps, ...nss), nextVal);
        }
      });
    });
    if (!notDone) {
      done = true;
    }
    player = player ? 0 : 1;
    t++;
    universe = nextUniverse;
  }


  console.log(wins);
  console.log('Part 2', Math.max(...wins))
}

const solver2fail = async () => {
  let playerUniverses = [[],[]];

  players.forEach((_, p) => {
    Array(10).fill(1).forEach((_, ix) => {
      playerUniverses[p][ix+1] = [];
    });
    playerUniverses[p][playerPositions[p]][0] = 1;
  });

  let t = 0;

  console.log('t', t + 1);
  players.forEach((p) => {
    console.log(`P${p}`);
    console.table(playerUniverses[p]);
  })

  let winner = false;
  let sweeps = players.map(() => 0);
  let firstWin = players.map(() => 0);
  
  while (!winner && t < 100) {
    console.log('t', t + 1, '___________________________________________________________________________________________');

    // init
    let nextUniverses = [[], []];
    players.forEach((_, p) => {
      Array(10).fill(1).forEach((_, ix) => {
        nextUniverses[p][ix+1] = [];
        // nextUniverses[p][ix+1][target] = (playerUniverses[p]?.[ix+1]?.[target] ?? 0);
      });
    });

    //
    players.forEach((player) => {
      // console.log(player, playerUniverses[player]);
      playerUniverses[player].forEach((universesAtScore, boardPosition) => {
        // if (!universesAtScore?.length) {
        //   return;
        // }
        // console.log(`boardPos: ${boardPosition} UnivsAtScore: ${universesAtScore.map((u, sc) => u ? `[${sc}]: ${u}` : null).filter(Boolean).join(', ')}`);
        // console.log(boardPos);
        universesAtScore.forEach((universeCount, score) => {
          // if (score >= target) {
          //   return;
          // }
          // if (!universeCount?.length) {
          //   return;
          // }
          // console.log(`universeCount: ${universeCount} score: ${score}`);
          Object.entries(probs).forEach(([diceSum, probability]) => {
            // console.log(`dice: ${probability} of ${diceSum}`)
            console.group(`p:${player}, boardPosition: ${boardPosition}, score: ${score}, dice: P${probability} of V ${diceSum}`);
            const ds = parseInt(diceSum);
            const bp = (boardPosition + ds - 1) % 10 + 1;
            // const ns = (playerUniverses[player]?.[boardPos]?.[score] ?? 0) + bp;
            // const ns = score + bp;
            const ns_orig = score + bp
            const ns = Math.min(target, ns_orig);
            console.log(`D${ds}, B${bp}, S${ns_orig} -> ${ns}`);
            if (!nextUniverses[player][bp][ns]) {
              nextUniverses[player][bp][ns] = 0;
              // nextUniverses[player][bp][ns] = playerUniverses[player]?.[bp]?.[ns] ?? 0;
            }

            if (ns >= target) {
              firstWin[player] += universeCount * probability;
            }
            // const prevScoreAtBoard = (universeCount ?? 0);
            console.log(`next[${player}][${bp}][${ns}] ${nextUniverses[player][bp][ns]} += ${universeCount} * ${probability} => ${nextUniverses[player][bp][ns] + universeCount * probability}`);

            nextUniverses[player][bp][ns] += universeCount * probability;
            console.table(nextUniverses[player]);
            console.log('');
            console.groupEnd();
          });
        });
      });
    });

    playerUniverses = nextUniverses;
    players.forEach((p) => {
      console.log(`P${p}`);
      console.table(playerUniverses[p]);
    });

    const wins = players.map((p) => playerUniverses[p].map((universesAtScore) => universesAtScore[target]).reduce((acc, n) => acc + (n || 0), 0));

    // const p0Wins = playerUniverses[0].map((universesAtScore) => universesAtScore[target]).reduce((acc, n) => acc + (n || 0), 0);
    // const p1Wins = playerUniverses[1].map((universesAtScore) => universesAtScore[target]).reduce((acc, n) => acc + (n || 0), 0);
    players.forEach((p) => {
      console.log(`P${p} wins:`, wins[p], f(wins[p]));
      sweeps[p] += wins[p];
    });
    
    const incompletes = players.map((p) => playerUniverses[p].some((universesAtScore) => universesAtScore.filter((u, score) => score < target).length));
    // console.log(JSON.stringify(playerUniverses[0].some((universesAtScore) => universesAtScore.filter((u, score) => score < 9).length), null, '  '))
    // const p0HasIncompletes = playerUniverses[0].some((universesAtScore) => universesAtScore.filter((u, score) => score < target).length);
    // const p1HasIncompletes = playerUniverses[1].some((universesAtScore) => universesAtScore.filter((u, score) => score < target).length);
    // console.log('p0HasIncompletes', p0HasIncompletes);
    // console.log('p1HasIncompletes', p1HasIncompletes);

    // winner = !p0HasIncompletes || !p1HasIncompletes;
    winner = incompletes.some(w => !w)
    console.log('WINNER', winner, `${incompletes.join(', ')}`);
    t++;
  }

  console.log('sweeps', sweeps.map((n) => f(n)).join(', '))
  console.log('firstWin', firstWin.map((n) => f(n)).join(', '))

  // let p1 = playerUniverses[0].reduce((acc, v) => acc + v, 0);
  // let p2 = playerUniverses[1].reduce((acc, v) => acc + v, 0);

  // console.log('p2', p1, p2);
}


await solver();
await solver2();
