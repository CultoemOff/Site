import { getLatestVideos } from "@/lib/youtube";
import YouTubeView from "./YouTubeView";

/** Seção do YouTube: busca os 4 vídeos mais recentes no servidor (revalida a cada 1 h). */
export default async function YouTube() {
  const videos = await getLatestVideos(4);
  return <YouTubeView videos={videos} />;
}
