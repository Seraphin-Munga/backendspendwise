/**
 * Runtime Type Checkers
 * These utilities help catch type mismatches that occur at runtime
 * in React Native's native bridge
 */

export interface TypeCheckResult {
  isValid: boolean;
  error?: string;
  path?: string;
}

/**
 * Validates that a value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * Validates that a value is a number
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Validates that a value is a string
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * Validates React Native component props to catch type mismatches
 * that would cause native bridge errors
 */
export const validateComponentProps = (
  props: Record<string, any>,
  propTypes: Record<string, 'boolean' | 'number' | 'string' | 'object' | 'array' | 'function'>
): TypeCheckResult[] => {
  const errors: TypeCheckResult[] = [];

  Object.keys(propTypes).forEach((propName) => {
    const expectedType = propTypes[propName];
    const actualValue = props[propName];

    // Skip if prop is undefined (optional props)
    if (actualValue === undefined) {
      return;
    }

    let isValid = false;
    let actualType = typeof actualValue;

    switch (expectedType) {
      case 'boolean':
        isValid = isBoolean(actualValue);
        if (!isValid) {
          errors.push({
            isValid: false,
            error: `Prop '${propName}' expected boolean but got ${actualType}`,
            path: propName,
          });
        }
        break;

      case 'number':
        isValid = isNumber(actualValue);
        if (!isValid) {
          errors.push({
            isValid: false,
            error: `Prop '${propName}' expected number but got ${actualType}`,
            path: propName,
          });
        }
        break;

      case 'string':
        isValid = isString(actualValue);
        if (!isValid) {
          errors.push({
            isValid: false,
            error: `Prop '${propName}' expected string but got ${actualType}`,
            path: propName,
          });
        }
        break;

      case 'object':
        isValid = typeof actualValue === 'object' && actualValue !== null && !Array.isArray(actualValue);
        if (!isValid) {
          errors.push({
            isValid: false,
            error: `Prop '${propName}' expected object but got ${actualType}`,
            path: propName,
          });
        }
        break;

      case 'array':
        isValid = Array.isArray(actualValue);
        if (!isValid) {
          errors.push({
            isValid: false,
            error: `Prop '${propName}' expected array but got ${actualType}`,
            path: propName,
          });
        }
        break;

      case 'function':
        isValid = typeof actualValue === 'function';
        if (!isValid) {
          errors.push({
            isValid: false,
            error: `Prop '${propName}' expected function but got ${actualType}`,
            path: propName,
          });
        }
        break;
    }
  });

  return errors;
};

/**
 * Validates boolean props specifically (common source of native bridge errors)
 */
export const validateBooleanProps = (
  props: Record<string, any>,
  booleanPropNames: string[]
): TypeCheckResult[] => {
  const errors: TypeCheckResult[] = [];

  booleanPropNames.forEach((propName) => {
    const value = props[propName];

    // Skip if undefined (optional)
    if (value === undefined) {
      return;
    }

    if (!isBoolean(value)) {
      errors.push({
        isValid: false,
        error: `Boolean prop '${propName}' has incorrect type: ${typeof value}. Value: ${JSON.stringify(value)}`,
        path: propName,
      });
    }
  });

  return errors;
};

/**
 * Validates number props
 */
export const validateNumberProps = (
  props: Record<string, any>,
  numberPropNames: string[]
): TypeCheckResult[] => {
  const errors: TypeCheckResult[] = [];

  numberPropNames.forEach((propName) => {
    const value = props[propName];

    if (value === undefined) {
      return;
    }

    if (!isNumber(value)) {
      errors.push({
        isValid: false,
        error: `Number prop '${propName}' has incorrect type: ${typeof value}. Value: ${JSON.stringify(value)}`,
        path: propName,
      });
    }
  });

  return errors;
};

/**
 * Creates a prop validator wrapper for React Native components
 */
export const withPropValidation = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  propTypes: Record<keyof P, 'boolean' | 'number' | 'string' | 'object' | 'array' | 'function'>
) => {
  return (props: P) => {
    if (__DEV__) {
      const errors = validateComponentProps(props, propTypes as Record<string, any>);
      if (errors.length > 0) {
        console.error('Component prop type errors:', errors);
        errors.forEach((error) => {
          console.error(`  - ${error.path}: ${error.error}`);
        });
        // In test environment, throw error to catch in tests
        if (process.env.NODE_ENV === 'test') {
          throw new Error(`Prop type errors: ${errors.map((e) => e.error).join(', ')}`);
        }
      }
    }
    return React.createElement(Component, props);
  };
};

