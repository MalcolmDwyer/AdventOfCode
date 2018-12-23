const pr = regs => {
  console.log(`${regs.map((r,i) => `[${i}] 0x${r.toString(16).padStart(8, '0')}`).join('  ')}`)
}

const run = (r0, max) => {

// 10851315
  let r = [0, 0, 0, 0, 0, 0]

  let done = false
  while (!done) {

    r[1] = r[5] | 0x10000
    r[5] = 0xA2F195

    pr(r)


    while (true) {
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

      r[4] = 0
      while (true) {
        r[3] = r[4] + 1
        r[3] *= 0xFF

        if (r[3] > r[1]) {
          r[1] = r[4]
          break
        }
        else {
          r[4]++
          continue
        }
      }

      pr(r)
    }

  }


}

(() => {

})()
