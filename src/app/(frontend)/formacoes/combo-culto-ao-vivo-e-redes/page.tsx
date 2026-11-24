import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import ComboPageView from "@/components/sales/ComboPageView";
import { COMBO } from "@/config/courses";
import { SALES_PAGES } from "@/config/salesPages";
import { getCourses, getSiteSettings } from "@/lib/cms";

export const revalidate = 3600;

// só por link (anúncios): fora do Google e do sitemap por enquanto
export const metadata: Metadata = {
  title: "Combo: Culto ao Vivo com Excelência + Redes para Igrejas",
  description: "Os dois cursos juntos: OBS Studio e transmissão do culto ao vivo + redes, Wi-Fi, NDI e câmeras PTZ na igreja.",
  alternates: { canonical: "/formacoes/combo-culto-ao-vivo-e-redes" },
  robots: { index: false, follow: false },
};

export default async function ComboPage() {
  if (!COMBO) notFound();
  const [courses, settings] = await Promise.all([getCourses(), getSiteSettings()]);
  const mainCourse = courses.find((c) => c.id === COMBO.main);
  const bumpCourse = courses.find((c) => c.id === COMBO.bump);
  const mainPage = SALES_PAGES[COMBO.main];
  const bumpPage = SALES_PAGES[COMBO.bump];
  if (!mainCourse || !bumpCourse || !mainPage || !bumpPage) notFound();
  return (
    <>
      {/* página de venda sem o menu do site */}
      <main id="conteudo" tabIndex={-1} className="sp-main">
        <ComboPageView main={{ course: mainCourse, page: mainPage }} bump={{ course: bumpCourse, page: bumpPage }} />
      </main>
      <Footer settings={settings} minimal />
      <ViewportFx />
    </>
  );
}
