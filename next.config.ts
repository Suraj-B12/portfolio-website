import type { NextConfig } from "next";

// When deployed behind CloudFront, set NEXT_PUBLIC_ASSET_PREFIX at build time
// to the CloudFront distribution URL (e.g. https://abc123.cloudfront.net).
// Next.js will rewrite URLs for /_next/static/* to load from the CDN instead
// of the EC2 origin, which keeps bundle delivery fast and reduces load on
// the Node process behind the ALB.
//
// Files in /public are NOT covered by assetPrefix. If those need CDN delivery
// too, configure CloudFront with a second behavior that maps /photography/*
// (or similar) to the S3 origin.
const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX?.trim() || undefined;

const nextConfig: NextConfig = {
  assetPrefix,
  images: {
    // Serve AVIF first, fall back to WebP. AVIF is roughly 30% smaller at
    // equivalent quality. The raw JPEGs in /public/photography are 11 to 29 MB
    // each; these generated variants are what actually ship to the browser.
    formats: ["image/avif", "image/webp"],
  },
  // Trust the X-Forwarded-* headers set by the ALB so that request.url,
  // redirects, and absolute URL generation reflect the public hostname
  // rather than the internal EC2 IP.
  poweredByHeader: false,
};

export default nextConfig;
