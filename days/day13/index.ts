import { readInput } from '../../common';

const input = readInput(`${__dirname}/input`);
const departTime = Number(input[0]);
const schedule = input[1].split(',').filter((id) => id !== 'x').map(Number);
const schedule2 = input[1].split(',');

type Departure = [number, number];

function part01(): number {
  const nextDepartures: Departure[] = schedule.map((time: number): Departure => {
    const lastDeparture = Math.floor(departTime / time) * time;

    if (departTime % time === 0) return [time, lastDeparture];

    return [time, lastDeparture + time];
  });
  const nextDeparture = nextDepartures.sort((a: Departure, b: Departure): number => a[1] - b[1])[0];

  return (nextDeparture[1] - departTime) * nextDeparture[0];
}

// Brute forced
// @TODO check https://en.wikipedia.org/wiki/Polynomial_remainder_theorem
// @TODO check https://www.mathsisfun.com/algebra/polynomials-remainder-factor.html
// @TODO https://math.stackexchange.com/questions/149709/hcf-lcm-and-remainders
// @TODO https://www.examrace.com/Study-Material/Aptitude/Quantitative-Reasoning/Solving-LCM-HCF-Remainder-Problems.html
function part02(): number {
  let t = 0;
  const solutionFound = false;
  let roundSolved = true;
  const maxBus = Math.max(...schedule);
  const maxBusIndex = schedule2.indexOf(String(maxBus));
  let busIndex = 0;
  let round = 0;

  while (!solutionFound) {
    round += 1;
    roundSolved = true;
    t += maxBus;

    if (round % 1000000000 === 0) process.stdout.write(`Test: ${t} -- ${process.memoryUsage().heapUsed}\n`);

    for (busIndex = 0; busIndex < schedule2.length; busIndex += 1) {
      if (schedule2[busIndex] === 'x') continue;

      if ((t - (maxBusIndex - busIndex)) % Number(schedule2[busIndex]) !== 0) {
        roundSolved = false;
        break;
      }
    }

    if (roundSolved) return t - maxBusIndex;
  }

  return 0;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
