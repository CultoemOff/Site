import type { ReactNode } from "react";
import ViewportFx from "@/components/fx/ViewportFx";
import Hero from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import HomeCourses from "@/components/sections/courses/HomeCourses";
import Manifesto from "@/components/sections/manifesto/Manifesto";
import OffersHome from "@/components/sections/offers-home/OffersHome";
import Partners from "@/components/sections/partners/Partners";
import SoftwareSection from "@/components/sections/software/SoftwareSection";
import type { Course } from "@/config/courses";
import type { Offer } from "@/config/offers";
import { HOME_COURSE_IDS, type SiteSettingsData } from "@/config/site";

type Props = {
  courses: Course[];
  settings: SiteSettingsData;
  /** ofertas cadastradas no painel (a seção de equipamentos mostra as marcadas para a home) */
  offers: Offer[];
  /** seção do YouTube (componente assíncrono no servidor) */
  youtube: ReactNode;
  /** últimos posts do blog (opcional) */
  latestPosts?: ReactNode;
};

/** Composição da homepage (sem busca de dados). */
export default function HomeView({ courses, settings, offers, youtube, latestPosts }: Props) {
  // a faixa amarela da promoção vem do layout (todas as páginas); a home mostra só as duas formações, lado a lado, sem o botão "Ver mais formações"
  const homeCourses = HOME_COURSE_IDS.map((id) => courses.find((c) => c.id === id)).filter((c): c is Course => Boolean(c));

  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {/* "Bastidores reais" saiu em 23/11/2026: o manifesto abre a home, seguido das formações em uma tela */}
        <Manifesto />
        <HomeCourses courses={homeCourses} />
        <SoftwareSection />
        {youtube}
        <Partners settings={settings} />
        {/* produtos que recomendamos: penúltima seção, antes do blog (pedido do Jonas em 23/11/2026) */}
        <OffersHome offers={offers} />
        {latestPosts}
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
