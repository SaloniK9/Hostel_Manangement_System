/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Exclude Node.js-only packages from the server bundle
  // This prevents 500 errors caused by trying to bundle native modules
  serverExternalPackages: ['@prisma/client', 'prisma', 'bcryptjs', 'jsonwebtoken'],
}

export default nextConfig
