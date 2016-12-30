const lines = input => input.split('\n').filter(a => a.length);

const getStack = line => {
  return line.split(/[\(\)x]+/).reduce((stack, c, ix) => {
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
}

const stackReducer = ({tally, multStack}, block) => {


  if (block && block.size && block.N) {
    // console.log('Taking block: ', block, ' <<<<<<<<<<<<<<<<<<');
    multStack.push(block);
    // console.log(multStack);
  }
  else {
    console.log('')
    console.log('-------')
    console.log('Reached char block: ', block);
    if (multStack && multStack.length) {
      console.log(multStack)
      console.log('')
    }


    let mult = multStack.map(m => m.N).reduce((p, m) => p*m, 1);

    for (let ix = multStack.length - 1; ix >= 0; ix--) {

      if (block.c <= 0) {
        break;
      }
      let block2 = multStack[ix];
      // console.log('reducing ', block2);
      // console.log(`mult: ${mult}`)
      let charSliceLength = block2.size

      if (block2.size) {
        const diff = Math.max(0, (block.c - block2.size));

        block2.done = true;
        // console.log('retiring ', block2);
        let stackSubtract = block2.w + block2.size;


        tally += mult * block2.size;
        console.log(`updating tally += ${mult} * ${block2.size}} => ${tally}`);

        mult = mult/block2.N;
        block.c -= block2.size;
        // console.log(`--> mult: ${mult}, block.c: ${block.c}, ix: ${ix}`)

        for (let i = ix-1; i >= 0; i--) {
          // console.log(`[${i}] updating stack by subtracting ${stackSubtract}`);
          multStack[i].size -= stackSubtract;
          // console.log(`multStack[${i}].size <= ${multStack[i].size}`)
          if (multStack[i].size === 0) {
            stackSubtract += multStack[i].w;
            // console.log(` --> retiring ${i} stackSubtract: ${stackSubtract}`)
            block2.done = true;
          }
          if (multStack[i].size < 0) {
            // Shouldn't happen...
            console.error(`ERROR!!!!!!!!!`)
            break;
          }
        }
      }
    }

    multStack = multStack.filter(s => !s.done && (s.size > 0))

    if (!multStack.length && block.c) {
      // console.log('No stack: += ' + block.c)
      tally += block.c;
      return {tally, multStack};
    }
  }

  return {tally, multStack};
}

const decodeCount = stack => {
  let {tally, multStack} = stack.reduce(stackReducer, {tally: 0, multStack: []});
  return tally;
}

const counter = line => {
  console.log(`




`)
  console.log('---------------------------------------------------');

  let groupedStack = getStack(line);
  console.log(groupedStack);

  let count = decodeCount(groupedStack);
  console.log(count);
}

module.exports = {
  lines,
  counter
}
