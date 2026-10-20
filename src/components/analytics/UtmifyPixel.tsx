"use client";

import { useEffect } from "react";

/**
 * Pixel da UTMify (atribuição de vendas por UTM), usado na página de venda.
 * É o mesmo código que a UTMify fornece, só que legível: define window.pixelId e carrega
 * https://cdn.utmify.com.br/scripts/pixel/pixel.js.
 * Carrega sempre, sem esperar o aceite de cookies (decisão do Jonas em 20/10/2026).
 */
const SRC = "https://cdn.utmify.com.br/scripts/pixel/pixel.js";

export default function UtmifyPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    if (!/^[a-f0-9]{16,40}$/i.test(pixelId)) return;
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    (window as unknown as { pixelId?: string }).pixelId = pixelId;
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, [pixelId]);
  return null;
}
