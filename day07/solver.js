var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

input = require('./input.txt');
let testInput = `
abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn
ioaxoj[asdfgh]ioxxoj[asdfgh]zxcvbn
ioaxoj[bddb]ioxxoj[asdfgh]zxcvbn

aba[bab]xyz
xyx[xyx]xyx
aaa[kek]eke
zazbz[bzb]cdb
zazbzb[bzb]cdb
`

// input = testInput;

let lines = input.split('\n').filter(a => a.length);//.slice(0, 20);
// console.log(lines);

let segmentsList = lines.map(line => {
  return line.split(/[\[\]]/)
})

// console.log(segmentsList);

let abbaFinder = s => {
  let found = false;
  s.split('').forEach((c, ix) => {
    if (ix < 3) { return }
    if (
      (s[ix] === s[ix - 3]) &&
      (s[ix-1] === s[ix - 2]) &&
      (s[ix] !== s[ix-1])
    ) {
      found = true;
      return;
    }
  })
  // console.log(s + ': ' + found);
  return found;
}

let abaFinder = s => {
  let found = [];
  s.split('').forEach((c, ix) => {
    if (ix < 2) { return }
    if (
      (s[ix] === s[ix - 2]) &&
      (s[ix] !== s[ix-1])
    ) {
      found.push(ix-2);
    }
  })
  // console.log(s + ': ' + found);
  return found;
}

// console.log(abbaFinder('abba'));
// console.log(abbaFinder('tttabbat'));
// console.log(abbaFinder('xxxx'));


// Part 1:
let vals1 = segmentsList.map(segments => {
  let val = false;
  // console.log('------------------------------------------------------');
  // console.log(segments.join(' ___ '));
  let abas = [];
  let babs = [];

  for (let i=0; i < segments.length; i++) {
    if (!(i%2)) { // even segment -> can set val
      if (abbaFinder(segments[i])) {
        // console.log('found ++++++ abba');
        val = true;

      }
    }
    else { // odd ([xxxx]) segment -> sets val and quits
      if (abbaFinder(segments[i])) {
        // console.log('found ----- [abba] -> breaking');
        val = false;
        break;
      }
    }
  }
  return val
});

// console.log(vals);

let vals2 = segmentsList.map(segments => {
  let val = false;
  console.log('------------------------------------------------------');
  console.log(segments.join(' ___ '));
  let abas = [];
  let babs = [];

  for (let i=0; i < segments.length; i++) {
    let abasFound = abaFinder(segments[i]);

    abasFound.forEach(abaIx => {
      let aba = segments[i].slice(abaIx, abaIx + 3)
      if (!(i%2)) { // even segment -> can set val
        console.log('found ++++++ aba: ' + aba);
        abas.push(aba);
      }
      else { // odd ([xxxx]) segment -> sets val and quits
        console.log('found ----- [bab] -> ' + aba);
        babs.push(aba);
      }
    })
  }

  if (abas.length && babs.length) {
    console.log(abas)
    console.log(babs)
    val = abas.some(aba =>
      babs.some(bab => {
        return ((aba[0] === bab[1]) && (aba[1] === bab[0]))
      })
    )
  }
  console.log(val);
  return val
})

let total = vals2.reduce((count, v) => { return count + (v ? 1 : 0)}, 0)
console.log(total);

// part1: 105
