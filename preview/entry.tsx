import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import "../src/components/fx/fx.css";
import HomeView from "../src/components/HomeView";
import YouTubeView from "../src/components/sections/youtube/YouTubeView";
import { COURSES } from "../src/config/courses";
import { DEFAULT_SETTINGS } from "../src/config/site";

// Prévia fora do Next: usa os dados padrão (sem banco) e o estado sem vídeos do YouTube.
document.documentElement.classList.add("js-reveal");
createRoot(document.getElementById("root")!).render(
  <HomeView
    courses={COURSES}
    settings={DEFAULT_SETTINGS}
    youtube={<YouTubeView videos={[]} channelUrl={DEFAULT_SETTINGS.social.youtube} />}
  />,
);
