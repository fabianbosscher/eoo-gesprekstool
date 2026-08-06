import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@react-pdf/renderer'],
  outputFileTracingIncludes: {
    '/api/reports/[id]/pdf': ['./public/logo-white.png', './public/logo-color.png'],
    '/api/view/[slug]/pdf': ['./public/logo-white.png', './public/logo-color.png'],
  },
}

export default nextConfig
