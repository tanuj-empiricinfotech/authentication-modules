/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  images: {
    domains: ['github.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com']
  }
}

module.exports = nextConfig
