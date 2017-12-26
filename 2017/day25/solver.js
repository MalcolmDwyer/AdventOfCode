var Immutable = require('immutable');

const tapeStr = (tape, pc) => {

  return Immutable.Range(-5, 6, 1)
    .map(v => v == pc ?
      `[${tape.get('_' + v, 0)}]` :
      ` ${tape.get('_' + v, 0)} `
    )
    .join('')
}

const checksum = (tape) => tape.reduce((acc, v) => acc + v, 0)

const solver = (rules, steps) => {
  let state = 'A'
  let pc = 0;
  let tape = Immutable.Map({})

  // console.log(rules.toJS())

  console.log('   x    ', state, tapeStr(tape, pc))

  for (let i=0; i < steps; i++) {
    // console.log('---------------')

    // console.log(state, pc, tape.get(pc, 0))
    // console.log(rules.getIn([state, '_' + tape.get(pc, 0)]))
    let rule = rules.getIn([state, '_' + tape.get('_' + pc, 0)]).toJS()
    // console.log('   ', rule)
    // console.log(`before ${i} ${state} ${tapeStr(tape, pc)}         ${pc}`)
    let {write, next, go} = rule
    tape = tape.set('_' + pc, write)
    state = next
    pc = pc + go
    // console.log(rule.toJS())
    // tape = tape.set(rule.get('write'))
    // state = rule.get('next')
    // pc = pc + rule.get('go')

    // console.log(` after ${i} ${state} ${tapeStr(tape, pc)}         ${pc}`)
    if (!(i%10000)) {
      console.log(i)
    }
  }

  console.log('checksum', checksum(tape))
}

// Right => +1
// Left => -1
const testRules = Immutable.fromJS({
  A: {
    _0: {
      write: 1,
      go: 1,
      next: 'B'
    },
    _1: {
      write: 0,
      go: -1,
      next: 'B'
    }
  },
  B: {
    _0: {
      write: 1,
      go: -1,
      next: 'A'
    },
    _1: {
      write: 1,
      go: 1,
      next: 'A'
    }
  }
})

const rules = Immutable.fromJS({
  A: {
    _0: {
      write: 1,
      go: 1,
      next: 'B'
    },
    _1: {
      write: 0,
      go: -1,
      next: 'C'
    }
  },
  B: {
    _0: {
      write: 1,
      go: -1,
      next: 'A'
    },
    _1: {
      write: 1,
      go: -1,
      next: 'D'
    }
  },
  C: {
    _0: {
      write: 1,
      go: 1,
      next: 'D'
    },
    _1: {
      write: 0,
      go: 1,
      next: 'C'
    }
  },
  D: {
    _0: {
      write: 0,
      go: -1,
      next: 'B'
    },
    _1: {
      write: 0,
      go: 1,
      next: 'E'
    }
  },
  E: {
    _0: {
      write: 1,
      go: 1,
      next: 'C'
    },
    _1: {
      write: 1,
      go: -1,
      next: 'F'
    }
  },
  F: {
    _0: {
      write: 1,
      go: -1,
      next: 'E'
    },
    _1: {
      write: 1,
      go: 1,
      next: 'A'
    }
  },
})

solver(rules, 12172063)
// solver(testRules, 6)
