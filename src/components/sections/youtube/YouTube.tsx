import type { SiteSettingsData } from "@/config/site";
import { getLatestVideos, getSelectedVideos } from "@/lib/youtube";
import YouTubeView from "./YouTubeView";

/**
 * Seção do YouTube. Por padrão mostra os 4 vídeos mais recentes do canal (feed RSS,
 * revalidado a cada 1 h). No admin é possível escolher vídeos específicos.
 */
export default async function YouTube({ settings }: { settings: SiteSettingsData }) {
  const selected = settings.videosMode === "selected" && settings.selectedVideos.length > 0;
  const videos = selected ? await getSelectedVideos(settings.selectedVideos) : await getLatestVideos(4);
  return <YouTubeView videos={videos} channelUrl={settings.social.youtube} />;
}
