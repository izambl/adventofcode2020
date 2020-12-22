import { readInput } from '../../common';

const input = readInput(`${__dirname}/input`);

const validOnes1 = input.reduce((total, password) => {
  const [range, letter, pass] = password.split(' ');
  const [min, max] = range.split('-');

  return total + Number(isValid(letter[0], Number(min), Number(max), pass));
}, 0);

const validOnes2 = input.reduce((total, password) => {
  const [range, letter, pass] = password.split(' ');
  const [first, second] = range.split('-');

  return total + Number(isValid2(letter[0], Number(first), Number(second), pass));
}, 0);

process.stdout.write(`part 1: ${validOnes1}\n`);
process.stdout.write(`part 2: ${validOnes2}\n`);

function isValid2(letter: string, first: number, second: number, pass: string): boolean {
  const firstPositive = pass[first - 1] === letter;
  const secondPositive = pass[second - 1] === letter;

  return !!(Number(firstPositive) ^ Number(secondPositive));
}

function isValid(letter: string, min: number, max: number, pass: string): boolean {
  const count = countLetter(letter, pass);

  if (count >= min && count <= max) return true;

  return false;
}

function countLetter(letter: string, pass: string): number {
  let count = 0;

  for (let i = 0; i < pass.length; i++) {
    if (pass[i] === letter) count++;
  }

  return count;
}
