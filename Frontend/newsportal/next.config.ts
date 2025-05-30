/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_IMAGE_PROTOCOL || 'http', // Default to 'http' for development
        hostname: process.env.NEXT_PUBLIC_API_HOST || '127.0.0.1', // Default to localhost for development
        port:"", // No port specified
        pathname: '/media/**', // Allow all paths under /media/
      },
    ],
  },
};

module.exports = nextConfig;