import { lineReader } from '../../common.mjs';

const parseLine = (line) => {
  return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
};

const solver = async () => {
  let lines = await lineReader('input.txt');
  let matches = 0;
  let matches2 = 0;
  
  lines.slice(0, 200000000).forEach(line => {
    const [all, rangeMin, rangeMax, ch, pass] = parseLine(line);
    

    const count = pass.split('').filter((c) => c === ch).length;
    let valid = false;
    
    if (count >= rangeMin && count <= rangeMax) {
      valid = true;
      matches++;
    }


    let valid2 = (pass[rangeMin-1] === ch) ^ (pass[rangeMax-1] === ch)
    if (valid2) {
      matches2++;
    }
    // console.log(rangeMin, rangeMax, ch, pass, count, valid ? '  ***** ' : '');
  })
  
  console.log(matches);
  console.log(matches2);
}


solver();

