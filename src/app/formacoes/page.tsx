import type { Metadata } from "next";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Courses from "@/components/sections/courses/Courses";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Formações — ${SITE_NAME}`,
  description: "Catálogo de formações técnicas para voluntários de igreja, com preço acessível.",
};

/** Catálogo completo de formações (destino do botão "Ver mais formações"). */
export default function FormacoesPage() {
  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="page-formacoes">
        <Courses showMoreButton={false} />
      </main>
      <Footer />
      <ViewportFx />
    </>
  );
}
