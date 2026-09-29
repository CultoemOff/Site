import type { Metadata } from "next";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Courses from "@/components/sections/courses/Courses";
import { getCourses, getSiteSettings } from "@/lib/cms";
import { JsonLd, coursesJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Formações",
  description:
    "Formações técnicas para voluntários de igreja: redes, mixagem, áudio para live, Bitfocus Companion e iluminação com grandMA2. Online e com preço acessível.",
  alternates: { canonical: "/formacoes" },
};

/** Catálogo completo de formações (destino do botão "Ver mais formações"). */
export default async function FormacoesPage() {
  const [courses, settings] = await Promise.all([getCourses(), getSiteSettings()]);
  return (
    <>
      <JsonLd data={coursesJsonLd(courses)} />
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="page-formacoes">
        <Courses courses={courses} showMoreButton={false} />
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
