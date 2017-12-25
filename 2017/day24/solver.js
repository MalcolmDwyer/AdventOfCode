var fs = require('fs');
var Immutable = require('immutable');
var _ = require('lodash')
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input
  .split('\n')
  .filter(a => a.length)
  .map(str => str.split('/').map(n => parseInt(n)))
//-----------------------------------------------------------

// let next;

let maxValue = 0;
let maxLength = 0;

function next(remaining, last, sum, length, chain) {
  const pre = Array(length * 3).fill(' ').join('');
  // console.log('')
  // console.log(pre, '----------------', ' --> last', last, 'sum', sum, 'length', length)
  // console.log(pre, 'chain', chain.map(c => `${c.get(0)}/${c.get(1)}`).join('--'))
  const nextList = remaining.filter(p => last == p.get(0) || last == p.get(1))
  // console.log(pre, 'children:', nextList.size)
  let max = sum;
  let longestPart = 0;

  nextList.forEach(p => {
    let next = p.get(1)
    if (p.get(1) == last) {
      next = p.get(0)
    }
    let newChain = chain.push(p)

    let newSum = sum + p.get(0) + p.get(1)
    if (chain.size > maxLength) {
      console.log(pre, 'new maxLength', chain.size, newSum)
      maxLength = Math.max(maxLength, newSum)
    }
    if (newSum >= maxValue) {
      console.log(pre, 'new maxValue', newSum, chain.size)
      maxValue = newSum
    }
    // console.log(pre, newChain.map(c => `${c.get(0)}/${c.get(1)}`).join('--'), newSum)
    let [partSum, partLength] = arguments.callee(
      remaining.filterNot(p2 => p2.equals(p)), next, newSum, length + 1, newChain
    )
    // console.log(pre, `[partSum: ${partSum}, partLength: ${partLength}]`)
    if (partLength >= longestPart) {
      // console.log(pre, `new longestPart ${longestPart} -> ${partLength}`)
      longestPart = Math.max(longestPart, partLength)
      max = Math.max(partSum, max)
    }
  })
  let thisLength = 1 + longestPart
  // console.log(pre, `----^^^^ Returning max ${max} len ${thisLength} (${1} + ${longestPart})`)
  return [max, thisLength];
}

const solver = (_parts) => {
  // console.log(_parts)

  const allParts = Immutable.fromJS(_parts)

  let start = 0;
  let curr = start;
  let best = 0;
  let side = 0;

  let [max, length] = next(allParts, start, 0, 0, Immutable.List())
  console.log('MAX:', max, 'LENGTH:', length)
}

solver(lines(input))
