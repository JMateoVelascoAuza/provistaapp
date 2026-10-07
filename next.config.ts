import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const exportEstatico = process.env.STATIC_EXPORT === "1";
const exportHosting = process.env.STATIC_EXPORT === "hosting";
const desarrollo = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  agentRules: false,
  pageExtensions: desarrollo ? ["dev.tsx", "tsx", "ts", "jsx", "js"] : ["tsx", "ts", "jsx", "js"],
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: exportEstatico ? "1" : "0",
    NEXT_PUBLIC_SIN_SERVIDOR: exportEstatico || exportHosting ? "1" : "0",
  },
  ...(exportHosting ? { output: "export", images: { unoptimized: true }, trailingSlash: true } : {}),
  ...(exportEstatico
    ? {
        output: "export",
        images: { unoptimized: true },
        assetPrefix: ".",
      }
    : {}),
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development" || exportEstatico,
  register: true,
  cacheOnFrontEndNav: true,
});

export default withPWA(nextConfig);
