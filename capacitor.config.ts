import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hotelkeys.app',
  appName: 'Hotel Keys',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*'],
    hostname: 'localhost'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined
    },
    minSdkVersion: 22,
    targetSdkVersion: 33,
    versionCode: 1,
    versionName: "1.0.0",
    permissions: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.WAKE_LOCK",
      "android.permission.CAMERA",
      "android.permission.PRINT",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.MANAGE_EXTERNAL_STORAGE",
      "android.permission.QUERY_ALL_PACKAGES"
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4F46E5",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ffffff"
    },
    Browser: {
      androidProperties: {
        showTitle: true,
        toolbarColor: "#4F46E5",
        secondaryToolbarColor: "#ffffff",
        enableUrlBarHiding: true,
        enableDefaultShare: true
      }
    },
    Filesystem: {
      directory: "Documents",
      androidDirectory: "Download/HotelKeys"
    },
    App: {
      backgroundColor: "#4F46E5",
      webViewAllowFileAccess: true,
      webViewAllowFileAccessFromFileURLs: true,
      webViewAllowUniversalAccessFromFileURLs: true
    }
  }
};

export default config;