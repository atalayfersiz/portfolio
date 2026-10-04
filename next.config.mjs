const isProd = process.env.NODE_ENV === "production";
const isGithubPages = process.env.GITHUB_ACTIONS === "true" || process.env.IS_GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/portfolio" : (process.env.NEXT_PUBLIC_BASE_PATH || "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
