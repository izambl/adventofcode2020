import { readInput } from '../../common';

interface Passport { [index: string]: string }

const input = readInput(`${__dirname}/input`, '\n\n');
const passports = input.map((passport) => passport.replace(/\n/g, ' ').split(' '));
const passportObjects: Passport[] = passports.map((passport) => passport.reduce((object: Passport, passportField: string): Passport => {
  const [field, value] = passportField.split(':');

  if (field === 'cid') return { ...object };

  return { ...object, [field]: value };
}, {}));

function part01() {
  return passportObjects.reduce((total: number, passportObject: Passport): number => {
    if (!validateForRequiredFields(passportObject)) return total;

    return total + 1;
  }, 0);
}

function part02() {
  return passportObjects.reduce((total: number, passportObject: Passport): number => {
    if (!validateForRequiredFields(passportObject)) return total;
    if (!validateValues(passportObject)) return total;

    return total + 1;
  }, 0);
}

function validateForRequiredFields(passportObject: Passport): boolean {
  const requiredFields: string[] = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

  return requiredFields.every((requiredField: string): boolean => !!passportObject[requiredField]);
}

function validateValues(passportObject: Passport): boolean {
  const validations: { [index: string]: (value: string) => boolean} = {
    byr: (byr: string) => (Number(byr) >= 1920 && Number(byr) <= 2002),
    iyr: (iyr: string) => (Number(iyr) >= 2010 && Number(iyr) <= 2020),
    eyr: (eyr: string) => (Number(eyr) >= 2020 && Number(eyr) <= 2030),
    hgt: (hgt: string) => {
      if (!/[0-9]{3}cm|[0-9]{2}in/.test(hgt)) return false;

      const unit = hgt.slice(-2);
      const height = hgt.slice(0, -2);

      if (unit === 'cm') {
        return (Number(height) >= 150 && Number(height) <= 193);
      }
      return (Number(height) >= 59 && Number(height) <= 76);
    },
    hcl: (hcl: string) => /^#[0-9a-f]{6}$/.test(hcl),
    ecl: (ecl: string) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(ecl),
    pid: (pid: string) => /^[0-9]{9}$/.test(pid),
  };

  for (const passportObjectField in passportObject) {
    if (!passportObject.hasOwnProperty(passportObjectField)) continue;
    if (!validations[passportObjectField](passportObject[passportObjectField])) return false;
  }

  return true;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
