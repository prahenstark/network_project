/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during builds
    reactStrictMode: false,
  },
};

export default nextConfig;
