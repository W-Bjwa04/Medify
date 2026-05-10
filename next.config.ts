import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  turbopack: {},
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    webpackMemoryOptimizations: true,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
