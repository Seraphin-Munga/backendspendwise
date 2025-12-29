// Setup Expo runtime mock before any imports
if (typeof global !== 'undefined') {
  (global as any).__ExpoImportMetaRegistry = {};
  
  // Mock structuredClone for Expo winter runtime
  if (!global.structuredClone) {
    (global as any).structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
  }
  
  // Mock Web APIs that Expo winter runtime needs
  if (!global.TextDecoderStream) {
    (global as any).TextDecoderStream = class TextDecoderStream {
      constructor() {}
    };
  }
  
  if (!global.TextEncoderStream) {
    (global as any).TextEncoderStream = class TextEncoderStream {
      constructor() {}
    };
  }
  
  if (!global.CompressionStream) {
    (global as any).CompressionStream = class CompressionStream {
      constructor() {}
    };
  }
  
  if (!global.DecompressionStream) {
    (global as any).DecompressionStream = class DecompressionStream {
      constructor() {}
    };
  }
}

// Mock Expo modules before any imports
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
  setStatusBarBackgroundColor: jest.fn(),
  setStatusBarStyle: jest.fn(),
  setStatusBarNetworkActivityIndicatorVisible: jest.fn(),
  setStatusBarHidden: jest.fn(),
  setStatusBarTranslucent: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children, ...props }: any) => {
      return React.createElement(View, props, children);
    },
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
  };
});

// Mock NavigationContainer
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    NavigationContainer: ({ children }: any) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
      reset: jest.fn(),
      setParams: jest.fn(),
      setOptions: jest.fn(),
      isFocused: () => true,
      canGoBack: () => false,
    }),
    useRoute: () => ({
      key: 'test-route',
      name: 'Test',
      params: {},
    }),
  };
});

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  screensEnabled: jest.fn(() => true),
}));

// Suppress console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

