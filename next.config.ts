import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Add this for UploadThing URLs
      },
      {
        protocol: "https",
        hostname: "9t1a2s3pgv.ufs.sh", // Your existing configuration
        port: "",
      },
    ],
  },
};

export default nextConfig;
