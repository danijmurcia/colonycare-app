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
        projectId: process.env.EXPO_PROJECT_ID || '',
      },
    },
    updates: {
      url: 'https://u.expo.dev/' + (process.env.EXPO_PROJECT_ID || ''),
      enabled: true,
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};