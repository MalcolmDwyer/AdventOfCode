var fs = require('fs');
var Immutable = require('immutable');
var _ = require('lodash')
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
input = require('./input.txt');
const lines = input => input
  .split('\n')
  .filter(a => a.length)
//-----------------------------------------------------------

const parser = (line, id) => {
  let p = line.split(/[,<>]/).map(s => parseInt(s)).filter(n => !isNaN(n))

  return {
    id,
    p: p.slice(0, 3),
    v: p.slice(3, 6),
    a: p.slice(6)
  }
}

const solver = (input) => {
  particles = input.map((i, id) => parser(i, id))
  let minA = Infinity;
  let minAIndex = -1;
  particles.forEach((p, ix) => {
    ta = Math.abs(p.a[0]) + Math.abs(p.a[1]) + Math.abs(p.a[2])
    if (ta < minA) {
      minA = ta;
      minAIndex = ix
    }
  })
  console.log(minAIndex)
}

const update = p => {
  let v = p.get('v')

  p = p
    .set('v', Immutable.fromJS([
      p.getIn(['v', 0]) + p.getIn(['a', 0]),
      p.getIn(['v', 1]) + p.getIn(['a', 1]),
      p.getIn(['v', 2]) + p.getIn(['a', 2])
    ]))

  return p
    .set('p', Immutable.fromJS([
      p.getIn(['p', 0]) + p.getIn(['v', 0]),
      p.getIn(['p', 1]) + p.getIn(['v', 1]),
      p.getIn(['p', 2]) + p.getIn(['v', 2])
    ]))

}

const destroyCollided = particles => {
  return particles
    .groupBy(p => p.get('p'))
    .filter((v,k) => v.size == 1)
    .map(v => v.get(0))
    .toList()
}

const solver2 = (input) => {
  particles = Immutable.fromJS(input.map((i, id) => parser(i, id)));

  let numParticles = particles.size
  let stepsSinceCollision = 0
  while (stepsSinceCollision < 100) {
    particles = particles.map(update)
    particles = destroyCollided(particles)

    if (particles.size !== numParticles) {
      stepsSinceCollision = 0
    }
    else {
      stepsSinceCollision++
    }
    numParticles = particles.size
  }

  console.log(particles.size)
}


solver(lines(input))
solver2(lines(input))
