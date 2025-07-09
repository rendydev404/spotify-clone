// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rendydev.spotifyclone',
  appName: 'Spotify Clone',
  webDir: 'out', // Biarkan ini untuk sementara
  // TAMBAHKAN BLOK INI
  server: {
    url: "https://spotify-clone-by-rendydev.vercel.app/", // <-- GANTI DENGAN URL VERCEL ANDA
    cleartext: true
  }
};

export default config;