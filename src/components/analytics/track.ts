/**
 * Eventos de conversão do site.
 * Vão para o Google Analytics 4 (gtag) e, se configurado e aceito, para o Meta Pixel (fbq).
 *
 * Eventos usados:
 *  - select_course   clique em "Quero participar" de uma formação   (label = nome da formação)
 *  - click_partner   clique no link de um parceiro                  (label = SPresenter / Voluts / Loja da Dorn)
 *  - copy_coupon     cupom do SPresenter copiado                    (label = código)
 *  - click_equipment clique em um equipamento recomendado           (label = nome do produto)
 *  - click_social    clique em YouTube / Instagram / TikTok         (label = rede)
 *  - generate_lead   cadastro concluído para liberar um download    (label = software)
 *  - download_software clique em "Baixar" depois do cadastro        (label = software)
 *
 * No GA4, marque select_course (e outros que quiser) como "evento principal" para virar conversão.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_EVENTS: Record<string, string> = {
  select_course: "InitiateCheckout",
  click_equipment: "ViewContent",
  generate_lead: "Lead",
};

export function track(event: string, params: { label?: string; url?: string } = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, {
    event_label: params.label,
    link_url: params.url,
  });
  if (window.fbq) {
    const standard = META_EVENTS[event];
    if (standard) window.fbq("track", standard, { content_name: params.label });
    else window.fbq("trackCustom", event, { label: params.label });
  }
}

/** Clique em qualquer elemento com data-track="evento" (e data-track-label opcional). */
export function trackClick(e: MouseEvent) {
  const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-track]") : null;
  if (!el) return;
  track(el.dataset.track || "click", {
    label: el.dataset.trackLabel,
    url: el instanceof HTMLAnchorElement ? el.href : undefined,
  });
}
