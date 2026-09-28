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
      apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    },
  },
};