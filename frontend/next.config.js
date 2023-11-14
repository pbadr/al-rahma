/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_ROUTE: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://api.rahma.live'
  },
  reactStrictMode: false
}

module.exports = nextConfig
