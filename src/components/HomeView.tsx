import type { ReactNode } from "react";
import ViewportFx from "@/components/fx/ViewportFx";
import Hero from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/about/About";
import Courses from "@/components/sections/courses/Courses";
import Equipment from "@/components/sections/equipment/Equipment";
import Faq from "@/components/sections/faq/Faq";
import Manifesto from "@/components/sections/manifesto/Manifesto";
import Partners from "@/components/sections/partners/Partners";
import Problems from "@/components/sections/problems/Problems";
import SoftwareSection from "@/components/sections/software/SoftwareSection";
import PromoBar from "@/components/sales/PromoBar";
import type { Course } from "@/config/courses";
import type { Equipment as EquipmentItem } from "@/config/equipment";
import type { SiteSettingsData } from "@/config/site";
import { resolvePrice } from "@/lib/pricing";

type Props = {
  courses: Course[];
  settings: SiteSettingsData;
  equipment: EquipmentItem[];
  /** seção do YouTube (componente assíncrono no servidor) */
  youtube: ReactNode;
  /** últimos posts do blog (opcional) */
  latestPosts?: ReactNode;
};

/** Composição da homepage (sem busca de dados). */
export default function HomeView({ courses, settings, equipment, youtube, latestPosts }: Props) {
  // Formação em promoção com prazo: a faixa amarela aparece também na home e leva à página da oferta.
  const promoCourse = courses.map((c) => ({ c, p: resolvePrice(c) })).find(({ p }) => p.promo);

  return (
    <>
      {promoCourse && (
        <PromoBar
          label={promoCourse.p.promo!.label}
          product={promoCourse.c.title}
          off={promoCourse.p.off}
          endsAt={promoCourse.p.promo!.endsAt}
          href={`/formacoes/${promoCourse.c.id}`}
          cta="Ver a oferta"
          ctaShort="Ver oferta"
          trackLabel={`${promoCourse.c.title} (faixa da home)`}
        />
      )}
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Problems />
        <Manifesto />
        <Courses courses={courses} />
        <SoftwareSection />
        <Partners settings={settings} />
        <About />
        {youtube}
        {latestPosts}
        <Equipment items={equipment} />
        <Faq items={settings.faq} />
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
