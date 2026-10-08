module.exports = {
  expo: {
    name: 'ColonyCare',
    slug: 'colonycare-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    ios: { supportsTablet: true },
    android: { predictiveBackGestureEnabled: false },
    web: {},
    plugins: ['expo-secure-store'],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
      eas: {
        projectId: '0b488585-a5e3-4078-9905-1023f11431a0',
      },
    },
    updates: {
      url: 'https://u.expo.dev/0b488585-a5e3-4078-9905-1023f11431a0',
      enabled: true,
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};