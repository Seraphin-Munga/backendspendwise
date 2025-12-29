/**
 * TypeScript Type Checking Tests
 * These tests verify that variables are assigned to the correct data types
 */

// Import types from the app
import type { LoginScreenProps, SignUpScreenProps, User, AuthState } from '../screens/auth/types';
import type { OnboardingSlide } from '../screens/onboarding/types';
import type { ValidationResult } from '../helpers/validations';

describe('TypeScript Type Checking', () => {
  describe('Auth Types', () => {
    it('should correctly type LoginScreenProps', () => {
      const validProps: LoginScreenProps = {
        onLoginSuccess: () => {},
        onSignUpPress: () => {},
      };

      // TypeScript should allow this
      expect(typeof validProps.onLoginSuccess).toBe('function');
      expect(typeof validProps.onSignUpPress).toBe('function');

      // All properties should be optional
      const minimalProps: LoginScreenProps = {};
      expect(minimalProps).toBeDefined();
    });

    it('should correctly type SignUpScreenProps', () => {
      const validProps: SignUpScreenProps = {
        onSignUpSuccess: () => {},
        onLoginPress: () => {},
      };

      expect(typeof validProps.onSignUpSuccess).toBe('function');
      expect(typeof validProps.onLoginPress).toBe('function');
    });

    it('should correctly type User interface', () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      };

      expect(typeof user.id).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.name).toBe('string');

      // Name should be optional
      const userWithoutName: User = {
        id: '456',
        email: 'test2@example.com',
      };

      expect(userWithoutName.name).toBeUndefined();
    });

    it('should correctly type AuthState interface', () => {
      const authState: AuthState = {
        user: {
          id: '123',
          email: 'test@example.com',
        },
        isAuthenticated: true,
        isLoading: false,
      };

      expect(typeof authState.isAuthenticated).toBe('boolean');
      expect(typeof authState.isLoading).toBe('boolean');
      expect(authState.user).toBeDefined();
    });
  });

  describe('Onboarding Types', () => {
    it('should correctly type OnboardingSlide', () => {
      const slide: OnboardingSlide = {
        id: 1,
        title: 'Test Title',
        description: 'Test Description',
        image: require('../assets/imgs/dollar-660223_1280.png'),
      };

      expect(typeof slide.id).toBe('number');
      expect(typeof slide.title).toBe('string');
      expect(typeof slide.description).toBe('string');
      expect(slide.image).toBeDefined();
    });
  });

  describe('Validation Types', () => {
    it('should correctly type ValidationResult', () => {
      const validResult: ValidationResult = {
        isValid: true,
      };

      expect(typeof validResult.isValid).toBe('boolean');
      expect(validResult.isValid).toBe(true);

      const invalidResult: ValidationResult = {
        isValid: false,
        error: 'Validation error message',
      };

      expect(typeof invalidResult.isValid).toBe('boolean');
      expect(typeof invalidResult.error).toBe('string');
      expect(invalidResult.isValid).toBe(false);
    });
  });

  describe('Type Guards and Type Narrowing', () => {
    it('should correctly narrow types with type guards', () => {
      const validateString = (value: unknown): value is string => {
        return typeof value === 'string';
      };

      const value: unknown = 'test string';

      if (validateString(value)) {
        // TypeScript should know value is string here
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      }
    });

    it('should correctly check for undefined/null', () => {
      const value: string | undefined = 'test';

      if (value !== undefined) {
        // TypeScript should know value is string here
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      }

      const nullableValue: string | null = null;
      expect(nullableValue).toBeNull();
    });
  });

  describe('Array Type Checking', () => {
    it('should correctly type string arrays', () => {
      const stringArray: string[] = ['one', 'two', 'three'];
      
      stringArray.forEach((item) => {
        expect(typeof item).toBe('string');
      });

      expect(Array.isArray(stringArray)).toBe(true);
    });

    it('should correctly type number arrays', () => {
      const numberArray: number[] = [1, 2, 3, 4, 5];
      
      numberArray.forEach((item) => {
        expect(typeof item).toBe('number');
      });

      const sum = numberArray.reduce((acc, num) => acc + num, 0);
      expect(typeof sum).toBe('number');
    });

    it('should correctly type object arrays', () => {
      const users: User[] = [
        { id: '1', email: 'user1@example.com' },
        { id: '2', email: 'user2@example.com', name: 'User 2' },
      ];

      users.forEach((user) => {
        expect(typeof user.id).toBe('string');
        expect(typeof user.email).toBe('string');
      });
    });
  });

  describe('Function Type Checking', () => {
    it('should correctly type function parameters and return types', () => {
      const addNumbers = (a: number, b: number): number => {
        return a + b;
      };

      const result = addNumbers(5, 10);
      expect(typeof result).toBe('number');
      expect(result).toBe(15);
    });

    it('should correctly type async functions', async () => {
      const asyncFunction = async (): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => resolve('async result'), 10);
        });
      };

      const result = await asyncFunction();
      expect(typeof result).toBe('string');
      expect(result).toBe('async result');
    });

    it('should correctly type callback functions', () => {
      const callback: (value: string) => void = (value: string) => {
        expect(typeof value).toBe('string');
      };

      callback('test');
    });
  });

  describe('Object Type Checking', () => {
    it('should correctly type object properties', () => {
      interface TestObject {
        id: number;
        name: string;
        active: boolean;
        optional?: string;
      }

      const obj: TestObject = {
        id: 1,
        name: 'Test',
        active: true,
      };

      expect(typeof obj.id).toBe('number');
      expect(typeof obj.name).toBe('string');
      expect(typeof obj.active).toBe('boolean');
      expect(obj.optional).toBeUndefined();

      const objWithOptional: TestObject = {
        id: 2,
        name: 'Test 2',
        active: false,
        optional: 'optional value',
      };

      expect(typeof objWithOptional.optional).toBe('string');
    });
  });

  describe('Union Types', () => {
    it('should correctly handle union types', () => {
      type Status = 'pending' | 'success' | 'error';

      const status: Status = 'success';
      expect(typeof status).toBe('string');
      expect(['pending', 'success', 'error']).toContain(status);
    });

    it('should correctly handle number | string union', () => {
      const value: number | string = 'test';
      
      if (typeof value === 'string') {
        expect(typeof value).toBe('string');
      } else {
        expect(typeof value).toBe('number');
      }
    });
  });

  describe('Type Assertions', () => {
    it('should correctly use type assertions', () => {
      const value: unknown = 'test string';
      const stringValue = value as string;

      expect(typeof stringValue).toBe('string');
      expect(stringValue.length).toBeGreaterThan(0);
    });

    it('should correctly use type guards with assertions', () => {
      const value: unknown = 123;

      if (typeof value === 'number') {
        const numberValue = value; // TypeScript knows it's a number
        expect(typeof numberValue).toBe('number');
        expect(numberValue).toBe(123);
      }
    });
  });

  describe('Generic Types', () => {
    it('should correctly type generic functions', () => {
      const identity = <T>(value: T): T => {
        return value;
      };

      const stringResult = identity<string>('test');
      expect(typeof stringResult).toBe('string');

      const numberResult = identity<number>(42);
      expect(typeof numberResult).toBe('number');

      const booleanResult = identity<boolean>(true);
      expect(typeof booleanResult).toBe('boolean');
    });

    it('should correctly type generic arrays', () => {
      const getFirst = <T>(array: T[]): T | undefined => {
        return array[0];
      };

      const stringArray = ['a', 'b', 'c'];
      const firstString = getFirst<string>(stringArray);
      expect(typeof firstString).toBe('string');

      const numberArray = [1, 2, 3];
      const firstNumber = getFirst<number>(numberArray);
      expect(typeof firstNumber).toBe('number');
    });
  });

  describe('Readonly and Const Types', () => {
    it('should correctly type readonly arrays', () => {
      const readonlyArray: readonly string[] = ['a', 'b', 'c'];
      
      readonlyArray.forEach((item) => {
        expect(typeof item).toBe('string');
      });

      expect(Array.isArray(readonlyArray)).toBe(true);
    });

    it('should correctly type const assertions', () => {
      const constArray = ['a', 'b', 'c'] as const;
      
      constArray.forEach((item) => {
        expect(typeof item).toBe('string');
      });
    });
  });

  describe('Record and Map Types', () => {
    it('should correctly type Record types', () => {
      const record: Record<string, number> = {
        one: 1,
        two: 2,
        three: 3,
      };

      Object.values(record).forEach((value) => {
        expect(typeof value).toBe('number');
      });

      Object.keys(record).forEach((key) => {
        expect(typeof key).toBe('string');
        expect(typeof record[key]).toBe('number');
      });
    });
  });

  describe('Type Compatibility', () => {
    it('should verify type compatibility for function assignments', () => {
      type StringCallback = (value: string) => void;
      
      const callback: StringCallback = (value: string) => {
        expect(typeof value).toBe('string');
      };

      callback('test');
    });

    it('should verify interface compatibility', () => {
      interface Base {
        id: string;
      }

      interface Extended extends Base {
        name: string;
      }

      const extended: Extended = {
        id: '123',
        name: 'Test',
      };

      expect(typeof extended.id).toBe('string');
      expect(typeof extended.name).toBe('string');
    });
  });
});

