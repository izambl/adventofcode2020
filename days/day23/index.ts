import { readInput } from '../../common';

type Cups = number[];
interface Cup {
  prev: Cup
  next: Cup
  label: number
}
interface CupList {
  [index: number]: Cup;
}

const input: Cups = readInput(`${__dirname}/input`)[0].split('').map(Number);

function part01(): string {
  const cups: CupList = createCupList(input);

  const orderedCups = [...input].sort((cupA: number, cupB: number) => cupB - cupA);

  let currentCup = cups[input[0]];
  for (let i = 0; i < 100; i += 1) {
    move(cups, currentCup, orderedCups);
    currentCup = currentCup.next;
  }

  const result = [];
  currentCup = cups[1].next;
  while (currentCup.label !== 1) {
    result.push(currentCup.label);
    currentCup = currentCup.next;
  }

  return result.join('');
}

function part02(): number {
  const cupsInput = [...input];
  const maxCup = Math.max(...input);

  for (let i = 1; i <= (1000000 - input.length); i += 1) {
    cupsInput.push(maxCup + i);
  }

  const cups: CupList = createCupList(cupsInput);
  const orderedCups = [...cupsInput].sort((cupA: number, cupB: number) => cupB - cupA);

  let currentCup = cups[cupsInput[0]];
  for (let i = 0; i < 10000000; i += 1) {
    move(cups, currentCup, orderedCups);
    currentCup = currentCup.next;
  }

  return cups[1].next.label * cups[1].next.next.label;
}

function move(cups: CupList, currentCup: Cup, orderedCups: number[]): void {
  const firstPick: Cup = currentCup.next;
  const middlePick: Cup = currentCup.next.next;
  const lastPick: Cup = currentCup.next.next.next;
  const picksLabels: number[] = [firstPick.label, middlePick.label, lastPick.label];

  firstPick.prev.next = lastPick.next;
  lastPick.next.prev = firstPick.prev;

  let destinationCup = null;
  for (let i = currentCup.label - 1; i > 0; i -= 1) {
    if (!picksLabels.includes(cups[i].label)) {
      destinationCup = cups[i];
      break;
    }
  }

  if (!destinationCup) {
    for (let i = 0; i < orderedCups.length; i += 1) {
      if (!picksLabels.includes(orderedCups[i])) {
        destinationCup = cups[orderedCups[i]];
        break;
      }
    }
  }

  const destinationCupNext = destinationCup.next;

  destinationCup.next = firstPick;
  firstPick.prev = destinationCup;
  lastPick.next = destinationCupNext;
  destinationCupNext.prev = lastPick;
}

function createCupList(cups: number[]): CupList {
  const cupList: CupList = {
    [cups[cups.length - 1]]: { prev: null, next: null, label: cups[cups.length - 1] },
  };

  let previousCup: Cup = cupList[cups[cups.length - 1]];
  cups.forEach((cup: number) => {
    if (!cupList[cup]) cupList[cup] = { prev: null, next: null, label: cup };

    previousCup.next = cupList[cup];
    cupList[cup].prev = previousCup;

    previousCup = cupList[cup];
  });

  return cupList;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
