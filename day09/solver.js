var fs = require('fs');
var utils = require('./utils')

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

input = require('./input.txt');
let testInput = `(11x2)(5x3)ABCDEFGHIJKL(5x4)MNOPQRSTUVWXYZ`
// testInput = 'X(8x2)(3x3)ABCY'
testInput = `
(3x3)XYZ
X(8x2)(3x3)ABCY
X(9x2)(3x3)ABCD
X(9x2)(3x3)ABCDY
A(2x2)BCD(2x2)EFG
(27x12)(20x12)(13x14)(7x10)(1x12)A
(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN
`

// testInput = 'X(8x2)(3x3)ABCY'

// testInput = '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN'

// testInput = 'X(8x2)(3x3)ABCY'
// testInput = '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN'
// testInput = '(8x10)SBTLHXZP(141x10)(20x4)PSFDROQLSZCXJYTATIBY(2x9)NN(60x14)(3x15)WUO(2x13)WF(10x14)KRXBNHFEGQ(20x4)SWJUMHNRCRJUPDVFAKMI(35x8)(3x14)VZB(8x15)SWKZSEFU(7x1)FZTLTXZ'
// input = testInput;

// let lines = input.split('\n').filter(a => a.length);
let lines = utils.lines(input);

// console.log(lines.length)
// console.log(lines[0].length)

// let stuff = [t, ...foo] = /\(([0-9]+)x([0-9]+)*\)/.exec(lines[0]);
// console.log(t)
// console.log(foo)

// let reg = /([^0-9]+([0-9])*)+/;
// let stuff = [t, ...foo] = reg.exec(lines[0]);
// console.log(t)
// console.log(foo)
// console.log(input.split(/[^]/).join(''))

// console.log = () => {}

lines.map(l => {

  utils.counter(l);
  return;

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////




  console.log(`




`)
  console.log('---------------------------------------------------');
  // console.log('line: ' + l);
  let output = '';
  let count = 0;
  let groupSize = 0;
  let n = 0;
  // (Size x N)
  let accN = false;
  let accSize = false;


  let groupedStack = l.split(/[\(\)x]+/).reduce((stack, c, ix) => {
    if (!c) {
      return stack;
    }
    if (isFinite(c)) {
      let n = parseInt(c, 10)
      if (
        stack.length && stack[stack.length - 1] &&
        stack[stack.length - 1].size &&
        !stack[stack.length - 1].N
      ) {
        stack[stack.length-1].N = n
        stack[stack.length-1].orig = `(${stack[stack.length - 1].size}x${n})`
        stack[stack.length-1].w = 3 + // (,x,)
          String(n).length + // N char length
          String(stack[stack.length - 1].size).length; // Size char length
      }
      else {
        stack.push({
          size: n
        });
      }
    }
    else {
      // stack = stack.concat(c.split('').map(z => {return {c:  z}}));
      // stack = stack.concat(c.split(''));
      stack.push({
        c: c.length,
        s: c
      })
    }
    // console.log('segment: ' + c);
    return stack;
  }, []);

  console.log(groupedStack)

  let multStack = [];
  let error = false;
  count = groupedStack.reduce((tally, block) => {

    if (block && block.size && block.N) {
      console.log('Taking block: ', block, ' <<<<<<<<<<<<<<<<<<');
      multStack.push(block);
      console.log(multStack);
    }
    else {
      let mult = multStack.map(m => m.N).reduce((p, m) => p*m, 1);
      console.log(`mult: ${mult}`)
      if (mult > 1) {
        let charSliceLength = multStack[multStack.length-1].size
        tally += mult * (charSliceLength);
      }
      else {
        console.log(`-----adding ${block.c} (${block.s})  direct group`)
        tally += block.c;
      }
    }

    return tally;
  }, 0);

  console.log('count: ' + count);

return;

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////








  // let multStack = [];
  // let error = false;
  count = groupedStack.reduce((tally, block) => {
    if (error) {
      return;
    }
    console.log('');
    console.log('-----------------------------------------------------------------');
    console.log('');

    if (block && block.size && block.N) {
      console.log('Taking block: ', block, ' <<<<<<<<<<<<<<<<<<');
      multStack.push(block);
      console.log(multStack);
    }
    else {
      let mult = multStack.map(m => m.N).reduce((p, m) => p*m, 1);

      if (mult > 1) {
        let charSliceLength = multStack[multStack.length-1].size
        console.log('-----adding ' + mult + ' * ' + charSliceLength + '  (' + block.s.slice(0, charSliceLength) + ')');
        tally += mult * (charSliceLength);

        multStack[multStack.length-1].done = true;

        console.log('Retiring block ', multStack[multStack.length-1], ' >>>>>>>>>>>>>>>>>>>>>>')

        // if (charSliceLength < block.c) {
        //   ''
        // }
        let diff = block.c - charSliceLength;
        if (diff) {
          console.log('-----adding ' + diff + ' for remaining ' + block.s.slice(charSliceLength));
          tally += diff;
        }
      }
      else {
        console.log('-----adding ' + block.c  + '       direct group')
        tally += block.c;
      }


      // multStack = multStack.map(m => {
      //   return Object.assign({}, m, {
      //     size: m.size -
      //   })
      // });

      console.log('multStack before');
      console.log(multStack);

      for (let i=0; i < multStack.length; i++) {
        let restStackWidth = multStack.slice(i + 1).reduceRight((red, m) => {
          if (m.done || m.size === 0) {
            return red + m.w;
          }
          else {
            return red;
          }
        }, 0);
        console.log(`[${i}] restStackWidth: ${restStackWidth}`)
        multStack[i].size = multStack[i].size -
          restStackWidth -
          multStack[multStack.length - 1].size
      }

      // multStack = multStack.reduceRight((red1, block) => {
      //
      // })

      // for (let i = multStack.length - 1; i >= 0; i--) {
      //   let restStackWidth = multStack.slice(i + 1).reduceRight((red, m) => {
      //     if (m.done || m.size === 0) {
      //       // return red + m.w;
      //       return red + m.w;
      //     }
      //     else {
      //       return red;
      //     }
      //   }, 0);
      //   console.log('restStackWidth: ' + restStackWidth)
      //   multStack[i].size = multStack[i].size -
      //     restStackWidth -
      //     multStack[multStack.length - 1].size
      // }

      console.log('multStack mid');
      console.log(multStack);

      // while(multStack.length && multStack[0].size === 0) {
      //   multStack.shift()
      // }
      if (multStack.some(m => m.size < 0)) {
        console.error('Negative stack size ?');
        error = true;
      }
      multStack = multStack.filter(m => m.size > 0)

      console.log('multStack after');
      console.log(multStack);
    }
    console.log('  tally: ' + tally);
    return tally;
  }, 0);

  console.info('count: ' + count);
});

// too low: 1913838552






// Part 1:
return;
lines.map(l => {
  console.log('---------------------------------------------------');
  console.log(l);
  let output = '';
  let count = 0;
  let groupSize = 0;
  let n = 0;
  // (Size x N)
  let accN = false;
  let accSize = false;

  l.split('').forEach(c => {
    if (!n && c === '(') {
      accSize = [];
      return;
    }
    else if (!n && c === 'x') {
      groupSize = parseInt(accSize.join(''), 10)
      accSize = false;
      accN = [];
      console.log('groupSize: ' + groupSize);
      return;
    }
    else if (!n && c === ')') {
      n = parseInt(accN.join(''), 10);
      accN = false;
      console.log('n: ' + n);
      return;
    }
    else if (!n && isFinite(c)) {
      if (accSize) {
        accSize.push(c)
      }
      else if (accN) {
        accN.push(c)
      }
      else {
        console.error('no accumulator');
      }
    }
    else {
      count += 1;
      output += c;


      if (n) {
        console.log(c + ' -------------');
        console.log('n: ' + n);
        for (let i = n-1; i; i--) {
          console.log('   i:' + i);
          count++;
          output += c;
          console.log(output);
        }
      }

      groupSize--;
      groupSize = Math.max(0, groupSize);
      if (!groupSize) {
        n = 0;
      }

    }
  })
  console.log(count);
})

 // 56725: too low --> 183269: correct
// console.log(output);
