import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };


const solver = async () => {
  let lines = await lineReader('input.txt');
  let program = lines.map((line) => {
    const [a, inst, valText] = /(^\w+) ([-+0-9]*)$/.exec(line);
    const val = parseInt(valText);
    return [
      inst,
      val,
    ];
  });

  let solved = false;
  let checking = -1;
  let acc = 0;

  while (!solved) {
    let visited = new Set([0]);
    let halt = false;
    let finished = false
    let pc = 0;
    let flip = program.findIndex(([inst], ix) => (ix > checking && ['nop', 'jmp'].includes(inst)));
    if (flip === -1) {
      // console.log('done flipping');
      solved = true;
      break;
    }

    acc = 0;
    // console.log('flip', flip);
    checking = flip;

    while (!halt && !finished) {
      if (pc >= program.length) {
        console.log('terminated');
        finished = true;
        continue;
      }
      visited.add(pc);
      let [inst, val] = program[pc];
      if (flip === pc && inst === 'jmp') {
        inst = 'nop'
      }
      else if (flip === pc && inst === 'nop') {
        inst = 'jmp';
      }
      // console.log(`[${pc}] |${inst}| |${val}|      ${acc}`);
      
      if (inst === 'jmp') {
        // console.log('       jmp', val);
        pc = pc + val;
      }
      else {
        pc += 1;
      }
      
      if (inst === 'acc') {
        // console.log('       acc', val);
        acc = acc + val;
      }

      if (inst === 'nop') {
        // console.log('       nop', val);
      }

      if (visited.has(pc)) {
        // console.log('infinite loop - halting');
        halt = true;
      }
    }
    if (finished) {
      solved = true;
    }
  }
  console.log('acc', acc);

}


solver();

