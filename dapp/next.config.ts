import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // env: { version:  },
  // webpack: (config) => {
  //   config.externals.push("pino-pretty", "lokijs", "encoding");
  //   config.resolve.fallback = { fs: false, net: false, tls: false };
  //   return config;
  // },
  // experimental: {
  //   turbo: {
  //     rules: {
  //       "*.svg": {
  //         loaders: ["@svgr/webpack"],
  //         as: "*.js",
  //       },
  //     },
  //   },
  // },
};

export default nextConfig;
