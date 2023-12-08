import { lineReader } from '../../common.mjs';

const solver = async () => {
  const games = await lineReader('input.txt');

  const red = 12;
  const green = 13;
  const blue = 14;

  const sum = games.reduce((acc, game) => {
    const [n, g] = game.split(':');
    const [_, ix] = n.split(' ');
    const gameNumber = parseInt(ix);
    const rounds = g.split(';');
    let plus = 0;
    let ok = true;
    if (rounds.every((round) => {
      const rolls = round.split(',').map(x => x.trim());
      for (let roll of rolls) {
        const [val, color] = roll.split(' ');
        if (color == 'red' && parseInt(val) > red) {
          ok = false;
        }
        else if (color == 'green' && parseInt(val) > green) {
          ok = false;
        }
        else if (color == 'blue' && parseInt(val) > blue) {
          ok = false;
        }
      }
      return ok;
    })) {
      plus = gameNumber;
    }
    return acc + plus;
    
  }, 0);
  console.log('p1', sum);
}

const solver2 = async () => {
  const games = await lineReader('input.txt');

  const sum = games.reduce((acc, game) => {
    const [_, g] = game.split(':');
    const rounds = g.split(';');
    let red = 1;
    let green = 1;
    let blue = 1;

    rounds.forEach((round) => {
      const rolls = round.split(',').map(x => x.trim());
      for (let roll of rolls) {
        const [val, color] = roll.split(' ');
        const v = parseInt(val);
        if (color === 'red' && v > red) {
          red = v;
        }
        if (color === 'green' && v > green) {
          green = v;
        }
        if (color === 'blue' && v > blue) {
          blue = v;
        }
      }
    });
    const power = red * green * blue
    return acc + power;
  }, 0)
  console.log('p2', sum);
}

await solver();
await solver2();
