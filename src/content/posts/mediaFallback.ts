import { SEED_POSTS } from "./index";

/**
 * Imagens dos posts do código que também existem em /public.
 * O seed roda no computador do Jonas; sem o token do Vercel Blob no .env de lá, as imagens enviadas
 * ficam só na pasta /media daquele computador e o site no ar responde erro 500 em /api/media/file/...
 * Com este mapa, o site usa a cópia de /public para qualquer imagem que veio do código.
 */

/** imagens antigas (WordPress) dentro do texto, convertidas e guardadas em /public */
const LEGACY: Record<string, string> = {
  "image-1024x782.png": "/blog/neoid/image-1024x782.webp",
  "image-2-1024x537.png": "/blog/neoid/image-2-1024x537.webp",
  "image-3-1024x576.png": "/blog/neoid/image-3-1024x576.webp",
  "image-4-1024x629.png": "/blog/neoid/image-4-1024x629.webp",
};

const base = (u: string) => decodeURIComponent(u.split("?")[0].split("/").pop() ?? "");

function build(): Map<string, string> {
  const map = new Map<string, string>(Object.entries(LEGACY));
  for (const p of SEED_POSTS) {
    if (p.cover?.localPath) {
      map.set(base(p.cover.localPath), p.cover.localPath);
      if (p.cover.sourceUrl) map.set(base(p.cover.sourceUrl), p.cover.localPath);
    }
    for (const b of p.blocks) {
      if ("img" in b && b.img.sourceUrl.startsWith("/")) map.set(base(b.img.sourceUrl), b.img.sourceUrl);
    }
  }
  return map;
}

let cached: Map<string, string> | null = null;

/**
 * Para um endereço de arquivo do Payload (/api/media/file/nome.jpg, inclusive os tamanhos
 * "nome-800x450.jpg"), devolve a cópia em /public, se houver. Caso contrário, undefined.
 */
export function publicMediaFallback(url: string | undefined): string | undefined {
  if (!url || !url.includes("/api/media/file/")) return undefined;
  cached ??= build();
  const name = base(url);
  const exact = cached.get(name);
  if (exact) return exact;
  // tamanho gerado pelo Payload: "nome-800x450.jpg" → "nome.jpg"
  const original = name.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, "$1");
  // nome repetido renomeado pelo Payload: "nome-1.jpg" → "nome.jpg"
  return cached.get(original) ?? cached.get(original.replace(/-\d{1,2}(\.[a-z0-9]+)$/i, "$1"));
}
