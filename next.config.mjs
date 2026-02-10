/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Avoid Vercel image optimization 402 errors on free plan.
    unoptimized: true
  }
};

export default nextConfig;
