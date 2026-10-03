/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useFormFields } from "@payloadcms/ui";

/**
 * Prévia da foto na tela de edição de uma oferta.
 * Mostra a imagem assim que o link é colado, no mesmo enquadramento do card do site
 * (quadro branco, foto inteira). Avisa quando o link não abre uma imagem.
 */
export default function OfferImagePreview() {
  const value = useFormFields(([fields]) => fields.imageUrl?.value);
  const url = typeof value === "string" ? value.trim() : "";
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const valid = /^https?:\/\/\S+$/i.test(url);
  const failed = failedUrl === url;

  return (
    <div className="ceo-preview">
      <div className="ceo-preview__frame">
        {valid && !failed ? (
          <img key={url} src={url} alt="Prévia da foto do produto" referrerPolicy="no-referrer" onError={() => setFailedUrl(url)} />
        ) : (
          <span>{url ? "?" : "foto"}</span>
        )}
      </div>
      <p className="ceo-preview__text">
        <strong>Prévia da foto</strong>
        {!url && "Cole o link da imagem no campo acima para ver como ela fica no card."}
        {url && !valid && "O link precisa começar com https://"}
        {valid && failed && "Não consegui abrir esta imagem. Confira se o link é da foto (e não da página do produto)."}
        {valid && !failed && "É assim que a foto aparece no card do site: inteira, dentro do quadro branco."}
      </p>
    </div>
  );
}
