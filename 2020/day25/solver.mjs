import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };

const iterate = (value, subjectNumber) => (value * subjectNumber) % 20201227;


const solver = async () => {
  let publicKeys = await lineReader('input.txt', l => parseInt(l));
  // let lines = await lineReader('input.txt');

  console.log('pub', publicKeys);

  let subjectNumber = 7;
  let doorVal = 1;
  let cardVal = 1;


  let doorLoop = 1;
  let cardLoop = 1;
  while (true) {
    doorVal = iterate(doorVal, 7)
    if (doorVal === publicKeys[0]) {
      break;
    }
    doorLoop++;
  }
  while (true) {
    cardVal = iterate(cardVal, 7)
    if (cardVal === publicKeys[1]) {
      break;
    }
    cardLoop++;
  }

  console.log('door loopCount', doorLoop, 'card', cardLoop);

  let encryptionKey = 1;
  for(let i = 0; i < cardLoop; i++) {
    encryptionKey = iterate(encryptionKey, publicKeys[0])
  }

  console.log('encryptionKey', encryptionKey);
}


solver();

