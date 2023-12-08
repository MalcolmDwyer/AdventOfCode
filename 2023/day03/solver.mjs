import { lineReader, gridReader2 } from '../../common.mjs';

const isNum = (c) => !isNaN(parseInt(c));

const solver = async () => {
  // const input = 'test.txt';
  const input = 'input.txt';
  let grid = await gridReader2(input, (v, {x, y}) => ({v, x, y}));
  let lines = await lineReader(input);

  const {numbers, symbols} = lines.reduce((acc, line, lineIndex) => {
    const chars = line.split('');
    let numPart;
    let inNum = false;
    let startInd;
    for (let i = 0; i < chars.length; i++) {
      if (isNum(chars[i])) {
        if (!inNum) {
          numPart = `${chars[i]}`;
          inNum = true;
          startInd = i;
        }
        else {
          numPart = `${numPart}${chars[i]}`;
        }
        if ((i === chars.length - 1 || !isNum(chars[i + 1]))) {
          acc.numbers.push({
            x: startInd,
            y: lineIndex,
            num: parseInt(numPart),
          });
        }
      }
      else {
        inNum = false;
        if (chars[i] !== '.') {
          acc.symbols.push({
            x: i,
            y: lineIndex,
            symbol: chars[i],
          })
        }
      }
    }

    return acc;
  }, {numbers: [], symbols: []});

  const partFilter = (parts) => (number) => {
    const xMin = number.x - 1;
    const xMax = number.x + `${number.num}`.length;
    const yMin = number.y - 1;
    const yMax = number.y + 1;
    console.log(`[${number.num}]  x:[${xMin}, ${xMax}]  y:[${yMin}, ${yMax}]`)

    return parts.find(({x, y}) => (x >= xMin && x <= xMax && y >= yMin && y <= yMax));
  }

  const parts = numbers.filter(partFilter(symbols));

  const gearCandidates = symbols.filter(({symbol}) => (symbol === '*'));

  const gears = gearCandidates.reduce((acc, gearCandidate) => {
    const neighborParts = parts.filter(partFilter([gearCandidate]));
    if (neighborParts.length === 2) {
      acc.push({
        ...gearCandidate,
        parts: neighborParts,
      });
    }
    return acc;
  }, []);

  const gearRatios = gears.reduce((acc, gear) => (
    acc + (gear.parts[0].num * gear.parts[1].num)
  ), 0)

  const total = parts.reduce((acc, {num}) => acc + num, 0);
  // console.log(grid)
  // console.log(lines)
  // console.log(numbers);
  // console.log(symbols);
  // console.log(parts);
  // console.log(gears);
  console.log('p1', total);
  console.log('p2', gearRatios);
}



await solver();

