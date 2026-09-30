import Image from "next/image";
import { EQUIPMENT_CATEGORIES, storeName, type Equipment } from "@/config/equipment";
import EquipmentIcon from "./EquipmentIcon";

/** Card de equipamento: o card inteiro é um link para a loja (abre em nova aba). */
export default function EquipmentCard({ item, index = 0 }: { item: Equipment; index?: number }) {
  const store = storeName(item);
  return (
    <li className="eq-card" data-reveal data-glow style={{ "--i": index } as React.CSSProperties}>
      <a className="eq-card__link" href={item.href} target="_blank" rel="noopener noreferrer">
        <div className={`eq-card__media${item.image ? " eq-card__media--photo" : ""}`} data-anim>
          {item.image ? (
            <Image
              src={item.image.url}
              alt={item.image.alt || item.name}
              fill
              sizes="(max-width: 640px) 90vw, 260px"
              className="eq-card__img"
            />
          ) : (
            <EquipmentIcon icon={item.icon} />
          )}
          <span className="eq-card__tag">{EQUIPMENT_CATEGORIES[item.category]}</span>
        </div>
        <div className="eq-card__body">
          <h3 className="eq-card__name">{item.name}</h3>
          {item.note && <p className="eq-card__note">{item.note}</p>}
          <span className="eq-card__cta">
            Ver no {store}
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only"> (abre em nova aba)</span>
          </span>
        </div>
      </a>
    </li>
  );
}
