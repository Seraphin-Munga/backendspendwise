/**
 * Tests for type validation utilities
 */

import {
  validateBooleanProps,
  validateNumberProps,
  validateComponentProps,
  isBoolean,
  isNumber,
  isString,
} from '../index';

describe('Type Validation Utilities', () => {
  describe('validateBooleanProps', () => {
    it('should detect string values passed as booleans', () => {
      const props = { secureTextEntry: 'true' };
      const errors = validateBooleanProps(props, ['secureTextEntry']);
      
      expect(errors.length).toBe(1);
      expect(errors[0].path).toBe('secureTextEntry');
      expect(errors[0].error).toContain('Boolean prop');
    });

    it('should detect number values passed as booleans', () => {
      const props = { editable: 1 };
      const errors = validateBooleanProps(props, ['editable']);
      
      expect(errors.length).toBe(1);
      expect(errors[0].path).toBe('editable');
    });

    it('should pass valid boolean props', () => {
      const props = { secureTextEntry: true, editable: false };
      const errors = validateBooleanProps(props, ['secureTextEntry', 'editable']);
      
      expect(errors.length).toBe(0);
    });
  });

  describe('validateNumberProps', () => {
    it('should detect string values passed as numbers', () => {
      const props = { maxLength: '10' };
      const errors = validateNumberProps(props, ['maxLength']);
      
      expect(errors.length).toBe(1);
      expect(errors[0].path).toBe('maxLength');
    });

    it('should pass valid number props', () => {
      const props = { maxLength: 10, fontSize: 16 };
      const errors = validateNumberProps(props, ['maxLength', 'fontSize']);
      
      expect(errors.length).toBe(0);
    });
  });

  describe('validateComponentProps', () => {
    it('should validate multiple prop types', () => {
      const props = {
        secureTextEntry: 'true', // Wrong
        maxLength: 10, // Correct
        placeholder: 'text', // Correct
      };

      const propTypes = {
        secureTextEntry: 'boolean' as const,
        maxLength: 'number' as const,
        placeholder: 'string' as const,
      };

      const errors = validateComponentProps(props, propTypes);
      expect(errors.length).toBe(1);
      expect(errors[0].path).toBe('secureTextEntry');
    });
  });

  describe('Type Guards', () => {
    it('isBoolean should correctly identify booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(1)).toBe(false);
    });

    it('isNumber should correctly identify numbers', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber('42')).toBe(false);
      expect(isNumber(NaN)).toBe(false);
    });

    it('isString should correctly identify strings', () => {
      expect(isString('test')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString(42)).toBe(false);
    });
  });
});

