let Immutable = require('immutable')

const solver = (input, range) => {

  let s = Immutable.List([0]);
  let pc = 0;
  let ix;
  let after0 = null;

  Immutable.Range(1, range + 1).forEach(v => {
    ix = ((pc + input)%s.size) + 1
    s = s.insert(ix, v)
    pc = ix;
  })

  console.log(s.get(ix+1))
}

const solver2 = (input, range) => {
  let pc = 0;
  let ix;
  let after0 = null;
  Immutable.Range(1, range + 1).forEach(v => {
    pc = ((pc + input)%v) + 1
    if (pc == 1) {
      after0 = v
    }
  });
  console.log(after0)
}

// let input = 3
let input = 370

solver(input, 2017)
solver2(input, 50000000)
