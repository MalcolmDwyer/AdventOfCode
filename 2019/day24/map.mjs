const r = 0;

class Map {
  d = {};
  // dd = {};
  minX = -r;
  maxX = r;
  minY = -r;
  maxY = r;

  lastWriteX = null;
  lsatWriteY = null;

  initDelay = () => {
    if (!this.dd) {
      this.dd = {};
    }
    for (let y = this.minY; y <= this.maxY; y++) {
      if (!this.dd[y]) {
        this.dd[y] = {};
      }
      for (let x = this.minX; x <= this.maxX; x++) {
        this.dd[y][x] = {x, y, s: '.'}
        // this.dd[y][x] = {...(this.d[y][x] || {s: '.'})}
        // this.delayedWriteCell(x, y, {})
      }
    }
  }

  delayedWriteCell = (x, y, v) => {
    // this.dd = {...this.d};
    if (!this.dd) {
      this.initDelay();
    }
    // if (!this.dd[y]) {
    //   this.dd[y] = {}
    // }
    // if (!this.dd[y][x]) {
    //   this.dd[y][x] = {};
    // }
    this.dd[y][x] = {
      ...this.dd[y][x],
      x,
      y,
      ...v
    };

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
  }

  commit = () => {
    this.d = {...this.dd};
    delete this.dd;
  }

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

  readCell = (x, y, delayed) => {
    // if (delayed) {
    //   if (!this.dd[y]) {
    //     return null;
    //   }
    //   return this.dd[y][x] || null;  
    // }
    if (!this.d[y]) {
      return null;
    }
    return this.d[y][x] || null;
  }

  draw = (prefix = '', logger) => {
    if (!logger) {
      logger = console;
    }
    // logger.log(this.d);
    logger.log(`${prefix}-------------X[${this.minX} - ${this.maxX}]----Y[${this.minY} - ${this.maxY}]---`);
    for (let y = this.minY; y <= this.maxY; y++) {
      let str = '';
      if (this.d[y]) {
        for (let x = this.minX; x <= this.maxX; x++) {
          str += (typeof this.d[y][x] !== 'undefined') ? this.d[y][x].s : ' ';
        }
      }
      logger.log(str);
    }
  }

  drawStrings = (prefix = '') => {
    let strs = [];
    for (let y = this.minY; y <= this.maxY; y++) {
      let str = prefix;
      if (this.d[y]) {
        for (let x = this.minX; x <= this.maxX; x++) {
          if (x == 2 && y == 2) {
            str += 'O';
          }
          else {
            str += (typeof this.d[y][x] !== 'undefined') ? this.d[y][x].s : ' ';
          }
        }
      }
      strs.push(str || '.....');
    }
    return strs;
  }

  neighbors = (x, y) => {
    // console.log('neighbors()');
    // console.log(this.d);
    let list = [];
    if (this.d[y - 1] && this.d[y - 1][x]) {
      list.push(this.d[y - 1][x])
    }
    if (this.d[y + 1] && this.d[y + 1][x]) {
      list.push(this.d[y + 1][x])
    }
    if (this.d[y] && this.d[y][x - 1]) {
      list.push(this.d[y][x - 1])
    }
    if (this.d[y] && this.d[y][x + 1]) {
      list.push(this.d[y][x + 1])
    }
    return list;
  }

  map = (callback) => {
    let i = 0;
    let out = [];
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        out.push(callback(this.d[y][x], x, y, i++));
      }
    }
    return out;
  }

  reduce = (callback, initVal) => {
    let val = initVal;
    let i = 0;
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        val = callback(val, this.d[y][x], x, y, i++);
      }
    }
    return val;
  }
}

export default Map;