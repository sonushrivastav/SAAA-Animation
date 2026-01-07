/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.17",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    // Enable modern image formats
    formats: ["image/avif", "image/webp"],
    // Minimize image size
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "gsap",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "react-icons",
    ],
  },
  output: "standalone",
  reactStrictMode: true,

  // Enable compression
  compress: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Power optimizations
  poweredByHeader: false,

  // Webpack customizations for better chunking
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate Three.js into its own chunk
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: "three-vendor",
            chunks: "all",
            priority: 30,
          },
          // Separate GSAP into its own chunk
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: "gsap-vendor",
            chunks: "all",
            priority: 30,
          },
          // Separate Framer Motion
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: "framer-motion-vendor",
            chunks: "all",
            priority: 30,
          },
          // Separate particles
          particles: {
            test: /[\\/]node_modules[\\/](@tsparticles|tsparticles|react-tsparticles)[\\/]/,
            name: "particles-vendor",
            chunks: "all",
            priority: 30,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
