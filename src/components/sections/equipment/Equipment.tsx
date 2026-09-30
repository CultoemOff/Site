import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { HOME_EQUIPMENT_LIMIT, type Equipment as Item } from "@/config/equipment";
import EquipmentCard from "./EquipmentCard";
import "./equipment.css";

/** CH 09 · Equipamentos que recomendamos (destaques + botão para a página completa). */
export default function Equipment({ items }: { items: Item[] }) {
  const featured = items.filter((i) => i.featured);
  const list = (featured.length ? featured : items).slice(0, HOME_EQUIPMENT_LIMIT);
  if (list.length === 0) return null;

  return (
    <section id="equipamentos" className="section section--abyss equipment" aria-labelledby="equipamentos-title">
      <div className="equipment__grid-bg" aria-hidden="true" />
      <div className="section__inner">
        <SectionHeader channel="CH 09 · Equipamentos" id="equipamentos-title" title="Equipamentos que recomendamos.">
          <p>
            Uma seleção de equipamentos que indicamos para montar ou melhorar a estrutura técnica da igreja, do
            microfone à rede.
          </p>
        </SectionHeader>

        <ul className="eq-grid eq-grid--home">
          {list.map((item, i) => (
            <EquipmentCard key={item.id} item={item} index={i} />
          ))}
        </ul>

        <div className="equipment__footer" data-reveal>
          <ArrowButton href="/equipamentos">Ver todos os equipamentos</ArrowButton>
          <p className="equipment__disclaimer">
            Os links levam para lojas externas. Preço e disponibilidade são definidos pela loja.
          </p>
        </div>
      </div>
    </section>
  );
}
