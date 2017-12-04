var fs = require('fs');
var Immutable = require('immutable');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input.split('\n').filter(a => a.length)

const letterCountForWord = word => {
  let letterCountsMap = Immutable.Map({});
  word.split('').forEach(letter => {
    letterCountsMap = letterCountsMap.set(
      letter, letterCountsMap.get(letter, 0) + 1
    )
  });
  return letterCountsMap;
}

let count = lines(input).reduce((acc, line) => {
  let words = line.split(/[\ \t]/);



  // Part 1
  // let s = new Set(words)
  // console.log('words', words.length, s.size)
  // if (words.length == s.size) {
  //   acc++;
  // }

  // Part 2
  let s = Immutable.Set([]);

  words.forEach(word => {
    // console.log('word', word, letterCountForWord(word).toJS());
    s = s.add(letterCountForWord(word))
  })

  // console.log('s', s.toJS())

  if (words.length == s.size) {
    acc++;
  }

  return acc;
}, 0)

console.log('count', count)
