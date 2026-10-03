import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import OffersView from "../src/components/offers/OffersView";
import { OFFERS, type Offer, type OfferTag } from "../src/config/offers";

// Prévia: fotos e preços de exemplo só para conferir o layout (no site real vêm do painel/links).
const pics = ["/partners/dorn.jpg", "/images/cesar-augusto.jpg", "/partners/voluts.jpg", "/blog/volume-na-igreja.png", ""];
const tags: OfferTag[][] = [["audio"], ["video"], ["iluminacao"], ["automacao"], ["acessorios"], ["hardware"], ["audio", "acessorios"]];
const many: Offer[] = Array.from({ length: 31 }, (_, i) => {
  const base = OFFERS[i % OFFERS.length];
  return {
    ...base,
    id: `${base.id}-${i}`,
    tags: i < OFFERS.length ? base.tags : tags[i % tags.length],
    imageUrl: pics[i % pics.length] || undefined,
    price: i % 7 === 6 ? undefined : 89.9 + i * 37.35,
    priceFrom: i % 3 === 0 ? (89.9 + i * 37.35) * 1.25 : undefined,
    priceCheckedAt: "2026-10-03T09:00:00-03:00",
  };
});

createRoot(document.getElementById("root")!).render(<OffersView offers={many} homeUrl="index.html" />);
