import { lineReader } from '../../common.mjs';

const setupCaves = (lines) => {
  const caves = new Map();

  lines
    .map((line) => line.split('-'))
    .map(([a, b]) => {
      [a, b].forEach((c, ix) => {
        if (!caves.has(c)) {
          if (c.toLowerCase() === c) {
            caves.set(c, {
              small: true,
              links: new Set([ix ? a : b]),
            });
          }
          else {
            caves.set(c, {
              big: true,
              links: new Set([ix ? a : b]),
            });
          }
        }
        else {
          const prev = caves.get(c);
          caves.set(c, {
            ...caves.get(c),
            links: new Set([...Array.from(prev.links), ix ? a : b]),
          }

          );
        }
      });
      return ({ a, b });
    });
    return caves;
};

const hasDoubleSmalls = (path, caves) => {
  const smalls = Array.from(path).filter((n) => caves.get(n).small);
  return smalls.length !== (new Set(smalls)).size;
}

const getRoutes = (path, caves, part2) => {
  const routes = [];
  let p = caves.get(path[path.length - 1]);
  // console.log('getRoutes', path, 'FROM', end, path.join(', '));

  const hasAlreadyDoubledSmall = hasDoubleSmalls(path.slice(1), caves);
  
  p.links.forEach((link) => {
    if (link === 'end') {
      routes.push([...path, 'end']);
      return;
    }
    if (link === 'start') {
      return;
    }
    if (
      caves.get(link).big
      || !path.includes(link)
      || (
           part2
           && path.filter((n) => n === link).length < 2
           && !hasAlreadyDoubledSmall
         )
    ) {
      let r = getRoutes([...path, link], caves, part2);
      if (r.length) {
        routes.push(...r);
      }
    }
  });
  return routes;
};


const solver = async (part2) => {
  let lines = await lineReader('input.txt');

  const caves = setupCaves(lines);
  // console.log(caves);
  const routes = getRoutes(['start'], caves, part2);
  
  console.log(part2 ? 'p2' : 'p1', routes.length);
}

await solver(false);
await solver(true);

// > 65040
