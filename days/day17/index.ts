import { readInput } from '../../common';

interface State { [index: string]: string }
type Position = [number, number, number];
type Position2 = [number, number, number, number];

const input = readInput(`${__dirname}/input`, '\n').map((line: string) => line.split(''));

function part01(): number {
  const initialState: State = {};

  for (let y = 0; y < input.length; y += 1) {
    for (let x = 0; x < input[y].length; x += 1) {
      initialState[`${x} ${y} 0`] = input[y][x];
    }
  }

  let currentState = { ...initialState };
  let cycles = 6;

  while (cycles--) {
    currentState = processRound(currentState);
  }

  return Object.keys(currentState).reduce((total: number, key: string) => {
    if (currentState[key] === '#') return total + 1;

    return total;
  }, 0);
}

function part02(): number {
  const initialState: State = {};

  for (let y = 0; y < input.length; y += 1) {
    for (let x = 0; x < input[y].length; x += 1) {
      initialState[`${x} ${y} 0 0`] = input[y][x];
    }
  }

  let currentState = { ...initialState };
  let cycles = 6;

  while (cycles--) {
    currentState = processRound2(currentState);
  }

  return Object.keys(currentState).reduce((total: number, key: string) => {
    if (currentState[key] === '#') return total + 1;

    return total;
  }, 0);
}

function processRound(currentState: State): State {
  const newState = addStateLayer(currentState);

  Object.keys(newState).forEach((key: string) => {
    const [x, y, z] = key.split(' ').map(Number);
    const cubeState = newState[key];
    const activeNeighbors = findActiveNeighbors([x, y, z], currentState);

    if (cubeState === '#' && activeNeighbors !== 2 && activeNeighbors !== 3) newState[key] = '.';
    if (cubeState === '.' && activeNeighbors === 3) newState[key] = '#';
  });

  return newState;
}

function processRound2(currentState: State): State {
  const newState = addStateLayer2(currentState);

  Object.keys(newState).forEach((key: string) => {
    const [x, y, z, w] = key.split(' ').map(Number);
    const cubeState = newState[key];
    const activeNeighbors = findActiveNeighbors2([x, y, z, w], currentState);

    if (cubeState === '#' && activeNeighbors !== 2 && activeNeighbors !== 3) newState[key] = '.';
    if (cubeState === '.' && activeNeighbors === 3) newState[key] = '#';
  });

  return newState;
}

function addStateLayer(currentState: State): State {
  const newState = { ...currentState };
  const xs: number[] = [];
  const ys: number[] = [];
  const zs: number[] = [];

  Object.keys(newState).forEach((key: string) => {
    const [x, y, z] = key.split(' ').map(Number);

    xs.push(x);
    ys.push(y);
    zs.push(z);
  });

  const minX = Math.min(...xs) - 1;
  const maxX = Math.max(...xs) + 1;
  const minY = Math.min(...ys) - 1;
  const maxY = Math.max(...ys) + 1;
  const minZ = Math.min(...zs) - 1;
  const maxZ = Math.max(...zs) + 1;

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      for (let z = minZ; z <= maxZ; z += 1) {
        newState[`${x} ${y} ${z}`] = newState[`${x} ${y} ${z}`] || '.';
      }
    }
  }

  return newState;
}

function addStateLayer2(currentState: State): State {
  const newState = { ...currentState };
  const xs: number[] = [];
  const ys: number[] = [];
  const zs: number[] = [];
  const ws: number[] = [];

  Object.keys(newState).forEach((key: string) => {
    const [x, y, z, w] = key.split(' ').map(Number);

    xs.push(x);
    ys.push(y);
    zs.push(z);
    ws.push(w);
  });

  const minX = Math.min(...xs) - 1;
  const maxX = Math.max(...xs) + 1;
  const minY = Math.min(...ys) - 1;
  const maxY = Math.max(...ys) + 1;
  const minZ = Math.min(...zs) - 1;
  const maxZ = Math.max(...zs) + 1;
  const minW = Math.min(...ws) - 1;
  const maxW = Math.max(...ws) + 1;

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      for (let z = minZ; z <= maxZ; z += 1) {
        for (let w = minW; w <= maxW; w += 1) {
          newState[`${x} ${y} ${z} ${w}`] = newState[`${x} ${y} ${z} ${w}`] || '.';
        }
      }
    }
  }

  return newState;
}

function findActiveNeighbors(position: Position, state: State): number {
  const [x, y, z] = position;
  let active = 0;

  for (let ix = x - 1; ix <= x + 1; ix += 1) {
    for (let iy = y - 1; iy <= y + 1; iy += 1) {
      for (let iz = z - 1; iz <= z + 1; iz += 1) {
        if (x === ix && y === iy && z === iz) continue;
        active += Number(state[`${ix} ${iy} ${iz}`] === '#');
      }
    }
  }

  return active;
}

function findActiveNeighbors2(position: Position2, state: State): number {
  const [x, y, z, w] = position;
  let active = 0;

  for (let ix = x - 1; ix <= x + 1; ix += 1) {
    for (let iy = y - 1; iy <= y + 1; iy += 1) {
      for (let iz = z - 1; iz <= z + 1; iz += 1) {
        for (let iw = w - 1; iw <= w + 1; iw += 1) {
          if (x === ix && y === iy && z === iz && w === iw) continue;
          active += Number(state[`${ix} ${iy} ${iz} ${iw}`] === '#');
        }
      }
    }
  }

  return active;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
