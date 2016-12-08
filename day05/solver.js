let md5 = require('md5')

let testInput = 'abc';
let input = 'abbhdwsy';

// console.log(md5(testInput.toString(16)))
// input = testInput;
console.log('input: ' + input);

let output = '--------'.split('');

let index = 0;


while (output.indexOf('-') !== -1 ) {

  // let hash = (md5(input + index)).toString(16);

  while (
    (hash = (md5(input + index)).toString(16)) &&
    ( hash.slice(0, 5) !== '00000' ) ||
    ( output[hash[5]] !== '-') ||
    ( !(hash[5] >= 0 && hash[5] < 8))
  ) {
    index++;
    // if (!(index%1000000)) {
    //   console.log(index + ' ' + hash);
    // }
  }
  output[hash[5]] = hash[6];
  console.log(`${index} ${hash[5]}=${hash[6]} ==> ${output.join('')}`)
  index++;
}

console.log(output.join(''))
