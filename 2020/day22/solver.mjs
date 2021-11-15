import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };


const solver = async () => {
  let players = await lineReader('input.txt', n => n, '\n\n');
  // let lines = await lineReader('input.txt');
  // console.log(players);
  let decks = players.map((player) => 
    player.split('\n').slice(1).map((l) => parseInt(l))
  );

  // console.log(decks[0]);
  // console.log(decks[1]);

  let round = 1;
  let winner = false;
  while (!winner) {
    let p1 = decks[0].shift();
    let p2 = decks[1].shift();

    // console.log(`ROUND ${round}: ${p1} vs ${p2}`);

    if (p1 > p2) {
      decks[0].push(p1)
      decks[0].push(p2);
    }
    else {
      decks[1].push(p2)
      decks[1].push(p1);
    }

    // console.log(decks[0]);
    // console.log(decks[1]);

    if (!decks[0].length || !decks[1].length) {
      winner = (decks[0].length ? 0 : 1);
    }

    round++;

    if (!(round % 100000000)) {
      console.log(`Round ${round}`);
    }
  }

  let score = 0;
  let t = decks[winner].length
  decks[winner].forEach((card, ix) => {
    score = score + (card * (t - ix))
  })

  console.log('p1', score)

}

class Card {
  constructor(v, next = null, prev = null) {
    this.v = v;
    this.prev = prev;
    this.next = next;
  }
}

const solverb = async () => {
  let players = await lineReader('input.txt', n => n, '\n\n');
  // let lines = await lineReader('input.txt');
  // console.log(players);
  let decks = players.map((player) => 
    player.split('\n').slice(1).map((l) => parseInt(l))
  );

  let t = decks[0].length + decks[1].length;

  let p1Top = new Card(decks[0][0]);
  let p2Top = new Card(decks[1][0]);

  let p1End;
  let p2End;

  let prev1 = p1Top;
  let prev2 = p2Top;
  for (let i = 1; i < decks[0].length; i++) {
    prev1.next = new Card(decks[0][i]);
    prev2.next = new Card(decks[1][i]);

    prev1 = prev1.next;
    prev2 = prev2.next;

    p1End = prev1;
    p2End = prev2;
  }

  // console.log(`${p1Top.v} ... ${p1End.v}`);

  // console.log('p1.n, p1.n.n', p1Top.v, p1Top.next.v, p1Top.next.next.v, p1Top.next.next.next.v, p1Top.next.next.next.next.v);
  // console.log('p2.n, p2.n.n', p2Top.v, p2Top.next.v, p2Top.next.next.v, p2Top.next.next.next.v, p2Top.next.next.next.next.v);

  // console.log(decks[0]);
  // console.log(decks[1]);

  let round = 1;
  let winner = false;
  while (!winner) {
    if (!p1Top) {
      winner = 1;
      break;
    }
    if (!p2Top) {
      winner = 0;
      break;
    }


  //   let p1 = decks[0].shift();
  //   let p2 = decks[1].shift();

    let c1 = p1Top;
    let c2 = p2Top;
    console.group(`ROUND ${round}: ${c1.v} vs ${c2.v}`);

    if (c1.v > c2.v) {
      console.log('1');
      let temp1 = c1.next;
      let temp2 = c2.next;
      p1End.next = p1Top;
      p1End.next.next = p2Top;
      p1End.next.next.next = null;
      p1End = p1End.next.next;
      p1Top = temp1;
      p2Top = temp2;
  //     decks[0].push(p1)
  //     decks[0].push(p2);
    }
    else {
      console.log('2');
      let temp1 = c1.next;
      let temp2 = c2.next;
      p2End.next = p2Top;
      p2End.next.next = p1Top;
      p2End.next.next.next = null;
      p2End = p2End.next.next;
      p2Top = temp2;
      p1Top = temp1;
  //     decks[1].push(p2)
  //     decks[1].push(p1);
    }

    console.log(`P1: ${p1Top?.v} ${p1Top?.next?.v}... ${p1End?.v}`);
    console.log(`P2: ${p2Top?.v} ${p2Top?.next?.v} ... ${p2End?.v}`);

    console.groupEnd();

  //   // console.log(decks[0]);
  //   // console.log(decks[1]);

  //   if (!decks[0].length || !decks[1].length) {
  //     winner = (decks[0].length ? 0 : 1);
  //   }

    round++;

    if (!(round % 100000000)) {
      console.log(`Round ${round}`);
    }
  }

  // console.log(`P1: ${p1Top.v} ... ${p1End.v}`);
  // console.log(`P2: ${p2Top.v} ... ${p2End.v}`);

  
  // let t = decks[winner].length
  let w = winner === 0 ? p1Top : p2Top;
  let n = 0;
  let score = w.v * (t-n);
  // console.log(`score = ${w.v} * ${t-n} => ${score}`)
  while (w.next) {
    w = w.next
    n++;
    // console.log(`score = ${w.v} * ${t-n} => ${score}`)
    score = score + w.v * (t-n);
    
  }
  // decks[winner].forEach((card, ix) => {
  //   score = score + (card * (t - ix))
  // })

  console.log('p1', score)

}









const solver2 = async () => {
  let players = await lineReader('test.txt', n => n, '\n\n');
  // let lines = await lineReader('input.txt');
  // console.log(players);
  let decks = players.map((player) => 
    player.split('\n').slice(1).map((l) => parseInt(l))
  );

  let t = decks[0].length + decks[1].length;

  let p1Top = new Card(decks[0][0]);
  let p2Top = new Card(decks[1][0]);

  let p1End;
  let p2End;

  let prev1 = p1Top;
  let prev2 = p2Top;
  for (let i = 1; i < decks[0].length; i++) {
    prev1.next = new Card(decks[0][i]);
    prev2.next = new Card(decks[1][i]);

    prev1 = prev1.next;
    prev2 = prev2.next;

    p1End = prev1;
    p2End = prev2;
  }

  // console.log(`${p1Top.v} ... ${p1End.v}`);

  // console.log('p1.n, p1.n.n', p1Top.v, p1Top.next.v, p1Top.next.next.v, p1Top.next.next.next.v, p1Top.next.next.next.next.v);
  // console.log('p2.n, p2.n.n', p2Top.v, p2Top.next.v, p2Top.next.next.v, p2Top.next.next.next.v, p2Top.next.next.next.next.v);

  // console.log(decks[0]);
  // console.log(decks[1]);

  let round = 1;
  let winner = false;
  while (!winner) {
    if (!p1Top) {
      winner = 1;
      break;
    }
    if (!p2Top) {
      winner = 0;
      break;
    }


  //   let p1 = decks[0].shift();
  //   let p2 = decks[1].shift();

    let c1 = p1Top;
    let c2 = p2Top;
    console.group(`ROUND ${round}: ${c1.v} vs ${c2.v}`);

    if (c1.v > c2.v) {
      console.log('1');
      let temp1 = c1.next;
      let temp2 = c2.next;
      p1End.next = p1Top;
      p1End.next.next = p2Top;
      p1End.next.next.next = null;
      p1End = p1End.next.next;
      p1Top = temp1;
      p2Top = temp2;
  //     decks[0].push(p1)
  //     decks[0].push(p2);
    }
    else {
      console.log('2');
      let temp1 = c1.next;
      let temp2 = c2.next;
      p2End.next = p2Top;
      p2End.next.next = p1Top;
      p2End.next.next.next = null;
      p2End = p2End.next.next;
      p2Top = temp2;
      p1Top = temp1;
  //     decks[1].push(p2)
  //     decks[1].push(p1);
    }

    console.log(`P1: ${p1Top?.v} ${p1Top?.next?.v}... ${p1End?.v}`);
    console.log(`P2: ${p2Top?.v} ${p2Top?.next?.v} ... ${p2End?.v}`);

    console.groupEnd();

  //   // console.log(decks[0]);
  //   // console.log(decks[1]);

  //   if (!decks[0].length || !decks[1].length) {
  //     winner = (decks[0].length ? 0 : 1);
  //   }

    round++;

    if (!(round % 100000000)) {
      console.log(`Round ${round}`);
    }
  }

  // console.log(`P1: ${p1Top.v} ... ${p1End.v}`);
  // console.log(`P2: ${p2Top.v} ... ${p2End.v}`);

  
  // let t = decks[winner].length
  let w = winner === 0 ? p1Top : p2Top;
  let n = 0;
  let score = w.v * (t-n);
  // console.log(`score = ${w.v} * ${t-n} => ${score}`)
  while (w.next) {
    w = w.next
    n++;
    // console.log(`score = ${w.v} * ${t-n} => ${score}`)
    score = score + w.v * (t-n);
    
  }
  // decks[winner].forEach((card, ix) => {
  //   score = score + (card * (t - ix))
  // })

  console.log('p1', score)

}


solver2();

