import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amirhosini.pianorain',
  appName: 'Piano Rain',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: { allowMixedContent: false },
};

export default config;
