"use client";

import { useEffect } from "react";
import { buildCheckoutUrl, readCampaign, type Campaign } from "@/lib/checkoutLink";
import { readConsent } from "./consent";

const KEY = "coe-campaign";
const SELECTOR = 'a[href*="hotmart.com"]';

/** Campanha da visita: a da URL atual; se a URL não trouxer nada, a que chegou antes nesta mesma visita. */
function currentCampaign(): Campaign {
  const fromUrl = readCampaign(window.location.search);
  try {
    if (Object.keys(fromUrl).length > 0) {
      sessionStorage.setItem(KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as Campaign;
  } catch {
    return fromUrl;
  }
}

/**
 * Leva a origem da visita até o checkout da Hotmart (não mostra nada na tela).
 * Quem chega por um anúncio traz UTMs na URL da página; aqui elas são guardadas durante a visita
 * e acrescentadas ao link dos botões de compra, junto com o parâmetro de origem (sck).
 * O link é refeito também na hora do clique: assim vale para botões que aparecem depois (aviso de saída)
 * e para quem aceitou os cookies depois de a página abrir. Sem JavaScript, o botão continua indo ao checkout.
 */
export default function CheckoutParams() {
  useEffect(() => {
    const decorate = (a: HTMLAnchorElement) => {
      const base = a.dataset.checkoutBase || a.href;
      a.dataset.checkoutBase = base;
      const next = buildCheckoutUrl(base, {
        campaign: currentCampaign(),
        location: a.dataset.trackLocation,
        adsConsent: readConsent() === "granted",
      });
      if (next !== a.href) a.href = next;
    };
    const onEvent = (e: Event) => {
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>(SELECTOR) : null;
      if (a) decorate(a);
    };

    document.querySelectorAll<HTMLAnchorElement>(SELECTOR).forEach(decorate);
    // captura: roda antes de o navegador seguir o link (clique, toque, teclado, botão do meio, "copiar link")
    document.addEventListener("pointerdown", onEvent, { capture: true });
    document.addEventListener("click", onEvent, { capture: true });
    document.addEventListener("contextmenu", onEvent, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", onEvent, { capture: true });
      document.removeEventListener("click", onEvent, { capture: true });
      document.removeEventListener("contextmenu", onEvent, { capture: true });
    };
  }, []);

  return null;
}
