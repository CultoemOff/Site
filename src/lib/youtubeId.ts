/** Extrai o ID de um link do YouTube (watch, youtu.be, shorts, live, embed). */
export function youTubeId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    const v = u.searchParams.get("v");
    if (v) return v;
    const m = u.pathname.match(/\/(?:shorts|live|embed)\/([\w-]{6,})/);
    return m ? m[1] : null;
  } catch {
    return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
  }
}

