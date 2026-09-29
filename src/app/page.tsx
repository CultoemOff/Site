import ViewportFx from "@/components/fx/ViewportFx";
import Hero from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/about/About";
import Courses from "@/components/sections/courses/Courses";
import Manifesto from "@/components/sections/manifesto/Manifesto";
import Partners from "@/components/sections/partners/Partners";
import Problems from "@/components/sections/problems/Problems";
import Purpose from "@/components/sections/purpose/Purpose";
import SoftwareSection from "@/components/sections/software/SoftwareSection";
import YouTube from "@/components/sections/youtube/YouTube";

// Revalida a página a cada 1 h (vídeos do YouTube).
export const revalidate = 3600;

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
        <About />
        <YouTube />
        <Manifesto />
      </main>
      <Footer />
      <ViewportFx />
    </>
  );
}
