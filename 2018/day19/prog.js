(() => {

  let r = [1, 0, 0, 0, 0, 0]

  r[1] += 2
  r[1] = r[1] * r[1]
  r[1] = r[1] * 19
  r[1] = r[1] * 11

  r[4] += 3
  r[4] = r[4] * 22
  r[4] += 7

  r[1] += r[4]

  console.log(`A ${r.map(d => String(d).padStart(6, ' ')).join('  ')}`)

  if (r[0]) {
    r[4] = 27
    r[4] *= 28
    r[4] += 29
    r[4] *= 30
    r[4] *= 14
    r[4] *= 32

    r[1] += r[4]
    r[0] = 0
  }

  console.log(`B ${r.map(d => String(d).padStart(6, ' ')).join('  ')}`)

  r[5] = 1
  r[4] = 0


  do {
    r[3] = 1
    // console.log(`C ${r.map(d => String(d).padStart(6, ' ')).join('  ')}`)

    let m2 = 0
    do {
      // const m = r[3] * r[5]
      m2 += r[5]
      // console.log(`D ${r.map(d => String(d).padStart(6, ' ')).join('  ')}   ${m}  ${m2}`)
      if (m2 == r[1]) {
        console.log(`Z ${r.map(d => String(d).padStart(6, ' ')).join('  ')}`)
        r[0] += r[5]
      }

      r[3] += 1
    } while (r[3] <= r[1])


    r[5]++
    // console.log(`E ${r.map(d => String(d).padStart(6, ' ')).join('  ')}`)
  } while(r[5] <= r[1])

  console.log(`F ${r.map(d => String(d).padStart(6, ' ')).join('  ')}`)

  console.log('==>', r[0])
})()
