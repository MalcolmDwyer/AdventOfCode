const pr = regs => {
  console.log(`${regs.map((r,i) => `[${i}] 0x${r.toString(16).padStart(8, '0')}`).join('  ')}`)
}

const run = (r0 = 0, pr, max1, max2) => {

// 10851315
  let r = [r0, 0, 0, 0, 0, 0]

  let done = false
  let kill = false
  let t = 0
  while (!done && !kill) {
    if (t > max1) {
      break
    }
    if (t && !(t%1000)) {
      console.log('t', t)
    }
    t++

    r[1] = r[5] | 0x10000
    r[5] = 0xA2F195

    pr(r)


    let t2 = 0
    while (true) {
      if (t2 > max2) {
        kill = true
        break
      }
      t2++

      r[4] = r[1] & 0xFF
      pr(r)
      r[5] += r[4]
      pr(r)
      r[5] &= 0xFFFFFF
      pr(r)
      r[5] *= 0x01016B // 363 + 0xffff
      pr(r)
      r[5] &= 0xFFFFFF
      pr(r)
      // done = true; break;

      if (0xFF > r[1]) {
        if (r[5] == r[0]) {
          break
        }
        // pr(r)
        continue
      }

      // r[4] = 0
      // while (true) {
      //   r[3] = r[4] + 1
      //   r[3] *= 0xFF
      //
      //   if (r[3] > r[1]) {
      //     r[1] = r[4]
      //     break
      //   }
      //   else {
      //     r[4]++
      //     continue
      //   }
      // }
      r[1] = Math.floor(r[1] / 0xFF)

      pr(r)
    }

  }
  if (done) {
    console.log(`${String(r0).padStart(10, ' ')} Finished`)
    return true
  }
  else if (!kill) {
    console.log(`${String(r0).padStart(10, ' ')} Bailed 0x${r0.toString(16).padStart(10, '0')}`)
  }



}

(() => {
  let r0 = 0
  let done = false
  while(!done && r0 < 1000000) {
    done = run(r0, () => {}, 200, 1000000)
    r0++
  }

})()

// !63
