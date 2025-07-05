/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan blok konfigurasi gambar ini
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // Memberi izin untuk domain gambar Spotify
        port: '',
        pathname: '/image/**', // Mengizinkan semua path gambar dari domain ini
      },
    ],
  },
};

module.exports = nextConfig;
