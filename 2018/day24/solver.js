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

const readArmy = (line, team, id) => {
  let parts = rx.exec(line)
  // if (!parts) {
  //   console.log('NO LINE... ', line)
  // }
  // console.log(parts.groups)
  let army = {
    id,
    team,
    hp: parseInt(parts.groups.hp),
    unitCount: parseInt(parts.groups.unitCount),
    damage: parseInt(parts.groups.damage),
    initiative: parseInt(parts.groups.initiative),
    attackType: parts.groups.attackType,
    weak: [],
    immune: []
  }
  if (parts.groups.weaknesses) {
    let ws = parts.groups.weaknesses.split('; ')
    ws.forEach(w => {
      let [key, values] = w.split(' to ')
      // console.log('WEAK', key, '|', values)
      army[key] = values.split(',').map(s => s.trim())
    })
  }

  return army
}

const getData = lines => {
  const groups = []
  let team = 'immune'
  let id = 1
  lines.forEach((line, ix) => {
    if (line == 'Infection:') {
      team = 'infection'
      id = 1
      return
    }
    else if (!ix || !line) { return }

    if (line && line.length) {
      groups.push(readArmy(line, team, team.slice(0, 2) + id))
      id++
    }
  })
  return groups
}


const solver = (lines) => {
  // solver1(getData(lines))
  solver2(getData(lines))
}

const solver1 = groups => {
  // console.log('groups', groups)

  let result = war(groups)
}

const solver2 = (groups) => {
  let result = false
  let boost = 59
  while (!result) {
    result = war(groups, boost)
    console.log(`boost ${boost} result: ${result}`)
    boost++
    result = true
  }
}

const war = (groups, boost = 0) => {
  let t = 0

  printGroups(groups)
  if (boost) {
    groups = groups.map(g => {
      if (g.team == 'immune') {
        console.log(`boosting ${g.id} damage by ${boost} ${g.damage} to ${g.damage + boost}`)
        g.damage = g.damage + boost
      }
      return g
    })
  }
  console.log('boosted:')
  printGroups(groups)
  // printGroups(groups)
  while(true/* && t < 20*/) {
    console.log('--------------------------------', t)
    targetingPhase(groups)
    console.log('  After targeting:')
    printGroups(groups)
    attackingPhase(groups)
    console.log('  Result:')
    printGroups(groups)
    t++

    if (['infection', 'immune'].some(team => (
      0 == groups.filter(g => g.team == team).reduce((s, g) => s + g.unitCount, 0)
    ))) {
      break
    }
  }
  printGroups(groups)
  const [infection, immune] =
  ['infection', 'immune'].map(team => {
    let r = groups.filter(g => g.team == team).reduce((s, g) => s + g.unitCount, 0)
    console.log(team, r)
    return r
  })
  console.log(`Infection: ${infection},   Immune: ${immune}`)
  return !!immune
}

// < 36362

const getEffectivePower = group => (group.unitCount * group.damage)

const targetingPhase = groups => {
  groups.forEach(group => {
    group.effectivePower = getEffectivePower(group)
    delete group.targetedBy
    delete group.targeting
  })

  groups = groups.sort((a,b) => {
    // Target selection sort
    let d1 = a.effectivePower - b.effectivePower
    if (d1) {
      return -d1
    }
    else {
      let d2 = a.initiative - b.initiative
      return -d2
    }
  })
  console.log('  Targeting:')

  groups.forEach(group => {
    if (!group.unitCount) {
      return
    }
    const targets = groups
      .filter(group2 => !group2.targetedBy && (group2.team !== group.team) && group2.unitCount)
      .sort((a, b) => {
        const aDamage = getAttackDamage(group, a)
        const bDamage = getAttackDamage(group, b)
        const d1 = aDamage - bDamage
        if (d1) {
          return -d1
        }
        else {
          // console.log(`targeting Damage tiebreak at ${aDamage}, -> ep [${group.id} -> [${a.id}, ${b.id}]]`)
          const d2 = a.effectivePower - b.effectivePower
          if (d2) {
            return -d2
          }
          else {
            // console.log(`                ep tiebreak at ${a.effectivePower}, -> ep [${group.id} -> [${a.id}, ${b.id}]]`)
            const d3 = a.initiative - b.initiative
            return -d3
          }
        }
      })
    if (targets.length && getAttackDamage(group, targets[0])) {
      group.targeting = targets[0].id
      targets[0].targetedBy = group.id
    }
  })

  // printGroups(groups)
}

const printGroups = groups => {
  groups.forEach(group => {
    console.log(`${group.id.padEnd(4, ' ')} ${group.team.padStart(10, ' ')}  count:${group.unitCount.toString().padStart(6, ' ')}  hp:${group.hp.toString().padStart(6, ' ')}  d: ${group.damage.toString().padStart(4, ' ')}  eP: ${(group.effectivePower || '').toString().padStart(6, ' ')}  init: ${group.initiative.toString().padStart(2, ' ')}  targeting: ${(group.targeting || '').padEnd(4, ' ')}  targetedBy: ${(group.targetedBy || '').padEnd(4, ' ')}`)
  })
}

const attackingPhase = groups => {
  console.log('  Attacking:')
  groups = groups
    .sort(attackingSort)
    .filter(group => group.unitCount && group.targeting)
    .forEach(group => {
      if (!group.unitCount) {
        return
      }
      group.effectivePower = getEffectivePower(group)
      skirmish(group, groups.find(g => g.id == group.targeting))
    })
}

const skirmish = (group, target) => {
  // apply damage by group to group.targeting
  const d = getAttackDamage(group, target)
  const killedUnits = Math.floor(d / target.hp)
  const oldUnitCount = target.unitCount
  target.unitCount = Math.max(0, target.unitCount - killedUnits)
  console.log(`    ${group.id} attacked ${target.id} (${oldUnitCount}) doing ${d} damage, killing ${Math.min(oldUnitCount, killedUnits)}`)
}

const getAttackDamage = (attacker, defender) => {
  let multiplier = 1

  if (defender.weak.includes(attacker.attackType)) {
    multiplier = 2
  }
  else if (defender.immune.includes(attacker.attackType)) {
    return 0
  }

  return attacker.effectivePower * multiplier
}

const attackingSort = (a, b) => {
  return -(a.initiative - b.initiative)
}
