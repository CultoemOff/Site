import ViewportFx from "@/components/fx/ViewportFx";
import Hero from "@/components/hero/Hero";
import { HomeSections } from "@/components/home2/HomeView2";
import ComboExitPopup from "@/components/sales/ComboExitPopup";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import type { Course } from "@/config/courses";
import type { Offer } from "@/config/offers";
import type { SiteSettingsData } from "@/config/site";
import type { PostSummary } from "@/lib/cms";
import type { YouTubeVideo } from "@/lib/youtube";

type Props = {
  courses: Course[];
  settings: SiteSettingsData;
  /** ofertas cadastradas no painel (a seção de equipamentos mostra as marcadas para a home) */
  offers: Offer[];
  /** vídeos do YouTube já buscados no servidor */
  videos: YouTubeVideo[];
  /** últimos posts do blog */
  posts: PostSummary[];
};

/**
 * Composição da homepage (sem busca de dados).
 * Desde 26/11/2026: o topo do palco continua o mesmo (só com o logo novo no telão) e,
 * depois dele, entram as seções da home2 (manifesto, formações, softwares, YouTube, parceiros, equipamentos, blog e encerramento).
 */
export default function HomeView({ courses, settings, offers, videos, posts }: Props) {
  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <HomeSections courses={courses} settings={settings} offers={offers} videos={videos} posts={posts} />
      </main>
      <Footer settings={settings} />
      <ViewportFx />
      <ComboExitPopup courses={courses} location="popup de saída (home)" />
    </>
  );
}
