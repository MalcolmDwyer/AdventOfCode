var fs = require('fs');
var utils = require('./utils')

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

input = require('./input.txt');

let testInput;

testInput =
`value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2`


// input = testInput;
// let watch = [2,5];

watch = [17, 61];


let lines = utils.lines(input);

let {inits, rules} = utils.parser(lines);
let {botSetup, found, outputs} = utils.run({inits, rules, watch});

// console.log('inits:');
// console.log(inits);
//
// console.log('');
// console.log('rules');
// console.log(rules);
//
// console.log('');
// console.log('botSetup');
// console.log(botSetup);

console.log('');
console.log('found: ' + found);
