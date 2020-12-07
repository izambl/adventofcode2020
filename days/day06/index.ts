import { readInput } from '../../common'

const input = readInput(`${__dirname}/input`, '\n\n');
const groups = input.map((group: string): string[] => group.split('\n'));

function part01(): number {
  return groups.reduce((total: number, group: string[]) => {
    return total + countYesOnGroup(group);
  }, 0);
}

function part02(): number {
  return groups.reduce((total: number, group: string[]) => {
    return total + countAllYesOnGroup(group);
  }, 0);
}

function countYesOnGroup(group: string[]): number {
  const yesAnswers: { [index: string]: boolean } = {};

  group.forEach((personAnswers: string): void => {
    [...personAnswers].forEach((answer: string): void => {
      yesAnswers[answer] = true;
    })
  });

  return Object.keys(yesAnswers).length;
}

function countAllYesOnGroup(group: string[]): number {
  const yesAnswers: { [index: string]: number } = {};

  group.forEach((personAnswers: string): void => {
    [...personAnswers].forEach((answer: string): void => {
      yesAnswers[answer] = (yesAnswers[answer] || 0) + 1;
    })
  });

  return Object.keys(yesAnswers).reduce((total: number, answer: string) => {
    if (yesAnswers[answer] === group.length) return total + 1;

    return total;
  }, 0);
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
