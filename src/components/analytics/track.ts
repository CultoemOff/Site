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
 *  - click_link      clique em um link da página de links da bio    (label = destino)
 *  - generate_lead   cadastro concluído para liberar um download    (label = software)
 *  - join_waitlist   inscrição na lista de espera de uma formação   (label = formação)
 *  - download_software clique em "Baixar" depois do cadastro        (label = software)
 *
 * No GA4, marque begin_checkout (e outros que quiser) como "evento principal" para virar conversão.
 *
 * Pixel da Meta (só depois do aceite dos cookies): PageView a cada página, ViewContent na página da formação,
 * CliqueComprar no botão de compra e Lead nos cadastros. A compra (Purchase) é disparada pela Hotmart.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Eventos que vão para o pixel da Meta. Só estes; o resto fica só no Google Analytics,
 * para o Gerenciador de Eventos mostrar apenas o que interessa aos anúncios.
 *  - view_item      → ViewContent (padrão)       página de uma formação aberta
 *  - begin_checkout → CliqueComprar (personalizado) clique em um botão de compra.
 *    Não é InitiateCheckout de propósito: esse a Hotmart já dispara no checkout, e aqui ficaria duplicado.
 *  - generate_lead / join_waitlist → Lead (padrão)
 */
const META_STANDARD: Record<string, string> = {
  view_item: "ViewContent",
  generate_lead: "Lead",
  join_waitlist: "Lead",
};
const META_CUSTOM: Record<string, string> = {
  begin_checkout: "CliqueComprar",
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
  /** enviar só para um dos destinos (padrão: os dois) */
  only?: "ga" | "meta";
};

/**
 * Fila do pixel da Meta: o pixel só é carregado depois que o visitante aceita os cookies,
 * e isso pode acontecer depois de a página já ter aberto. O que aconteceu antes fica aqui
 * e é enviado quando o pixel inicia (ver Analytics.tsx). Sem aceite, nada sai do navegador.
 */
const metaQueue: unknown[][] = [];

function sendMeta(...args: unknown[]) {
  if (window.fbq) window.fbq(...args);
  else if (metaQueue.length < 20) metaQueue.push(args);
}

/** Chamado logo depois de o pixel iniciar: envia o que ficou esperando. */
export function flushMeta() {
  if (!window.fbq) return;
  for (const args of metaQueue.splice(0)) window.fbq(...args);
}

export function track(event: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;
  const hasValue = typeof params.value === "number" && params.value > 0;

  if (params.only !== "meta") {
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
  }

  if (params.only !== "ga") {
    const meta = {
      content_name: params.label,
      ...(params.itemId ? { content_ids: [params.itemId], content_type: "product" } : {}),
      ...(hasValue ? { value: params.value, currency: "BRL" } : {}),
    };
    if (META_STANDARD[event]) sendMeta("track", META_STANDARD[event], meta);
    else if (META_CUSTOM[event]) sendMeta("trackCustom", META_CUSTOM[event], { ...meta, local: params.location });
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
