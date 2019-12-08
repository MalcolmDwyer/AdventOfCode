let fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
let input = require('./input.txt');

const lines = input => input
  .split('\n')
  .filter(line => line)
  .map(line => parseInt(line))
//-----------------------------------------------------------

const fuelForMass = (mass) => (Math.floor(mass / 3) - 2);

const solver = (lines) => {
  const result = lines.reduce((acc, line) => acc + fuelForMass(line), 0);
  console.log('part1: ', result);

  const result2 = lines.reduce((acc, line) => {
    let add = fuelForMass(line);
    
    while (add > 0) {
      acc += Math.max(0, add);
      add = fuelForMass(add);
    }
    return acc;
  }, 0);
  console.log('part2: ', result2);
}


solver(lines(input));

