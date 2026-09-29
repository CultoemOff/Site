import { YOUTUBE_CHANNEL_ID, YOUTUBE_FEED_URL, YOUTUBE_REVALIDATE_SECONDS } from "@/config/site";

export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  published: string; // ISO
};

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .trim();

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
};

/** Converte o feed Atom do YouTube em uma lista de vídeos. */
export function parseYouTubeFeed(xml: string, limit = 4): YouTubeVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const videos: YouTubeVideo[] = [];
  for (const entry of entries) {
    const id = tag(entry, "yt:videoId");
    const title = tag(entry, "title");
    if (!id || !title) continue;
    const link = entry.match(/<link[^>]+rel="alternate"[^>]+href="([^"]+)"/)?.[1];
    videos.push({
      id,
      title,
      url: link ? decode(link) : `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      published: tag(entry, "published"),
    });
    if (videos.length >= limit) break;
  }
  return videos;
}

/**
 * Busca os vídeos mais recentes do canal (server-side, com cache de 1 h).
 * Nunca lança erro: se o YouTube estiver indisponível, retorna [].
 */
export async function getLatestVideos(limit = 4): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_CHANNEL_ID) return [];
  try {
    const res = await fetch(YOUTUBE_FEED_URL, {
      next: { revalidate: YOUTUBE_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    return parseYouTubeFeed(await res.text(), limit);
  } catch {
    return [];
  }
}

/** "2026-09-12T15:00:00+00:00" → "12 set. 2026" */
export function formatVideoDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" })
    .replace(/ de /g, " ");
}
