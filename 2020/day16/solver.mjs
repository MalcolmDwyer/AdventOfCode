import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };


const solver = async () => {
  let parts = await lineReader('input.txt', undefined, '\n\n');

  let rules = parts[0].split('\n').map((r) => r.split(',')).map((r) => {
    // console.log('line', r);
    let rp = /^([\w ]*): ([0-9- or]*)$/.exec(r);
    let key = rp[1];
    let ranges = rp[2].split(' or ').map((r2) => {
      let rp2 = /^(\d*)-(\d*)$/.exec(r2);
      return {
        l: parseInt(rp2[1]),
        h: parseInt(rp2[2]),
      };
    });
    // console.log(key);
    // console.log(ranges);
    return {
      key,
      ranges,
    }
  });
  let yourTicket = parts[1].split('\n')[1].split(',').map((t) => parseInt(t));
  let tickets = parts[2]
    .split('\n')
    .slice(1)
    .map(
      (r) => r
        .split(',')
        .map((r2) => parseInt(r2))
    );

  // console.log('rules', JSON.stringify(rules, null, '  '));
  // console.log('yt', yourTicket);
  // console.log('t', tickets)

  tickets.forEach((t, tix) => {
    console.log(`[${String(tix).padStart(3, ' ')}] ${t.map(t => `${t}`.padStart(3, ' ')).join(', ')}`)
  })
  // let lines = await lineReader('input.txt');

  let invalid = 0;

  // part 1:
  tickets.forEach((ticket) => {
    ticket.forEach((t) => {
      if (!rules.some((rule) => rule.ranges.some((range) => t >= range.l && t <= range.h))) {
        invalid = invalid + t;
      }
    })
  });
  console.log('P1:', invalid);


  const validTickets = tickets.filter((ticket) =>
    ticket.every((t) =>
      rules.some((rule) =>
        rule.ranges.some((range) =>
          t >= range.l && t <= range.h
        )
      )
    )
  );

  // console.log('validTickets-------------------------------------------------------------');
  // console.log(validTickets);


  let rulePositions = {};
  rules.forEach((rule) => {
    console.log('------------rule', rule);
    let validPositions = new Set([]);
    for (let tix = 0; tix < tickets[0].length; tix++) {
      console.log(`${rule.key} checking position ${tix} -- ${validTickets.slice(0, 3).map(t => t[tix])}`)
      // console.log(`${rule.key} checking position ${tix}`);
      if (
        validTickets.every(ticket =>
          rule.ranges.some((range) =>
            ((ticket[tix] >= range.l) && (ticket[tix] <= range.h))
          )
        )
      ) {
        console.log('valid', tix)
        validPositions.add(tix);
      }
    }
    rulePositions[rule.key] = validPositions;
  });
  

  const ruleKeys = Object.keys(rulePositions);

  ruleKeys.forEach((rk) => {
    console.log(`${rk} ${[...rulePositions[rk].values()]}`)
  });

  console.log('elimination--------');

  while (ruleKeys.some((rk) => rulePositions[rk].size > 1)) {
    const singles = ruleKeys.filter((rk) => rulePositions[rk].size === 1);
    // console.log('singles', singles);
    const singlePositions = singles.map((rk) => [...rulePositions[rk].values()][0]);
    // console.log('singleP', singlePositions);

    ruleKeys.forEach((rk) => {
      singlePositions.forEach((s) => {
        if (rulePositions[rk].size > 1) {
          // console.log(`remove ${s} from ${rk}`);
          rulePositions[rk].delete(s);
        }
      })
    })
    // break;
  }
  ruleKeys.forEach((rk) => {
    console.log(`${rk} ${[...rulePositions[rk].values()]}`)
  });

  let p2 = 1;

  ruleKeys.filter((rk) => rk.startsWith('departure')).forEach((rk) => {
    let pos = [...rulePositions[rk].values()][0];
    // console.log(`${rk} [${pos}] ${yourTicket[pos]} * ${p2}}`)
    p2 = p2 * yourTicket[pos];
  });

  console.log('p2', p2);
}


solver();

// 1061520150601

