import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };

const parseRule = (line) => {
  let parts = /^(\d+): ([ 0-9\"a-z\|]*)$/.exec(line);
  // console.log(line, ':::::parse parts:::::', parts);
  const index = parts[1];
  if (parts[2][0] === '"') {
    return {
      index,
      root: parts[2][1],
    }
  }
  const ruleOptions = parts[2].split('|');
  const sequences = ruleOptions.map(ruleOption =>
    ruleOption.trim().split(' ').map((n) => parseInt(n))
  )
  return { index, sequences };
}

const buildTree = (rules, ruleNumber, part2) => {
  console.group(`buildTree[${ruleNumber}] -> ${rules.length}`);
  const rule = rules[ruleNumber];
  console.log('rule', rule)
  if (rule.root) {
    console.groupEnd();
    return `${rule.root}`;
  }

  if (part2 && ruleNumber === 11 && rule.sequences.length === 2) {
    console.log('******************')
    const next = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((N) => {
      return `(${buildTree(rules, rule.sequences[0][0], part2)}){${N}}(${buildTree(rules, rule.sequences[0][1], part2)}){${N}}`;
    }).join('|')
    console.groupEnd();
    return `(${next})`
  }
  if (part2 && ruleNumber === 8) {
    const next = buildTree(rules, rule.sequences[0], part2);
    console.groupEnd();
    return `(${next})+`
  }

  const next = rule.sequences.map(
    (sequence) => sequence.map(s => `${buildTree(rules, s, part2)}`).join('')
  ).join('|');
  console.groupEnd();
  return `(${next})`
}


const solver = async () => {
  let [ruleLines, messages] = (await lineReader('input.txt', a=>a, '\n\n')).map((lines) => lines.split('\n'));
  // let lines = await lineReader('input.txt');

  const rules = ruleLines.map(parseRule);
  let rulesArray = [];
  rules.forEach((rule) => {
    rulesArray[rule.index] = rule;
  });

  // console.log(rules);
  // rulesArray.forEach((rule) => console.log(rule));

  let oneRule = `^${buildTree(rulesArray, 0)}$`;

  let ruleReg = new RegExp(oneRule)

  console.log('oneRule', oneRule);
  let count = 0;
  messages.forEach((message) => {
    let t = ruleReg.test(message);
    if (t) {
      count++;
    }
    // console.log(`${message}: ${t}`);
  });

  

  console.log('p1', count);


  // /// PART 2
  // // 8: 42 | 42 8
  // // 11: 42 31 | 42 11 31

  rulesArray[8] = parseRule('8: 42 | 42 8');
  rulesArray[11] = parseRule('11: 42 31 | 42 11 31');

  oneRule = `^${buildTree(rulesArray, 0, true)}$`;
  console.log('oneRule', oneRule);
  ruleReg = new RegExp(oneRule)

  count = 0;
  messages.forEach((message) => {
    let t = ruleReg.test(message);
    if (t) {
      count++;
    }
    console.log(`${t ? '*' : ' '}: ${message}`);
  });

  

  console.log('p2', count);
}


solver();

//! 289
