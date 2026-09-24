import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@glasspad/core"],
  turbopack: {
    root: "C:/Users/ggaud/glasspad",
  },
};

export default nextConfig;