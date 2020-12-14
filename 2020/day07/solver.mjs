import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };

const parseRule = (line) => {
  // console.log('-------------------------', line);
  const p1 = /^(\w+) (\w+) bags contain ([\w\ ,]*)\.$/.exec(line);
  const nothing = p1[3] === 'no other bags';
  let contents  = [];
  if (!nothing) {
    // contents = p1[3].split(', ');
    p1[3].split(', ').map(c => {
      // console.log(' --- ', c);
      const p2 = /^(\d+) (\w+) (\w+)/.exec(c);
      // console.log(' -------', p2);
      contents.push({
        q: p2[1],
        adj: p2[2],
        color: p2[3],
      });
    })
  }

  return {
    adj: p1[1],
    color: p1[2],
    contents,
  }
  
  // console.log(p1);
  // console.log('contents', contents);
  
}

let canContain;

canContain = (rules, adj, color, found) => {
  console.group('Checking', adj, color, found);
  let count = 0;
  let f = [...found];
  rules.forEach((rule, ix) => {
    // console.group('r', ix + 1)
    rule.contents.forEach((item) => {
      // console.group('c', item.adj, item.color);
      if (item.adj === adj && item.color === color && !found.includes(`${rule.adj} ${rule.color}`)) {
        count = count + 1;
        console.log('+1', rule.adj, rule.color);
        f.push(`${rule.adj} ${rule.color}`)
        // f = f.concat()
        let newFound = canContain(rules, rule.adj, rule.color, [...found, `${rule.adj} ${rule.color}`]);
        newFound.forEach((nf) => {
          if (!f.includes(nf)) {
            f = [...f, nf];
          }
        });
      }
      // console.groupEnd();
    });
    // console.groupEnd();
  });
  console.groupEnd();
  return f;
};

const solver = async () => {
  let lines = await lineReader('input.txt');
  let rules = lines.map(parseRule);

  const found = canContain(rules, 'shiny', 'gold', []);
  // console.log(found.sort());

  let count = 0;
  found.sort().map((f, ix) => {
    if (!ix || f !== found[ix -1]) {
      count++;
    }
    console.log(f)
  });

  console.log(found.length);
  console.log(count);
}

// !113
// !194

let bagContents;
bagContents = (rules, bag) => {
  // console.group(bag);
  if (!rules[bag].contents.length) {
    // console.groupEnd();
    return 1;
  }
  let count = 1;
  rules[bag].contents.forEach((b2) => {
    // console.log(b2.q, ' *');
    count += b2.q * bagContents(rules, `${b2.adj} ${b2.color}`)
  })
  // console.groupEnd();
  return count;
}


const solver2 = async () => {
  let lines = await lineReader('input.txt');
  // let rules = lines.map(parseRule);
  let rules = {};
  lines.forEach(line => {
    const rule = parseRule(line);
    rules[`${rule.adj} ${rule.color}`] = rule;
  });

  // console.log(rules);

  const count = bagContents(rules, 'shiny gold');
  console.log('part 2', count - 1);
};

solver2();

