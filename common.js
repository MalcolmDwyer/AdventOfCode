var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};


module.exports = {
  getInputFile: n => {
    return require(n);
  },
  lines: input => input.split('\n').filter(a => a.length)
}
