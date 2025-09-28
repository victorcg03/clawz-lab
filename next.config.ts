import type { NextConfig } from 'next';

// Añadimos turbopack.root mediante cast para silenciar warning de lockfiles múltiples.
const nextConfig = {
  experimental: {
    // @ts-expect-error: propiedad no tipada aún en Next types
    turbopack: { root: __dirname },
  },
} satisfies NextConfig;

export default nextConfig;
