import { lineReader, gridReader } from '../../common.mjs';

// const parseLine = (line) => {
//   return /(\d*)\-(\d*) ([a-z]): ([a-z]*)/.exec(line);
// };

const readData = async () => {
  let data = await lineReader('input.txt', (line) => {
    let [ing, aller] = line.split('(');
    const ingredients = ing.split(' ').slice(0, -1);
    const allergens = aller.split(' ').slice(1).map(r => r.trim().replace(')', '').replace(',', ''));
    // const parts = /^((\w+)\s)*\(contains (\w*),+\)/.exec(line);
    return { ingredients, allergens};
  });
  return data;
}


const solver1 = async () => {
  const data = await readData();
  console.log('data');
  console.log(data);
  console.log('--------------------------------');
  const possibles = {};
  data.forEach((d) => {
    d.allergens.forEach((allergen) => {
      if (!possibles[allergen]) {
        console.log(`${allergen}: [${d.ingredients}]`)
        possibles[allergen] = d.ingredients;
      }
      else {
        console.log(`filtering ${data[allergen]} with ${d.ingredients}`)
        const f = possibles[allergen].filter((ingredient) => d.ingredients.includes(ingredient));
        console.log('   filtered', f);
        possibles[allergen] = f;
      }
    });
  });

  console.log('possibles');
  console.log(possibles);

  const allergens = Object.keys(possibles);

  while (allergens.some((allergen) => possibles[allergen].length > 1)) {
    const singles = allergens.filter((allergen) => possibles[allergen].length === 1).map((allergen) => possibles[allergen][0]);

    console.log('singles', singles);
    singles.forEach((single) => {
      allergens.forEach((allergen) => {
        if (possibles[allergen].length > 1 && possibles[allergen].includes(single)) {
          possibles[allergen] = possibles[allergen].filter((ingredient) => ingredient !== single);
        }
      });
    })
  }


  console.log('possibles');
  console.log(possibles);

  const allergenIngredients = allergens.map((allergen) => possibles[allergen][0]);
  console.log('allergenIngredients', allergenIngredients);

  let count = 0;
  data.forEach((d) => d.ingredients.forEach((ingredient) => {
    if (!allergenIngredients.includes(ingredient)) {
      count++
    }
  }))

  console.log('p1', count);


  const sortedIng = allergens.sort().map((allergen) => possibles[allergen][0]);

  console.log(sortedIng.join(','));
}


solver1();

