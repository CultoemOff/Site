import Hero from "@/components/hero/Hero";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {/* Etapas 2–6: problemas, propósito, formações, ecossistema, parceiros, palco, softwares, sobre, YouTube, manifesto */}
        <div id="problemas" />
      </main>
    </>
  );
}
