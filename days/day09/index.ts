import { readInput } from '../../common'

const input = readInput(`${__dirname}/input`).map(Number);
 
function part01(): number {
  const preamble = 25;
  let currentNumber = 0;

  while (findNumbersThatSum(input.slice(currentNumber, preamble + currentNumber), input[currentNumber + preamble])) {
    currentNumber += 1;
  }

  return input[currentNumber + preamble];
}

function part02(): number {
  const invalidNumber = part01();
  let totalSum = 0;
  let numberList = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = i; j < input.length; j++) {
      totalSum += input[j];
      numberList.push(input[j]);

      if (totalSum > invalidNumber) {
        totalSum = 0;
        numberList = [];
        break;
      }
      if (totalSum === invalidNumber) {
        return Math.max(...numberList) + Math.min(...numberList);
      }
    }  
  }

  return 0;
}

function findNumbersThatSum(preambleList: number[], number: number) {
  for (let i = 0; i < preambleList.length; i++) {
    for (let j = i + 1; j < preambleList.length; j++) {
      if ((preambleList[i] + preambleList[j] === number) && (preambleList[i] !== preambleList[j])) {
        return true;
      }
    }
  }
  
  return false;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
