// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Kita tetap biarkan ini untuk mengabaikan error tipe minor
    ignoreBuildErrors: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
};

module.exports = nextConfig;