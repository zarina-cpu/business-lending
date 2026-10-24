/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: [
    "@libsql/client",
    "@libsql/hrana-client",
    "@libsql/core",
    "libsql",
  ],
  webpack: (config) => {
    config.module.rules.push({
      test: /[\\/]LICENSE$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
