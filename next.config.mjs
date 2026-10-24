/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hide the English Next.js DevTools overlay on the landing page.
  devIndicators: false,
  serverExternalPackages: ["@libsql/client", "@libsql/hrana-client"],
};

export default nextConfig;
