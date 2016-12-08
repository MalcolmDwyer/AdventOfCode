var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

let input = `
aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]
qzmt-zixmtkozy-ivhz-343[zimth]
`

input = require('./input.txt');


let rooms = input.split('\n').filter(a => a.length);
let reg = /^([a-z-]+)-([0-9]+)\[([a-z]+)\]/;

let validRooms = rooms.reduce((reduction, room) => {

  // console.log('');
  // console.log('------------' + room);
  let [all, name, sector, checksum] = reg.exec(room);
  // console.log(name, '     ...    ', sector, '    ...    ', checksum);
  // console.log(name);

  let charCounts = {};
  name.split('').filter(c => c !== '-').forEach(c => {
    charCounts[c] = (charCounts[c] || 0) + 1;
  })
  // console.log(charCounts)
  let sortableCounts = [];
  for (c in charCounts) {
    sortableCounts.push([charCounts[c], c])
  }
  // console.log(sortableCounts);
  let correctChecksum = sortableCounts
    .sort((a,b) => {
      if (a[0] < b[0]) {
        return 1
      }
      else if (a[0] === b[0]) {
        if (a[1] > b[1]) {
          return 1
        }
        else {
          return -1
        }
      }
      else {
        return -1
      }
    })
    .slice(0, 5)
    .map(x => x[1])
    .join('');

/* part 1
  if (correctChecksum === checksum) {
    reduction += parseInt(sector, 10)
  }

  return reduction;
}, 0);
*/

  if (correctChecksum === checksum) {
    reduction.push({
      name: name.replace(/-/g, ' '),
      sector
    })
  }

  return reduction;
}, []);

let rotHelper = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

validRooms = validRooms.map(r => {
  // console.log(r);
  r.decrypted = r.name.split('').map(c => {
    if (c === ' ') { return c }

    return rotHelper[ (rotHelper.indexOf(c) + (r.sector % 26 )) % 26]
  }).join('')
  return r;
});

console.log(
  validRooms
    .filter(r => r.decrypted.indexOf('bunny') == -1)
    .filter(r => r.decrypted.indexOf('candy') == -1)
    .filter(r => r.decrypted.indexOf('jellybean') == -1)
    .filter(r => r.decrypted.indexOf('rabbit') == -1)
    .filter(r => r.decrypted.indexOf('grass') == -1)
    .filter(r => r.decrypted.indexOf('flower') == -1)
    .filter(r => r.decrypted.indexOf('fuzzy') == -1)
    .filter(r => r.decrypted.indexOf('basket') == -1)
    .filter(r => r.decrypted.indexOf('egg') == -1)
    .filter(r => r.decrypted.indexOf('dye') == -1)
    .filter(r => r.decrypted.indexOf('chocolate') == -1)
    .filter(r => r.decrypted.indexOf('scavenger') == -1)
    //  What's left is 'northpole object storage'
    //  aka:
    // .filter(r => r.decrypted.indexOf('northpole') == 0)
    .map(r => r.sector)[0]
)
