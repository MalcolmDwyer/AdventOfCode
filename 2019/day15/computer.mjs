
const computer = (program,
  {
    name = 'cpu',
    inputFn,
    inputGenerator,
    inputPromise,
    inputArray,
    logObj = console,
    rerun = false,
  }) => {

  let inputIterator;
  if (inputGenerator) {
    inputIterator = inputGenerator();
  }

  return async function* iter() {
    let codes = [...program];
    let outputs = [];
    // logObj.log('codes', codes);

    let pc = 0;
    let relativeBase = 0;
    let instruction;
    let opcode;

    // codes[1] = noun;
    // codes[2] = verb;

    while (true) {
      // logObj.log('----------------------------------------------------', pc, relativeBase)
      // logObj.log(codes.join(','));
      // logObj.log('--------------------------------------------------------------');
      instruction = codes[pc];
      // logObj.log(`instruction ${instruction}      ${codes[pc+1]}, ${codes[pc + 2]}, ${codes[pc + 3]}, ...`);
      let strOp = `${instruction}`.split('');
      opcode = strOp.splice(-2);
      opcode = parseInt(opcode.join(''));
      // logObj.log('opcode', opcode);
      let parameterModes = strOp.map(n => parseInt(n)).reverse();
      // logObj.log('parameterModes', parameterModes);
      if (opcode === 99) {
        // logObj.log(`Noun: ${noun} Verb: ${verb} ==> [0]: ${codes[0]}`);
        logObj.log(`${name} OP 99 - Terminating`);
        if (rerun) {
          yield 'RESTART';
          relativeBase = 0;
          pc = 0;
          codes = [...program];
          continue;
        }
        else {
          yield 'DONE';
          break;
        }
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
          args.push(relativeBase + (codes[pc + i] || 0))
          // logObj.log('           args', args);
        }
        else if (mode === 0) {
          // logObj.log(`      ++++ mode 0 position     ${codes[pc + i]} => []`)
          args.push(codes[pc + i] || 0)
          // logObj.log('           args', args);
        }
        else {
          // logObj.log(`      ++++ mode 1 immediate      ${pc + i} => []`)
          args.push(pc + i);
          // logObj.log('           args', args);
        }
      }

      // logObj.log('args', args);

      if (opcode === 1) { // ADD
        // logObj.log(`ADD ${codes[args[0]] || 0} + ${codes[args[1]] || 0} ==> *${args[2]}`)
        codes[args[2]] = (codes[args[0]] || 0) + (codes[args[1]] || 0);
      }
      else if (opcode === 2) { // MULT
        // logObj.log(`MULT ${args[0]} * ${args[1]} ==> *${args[2]}`)
        codes[args[2]] = (codes[args[0]] || 0) * (codes[args[1]] || 0);
      }
      else if (opcode === 3) {
        let value;
        if (inputIterator) {
          const inputGeneratorResponse = inputIterator.next();
          logObj.log(inputGeneratorResponse);
          if (inputGeneratorResponse.done) {
            logObj.log("************************ INPUT GENERATOR IS DONE, BUT CPU IS STILL ASKING ******************");
          }
          else {
            value = inputGeneratorResponse.value;
            logObj.log(`${name} INPUT (generator) value: ${value}`);
          }
        }
        else if (typeof inputFn === 'function') {
          value = inputFn();
          logObj.log('inputFn <=', value);
        }
        else if (inputPromise) {
          value = await inputPromise();
          logObj.log(`${name} inputPromise <= ${value}`);
        }
        else if (inputArray) {
          value = inputArray.shift();
        }
        else {
          // logObj.log(`${name} waiting for input`)
          value = yield 'INPUT';
          // let value = yield;
          // logObj.log(`${name}  -- yield got value [${value}]`)
        }
        // logObj.log(`${name} INPUT (next) ${value} ==> &${args[0]}`)
        codes[args[0]] = value;
      }
      else if (opcode === 4) {
        // logObj.log('OUTPUT ', args[0], '-->');
        // logObj.log(`${name} OUTPUT *${args[0]} -> ${codes[args[0]]}  =====> output`)
        // outputs.push(codes[args[0]]);
        // logObj.log(`${name} Yielding ${codes[args[0]]}`);
        yield (codes[args[0]]);

        // if (noValue) {
        //   console.error(`Got [${noValue}] from output yield. *************************************************`)
        // }
        
      }
      else if (opcode === 5) { // jump-if-true
        // logObj.log(`jump-if-true ${codes[args[0]]} ?  => pc = ${args[1]}`);
        if (codes[args[0]]) {
          pc = codes[args[1]] || 0;
          continue;
        }
      }
      else if (opcode === 6) { // jump-if-false
        if (codes[args[0]] == 0) {
          pc = codes[args[1]] || 0;
          continue;
        }
      }
      else if (opcode === 7) { // less-than
        codes[args[2]] = ((codes[args[0]] || 0) < (codes[args[1]] || 0))
          ? 1
          : 0;
      }
      else if (opcode === 8) { // equals
        codes[args[2]] = ((codes[args[0]] || 0) === (codes[args[1]] || 0))
          ? 1
          : 0;
      }
      else if (opcode === 9) {
        // logObj.log('Adj Rel', relativeBase, codes[args[0]]);
        relativeBase = relativeBase + (codes[args[0]] || 0);
      }
      else {
        logObj.log(' ****************************** bad instruction', opcode);
        break;
      }

      pc = pc + args.length + 1;
      
    }

    // logObj.log('codes after', codes);

    // return outputs;
    // return null;
    return;

  }
}

export default computer;