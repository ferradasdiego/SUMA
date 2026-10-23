import type { ConfigContext, ExpoConfig } from 'expo/config';

const APP_NAME = 'SUMA';
const APP_SLUG = 'suma';
const BUNDLE_ID = 'com.suma.mobile';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: APP_SLUG,
  version: '0.1.0',
  orientation: 'portrait',
  scheme: 'suma',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',
  ios: {
    supportsTablet: false,
    bundleIdentifier: BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: BUNDLE_ID,
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
      backgroundColor: '#FFFFFF',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-router',
      {
        // Sin rutas asíncronas en web: todo el código queda en el bundle inicial
        // y el service worker puede servirlo sin conexión.
        asyncRoutes: false,
        headers: {
          'Cross-Origin-Embedder-Policy': 'credentialless',
          'Cross-Origin-Opener-Policy': 'same-origin',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: false,
  },
});
