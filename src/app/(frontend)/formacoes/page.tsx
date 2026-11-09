import type { Metadata } from "next";
import { isListed } from "@/config/courses";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/about/About";
import CourseCatalog from "@/components/sections/courses/CourseCatalog";
import { getCourses, getSiteSettings } from "@/lib/cms";
import { JsonLd, coursesJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Cursos para igrejas: OBS Studio, transmissão de culto, redes e som",
  description:
    "Cursos online para equipes de mídia de igreja: OBS Studio e transmissão de culto ao vivo, redes e Wi-Fi para igrejas, câmeras PTZ, NDI, mixagem e iluminação. Com certificado e preço acessível.",
  alternates: { canonical: "/formacoes" },
};

/** Catálogo completo de formações (destino do botão "Ver mais formações"), seguido dos professores. */
export default async function FormacoesPage() {
  const [all, settings] = await Promise.all([getCourses(), getSiteSettings()]);
  // formações fora da lista (só pelo link direto) não aparecem aqui
  const courses = all.filter(isListed);
  return (
    <>
      <JsonLd data={coursesJsonLd(courses)} />
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="page-formacoes">
        <CourseCatalog courses={courses} />
        {/* professores: saíram da home e ficam aqui, junto de todas as formações */}
        <About />
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
