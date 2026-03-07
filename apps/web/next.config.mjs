/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@workspace/ui", "@workspace/http-client", "@workspace/utils", "@workspace/local-storage", "@workspace/eslint-config", "@workspace/typescript-config"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
    ],
  },
}

export default nextConfig
