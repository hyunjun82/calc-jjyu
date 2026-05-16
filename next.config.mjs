/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
