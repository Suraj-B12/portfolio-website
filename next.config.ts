import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first, fall back to WebP. AVIF ~30% smaller at equal quality.
    // The original raw JPEGs in /public/photography are 11-29MB each; these
    // generated variants are what actually ship to the browser.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
