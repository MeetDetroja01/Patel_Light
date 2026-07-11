/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress Vercel vulnerability warning for Next.js 15.3.x
  // This project does not use React Server Components with untrusted input
  serverExternalPackages: ["mongoose"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
}

module.exports = nextConfig
