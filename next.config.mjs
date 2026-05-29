/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["maplibre-gl"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
    ],
  },
};

export default nextConfig;
