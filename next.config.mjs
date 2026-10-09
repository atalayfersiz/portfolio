import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants.js";

/** @type {import('next').NextConfig} */
export default (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isGithubPages =
    process.env.GITHUB_ACTIONS === "true" || process.env.IS_GITHUB_PAGES === "true";
  const basePath = isGithubPages
    ? "/portfolio"
    : process.env.NEXT_PUBLIC_BASE_PATH || "";

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    // In dev server mode, strictly avoid output: 'export' to prevent SSR cache collisions
    output: isDev ? undefined : "export",
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

  return nextConfig;
};
