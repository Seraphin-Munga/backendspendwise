# Runtime Type Error Detection

## Why Native Bridge Errors Aren't Caught in Tests

The error `"expected dynamic type 'boolean', but had type 'string'"` occurs in React Native's **native bridge** at runtime, not in JavaScript. Here's why tests can't catch it:

### The Problem

1. **Jest runs in Node.js**, not in a native React Native environment
2. **Native components are mocked** in tests, so they don't actually use the native bridge
3. **Type errors occur when props cross the JS-to-native boundary**, which doesn't happen in tests
4. **React Native's bridge validates types** when passing data to native modules, which Jest doesn't replicate

### Example

```typescript
// This will cause a native bridge error at runtime:
<TextInput secureTextEntry="true" />  // ❌ String instead of boolean

// But in tests, this won't fail because TextInput is mocked:
render(<TextInput secureTextEntry="true" />);  // ✅ Test passes
```

## Solution: Runtime Type Checkers

We've created utilities to catch these errors **before** they reach the native bridge:

### Usage

```typescript
import { validateBooleanProps, validateComponentProps } from '../helpers/type-checkers';

// Validate boolean props before passing to component
const props = {
  secureTextEntry: true,
  editable: 'false', // ❌ Wrong type
};

const errors = validateBooleanProps(props, ['secureTextEntry', 'editable']);
if (errors.length > 0) {
  console.error('Type errors:', errors);
}
```

### Integration in Components

You can use the `withPropValidation` HOC to automatically validate props:

```typescript
import { withPropValidation } from '../helpers/type-checkers';

const ValidatedTextInput = withPropValidation(TextInput, {
  secureTextEntry: 'boolean',
  editable: 'boolean',
  maxLength: 'number',
});
```

## Common Errors to Watch For

### Boolean Props (Most Common)

- `secureTextEntry="true"` → Should be `secureTextEntry={true}`
- `editable="false"` → Should be `editable={false}`
- `selectTextOnFocus="1"` → Should be `selectTextOnFocus={true}`
- `horizontal="yes"` → Should be `horizontal={true}`
- `pagingEnabled="1"` → Should be `pagingEnabled={true}`

### Number Props

- `maxLength="10"` → Should be `maxLength={10}`
- `fontSize="16"` → Should be `fontSize={16}`

## Testing Strategy

1. **Use runtime type checkers** in development mode
2. **Run type validation tests** to catch common patterns
3. **Use TypeScript** to catch type errors at compile time
4. **Test on actual devices/simulators** to catch native bridge errors

## Best Practices

1. Always use explicit boolean values: `{true}` or `{false}`, never strings
2. Use TypeScript to catch type errors at compile time
3. Add runtime validation in development mode
4. Test on real devices to catch native bridge errors

