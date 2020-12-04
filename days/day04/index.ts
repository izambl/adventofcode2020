import { readInput } from '../../common'

const input = readInput(`${__dirname}/input`, '\n\n');

const requiredFields: string[] = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

function check01() {
  let total = 0;
  
  input.forEach((passport) => {
    if (requiredFields.every((field) => passport.indexOf(field) !== -1)) {
      total += 1;
    }
  })

  return total;
}

const validations: any = {
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

function check02() {
  const passports = input.map((passport) => passport.replace(/\n/g, ' ').split(' '));

  return passports.reduce((total: number, passport: string[]) => {
    const passportObject = passport.reduce((object: any, passportField: string) => {
      const [field, value] = passportField.split(':');

      if (field === 'cid') return { ...object };

      return { ...object, [field]: value };
    }, {})

    if (!requiredFields.every((requiredField: string) => {
      return !!passportObject[requiredField];
    })) { return total; }
    
    if (!Object.keys(passportObject).every((passportObjectField: string) => {
      return validations[passportObjectField](passportObject[passportObjectField]);
    })) {
      return total;
    }

    return total + 1;
  }, 0);
}

process.stdout.write(`Part 1: ${check01()}\n`);
process.stdout.write(`Part 2: ${check02()}\n`);
