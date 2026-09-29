import ViewportFx from "@/components/fx/ViewportFx";
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/layout/Navbar";
import Courses from "@/components/sections/courses/Courses";
import Partners from "@/components/sections/partners/Partners";
import Problems from "@/components/sections/problems/Problems";
import Purpose from "@/components/sections/purpose/Purpose";
import SoftwareSection from "@/components/sections/software/SoftwareSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Problems />
        <Purpose />
        <Courses />
        <SoftwareSection />
        <Partners />
        {/* Etapas 5–6: sobre, YouTube, manifesto, footer */}
      </main>
      <ViewportFx />
    </>
  );
}
