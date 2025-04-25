import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "gateway.irys.xyz",
        protocol: "https",
      },
      {
        hostname: "arweave.net",
        protocol: "https",
      },
      {
        hostname: "kcaxhjlvvpenmyrfonpc.supabase.co",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
