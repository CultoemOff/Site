import type { Metadata } from "next";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import EquipmentCard from "@/components/sections/equipment/EquipmentCard";
import { EQUIPMENT_CATEGORIES, type Equipment, type EquipmentCategory } from "@/config/equipment";
import { getEquipment, getSiteSettings } from "@/lib/cms";
import "@/components/blog/blog.css";
import "@/components/sections/equipment/equipment.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Equipamentos que recomendamos",
  description:
    "Equipamentos que o Culto em Off recomenda para a estrutura técnica da igreja: microfones, áudio, rede, energia e mais.",
  alternates: { canonical: "/equipamentos" },
};

/** Lista completa de equipamentos, agrupada por categoria. */
export default async function EquipamentosPage() {
  const [items, settings] = await Promise.all([getEquipment(), getSiteSettings()]);

  const groups = (Object.keys(EQUIPMENT_CATEGORIES) as EquipmentCategory[])
    .map((cat) => ({ cat, items: items.filter((i) => i.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <header className="blog-hero">
          <div className="blog-hero__inner">
            <p className="blog-hero__channel">
              <span aria-hidden="true" />
              CH 09 · Equipamentos
            </p>
            <h1 className="blog-hero__title">Equipamentos que recomendamos.</h1>
            <p className="blog-hero__text">
              Uma seleção de equipamentos que indicamos para montar ou melhorar a estrutura técnica da igreja. Os links
              levam para lojas externas; preço e disponibilidade são definidos pela loja.
            </p>
          </div>
        </header>

        <div className="eq-page">
          <div className="eq-page__inner">
            {groups.map((g) => (
              <section key={g.cat} aria-labelledby={`eq-${g.cat}`}>
                <h2 id={`eq-${g.cat}`} className="eq-page__group-title">
                  {EQUIPMENT_CATEGORIES[g.cat]}
                  <span className="eq-page__count">
                    {g.items.length} {g.items.length === 1 ? "item" : "itens"}
                  </span>
                </h2>
                <ul className="eq-grid">
                  {g.items.map((item: Equipment, i) => (
                    <EquipmentCard key={item.id} item={item} index={i} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
