/**
 * Página do combo Culto ao Vivo + Redes para Igrejas (/formacoes/combo-culto-ao-vivo-e-redes).
 * Com `price` preenchido, a página fala de uma oferta própria do combo na Hotmart (os dois cursos numa compra só).
 * Com `price` = 0, volta a usar o checkout do Culto ao Vivo com o Redes no carrinho (order bump, ver COMBO em courses.ts).
 * Fica fora do menu, do sitemap e do Google (só por link, para anúncios).
 */
export const COMBO_PAGE = {
  slug: "combo-culto-ao-vivo-e-redes",
  /** link da oferta do combo na Hotmart. PENDENTE: o Jonas vai criar (25/11/2026); até lá o botão usa o link do Culto ao Vivo */
  checkoutUrl: "",
  /** preço do combo (oferta própria), pedido do Jonas em 25/11/2026; 0 = Culto ao Vivo + valor do Redes no carrinho */
  price: 82,
};
