import type { Offer, OfferTag } from "../src/config/offers";

// Só para a prévia: produtos, fotos e preços de exemplo (no site real vêm do painel).
const names = ["Microfone sem fio duplo Kadosh K502M", "Microfone sem fio AKG WP300", "Switch TP-Link TL-SG1016PE", "Case rack para mesa XR18", "Filtro de linha Wireconex WPD8D", "Câmera PTZ 20x", "Controladora DMX", "Stream Deck 15 teclas"];
const pics = ["/partners/dorn.jpg", "/images/cesar-augusto.jpg", "/partners/voluts.jpg", "/blog/volume-na-igreja.png", ""];
const tags: OfferTag[][] = [["audio"], ["audio"], ["hardware"], ["audio", "acessorios"], ["acessorios"], ["video"], ["iluminacao"], ["automacao"], ["cabeamento"], ["ferramentas"]];

export const SAMPLE_OFFERS: Offer[] = Array.from({ length: 31 }, (_, i) => ({
  id: `exemplo-${i}`,
  title: names[i % names.length],
  href: "https://www.mercadolivre.com.br/",
  tags: tags[i % tags.length],
  imageUrl: pics[i % pics.length] || undefined,
  price: i % 7 === 6 ? undefined : 89.9 + i * 37.35,
  priceFrom: i % 3 === 0 ? (89.9 + i * 37.35) * 1.25 : undefined,
  priceCheckedAt: "2026-10-03T09:00:00-03:00",
  home: i % 2 === 0,
  reviewUrl: i % 4 === 0 ? "https://www.youtube.com/@cultoemoff" : undefined,
}));
