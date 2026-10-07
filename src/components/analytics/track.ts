/**
 * Eventos do site.
 * Vão para o Google Analytics 4 (gtag) e, se configurado e aceito, para o Meta Pixel (fbq).
 * O ID do GA4 é colado no painel: Site → Configurações do site → Analytics.
 *
 * Funil de venda das formações (nomes recomendados pelo GA4, com valor em reais):
 *  - view_item        a página de uma formação foi aberta            (item = formação)
 *  - view_section     uma parte da página de venda apareceu na tela  (section = modulos, materiais, oferta, duvidas, final)
 *  - select_item      clique que leva até a página da formação       (faixa amarela, "Ver detalhes")
 *  - begin_checkout   clique em um botão de compra (vai para a Hotmart); cta_location diz qual botão
 *  - exit_popup_view  o aviso de saída apareceu
 *  A compra em si acontece na Hotmart: para ela aparecer no GA4, o mesmo ID precisa estar configurado lá.
 *
 * Demais eventos:
 *  - click_partner   clique no link de um parceiro                  (label = SPresenter / Voluts / Loja da Dorn)
 *  - copy_coupon     cupom do SPresenter copiado                    (label = código)
 *  - click_equipment clique em um equipamento recomendado           (label = nome do produto)
 *  - click_offer     clique em um produto da página de ofertas      (label = nome do produto)
 *  - click_review    clique em "Assistir review" de uma oferta      (label = nome do produto)
 *  - click_social    clique em YouTube / Instagram / TikTok         (label = rede)
 *  - generate_lead   cadastro concluído para liberar um download    (label = software)
 *  - join_waitlist   inscrição na lista de espera de uma formação   (label = formação)
 *  - download_software clique em "Baixar" depois do cadastro        (label = software)
 *
 * No GA4, marque begin_checkout (e outros que quiser) como "evento principal" para virar conversão.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_EVENTS: Record<string, string> = {
  view_item: "ViewContent",
  begin_checkout: "InitiateCheckout",
  click_equipment: "ViewContent",
  click_offer: "ViewContent",
  generate_lead: "Lead",
  join_waitlist: "Lead",
};

/** eventos de comércio do GA4: levam moeda, valor e o item (a formação) */
const ITEM_EVENTS = new Set(["view_item", "select_item", "begin_checkout"]);

export type TrackParams = {
  /** nome do que foi clicado/visto (nas formações, o nome da formação) */
  label?: string;
  url?: string;
  /** valor em reais (preço atual da formação) */
  value?: number;
  /** onde está o botão: topo, faixa, módulos, oferta, final, barra do celular, popup de saída... */
  location?: string;
  /** identificador do item (id da formação) */
  itemId?: string;
  /** parte da página (evento view_section) */
  section?: string;
};

export function track(event: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;
  const hasValue = typeof params.value === "number" && params.value > 0;
  const ga: Record<string, unknown> = {
    event_label: params.label,
    link_url: params.url,
    cta_location: params.location,
    section: params.section,
  };
  if (ITEM_EVENTS.has(event)) {
    ga.currency = "BRL";
    if (hasValue) ga.value = params.value;
    ga.items = [
      {
        item_id: params.itemId || params.label,
        item_name: params.label,
        item_category: "Formação",
        ...(hasValue ? { price: params.value } : {}),
        quantity: 1,
      },
    ];
  }
  window.gtag?.("event", event, ga);
  if (window.fbq) {
    const standard = META_EVENTS[event];
    if (standard) {
      window.fbq("track", standard, {
        content_name: params.label,
        ...(hasValue ? { value: params.value, currency: "BRL" } : {}),
      });
    } else window.fbq("trackCustom", event, { label: params.label, location: params.location, section: params.section });
  }
}

/**
 * Clique em qualquer elemento com data-track="evento".
 * Opcionais: data-track-label, data-track-value (reais), data-track-location e data-track-id.
 */
export function trackClick(e: MouseEvent) {
  const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-track]") : null;
  if (!el) return;
  const value = Number(el.dataset.trackValue);
  track(el.dataset.track || "click", {
    label: el.dataset.trackLabel,
    url: el instanceof HTMLAnchorElement ? el.href : undefined,
    value: Number.isFinite(value) && value > 0 ? value : undefined,
    location: el.dataset.trackLocation,
    itemId: el.dataset.trackId,
  });
}
