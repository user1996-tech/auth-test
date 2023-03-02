/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["s.gravatar.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

module.exports = nextConfig;
