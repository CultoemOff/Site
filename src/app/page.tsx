import ViewportFx from "@/components/fx/ViewportFx";
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/layout/Navbar";
import Courses from "@/components/sections/courses/Courses";
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
        {/* Etapas 3–6: ecossistema, parceiros, palco, softwares, sobre, YouTube, manifesto, footer */}
      </main>
      <ViewportFx />
    </>
  );
}
