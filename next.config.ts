import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms.rukhsolutions.com" },
    ],
  },
};

export default nextConfig;
