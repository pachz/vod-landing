/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'impartial-jellyfish-472.convex.cloud',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'warmhearted-sturgeon-237.convex.cloud',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
