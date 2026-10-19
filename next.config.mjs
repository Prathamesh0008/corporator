/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store, private" }] },
      { source: "/ward-control/:path*", headers: [{ key: "Cache-Control", value: "no-store, private" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
      
};

export default nextConfig;
