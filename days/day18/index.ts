import { readInput } from '../../common';

const input = readInput(`${__dirname}/input`, '\n').map((operation: string): string[] => operation.replace(/\s/g, '').split(''));

function part01(): number {  
  return input.reduce((total: number, operation: string[]): number => total + solveOperation(operation), 0);
}

function part02(): number {
  return input.reduce((total: number, operation: string[]): number => {
    const finalOperation = reduceOperation(operation);

    return solveExpression(finalOperation) + total;
  }, 0);
}

function reduceOperation(expression: string[]): string[] {
  let finalexpression = expression.join('');
  const matcher = /\([\d+*]+\)/;
  let match: RegExpExecArray = null;  

  while (match = matcher.exec(finalexpression)) {
    const innerExpression = finalexpression.substring(match.index + 1, match.index + match[0].length - 1);

    finalexpression = finalexpression.replace(match[0], `${solveExpression(splitByOperators(innerExpression))}`)
  }

  return splitByOperators(finalexpression);
}

function solveOperation(expression: string[]): number {
  let operators = [...expression];
  const operation: any = [];
  let currentValue = null;

  while (currentValue = operators.shift()) {
    if (currentValue === '(') {      
      const innerExpression: string[] = [];
      let value = null;
      let openInners = 1;
      
      while (true) {
        value = operators.shift();
        if (value === ')') {
          if (openInners === 1) break;
          openInners--;
        }
        if (value === '(') openInners++;
        innerExpression.push(value);
      }

      currentValue = solveOperation(innerExpression);
    }
    operation.push(currentValue);

    if (operation.length === 3) {
      const [left, operator, right]: [number, string, number] = operation;
      let result = null;      
      
      switch (operator) {
        case '+': result = Number(left) + Number(right); break;
        case '*': result = Number(left) * Number(right); break;
      }

      operation.push(result);
      operation.shift();
      operation.shift();
      operation.shift();
    }
  }
    
  return operation[0];
}

type Operator = [string, (a: number, b: number) => number];

const sum: Operator = ['+', (a: number, b: number): number => a + b];
const multiplication: Operator = ['*', (a: number, b: number): number => a * b];

function solveExpression(expression: string[], operators: Operator[] = [sum, multiplication]): number {
  let operation = [...expression];

  operators.forEach((operator: Operator): void => {
    const [sign, execute] = operator;

    while (operation.indexOf(sign) !== -1) {
      const operatorIndex = operation.indexOf(sign);
      const leftSide = Number(operation[operatorIndex - 1]);
      const rightSide = Number(operation[operatorIndex + 1]);
      const result = execute(leftSide, rightSide);

      operation.splice(operatorIndex-1, 3, `${result}`)
    }
  });
  
  return Number(operation[0]);
}

function splitByOperators(expression: string, operators: Operator[] = [sum, multiplication]): string[] {
  const result: string[] = [];
  let acc = '';
  
  for (let i = 0; i < expression.length; i++) {
    const nextChar = expression[i];

    if (operators.some((operator: Operator) => operator[0] === nextChar)) {
      result.push(acc);
      result.push(nextChar);
      acc = '';
    } else {
      acc += nextChar;
    }
  } 

  result.push(acc);
  
  return result;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
