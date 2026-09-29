import ViewportFx from "@/components/fx/ViewportFx";
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/layout/Navbar";
import Courses from "@/components/sections/courses/Courses";
import TechnologyEcosystem from "@/components/sections/ecosystem/TechnologyEcosystem";
import Partners from "@/components/sections/partners/Partners";
import Problems from "@/components/sections/problems/Problems";
import Purpose from "@/components/sections/purpose/Purpose";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Problems />
        <Purpose />
        <Courses />
        <TechnologyEcosystem />
        <Partners />
        {/* Etapas 4–6: palco cinematográfico, softwares, sobre, YouTube, manifesto, footer */}
      </main>
      <ViewportFx />
    </>
  );
}
