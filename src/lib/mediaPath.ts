/**
 * Arquivos servidos pelo próprio site (/api/media/...) viram caminho relativo:
 * o Payload devolve a URL completa (com http://localhost:3000 ou o domínio), e o next/image
 * só aceita endereços completos de domínios liberados em next.config.mjs.
 */
export function localMediaPath(url: string): string {
  if (!/^https?:\/\//i.test(url)) return url;
  try {
    const u = new URL(url);
    return u.pathname.startsWith("/api/") ? u.pathname + u.search : url;
  } catch {
    return url;
  }
}
