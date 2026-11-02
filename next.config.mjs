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
  // imagens e vídeos da pasta public: o navegador guarda por 1 dia e, depois, mostra a cópia guardada enquanto
  // busca a nova (até 7 dias). Os nomes dos arquivos não mudam quando a imagem é trocada, por isso não é 1 ano.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return [
      { source: "/images/:path*", headers: cache },
      { source: "/videos/:path*", headers: cache },
      { source: "/partners/:path*", headers: cache },
      { source: "/textures/:path*", headers: cache },
    ];
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
