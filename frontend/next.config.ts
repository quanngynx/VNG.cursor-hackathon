import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // For static images
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*',
      },
    ]
  },
}

export default nextConfig
// Forced restart
