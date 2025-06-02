/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
          protocol: 'https',
          // Allow HTTPS protocol
          hostname: 'res.cloudinary.com',
          port: '',
          pathname: '/**', // Allow all paths under res.cloudinary.com
        }
      //   {
      //     protocol: 'http',
      //     // Allow HTTP protocol
      //     hostname: '127.0.0.1',
      //     port: '8000', // Allow port 8000 for local development
      //     pathname: '/media/**', // Allow all paths under 127.0.0.1
      // }
    ],
  },
};

module.exports = nextConfig;