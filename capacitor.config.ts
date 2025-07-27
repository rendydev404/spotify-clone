// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rendydev.spotifyclone',
  appName: 'SpotifyClone',
  webDir: '.next', // <-- UBAH INI dari 'out' menjadi '.next'
  server: {
    url: 'https://spotify-clone-by-rendydev.vercel.app',
    cleartext: true
  }
};

export default config;