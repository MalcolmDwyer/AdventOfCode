import { lineReader } from '../../common.mjs';

const solver = async (part, iter) => {

  let lines = await lineReader('input.txt');

  let p = lines[0].split('');
  let rules = lines.slice(1).reduce((o, r) => {
    const [a1, c] = r.split(' -> ');
    const [a, b] = a1.split('');
    o[`${a}${c}${b}`] = 0;
    return o;
  }, {});

  const first = p[0];

  // console.log('rules', rules);

  for (let i = 1; i < p.length; i++) {
    let a = p[i-1];
    let b = p[i];

    Object.keys(rules).find((rule) => {
      let [x, z, y] = rule.split('');
      if (x === a && y === b) {
        rules[rule]++;
      }
    });
  }

  const iterate = () => {
    const next = { ...rules };
    Object.keys(next).forEach((k) => {
      next[k] = 0;
    })


    Object.entries(rules).forEach(([rule, value]) => {
      if (!value) {
        return;
      }
      let [x, z, y] = rule.split('');
      const xz = `${x}${z}`;
      const zy = `${z}${y}`;
      // console.log(`--------------- x:${x}   z:${z}   y:${y}`)

      const rulesWithXZ = Object.keys(rules).filter((rule2) => {
        let [a, c, b] = rule2.split('');
        return (
          `${a}${b}` === xz
        )
      });
      // console.log('rulesWithXZ', rulesWithXZ);

      const rulesWithZY =  Object.keys(rules).filter((rule2) => {
        let [a, c, b] = rule2.split('');
        return (
          `${a}${b}` === zy
        )
      });
      // console.log('rulesWithZY', rulesWithZY);


      [...rulesWithXZ, ...rulesWithZY].forEach((rule2) => {
        next[rule2] += value;
      });
    });
    rules = next;
  }

  // console.log('rules', rules);
  let right;

  for (let t = 0; t < iter; t++) {
    iterate();

    right = {};
    Object.entries(rules).forEach(([rule, value]) => {
      let [x, z, y] = rule.split('');
      if (!right[y]) {
        right[y] = value;
      }
      else {
        right[y] += value;
      }
    });

  }

  right[first]++;
  const scores = Object.values(right);
  const m = Math.min(...scores);
  const M = Math.max(...scores);

  console.log(`p${part}`, (M-m));
}


await solver(1, 10);
await solver(2, 40);
