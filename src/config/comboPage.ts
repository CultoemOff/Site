/**
 * Página do combo Culto ao Vivo + Redes para Igrejas (/formacoes/combo-culto-ao-vivo-e-redes).
 * Por enquanto usa o checkout do Culto ao Vivo com o Redes no carrinho (order bump, ver COMBO em courses.ts).
 * Quando houver uma oferta própria na Hotmart, preencha checkoutUrl e price.
 * Fica fora do menu, do sitemap e do Google (só por link, para anúncios).
 */
export const COMBO_PAGE = {
  slug: "combo-culto-ao-vivo-e-redes",
  /** vazio = link de compra do Culto ao Vivo (o Redes vem no carrinho) */
  checkoutUrl: "",
  /** 0 = preço atual do Culto ao Vivo + valor do Redes no carrinho */
  price: 0,
};
