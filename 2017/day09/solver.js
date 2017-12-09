var fs = require('fs');
var Immutable = require('immutable');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');

// testInput = `
// `
//

//------------------------------------------------------------







const solver = (stream) => {
  // console.log(stream)

  const groups = Immutable.List([])

  let pc = 0;
  let garbage = false;
  let ignore = false;

  let gStack = [0];
  let groupTotal = 0;
  let garbageTotal = 0;

  while (pc < stream.length) {
    let c = stream[pc];
    // console.log('-', c)

    if (ignore) {
      ignore = false;
    }
    else if (garbage) {
      if (c == '!') {
        ignore = true;
      }
      else if (c == '>') {
        garbage = false;
      }
      else {
        garbageTotal++;
      }
    }
    else {
      if (c == '!') {
        ignore = true;
      }
      else if (c == '{') {
        let g = gStack[gStack.length - 1] + 1
        gStack.push(g)
        groupTotal += g
      }
      else if (c == '}') {
        gStack.pop()
      }
      else if (c == '<') {
        garbage  = true
      }
    }

    // console.log(`    ${c} - g ${garbage} | i ${ignore} | stack: ${gStack}`)

    pc++;
  }
  console.log('group score', groupTotal)
  console.log('garbageTotal', garbageTotal)

}

// solver('{}')
// solver('{{{}}}')
// solver('{{},{}}')
// solver('{{{},{},{{}}}}')
// solver('{<a>,<a>,<a>,<a>}')
// solver('{{<ab>},{<ab>},{<ab>},{<ab>}}')
// solver('{{<!!>},{<!!>},{<!!>},{<!!>}}')
// solver('{{<a!>},{<a!>},{<a!>},{<ab>}}')


solver(input)
