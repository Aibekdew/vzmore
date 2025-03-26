const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias["~slick-carousel"] = path.resolve(
      __dirname,
      "node_modules/slick-carousel"
    );

    return config;
  },
};

module.exports = nextConfig;
