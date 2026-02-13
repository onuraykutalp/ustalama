/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@talepo/ui', '@talepo/database', '@talepo/api-server'],
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

