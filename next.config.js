/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    forceSwcTransforms: true
  }
} 