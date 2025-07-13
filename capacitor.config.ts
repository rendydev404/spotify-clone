import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rendydev.spotifyclone',
  appName: 'SpotifyClone',
  // bundledWebRuntime: false,
  server: {
    url: 'https://spotify-clone-by-rendydev.vercel.app',
    cleartext: true
  }
};

export default config;
