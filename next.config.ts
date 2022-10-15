/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.writeortalk.com', 'files.writeortalk.com', 'lh3.googleusercontent.com']
  }
}

module.exports = nextConfig
