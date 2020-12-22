import { readInput } from '../../common';

const input = readInput(`${__dirname}/input`).map((instruction: string): [string, number] => {
  const [command, num] = instruction.split(' ');

  return [command, Number(num)];
});

function part01(): number {
  try {
    runProgram(input);
  } catch (error) {
    return Number(error.message);
  }
  return 0;
}

function part02(): number {
  let result = 0;
  let currentLine = 0;
  let switchLine = false;

  while (!result) {
    try {
      result = switchLine ? runProgram(input, currentLine) : runProgram(input);
    } catch (error) {
      if (switchLine) {
        currentLine += 1;
        switchLine = false;
      } else {
        switchLine = true;
      }
    }
  }

  return result;
}

function runProgram(program: Array<[string, number]>, switchLine: number | null = null): number {
  let accumulator = 0;
  let currentLine = 0;
  const linesRan: { [index: number]: boolean } = {};

  while (currentLine !== program.length) {
    const [instruction, value] = input[currentLine];
    let switchedInstruction = null;

    if (linesRan[currentLine]) throw new Error(`${accumulator}`);

    linesRan[currentLine] = true;

    if (switchLine === currentLine && instruction === 'nop') switchedInstruction = 'jmp';
    if (switchLine === currentLine && instruction === 'jmp') switchedInstruction = 'nop';

    switch (switchedInstruction || instruction) {
      case 'acc': accumulator += value; currentLine += 1; break;
      case 'nop': currentLine += 1; break;
      case 'jmp': currentLine += value; break;
    }
  }

  return accumulator;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
