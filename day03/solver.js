var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

let input = require('./input.txt');


// input = `  11 200 3
// 30    22 8
// 20 20    20`

// Part 1:
let triangles1 = input
  .split('\n')
  .filter(a => a.length)
  .map(
    a => a.trim()
      .split(/\s+/)
      .map(t => parseInt(t, 10))
  );

// Part 2:
let parts = [[], [], []]
let triangles = triangles1.reduce((newTriangles, row) => {
  row.map((s, ix) => parts[ix].push(s))
  if (parts[0].length === 3) {

    parts.map((p, ix2) => {
      newTriangles.push(p)
      parts[ix2] = []
    });

  }
  return newTriangles;
}, []);



let goodTriangles = triangles.reduce((count, triangle) => {
  let s = triangle.sort((a, b) => (parseInt(a, 10) - parseInt(b, 10)));
  if ((s[0] + s[1]) > s[2]) {
    count = count + 1;
  }
  return count;
}, 0)

console.log(goodTriangles);
