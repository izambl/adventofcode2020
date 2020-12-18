import { readInput } from '../../common';

type OperatorFunction = (a: number, b: number) => number;
type Operator = [string, OperatorFunction];
type ExpressionResolver = (expression: string, operators: Operator[]) => number;

const input = readInput(`${__dirname}/input`, '\n').map((operation: string): string => operation.replace(/\s/g, ''));

const sum: Operator = ['+', (a: number, b: number): number => a + b];
const multiplication: Operator = ['*', (a: number, b: number): number => a * b];

function part0102(expressionResolver: ExpressionResolver): number {  
  return input.reduce((total: number, operation: string): number => {
    return reduceOperation(operation, [sum, multiplication], expressionResolver) + total
  }, 0);
}

function reduceOperation(expression: string, operators: Operator[], solveExpression: ExpressionResolver): number {
  let finalexpression = expression;
  const matcher = /\([\d+*]+\)/;
  let match: RegExpExecArray = null;  

  while (match = matcher.exec(finalexpression)) {
    const innerExpression = finalexpression.substring(match.index + 1, match.index + match[0].length - 1);

    finalexpression = finalexpression.replace(match[0], `${solveExpression(innerExpression, operators)}`)
  }

  return solveExpression(finalexpression, operators);
}

function solveExpressionInOrder(expression: string, operators: Operator[]): number {
  let operation = splitByOperators(expression, operators);
  let nextSign = null;

  const operatorOMethods = operators.reduce((total: { [index: string]: OperatorFunction }, operator: Operator) => {
    const [name, method] = operator;

    return { ...total, [name]: method };
    }, {});

  while (nextSign = operation.find((sign: string) => !!operatorOMethods[sign])) {
    const operatorIndex = operation.indexOf(nextSign);
    const leftSide = Number(operation[operatorIndex - 1]);
    const rightSide = Number(operation[operatorIndex + 1]);
    const result = operatorOMethods[nextSign](leftSide, rightSide);

    operation.splice(operatorIndex-1, 3, `${result}`)
  }
  
  return Number(operation[0]);
}

function solveExpression(expression: string, operators: Operator[]): number {
  let operation = splitByOperators(expression, operators);

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

function splitByOperators(expression: string, operators: Operator[]): string[] {
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

process.stdout.write(`Part 1: ${part0102(solveExpressionInOrder)}\n`);
process.stdout.write(`Part 2: ${part0102(solveExpression)}\n`);
