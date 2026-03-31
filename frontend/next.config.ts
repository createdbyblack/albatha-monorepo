import type {NextConfig} from 'next'

function getFrameAncestors(): string {
  const ancestors = ["'self'", 'http://localhost:3333']
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL

  if (studioUrl) {
    try {
      ancestors.push(new URL(studioUrl).origin)
    } catch {
      // Ignore invalid Studio URLs and keep the default localhost fallback.
    }
  }

  return Array.from(new Set(ancestors)).join(' ')
}

const nextConfig: NextConfig = {
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: 'false',
  },
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors ${getFrameAncestors()}`,
          },
        ],
      },
    ]
  },
}

export default nextConfig
