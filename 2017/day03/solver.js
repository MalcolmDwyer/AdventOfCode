let solver = (n) => {
  // console.log('solver n', n, typeof n)

  let sqIndex = 1;
  let total = 0;
  let prevTotal = 0;
  do {
    prevTotal = total;
    total = sqIndex * sqIndex
    sqIndex += 2

  } while (total < n)
  sqIndex -= 2;
  // while ((total + sqIndex * sqIndex) < n) {
  //   total = sqIndex * sqIndex;
  //   console.log(`${sqIndex} [${sqIndex * sqIndex} sum: ${total} <? ${n}]`)
  //   sqIndex += 3;
  // }

  // console.log('sq', sqIndex, 'totals: ', prevTotal, total)

  let sideIncrLength = sqIndex - 1;
  let positionOnSide = (n - prevTotal - 1) % sideIncrLength
  let sideNum = Math.floor((n - prevTotal - 1) / sideIncrLength)
  let sideStart = prevTotal + 1 + (sideNum * sideIncrLength)
  // console.log('positionOnSide', positionOnSide, sideStart)


  let spanOnSide = Math.abs(positionOnSide - (sideIncrLength/2) + 1);
  // console.log('spanOnSide', spanOnSide)

  let distance = spanOnSide + (sqIndex - 1)/2

  // Part 1 solution:
  // console.log('distance', distance)
  // commented out for use in part 2

  return ({
    sideNum,
    positionOnSide,
    maxSide: sideIncrLength - 1
  })
}

// solver(parseInt(process.argv[2]))

// 1 3  5   7   9   11
// 1 9  25  49  81  121
//  8 16  24  32  40
//
//   37  36  35  34  33  32  31
//   38  17  16  15  14  13  30
//   39  18   5   4   3  12  29
//   40  19   6   1   2  11  28
//   41  20   7   8   9  10  27
//   42  21  22  23  24  25  26
//   43  44  45  46  47  48  49



// process.argv.forEach(function (val, index, array) {
//   console.log(array)
//   solver(parseInt(val))
// });

module.exports = solver;
