const lines = input => input.split('\n').filter(a => a.length);

const parser = lines => {
  let inits = [];
  let rules = [];

  lines.forEach(line => {
    // console.log('handling line: ' + line);
    const parts = line.split(' ');
    if (line.indexOf('value') === 0) {
      inits.push({
        value: parseInt(parts[1], 10),
        bot: parseInt(parts[5], 10)
      })
    }
    else {
      rules.push({
        bot: parseInt(parts[1], 10),
        low: {
          bot: (parts[5] !== 'output'),
          num: parseInt(parts[6], 10),
        },
        high: {
          bot: (parts[10] !== 'output'),
          num: parseInt(parts[11], 10)
        }
      })
    }
  });

  return {
    inits,
    rules
  }
}

run = ({inits, rules, watch}) => {
  let found = false;
  let botSetup = {};
  let outputs = {};

  let initBot = b => {
    if (!botSetup[b]) {
      botSetup[b] = {
        values: []
      }
    }
  }

  let addToBot = (b, value) => {
    initBot(b);
    botSetup[b].values = botSetup[b].values.concat(value).sort((a,b) => a - b);
    console.log(` --> addToBot [${b}] ==> ${botSetup[b].values}`)
  }

  let addToOutputBin = (b, value) => {
    if (!outputs[b]) {
      outputs[b] = [];
    }
    outputs[b].push(value);
    console.log(` --> addToOutputBin [${b}] ==> ${outputs[b]}`)
  }

  let updateList = [];

  let runBot = b => {
    console.log('--------------------------------- Running rule for ', b, updateList);
    if (botSetup[b].values.length !== 2) {
      console.error('ERROR: Nothing to run for bot ' + b);
      return;
    }

    // botSetup[b]
    let rule = rules.find(r => r.bot === b);
    if (!rule.low || !rule.high) {
      console.error('ERROR: Missing rule for bot ' + b);
      return;
    }

    if (botSetup[b].values[0] === watch[0] && botSetup[b].values[1] === watch[1]) {
      console.log('');
      console.log('');
      console.log(`Comparison between ${watch[0]} and ${watch[1]} made by ${b}`)
      console.log('');
      console.log('');
      found = b;
    }

    ['low', 'high'].forEach((part, ix) => {
      if (rule[part].bot) {
        console.log(`Moving ${part} ${botSetup[b].values[ix]} to bot ${rule[part].num}`)
        addToBot(rule[part].num, botSetup[b].values[ix]);

        if (botSetup[rule[part].num].values.length === 2) {
          console.log('++++ UpdateList + ', rule[part].num);
          updateList.push(rule[part].num);
        }
      }
      else {
        console.log(`Moving ${part} ${botSetup[b].values[ix]} to output ${rule[part].num}`)
        addToOutputBin(rule[part].num, botSetup[b].values[ix])
      }
    });

    botSetup[b].values = [];
  }

  rules.forEach(rule => {
    initBot(rule.bot);
    if (rule.low && rule.low.bot) {
      initBot(rule.low.num)
    }
    if (rule.high && rule.high.bot) {
      initBot(rule.high.num)
    }
  })

  inits.forEach(init => {
    initBot(init.bot);
    // botSetup[init.bot].values = botSetup[init.bot].values.concat(init.value).sort();
    addToBot(init.bot, init.value);

    if (botSetup[init.bot].values.length === 2) {
      updateList.push(init.bot);
    }

    while(updateList.length/* && !found*/) {
      const b = updateList.shift();
      runBot(b);
    }
  });

  console.log('updateList: ');
  console.log(updateList);

  console.log('outputs:');
  console.log(outputs);

  return {botSetup, outputs, found};
}

module.exports = {
  lines,
  parser,
  run
}
