/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  env: {
    PORT: 5253,
  },
  // Enable HTTPS in production
  server: {
    https: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
