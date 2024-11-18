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
      keystorePath: 'release-key.keystore',
      keystorePassword: 'your_keystore_password',
      keystoreAlias: 'release-key-alias',
      keystoreAliasPassword: 'your_alias_password'
    },
    minSdkVersion: 21,
    targetSdkVersion: 33,
    versionCode: 1,
    versionName: "1.0.0"
  }
};

export default config;