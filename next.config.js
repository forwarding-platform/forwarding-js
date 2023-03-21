/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "kirkgtkhcjuemrllhngq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "robohash.org",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
