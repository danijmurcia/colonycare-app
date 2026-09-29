#!/bin/sh

# Login to Expo CLI if credentials are provided
if [ -n "$EXPO_USERNAME" ] && [ -n "$EXPO_PASSWORD" ]; then
  echo "Logging in to Expo as $EXPO_USERNAME..."
  npx expo login -u "$EXPO_USERNAME" -p "$EXPO_PASSWORD"
else
  echo "No Expo credentials found, skipping login"
fi

# Start Expo with tunnel
exec npm start -- --clear --lan