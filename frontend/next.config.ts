import type { NextConfig } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL_SERVER || 'http://localhost:3002'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // For static images
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
