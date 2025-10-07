const withNextIntl = require('next-intl/plugin')(
  './i18n.ts'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO优化配置
  trailingSlash: false,
  generateEtags: true,
  compress: true,
  
  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.5.15',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'bc.aikits.sbs',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'bcbk.aikits.sbs',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'soramvods.xyz',
        pathname: '/media/**',
      },
    ],
  },
  
  // API重写
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://bcbk.aikits.sbs/:path*',
      },
    ]
  },
  
  // 安全头配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
