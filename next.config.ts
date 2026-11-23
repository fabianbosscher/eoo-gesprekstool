import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@react-pdf/renderer'],
  // pdfkit en fontkit (deps van @react-pdf/renderer) laden fonts via runtime require().
  // Vercel's bundler ziet die niet, dus expliciet meenemen voor beide PDF-routes.
  outputFileTracingIncludes: {
    '/api/reports/[id]/pdf': [
      './node_modules/pdfkit/**/*',
      './node_modules/fontkit/**/*',
    ],
    '/api/view/[slug]/pdf': [
      './node_modules/pdfkit/**/*',
      './node_modules/fontkit/**/*',
    ],
  },
}

export default nextConfig
