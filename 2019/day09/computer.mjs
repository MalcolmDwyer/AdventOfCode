
const computer = async (program, inputs) => {
  let codes = [...program];
  let outputs = [];
  // console.log('codes', codes);

  let pc = 0;
  let relativeBase = 0;
  let instruction;
  let opcode;

  // codes[1] = noun;
  // codes[2] = verb;

  while (true) {
    // console.log('----------------------------------------------------', pc, relativeBase)
    // console.log(codes.join(','));
    // console.log('--------------------------------------------------------------');
    instruction = codes[pc];
    // console.log(`instruction ${instruction}      ${codes[pc+1]}, ${codes[pc + 2]}, ${codes[pc + 3]}, ...`);
    let strOp = `${instruction}`.split('');
    opcode = strOp.splice(-2);
    opcode = parseInt(opcode.join(''));
    // console.log('opcode', opcode);
    let parameterModes = strOp.map(n => parseInt(n)).reverse();
    // console.log('parameterModes', parameterModes);
    if (opcode === 99) {
      // console.log(`Noun: ${noun} Verb: ${verb} ==> [0]: ${codes[0]}`);
      break;
    }

    let args = [];
    let numArgs = 0;
    if ([1, 2, 7, 8].includes(opcode)) {
      numArgs = 3;
    }
    else if ([3, 4, 9].includes(opcode)) {
      numArgs = 1;
    }
    else if ([5, 6].includes(opcode)) {
      numArgs = 2;
    }

    for (let i = 1; i <= numArgs; i++) {
      let mode = parameterModes.length
        // ? parameterModes.splice(-1)
        ? parameterModes.shift()
        : 0;
      if (mode === 2) { // relative mode
        args.push(relativeBase + codes[pc + i])
        // console.log('           args', args);
      }
      else if (mode === 0) {
        // console.log(`      ++++ mode 0 position     ${codes[pc + i]} => []`)
        args.push(codes[pc + i])
        // console.log('           args', args);
      }
      else {
        // console.log(`      ++++ mode 1 immediate      ${pc + i} => []`)
        args.push(pc + i);
        // console.log('           args', args);
      }
    }

    // console.log('args', args);

    if (opcode === 1) { // ADD
      // console.log(`ADD ${codes[args[0]] || 0} + ${codes[args[1]] || 0} ==> *${args[2]}`)
      codes[args[2]] = (codes[args[0]] || 0) + (codes[args[1]] || 0);
    }
    else if (opcode === 2) { // MULT
      // console.log(`MULT ${args[0]} * ${args[1]} ==> *${args[2]}`)
      codes[args[2]] = (codes[args[0]] || 0) * (codes[args[1]] || 0);
    }
    else if (opcode === 3) {
      // console.log(`INPUT ${inputs[0]} ==> &${args[0]}`)
      codes[args[0]] = inputs.shift();
    }
    else if (opcode === 4) {
      // console.log('OUTPUT ', args[0], '-->');
      outputs.push(codes[args[0]]);
    }
    else if (opcode === 5) { // jump-if-true
      // console.log(`jump-if-true ${codes[args[0]]} ?  => pc = ${args[1]}`);
      if (codes[args[0]]) {
        pc = codes[args[1]];
        continue;
      }
    }
    else if (opcode === 6) { // jump-if-false
      if (codes[args[0]] === 0) {
        pc = codes[args[1]];
        continue;
      }
    }
    else if (opcode === 7) { // less-than
      codes[args[2]] = (codes[args[0]] < codes[args[1]])
        ? 1
        : 0;
    }
    else if (opcode === 8) { // equals
      codes[args[2]] = (codes[args[0]] === codes[args[1]])
        ? 1
        : 0;
    }
    else if (opcode === 9) {
      // console.log('Adj Rel', relativeBase, codes[args[0]]);
      relativeBase = relativeBase + codes[args[0]];
    }
    else {
      console.log(' ****************************** bad instruction', opcode);
      break;
    }

    pc = pc + args.length + 1;
    
  }

  // console.log('codes after', codes);

  return outputs;

}

export default computer;