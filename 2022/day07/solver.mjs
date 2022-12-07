import { lineReader } from '../../common.mjs';

function Directory(parent) {
  this.dirs = {};
  this.parent = parent;
  this.files = [];
  this.size = 0;
};

const solver = async () => {
  let lines = await lineReader('input.txt');
  let root = new Directory(null);
  let current = root;
  let smallSum = 0;

  const allDirs = [root];

  const goUp = () => {
    if (current.size <= 100000) {
      smallSum += current.size;
    }
    current.parent.size += current.size;
    current = current.parent;
  };

  lines.forEach((line) => {
    if (line[0] === '$') {
      if (line[2] === 'l') { // ls
        // NOOP
      }
      else if (line[2] === 'c') { // cd
        if (line[5] === '/') { // cd /
          // NOOP
        }
        else if (line[5] === '.') { // cd ..
          goUp();
        }
        else { // cd x
          current = current.dirs[line.slice(5)];
        }
      }
    }
    else {
      if (line[0] === 'd') { // dir
        const nd = new Directory(current)
        allDirs.push(nd);
        current.dirs[line.slice(4)] = nd;
      }
      else { // file size
        const size = parseInt(line);
        current.files.push({
          size,
        });
        current.size += size;
      }
    }
  });

  while(current !== root) {
    goUp();
  }

  console.log('p1', smallSum);

  // Part 2
  const total = 70000000;
  const updateSize = 30000000;
  const diff = total - root.size;
  const spaceNeeded = updateSize - diff;

  const bigEnough = allDirs.filter((d) => d.size > spaceNeeded);

  bigEnough.sort((a, b) => (a.size > b.size ? 1 : -1));

  console.log('p2', bigEnough[0].size);
}

await solver();
