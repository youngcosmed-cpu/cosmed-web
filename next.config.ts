import type { NextConfig } from 'next';

const apiServerUrl = process.env.API_SERVER_URL || 'http://localhost:3000';
if (!process.env.API_SERVER_URL && process.env.NODE_ENV === 'production') {
  console.warn(
    '[cosmed-web] API_SERVER_URL is not set. Falling back to http://localhost:3000. ' +
    'Set API_SERVER_URL for production/preview deployments.'
  );
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '*.r2.dev' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiServerUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
