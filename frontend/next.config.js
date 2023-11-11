/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_ROUTE: 'http://localhost:5000'
  },
  images: {
    loader: "akamai",
    path: '/'
  }
}

module.exports = nextConfig
