import { readInput } from '../../common'

const input = readInput(`${__dirname}/input`).map(Number);
const sortedInput = [0, ...input, Math.max(...input) + 3].sort((a: number, b: number) => a - b);

function part01(): number {
  const joltDifferences: { [index: number]: number } = {};

  for (let i = 1; i < sortedInput.length; i++) {
    const joltDifference = sortedInput[i] - sortedInput[i - 1];

    joltDifferences[joltDifference] = (joltDifferences[joltDifference] || 0) + 1;
  }

  return joltDifferences[1] * (joltDifferences[3]);
}

function getPossibleWays(device: number): number {
  let possibleWays = 1;

  if (sortedInput[device + 2] - sortedInput[device] <= 3) possibleWays++;
  if (sortedInput[device + 3] - sortedInput[device] <= 3) possibleWays++;

  return possibleWays;
}

function part02(): number {
  const multipliers = [...Array(sortedInput.length)].map(() => 1); // times each device is in different paths
  let currentPaths = 1;

  for (let device = 0; device < sortedInput.length; device++) {
    const possibleWays = getPossibleWays(device);

    if (possibleWays === 1 || possibleWays === 0) continue;

    currentPaths += ((possibleWays - 1) * multipliers[device]);

    multipliers[device + 2] = (possibleWays === 3)
      ? multipliers[device] * 2
      : multipliers[device];

    for (let m = device + 3; m < multipliers.length; m++) {
      multipliers[m] = currentPaths;
    }    
  }
  
  return currentPaths;
}

// Brute forced - should get result in a few hours (or days)
function part02bf(): number {
  let totalWays = 0;

  function walkDevices(combination: number[]) {    
    totalWays += 1;

    for (let i = 0; i < combination.length; i++) {
      if (combination[i + 2] && combination[i + 2] - combination[i] <= 3) walkDevices([...combination.slice(i + 2)]);
      if (combination[i + 3] && combination[i + 3] - combination[i] <= 3) walkDevices([...combination.slice(i + 3)]);
    }
  }

  walkDevices(sortedInput);

  return totalWays;
}

process.stdout.write(`Part 1: ${part01()}\n`);

process.stdout.write(`Part 2: ${part02()}\n`);


// Manual runs part 01
// multipliers 1 1 1 2 4  7  13 13
// devices     0 3 4 5 6  7  8 11
// ways        1 3 3 3 2  1  1
// total paths 1 3 5 9 13 13 13

// 0
// 0 3 4 5 6 7 8 11  

// 3: paths + ways-1 * multiplier
// 0 3 4 5 6 7 8 11  
// 0 3   5 6 7 8 11  
// 0 3     6 7 8 11  

// 4: paths + ways-1 * multiplier
// 0 3 4 5 6 7 8 11  
// 0 3 4   6 7 8 11  
// 0 3 4     7 8 11  
// 0 3   5 6 7 8 11  
// 0 3     6 7 8 11  

// 5: paths + ways-1 * multiplier
// 0 3 4 5 6 7 8 11  
// 0 3 4 5   7 8 11  
// 0 3 4 5     8 11  
// 0 3 4   6 7 8 11  
// 0 3 4     7 8 11  
// 0 3   5 6 7 8 11
// 0 3   5   7 8 11  
// 0 3   5     8 11  
// 0 3     6 7 8 11 



// Manual runs part 01
// multipliers  1  1  2  4  7  7  7  7  7  7  7  7  7  7  7  7
// devices     00 01 02 03 04 07 08 09 10 11 14 17 18 19 20 23
// ways         3  3  2  1  1  3  3  2  1  1  1  3  2  1  1  0
// total paths  3  5  7


// 00 01 02 03 04 07 08 09 10 11 14 17 18 19 20 23
// 00 01 02    04 07 08 09 10 11 14 17 18 19 20 23
// 00 01    03 04 07 08 09 10 11 14 17 18 19 20 23
// 00 01       04 07 08 09 10 11 14 17 18 19 20 23
// 00    02 03 04 07 08 09 10 11 14 17 18 19 20 23
// 00    02    04 07 08 09 10 11 14 17 18 19 20 23
// 00       03 04 07 08 09 10 11 14 17 18 19 20 23


// 3-- *=0,*=1,*=2 por el multiplier del actual
// 2--   0 1 por el multiplier del actual


// --: 1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1
// 00:    1  2  3  3  3  3  3  3  3  3  3  3  3  3  3
// 01: 
// 02: 
// 03: 
