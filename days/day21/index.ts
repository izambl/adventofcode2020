import { intersection, cloneDeep } from 'lodash';
import { readInput } from '../../common';

type Ingredent = string;
type Allergen = string;
type Food = [Ingredent[], Allergen[]];

const foods: Food[] = readInput(`${__dirname}/input`, '\n').map((foodLine: string): Food => {
  const [ingredientsString, allergensString] = foodLine.split(' (');
  const ingredients = ingredientsString.split(' ');
  const allergens = allergensString.replace(/(contains |\)|\s)/g, '').split(',');

  return [ingredients, allergens];
});

const allergensObject: { [index: string]: Array<string[]> } = {};

foods.forEach((food: Food) => {
  const [ingredients, allergens] = food;

  allergens.forEach((allergen: string) => {
    if (!allergensObject[allergen]) allergensObject[allergen] = [];
    allergensObject[allergen].push([...ingredients]);
  });
});

function part01(): number {
  const allergens = Object.keys(allergensObject);
  const ingredientsCount: { [index: string]: number } = {};
  const ingredientsWithAllergen: { [index: string]: boolean } = {};

  foods.forEach((food: Food) => {
    const [ingredients] = food;

    ingredients.forEach((ingredient: string) => {
      if (!ingredientsCount[ingredient]) ingredientsCount[ingredient] = 0;
      ingredientsCount[ingredient]++;
    });
  });

  allergens.forEach((allergen: string) => {
    const food = intersection(...allergensObject[allergen]);
    // console.log(`Allergen: ${allergen}:  ${food}`);
    food.forEach((foodString: string) => { ingredientsWithAllergen[foodString] = ingredientsWithAllergen[foodString] || true; });
  });

  const badIngredients = Object.keys(ingredientsWithAllergen);
  const cleanIngredients = Object.keys(ingredientsCount).filter((ingredient: string) => !badIngredients.includes(ingredient));

  return cleanIngredients.reduce((total: number, ingredient: string) => ingredientsCount[ingredient] + total, 0);
}

function part02(): string {
  const allergens = cloneDeep(allergensObject);
  const allergenNames = Object.keys(allergens);
  const ingredientAndAlergen: { [index: string]: string } = {};

  while (allergenNames.length) {
    const allergen = allergenNames[0];
    const ingredient = intersection(...allergens[allergen]);

    if (ingredient.length === 1) {
      const ingredientFound = ingredient[0];

      ingredientAndAlergen[ingredientFound] = allergen;
      allergenNames.shift();
      allergenNames.forEach((allergenName: string) => {
        allergens[allergenName] = allergens[allergenName].map((ingredients: string[]) => {
          if (ingredients.includes(ingredientFound)) {
            ingredients.splice(ingredients.indexOf(ingredientFound), 1);
          }
          return ingredients;
        });
      });
    } else {
      allergenNames.push(allergenNames.shift());
    }
  }

  const badIngredients = Object.keys(ingredientAndAlergen).sort((a: string, b: string) => {
    if (ingredientAndAlergen[a] > ingredientAndAlergen[b]) return 1;
    if (ingredientAndAlergen[a] < ingredientAndAlergen[b]) return -1;
    return 0;
  });

  return badIngredients.join(',');
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
