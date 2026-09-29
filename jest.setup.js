// Mock expo-constants and expo-modules-core (native modules, can't run in Node)
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: { apiUrl: 'http://localhost:8000' },
    },
  },
}));

jest.mock('expo-modules-core', () => ({
  EventEmitter: class EventEmitter {},
  requireOptionalNativeModule: jest.fn(),
  NativeModulesProxy: {},
}));