import type { ReactNode } from "react";
import ViewportFx from "@/components/fx/ViewportFx";
import Hero from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/about/About";
import Courses from "@/components/sections/courses/Courses";
import Equipment from "@/components/sections/equipment/Equipment";
import Manifesto from "@/components/sections/manifesto/Manifesto";
import Partners from "@/components/sections/partners/Partners";
import Problems from "@/components/sections/problems/Problems";
import SoftwareSection from "@/components/sections/software/SoftwareSection";
import type { Course } from "@/config/courses";
import type { Equipment as EquipmentItem } from "@/config/equipment";
import type { SiteSettingsData } from "@/config/site";

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
  return (
    <>
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
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
