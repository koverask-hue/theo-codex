import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // In production Electron loads the app from the static `out/` directory,
  // so we export a fully static site.  In development Next.js runs as a
  // normal dev-server and Electron connects to http://localhost:3000.
  ...(isProd ? { output: "export" } : {}),

  // Required for file:// URL loading in the exported build.
  ...(isProd ? { trailingSlash: true } : {}),
};

export default nextConfig;
