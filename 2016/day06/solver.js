var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

input = require('./input.txt');
let testInput = `
eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar
`

// input = testInput;


let lines = input.split('\n').filter(a => a.length);

let counts = [];
lines.map(line => {
  // console.log(' ------------------line: ' + line)
  line.split('').map((c, ix) => {
    // console.log(' ---- char: ' + c)
    if (!counts[ix]) {
      counts[ix] = [];
    }
    // console.log(typeof counts[ix]);
    // console.log(typeof counts[ix].indexOf)
    // console.log(counts[ix]);
    tIndex = counts[ix].findIndex(t => t.c === c);
    // console.log('tIndex: ' + tIndex);
    if (tIndex < 0) {
      counts[ix].push({c, count: 1})
    }
    else {
      let count = counts[ix][tIndex].count + 1;
      counts[ix][tIndex] = {
        c, count
      }
    }
  })
});


console.log(counts);
console.log(' ************************** sort ********************');

counts.map(countList => { // sort each list
  countList.sort((a,b) => {
    if (a.count < b.count) {
      return 1
    }
    else {
      return -1
    }
  })
})
console.log(counts);

let message = counts
  .map(countList => countList[0].c)
  .join('');

// Part 2:
message = counts
  .map(countList => countList[countList.length - 1].c)
  .join('');


console.log(message);
