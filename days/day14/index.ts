import { readInput } from '../../common'

type Line = [string, string];

const input: Line[] = readInput(`${__dirname}/input`).map((line: string): Line => {
  const lineParts = line.split(' = ');

  return [lineParts[0], lineParts[1]];
});

function part01(): number {
  const memory: { [index: string]: number } = {};
  let currentMask = 'X'.repeat(36);

  input.forEach(([code, value]: Line) => {
    if (code === 'mask') {
      currentMask = value;
    } else {
      const memoryPosition = /\[(.*?)\]/.exec(code)[1];
     
      memory[memoryPosition] = applyMask(Number(value), currentMask);
    }
  });

  return Object.keys(memory).reduce((total: number, key: string) => memory[key] + total, 0);
}

function part02(): number {
  const memory: { [index: string]: number } = {};
  let currentMask = 'X'.repeat(36);

  input.forEach(([code, value]: Line) => {
    if (code === 'mask') {
      currentMask = value;
    } else {
      const memoryPosition = /\[(.*?)\]/.exec(code)[1];
      const memoryPositions = applyMemoryMask(Number(memoryPosition), currentMask);
      
      memoryPositions.forEach((address: string) => {
        memory[address] = Number(value);
      });
    }
  });

  return Object.keys(memory).reduce((total: number, key: string) => memory[key] + total, 0);
}

function applyMask(value: number, mask: string): number {
  const binaryValue = `${'0'.repeat(36)}${value.toString(2)}`.slice(-36).split('');
  
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === 'X') continue; 

    binaryValue[i] = mask[i];
  }

  return parseInt(binaryValue.join(''), 2);
}

function applyMemoryMask(value: number, mask: string): string[] {
  const binaryValue = `${'0'.repeat(36)}${value.toString(2)}`.slice(-36).split('');
  let addresses = [''];

  for (let i = 0; i < mask.length; i++) {
    switch (mask[i]) {
      case '0': addresses = addValueToAddresses(addresses, binaryValue[i]); break;
      case '1': addresses = addValueToAddresses(addresses, '1'); break;
      case 'X': addresses = forkAddresses(addresses); break;
    }
  }

  return addresses;
}

function forkAddresses(addresses: string[]): string[] {
  const addressesLeft = addValueToAddresses([...addresses], '1');
  const addressesRight = addValueToAddresses([...addresses], '0');

  return [...addressesLeft, ...addressesRight];
}

function addValueToAddresses(addresses: string[], value: string): string[] {
  const addressesWithNewValue = [...addresses];

  for (let i = 0; i < addressesWithNewValue.length; i++) {
    addressesWithNewValue[i] = addressesWithNewValue[i] + value;
  }

  return addressesWithNewValue;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
