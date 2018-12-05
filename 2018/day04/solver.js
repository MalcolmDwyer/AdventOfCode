var fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
testInput = require('./input_test.txt')

const lines = input => input
  .split('\n')
  .filter(line => line)
//-----------------------------------------------------------

const rg = /\[([\d]*)\-([\d]*)\-([\d]*) ([\d]*):([\d]*)\] ([A-Za-z\#0-9\s]*)/

let sortLines = lines => lines
  .map(line => {
    return rg.exec(line).slice(1)
  })
  .sort((a,b) => {
    return (
      (parseInt(a[0] + a[1] + a[2] + a[3] + a[4])) < (parseInt(b[0] + b[1] + b[2] + b[3] + b[4]))
    ) ? -1 : 1
  })

let getData = sorted => {
  let guardMinutesCount = {}
  let guardMinutes = {}
  let maxGuard = null
  let maxGuardMinutes = 0

  let id = null
  let asleepAt = null
  for (let l = 0; l < sorted.length; l++) {
    if (sorted[l][5][0] === 'G') {
      id = parseInt(sorted[l][5].replace(/[^\d]*/, ''))
    }
    else if (sorted[l][5][0] === 'f') {
      asleepAt = parseInt(sorted[l][4])
    }
    else {
      if (!guardMinutesCount[id]) {
        guardMinutesCount[id] = 0
        guardMinutes[id] = Array(60)
        guardMinutes[id].fill(0)
      }

      let wokeAt = parseInt(sorted[l][4])
      guardMinutesCount[id] += wokeAt - asleepAt

      if (guardMinutesCount[id] > maxGuardMinutes) {
        maxGuardMinutes = guardMinutesCount[id]
        maxGuard = id
      }

      for (let m = asleepAt; m < wokeAt; m++) {
        guardMinutes[id][m] += 1
      }
    }
  }

  return {
    guardMinutes,
    guardMinutesCount,
    maxGuard,
    maxGuardMinutes
  }
}

const solver1 = lines => {
  let sorted = sortLines(lines)
  let data = getData(sorted)
  let {
    guardMinutes,
    guardMinutesCount,
    maxGuard,
    maxGuardMinutes
  } = data

  let maxMinute = -1
  let maxMinuteAmount = 0
  guardMinutes[maxGuard].forEach((v, m) => {
    if (v > maxMinuteAmount) {
      maxMinute = m
      maxMinuteAmount = v
    }
  })

  return maxGuard * maxMinute
}

const solver2 = lines => {
  let sorted = sortLines(lines)
  let data = getData(sorted)
  let {
    guardMinutes,
    guardMinutesCount,
    maxGuard,
    maxGuardMinutes
  } = data

  let maxMinuteTop = -1
  let maxMinuteAmountTop = 0
  let maxGuardTop = null
  Object.keys(guardMinutes).forEach(id => {
    let maxMinute = -1
    let maxMinuteAmount = 0
    guardMinutes[id].forEach((v, m) => {
      if (v > maxMinuteAmount) {
        maxMinute = m
        maxMinuteAmount = v
      }
    })
    if (maxMinuteAmount > maxMinuteAmountTop) {
      maxGuardTop = id
      maxMinuteTop = maxMinute
      maxMinuteAmountTop = maxMinuteAmount
    }
  })

  // console.log(maxGuardTop, maxMinuteTop, maxMinuteAmountTop)
  return maxGuardTop * maxMinuteTop
}


let s1 = solver1(lines(input))
let s2 = solver2(lines(input))

console.log('s1', s1)
console.log('s2', s2)
