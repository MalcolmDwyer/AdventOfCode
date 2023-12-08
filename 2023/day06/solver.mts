const waysToWin = (races) => races.reduce((acc, [t, record]) => {
  let count = 0;
  for (let n = 1; n <= t; n++) {
    if (n*(t-n) > record) {
      count++;
    }
  }
  return acc * count;
}, 1);

const solver = async () => {
  // const p1 = [[7, 9], [15, 40], [30, 200]];
  // const p2 = [[71530, 940200]];
  
  const p1 = [[55, 401], [99, 1485], [97, 2274], [93, 1405]];
  const p2 = [[55999793, 401148522741405]];

  console.log('p1', waysToWin(p1));
  console.log('p1', waysToWin(p2));
}

await solver();
