// next.config.ts
import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ['fatafatsewa.com'],
  },
  reactStrictMode: true,
  experimental: {
    serverActions: true, // if you're using Server Actions (optional)
  },
};

export default nextConfig;
