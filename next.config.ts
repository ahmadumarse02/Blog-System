import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "9t1a2s3pgv.ufs.sh",
        port: ""
      }
    ]
  }
};

export default nextConfig;
