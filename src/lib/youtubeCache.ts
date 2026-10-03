import { getPayloadClient } from "@/lib/cms";
import { getLatestVideos, type YouTubeVideo } from "@/lib/youtube";

/** Só no servidor: usa o banco para guardar a última lista boa de vídeos. */

const isVideo = (v: unknown): v is YouTubeVideo => {
  const o = v as Partial<YouTubeVideo> | null;
  return Boolean(o && typeof o.id === "string" && /^[\w-]{6,}$/.test(o.id) && typeof o.title === "string" && o.title);
};

/** Reaproveita só o que é seguro: os links e as miniaturas são remontados a partir do ID. */
const clean = (v: YouTubeVideo): YouTubeVideo => ({
  id: v.id,
  title: v.title,
  url: `https://www.youtube.com/watch?v=${v.id}`,
  thumbnail: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
  published: typeof v.published === "string" ? v.published : "",
});

/**
 * Vídeos mais recentes do canal, com cópia de segurança:
 * - YouTube respondeu: mostra a lista nova e guarda uma cópia no banco;
 * - YouTube falhou (acontece de tempos em tempos): mostra a última lista guardada.
 */
export async function getLatestVideosWithFallback(limit = 4): Promise<YouTubeVideo[]> {
  const fresh = await getLatestVideos(limit);
  const payload = await getPayloadClient();
  if (!payload) return fresh;

  try {
    const saved = (await payload.findGlobal({ slug: "youtube-cache", depth: 0 })) as unknown as { videos?: unknown };
    const stored = Array.isArray(saved?.videos) ? saved.videos.filter(isVideo).map(clean) : [];

    if (fresh.length === 0) return stored.slice(0, limit);

    const changed = fresh.map((v) => v.id).join(",") !== stored.map((v) => v.id).join(",");
    if (changed) {
      await payload.updateGlobal({
        slug: "youtube-cache",
        data: { videos: fresh.map(clean), fetchedAt: new Date().toISOString() },
      });
    }
  } catch (err) {
    console.error("[youtube] Não foi possível ler ou gravar a cópia de segurança dos vídeos:", err);
  }
  return fresh;
}
