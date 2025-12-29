/**
 * Runtime Type Error Detection Tests
 * These tests help catch the "expected dynamic type 'boolean', but had type 'string'"
 * errors that occur in React Native's native bridge
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import {
  validateBooleanProps,
  validateNumberProps,
  validateComponentProps,
  isBoolean,
  isNumber,
  isString,
} from '../helpers/type-checkers';
import { TextInput, View, ScrollView } from 'react-native';

describe('Runtime Type Error Detection', () => {
  describe('Boolean Prop Validation', () => {
    it('should detect when boolean prop is passed as string', () => {
      const props = {
        secureTextEntry: 'true', // Wrong: string instead of boolean
        editable: true, // Correct
      };

      const errors = validateBooleanProps(props, ['secureTextEntry', 'editable']);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].error).toContain('secureTextEntry');
      expect(errors[0].error).toContain('Boolean prop');
      expect(errors[0].error).toContain('string');
    });

    it('should detect when boolean prop is passed as number', () => {
      const props = {
        secureTextEntry: 1, // Wrong: number instead of boolean
      };

      const errors = validateBooleanProps(props, ['secureTextEntry']);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].error).toContain('Boolean prop');
      expect(errors[0].error).toContain('number');
      expect(errors[0].error).toContain('secureTextEntry');
    });

    it('should pass when boolean props are correct', () => {
      const props = {
        secureTextEntry: true,
        editable: false,
        selectTextOnFocus: true,
      };

      const errors = validateBooleanProps(props, [
        'secureTextEntry',
        'editable',
        'selectTextOnFocus',
      ]);

      expect(errors.length).toBe(0);
    });

    it('should handle undefined optional boolean props', () => {
      const props = {
        secureTextEntry: true,
        // editable is undefined (optional)
      };

      const errors = validateBooleanProps(props, ['secureTextEntry', 'editable']);

      expect(errors.length).toBe(0);
    });
  });

  describe('Number Prop Validation', () => {
    it('should detect when number prop is passed as string', () => {
      const props = {
        maxLength: '10', // Wrong: string instead of number
        fontSize: 16, // Correct
      };

      const errors = validateNumberProps(props, ['maxLength', 'fontSize']);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].error).toContain('maxLength');
      expect(errors[0].error).toContain('Number prop');
      expect(errors[0].error).toContain('string');
    });

    it('should pass when number props are correct', () => {
      const props = {
        maxLength: 10,
        fontSize: 16,
        height: 50,
      };

      const errors = validateNumberProps(props, ['maxLength', 'fontSize', 'height']);

      expect(errors.length).toBe(0);
    });
  });

  describe('Component Props Validation', () => {
    it('should detect multiple type errors in component props', () => {
      const props = {
        secureTextEntry: 'true', // Wrong: string
        maxLength: '10', // Wrong: string
        editable: true, // Correct
        placeholder: 'Enter text', // Correct
      };

      const propTypes = {
        secureTextEntry: 'boolean' as const,
        maxLength: 'number' as const,
        editable: 'boolean' as const,
        placeholder: 'string' as const,
      };

      const errors = validateComponentProps(props, propTypes);

      expect(errors.length).toBe(2);
      expect(errors.some((e) => e.path === 'secureTextEntry')).toBe(true);
      expect(errors.some((e) => e.path === 'maxLength')).toBe(true);
    });

    it('should validate ScrollView boolean props', () => {
      const props = {
        horizontal: 'true', // Wrong: string
        pagingEnabled: true, // Correct
        showsHorizontalScrollIndicator: false, // Correct
      };

      const propTypes = {
        horizontal: 'boolean' as const,
        pagingEnabled: 'boolean' as const,
        showsHorizontalScrollIndicator: 'boolean' as const,
      };

      const errors = validateComponentProps(props, propTypes);

      expect(errors.length).toBe(1);
      expect(errors[0].path).toBe('horizontal');
    });
  });

  describe('Type Guard Functions', () => {
    it('should correctly identify boolean values', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('false')).toBe(false);
    });

    it('should correctly identify number values', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-10)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber('42')).toBe(false);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(true);
    });

    it('should correctly identify string values', () => {
      expect(isString('test')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString(42)).toBe(false);
      expect(isString(true)).toBe(false);
    });
  });

  describe('Common React Native Prop Errors', () => {
    it('should catch TextInput boolean prop errors', () => {
      const commonErrors = [
        { secureTextEntry: 'true' },
        { editable: 'false' },
        { selectTextOnFocus: '1' },
        { autoCorrect: 'true' },
        { autoCapitalize: 'none' }, // This is actually correct (string enum)
      ];

      const booleanProps = ['secureTextEntry', 'editable', 'selectTextOnFocus', 'autoCorrect'];

      commonErrors.forEach((props, index) => {
        if (index < 4) {
          // First 4 should have errors
          const errors = validateBooleanProps(props, booleanProps);
          expect(errors.length).toBeGreaterThan(0);
        }
      });
    });

    it('should catch ScrollView boolean prop errors', () => {
      const props = {
        horizontal: 'yes', // Wrong
        pagingEnabled: '1', // Wrong
        showsHorizontalScrollIndicator: 'false', // Wrong
      };

      const errors = validateBooleanProps(props, [
        'horizontal',
        'pagingEnabled',
        'showsHorizontalScrollIndicator',
      ]);

      expect(errors.length).toBe(3);
    });
  });

  describe('Error Message Format', () => {
    it('should provide helpful error messages', () => {
      const props = {
        secureTextEntry: 'true',
      };

      const errors = validateBooleanProps(props, ['secureTextEntry']);

      expect(errors[0].error).toContain('secureTextEntry');
      expect(errors[0].error).toContain('Boolean prop');
      expect(errors[0].error).toContain('string');
      expect(errors[0].error).toContain('true'); // Should show the actual value
    });
  });

  describe('Real Component Props Validation', () => {
    it('should validate TextInput props that cause native bridge errors', () => {
      // These are the props that commonly cause "expected boolean but got string" errors
      const textInputProps = {
        secureTextEntry: true, // Should be boolean
        editable: true, // Should be boolean
        selectTextOnFocus: true, // Should be boolean
        autoCapitalize: 'none', // This is correct (string enum)
        autoCorrect: false, // Should be boolean
        maxLength: 10, // Should be number
      };

      const propTypes = {
        secureTextEntry: 'boolean' as const,
        editable: 'boolean' as const,
        selectTextOnFocus: 'boolean' as const,
        autoCapitalize: 'string' as const,
        autoCorrect: 'boolean' as const,
        maxLength: 'number' as const,
      };

      const errors = validateComponentProps(textInputProps, propTypes);
      expect(errors.length).toBe(0);
    });

    it('should catch errors in TextInput props', () => {
      const textInputProps = {
        secureTextEntry: 'true', // Wrong
        editable: 'false', // Wrong
        maxLength: '10', // Wrong
      };

      const propTypes = {
        secureTextEntry: 'boolean' as const,
        editable: 'boolean' as const,
        maxLength: 'number' as const,
      };

      const errors = validateComponentProps(textInputProps, propTypes);
      expect(errors.length).toBe(3);
    });
  });
});

