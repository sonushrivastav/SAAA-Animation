/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
  experimental: {
    appDir: true,
  },
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
