import path from 'path'
import {readFile, getLines} from '../../common'

readFile(path.resolve(process.argv[2] || 'input.txt'))
  .then(data => {
    solver(
      getLines(data)// .map(l => l.split(''))
    )
  })
  .catch(err => {
    console.error(err)
  })

// 17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2

const rx = /(?<unitCount>[\d]*) units each with (?<hp>[\d]*) hit points( \((?<weaknesses>[a-z,; ]*)\))? with an attack that does (?<damage>[\d]*) (?<attackType>[a-z]*) damage at initiative (?<initiative>[\d]*)/
// const partKeys = ['unitCount', 'hp', 'weaknesses', 'damage', 'attackType', 'initiative']
// const partTypes = ['num', 'num', 'x', 'weaknesses', 'num', 'string', 'num']

const readArmy = (line, team) => {
  let parts = rx.exec(line)
  // if (!parts) {
  //   console.log('NO LINE... ', line)
  // }
  // console.log(parts.groups)
  let army = {
    team,
    hp: parseInt(parts.groups.hp),
    unitCount: parseInt(parts.groups.unitCount),
    damage: parseInt(parts.groups.damage),
    initiative: parseInt(parts.groups.initiative),
    attackType: parts.groups.attackType,
  }
  if (parts.groups.weaknesses) {
    let ws = parts.groups.weaknesses.split('; ')
    ws.forEach(w => {
      let [key, values] = w.split(' to ')
      // console.log('WEAK', key, '|', values)
      army[key] = values.split(',')
    })
  }

  return army
}

const getData = lines => {
  // return lines.map(line => {
  //
  //   const parts = rx.exec(line)
  //   // console.log('l', parts)
  //   return parts.slice(1, 5).map(d => parseInt(d))
  // })
  // const section2 = lines.findIndex(line => line.indexOf('Infection:' == 0))
  // console.log('section2', section2)

  const armies = []
  let team = 'immune'
  lines.forEach((line, ix) => {
    if (line == 'Infection:') {
      team = 'infection'
      return
    }
    else if (!ix || !line) { return }
    // let team = (ix > section2) ? 1 : 0
    if (line && line.length) {
      // console.log('readArmy', line)
      armies.push(readArmy(line, team))
    }
  })
  return armies
}


const solver = (lines) => {
  solver1(getData(lines))
}

const solver1 = armies => {
  // console.log('armies', armies)

  let result = battle(armies)
}

const getEffectivePower = army => (army.unitCount * army.damage)

const battle = armies => {
  armies.forEach(army => {
    army.effectivePower = getEffectivePower(army)
  })

  armies = armies.sort((a,b) => {
    // Target selection sort
    if (a.effectivePower > b.effectivePower) {
      return -1
    }
    else if (a.effectivePower < b.effectivePower) {
      return 1
    }
    else {
      if (a.initiative > b.initiative) {
        return -1
      }
      else {
        return 1
      }
    }
  })
  console.log('Sorted armies for targeting')
  armies.forEach(army => {
    console.log(`${army.team}, ${army.unitCount}, ${army.effectivePower}, ${army.initiative}`)
  })
}
