/**
 * Página do combo Culto ao Vivo + Redes para Igrejas (/formacoes/combo-culto-ao-vivo-e-redes).
 * Com `price` preenchido, a página fala de uma oferta própria do combo na Hotmart (os dois cursos numa compra só).
 * Com `price` = 0, volta a usar o checkout do Culto ao Vivo com o Redes no carrinho (order bump, ver COMBO em courses.ts).
 * Fica fora do menu, do sitemap e do Google (só por link, para anúncios).
 */
export const COMBO_PAGE = {
  slug: "combo-culto-ao-vivo-e-redes",
  /** link da oferta do combo na Hotmart (enviado pelo Jonas em 25/11/2026) */
  checkoutUrl: "https://pay.hotmart.com/S108668812U",
  /** preço do combo (oferta própria), pedido do Jonas em 25/11/2026; 0 = Culto ao Vivo + valor do Redes no carrinho */
  price: 82,
  /** vídeo do topo (reel do combo, enviado pelo Jonas em 25/11/2026; provisório até ele mandar outro) */
  video: {
    src: "/videos/combo-culto-ao-vivo-e-redes.mp4",
    poster: "/images/formacoes/combo-video-capa.jpg",
    width: 720,
    height: 1280,
  } as { src: string; poster: string; width: number; height: number } | null,
  /** provas reais mostradas no combo (títulos das provas das páginas de cada curso), nesta ordem */
  proofTitles: [
    "O Jonas responde as dúvidas muito rapidamente.",
    "Muito melhor que outros mais caros.",
    "Consegui entender o sistema que uma empresa montou na minha igreja.",
  ],
};
