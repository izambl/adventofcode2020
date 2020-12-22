import fs from 'fs';
import path from 'path';

export function readInput(fileName: string, splitBy: string = '\n'): string[] {
  return fs.readFileSync(path.join(fileName)).toString('utf-8').split(splitBy);
}

export function readNumberInput(fileName: string) {
  return readInput(fileName).map(Number);
}
