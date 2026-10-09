import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // URLs do site antigo (WordPress) → blog novo, preservando o SEO
  async redirects() {
    return [
      { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/category/:path*", destination: "/blog", permanent: true },
      { source: "/tag/:path*", destination: "/blog", permanent: true },
    ];
  },
  // ofertas.<domínio> e links.<domínio> abrem direto as suas páginas (o subdomínio aponta para este mesmo projeto na Vercel)
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", has: [{ type: "host", value: "ofertas\\..+" }], destination: "/ofertas" },
        // links.<domínio> abre a página de links da bio (substitui o Linktree)
        { source: "/", has: [{ type: "host", value: "links\\..+" }], destination: "/links" },
      ],
    };
  },
  images: {
    // AVIF primeiro (menor), WebP como alternativa
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      // arquivos do admin servidos pelo próprio site durante o desenvolvimento
      { protocol: "http", hostname: "localhost" },
      // imagens de artigos migrados do site antigo (usadas só enquanto o banco não está configurado)
      { protocol: "https", hostname: "cultoemoff.com.br", pathname: "/wp-content/**" },
      // imagens enviadas pelo admin quando o armazenamento é o Vercel Blob
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
