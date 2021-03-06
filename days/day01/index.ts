import { readNumberInput } from '../../common';

const input = readNumberInput(`${__dirname}/input`);

function findAmounts1() {
  for (let x = 0; x < input.length; x += 1) {
    for (let y = x + 1; y < input.length; y += 1) {
      if (input[x] + input[y] === 2020) {
        return input[x] * input[y];
      }
    }
  }
  return -1;
}

function findAmounts2() {
  for (let x = 0; x < input.length; x += 1) {
    for (let y = x + 1; y < input.length; y += 1) {
      for (let z = x + 2; z < input.length; z += 1) {
        if (input[x] + input[y] + input[z] === 2020) {
          return input[x] * input[y] * input[z];
        }
      }
    }
  }
  return -1;
}

process.stdout.write(`Part 1: ${findAmounts1()}\n`);
process.stdout.write(`Part 2: ${findAmounts2()}\n`);
