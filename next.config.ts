import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "encrypted-tbn0.gstatic.com"],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default nextConfig;
