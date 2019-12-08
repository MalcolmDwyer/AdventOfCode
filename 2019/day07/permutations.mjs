let permutations = [];
let used = [];

const permute = (input) => {
  for (let i = 0; i < input.length; i++) {
    const part = input.splice(i, 1)[0];
    used.push(part);

    if (!input.length) {
      permutations.push(used.slice());
    }

    permute(input);
    input.splice(i, 0, part);
    used.pop();
  }

  return permutations;
}

export default permute;
