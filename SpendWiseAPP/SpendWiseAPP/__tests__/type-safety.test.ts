/**
 * Type Safety Tests
 * These tests verify that TypeScript catches type errors at compile time
 * and that variables are assigned to the correct data types at runtime
 */

import { validateEmail, validatePassword, ValidationResult } from '../helpers/validations';

describe('Type Safety - Variable Assignment Checks', () => {
  describe('String Type Safety', () => {
    it('should ensure string variables are assigned strings', () => {
      const email: string = 'test@example.com';
      const name: string = 'John Doe';
      const emptyString: string = '';

      expect(typeof email).toBe('string');
      expect(typeof name).toBe('string');
      expect(typeof emptyString).toBe('string');
      expect(email.length).toBeGreaterThan(0);
    });

    it('should verify string operations return strings', () => {
      const str1: string = 'Hello';
      const str2: string = 'World';
      const concatenated: string = `${str1} ${str2}`;

      expect(typeof concatenated).toBe('string');
      expect(concatenated).toBe('Hello World');
    });
  });

  describe('Number Type Safety', () => {
    it('should ensure number variables are assigned numbers', () => {
      const integer: number = 42;
      const float: number = 3.14;
      const zero: number = 0;
      const negative: number = -10;

      expect(typeof integer).toBe('number');
      expect(typeof float).toBe('number');
      expect(typeof zero).toBe('number');
      expect(typeof negative).toBe('number');
    });

    it('should verify number operations return numbers', () => {
      const a: number = 10;
      const b: number = 5;
      const sum: number = a + b;
      const product: number = a * b;
      const division: number = a / b;

      expect(typeof sum).toBe('number');
      expect(typeof product).toBe('number');
      expect(typeof division).toBe('number');
      expect(sum).toBe(15);
      expect(product).toBe(50);
      expect(division).toBe(2);
    });
  });

  describe('Boolean Type Safety', () => {
    it('should ensure boolean variables are assigned booleans', () => {
      const isTrue: boolean = true;
      const isFalse: boolean = false;

      expect(typeof isTrue).toBe('boolean');
      expect(typeof isFalse).toBe('boolean');
      expect(isTrue).toBe(true);
      expect(isFalse).toBe(false);
    });

    it('should verify boolean operations return booleans', () => {
      const a: boolean = true;
      const b: boolean = false;
      const and: boolean = a && b;
      const or: boolean = a || b;
      const not: boolean = !a;

      expect(typeof and).toBe('boolean');
      expect(typeof or).toBe('boolean');
      expect(typeof not).toBe('boolean');
    });
  });

  describe('Object Type Safety', () => {
    it('should ensure object properties match their types', () => {
      interface UserData {
        id: string;
        age: number;
        isActive: boolean;
        email: string;
      }

      const user: UserData = {
        id: '123',
        age: 30,
        isActive: true,
        email: 'user@example.com',
      };

      expect(typeof user.id).toBe('string');
      expect(typeof user.age).toBe('number');
      expect(typeof user.isActive).toBe('boolean');
      expect(typeof user.email).toBe('string');
    });

    it('should verify nested object types', () => {
      interface Address {
        street: string;
        city: string;
        zipCode: number;
      }

      interface Person {
        name: string;
        address: Address;
      }

      const person: Person = {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'New York',
          zipCode: 10001,
        },
      };

      expect(typeof person.name).toBe('string');
      expect(typeof person.address.street).toBe('string');
      expect(typeof person.address.city).toBe('string');
      expect(typeof person.address.zipCode).toBe('number');
    });
  });

  describe('Array Type Safety', () => {
    it('should ensure array elements match their declared type', () => {
      const numbers: number[] = [1, 2, 3, 4, 5];
      const strings: string[] = ['a', 'b', 'c'];
      const booleans: boolean[] = [true, false, true];

      numbers.forEach((num) => {
        expect(typeof num).toBe('number');
      });

      strings.forEach((str) => {
        expect(typeof str).toBe('string');
      });

      booleans.forEach((bool) => {
        expect(typeof bool).toBe('boolean');
      });
    });

    it('should verify array methods return correct types', () => {
      const numbers: number[] = [1, 2, 3];
      const doubled: number[] = numbers.map((n) => n * 2);
      const sum: number = numbers.reduce((acc, n) => acc + n, 0);
      const filtered: number[] = numbers.filter((n) => n > 1);

      doubled.forEach((n) => expect(typeof n).toBe('number'));
      expect(typeof sum).toBe('number');
      filtered.forEach((n) => expect(typeof n).toBe('number'));
    });
  });

  describe('Function Return Type Safety', () => {
    it('should verify functions return the declared type', () => {
      const getString = (): string => 'hello';
      const getNumber = (): number => 42;
      const getBoolean = (): boolean => true;

      const strResult: string = getString();
      const numResult: number = getNumber();
      const boolResult: boolean = getBoolean();

      expect(typeof strResult).toBe('string');
      expect(typeof numResult).toBe('number');
      expect(typeof boolResult).toBe('boolean');
    });

    it('should verify validation functions return ValidationResult', () => {
      const emailResult: ValidationResult = validateEmail('test@example.com');
      const passwordResult: ValidationResult = validatePassword('Password123');

      expect(typeof emailResult.isValid).toBe('boolean');
      if (emailResult.error) {
        expect(typeof emailResult.error).toBe('string');
      }

      expect(typeof passwordResult.isValid).toBe('boolean');
      if (passwordResult.error) {
        expect(typeof passwordResult.error).toBe('string');
      }
    });
  });

  describe('Optional and Nullable Types', () => {
    it('should handle optional properties correctly', () => {
      interface OptionalProps {
        required: string;
        optional?: number;
      }

      const withOptional: OptionalProps = {
        required: 'test',
        optional: 42,
      };

      const withoutOptional: OptionalProps = {
        required: 'test',
      };

      expect(typeof withOptional.required).toBe('string');
      expect(typeof withOptional.optional).toBe('number');
      expect(withoutOptional.optional).toBeUndefined();
    });

    it('should handle nullable types correctly', () => {
      const nullableString: string | null = null;
      const nullableNumber: number | null = 42;

      expect(nullableString).toBeNull();
      expect(typeof nullableNumber).toBe('number');
    });

    it('should handle undefined types correctly', () => {
      const undefinedString: string | undefined = undefined;
      const definedString: string | undefined = 'defined';

      expect(undefinedString).toBeUndefined();
      expect(typeof definedString).toBe('string');
    });
  });

  describe('Type Narrowing', () => {
    it('should correctly narrow union types', () => {
      const value: string | number = 'test';

      if (typeof value === 'string') {
        // TypeScript should know value is string here
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      } else {
        // TypeScript should know value is number here
        expect(typeof value).toBe('number');
      }
    });

    it('should correctly narrow with type guards', () => {
      const isString = (value: unknown): value is string => {
        return typeof value === 'string';
      };

      const value: unknown = 'test';

      if (isString(value)) {
        expect(typeof value).toBe('string');
        expect(value.toUpperCase()).toBe('TEST');
      }
    });
  });

  describe('Generic Type Safety', () => {
    it('should maintain type safety with generics', () => {
      const identity = <T>(value: T): T => value;

      const stringValue: string = identity<string>('test');
      const numberValue: number = identity<number>(42);
      const booleanValue: boolean = identity<boolean>(true);

      expect(typeof stringValue).toBe('string');
      expect(typeof numberValue).toBe('number');
      expect(typeof booleanValue).toBe('boolean');
    });

    it('should verify generic array functions', () => {
      const getFirst = <T>(arr: T[]): T | undefined => arr[0];

      const stringArray: string[] = ['a', 'b', 'c'];
      const firstString = getFirst<string>(stringArray);

      if (firstString !== undefined) {
        expect(typeof firstString).toBe('string');
      }
    });
  });

  describe('Type Assertions Safety', () => {
    it('should verify type assertions are correct at runtime', () => {
      const value: unknown = 'test string';
      const assertedString = value as string;

      expect(typeof assertedString).toBe('string');
      expect(assertedString.length).toBeGreaterThan(0);
    });

    it('should verify safe type assertions with checks', () => {
      const value: unknown = 123;

      if (typeof value === 'number') {
        const numberValue = value; // Type narrowing
        expect(typeof numberValue).toBe('number');
        expect(numberValue).toBe(123);
      }
    });
  });

  describe('Complex Type Safety', () => {
    it('should verify function parameter types match', () => {
      const processUser = (id: string, age: number, active: boolean): string => {
        expect(typeof id).toBe('string');
        expect(typeof age).toBe('number');
        expect(typeof active).toBe('boolean');
        return `User ${id}, age ${age}, active: ${active}`;
      };

      const result: string = processUser('123', 30, true);
      expect(typeof result).toBe('string');
    });

    it('should verify async function return types', async () => {
      const fetchData = async (): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => resolve('data'), 10);
        });
      };

      const data: string = await fetchData();
      expect(typeof data).toBe('string');
      expect(data).toBe('data');
    });
  });
});

