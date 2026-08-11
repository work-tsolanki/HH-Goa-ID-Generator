import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@napi-rs/canvas", "bwip-js"],
  outputFileTracingIncludes: {
    "/api/generate": ["./assets/**/*"],
  },
};

export default nextConfig;
