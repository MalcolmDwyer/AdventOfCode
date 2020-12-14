// import colors from 'colors';

// colors.setTheme({
//   silly: 'rainbow',
//   input: 'grey',
//   verbose: 'cyan',
//   prompt: 'grey',
//   info: 'green',
//   data: 'grey',
//   help: 'cyan',
//   warn: 'yellow',
//   debug: 'blue',
//   error: 'red'
// });
const colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

const r = 0;

class Map {
  d = {};
  minX = Infinity;
  maxX = -Infinity;
  minY = Infinity;
  maxY = -Infinity;

  lastWriteX = null;
  lsatWriteY = null

  writeCell = (x, y, v) => {
    if (!this.d[y]) {
      this.d[y] = {}
    }
    if (!this.d[y][x]) {
      this.d[y][x] = {};
    }
    this.d[y][x] = {
      ...this.d[y][x],
      x,
      y,
      ...v
    };
    // this.d[y][x].x = x;
    // this.d[y][x].y = y;

    if (y > this.maxY) {
      this.maxY = y;
    }
    if (x > this.maxX) {
      this.maxX = x;
    }
    if (y < this.minY) {
      this.minY = y;
    }
    if (x < this.minX) {
      this.minX = x;
    }

    this.lastWriteX = x;
    this.lastWriteY = y;

    // console.log(`map wrote [${v.s}] to ${x},${y}`)
  }

  readCell = (x, y) => {
    if (!this.d[y]) {
      return null;
    }
    return this.d[y][x] || null;
  }

  draw = (prefix = '') => {
    // console.log(this.d);
    console.log(`${prefix}-------------X[${this.minX} - ${this.maxX}]----Y[${this.minY} - ${this.maxY}]---`);
    // console.log(`     0123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789`)
    for (let y = this.minY; y <= this.maxY; y++) {
      let str = '';
      if (this.d[y]) {
        for (let x = this.minX; x <= this.maxX; x++) {
          if (x === this.lastWriteX && y === this.lastWriteY) {
            str += colors.FgRed + (typeof this.d[y][x] !== 'undefined') ? this.d[y][x].s : ' ' + colors.Reset;  
          }
          else {
            str += (typeof this.d[y][x] !== 'undefined') ? this.d[y][x].s : ' ';
          }
          
        }
      }
      // console.log(String(y - this.minY).padStart(4), str);
      console.log(str);
    }
  }

  neighbors = (x, y) => {
    let list = [];
    if (this.d[y - 1][x]) {
      list.push(this.d[y - 1][x])
    }
    if (this.d[y + 1][x]) {
      list.push(this.d[y + 1][x])
    }
    if (this.d[y][x - 1]) {
      list.push(this.d[y][x - 1])
    }
    if (this.d[y][x + 1]) {
      list.push(this.d[y][x + 1])
    }
    return list;
  }
}

export default Map;