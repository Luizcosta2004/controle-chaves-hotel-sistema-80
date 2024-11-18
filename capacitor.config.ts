import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hotelkeys.app',
  appName: 'Hotel Keys',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*']
  },
  android: {
    buildOptions: {
      keystorePath: 'hotelkeys.keystore',
      keystorePassword: 'hotelkeys123',
      keystoreAlias: 'hotelkeys',
      keystoreAliasPassword: 'hotelkeys123'
    },
    minSdkVersion: 22,
    targetSdkVersion: 33,
    versionCode: 1,
    versionName: "1.0.0"
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4F46E5",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ffffff"
    }
  }
};

export default config;