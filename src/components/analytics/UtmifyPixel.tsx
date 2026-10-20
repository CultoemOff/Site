"use client";

import { useEffect } from "react";
import { CONSENT_CHANGED_EVENT, readConsent } from "./consent";

/**
 * Pixel da UTMify (atribuição de vendas por UTM), usado na página de venda.
 * É o mesmo código que a UTMify fornece, só que legível: define window.pixelId e carrega
 * https://cdn.utmify.com.br/scripts/pixel/pixel.js.
 * Como o pixel da Meta, só carrega depois que o visitante aceita os cookies (LGPD).
 */
const SRC = "https://cdn.utmify.com.br/scripts/pixel/pixel.js";

export default function UtmifyPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    if (!/^[a-f0-9]{16,40}$/i.test(pixelId)) return;
    const load = () => {
      if (document.querySelector(`script[src="${SRC}"]`)) return;
      (window as unknown as { pixelId?: string }).pixelId = pixelId;
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    };
    if (readConsent() === "granted") load();
    const onChange = (e: Event) => {
      if ((e as CustomEvent<string>).detail === "granted") load();
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  }, [pixelId]);
  return null;
}
