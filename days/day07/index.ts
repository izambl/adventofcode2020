import { readInput } from '../../common'

const input = readInput(`${__dirname}/input`);
const bagsArray = input.map((bag: string): [string, string]=>{
  const rawBag: string[] = bag.replace(/bag,/g, 'bags,').replace(/bag\./g, 'bags.').replace(/\./g, '').split(' bags contain ');

  return [rawBag[0], rawBag[1].replace(/ bags/g, '')];
});
const bagsObject = bagsArray.reduce((bagObject: any, bag: string[]) => {
  const [bagColor, bagsContained] = bag;

  if (bagsContained === 'no other') return { ...bagObject, [bagColor]: null };

  const bagcontents = bagsContained.split(', ').reduce((childrenObjects: any, children: string) => {
    const [quantity, color] = children.replace(/\s/, '__').split('__');

    return [...childrenObjects, [color, Number(quantity)]];
  }, []);

  
   return { ...bagObject, [bagColor]: bagcontents };
 }, {});

function part01(): number {
  const BAG = 'shiny gold';
  const possibleParents = {};
 
  parentFinder([BAG], possibleParents);

  return Object.keys(possibleParents).length;
}

function part02(): number {
  const BAG = 'shiny gold';

  return childrenCounter(BAG);
}

function childrenCounter(color: string, multiplier: number = 1) {
  const colorChildrens = bagsObject[color];
  let totalSum = 0;

  if (!colorChildrens) return totalSum;

  colorChildrens.forEach(([color, quantity]: [string, number]) => {
    totalSum += quantity * multiplier;
    totalSum += childrenCounter(color, quantity) * multiplier;
  });

  return totalSum;
}

function parentFinder(colors: string[], possibleParents: { [index: string]: boolean }) {
  colors.forEach((color: string) => {
    const parents = findParentsOf(color);
    
    if (parents.length) {
      parents.forEach((parentColor: string) => { possibleParents[parentColor] = true; });
      parentFinder(parents, possibleParents);
    }
  });
}

function findParentsOf(bagColor: string): string[] {
  const bagParentsColors: string[] = [];

  bagsArray.forEach(([bagParent, bagChildren]: [string, string]) => {
    if (bagChildren.includes(bagColor)) bagParentsColors.push(bagParent);
  });

  return bagParentsColors;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
