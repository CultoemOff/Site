"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./consent.css";

import { CONSENT_EVENT, CONSENT_KEY, readConsent, type Consent } from "./consent";
import { flushMeta, trackClick } from "./track";

/**
 * Google Analytics 4 com Consent Mode v2 + Meta Pixel opcional (LGPD):
 * nada é armazenado até o visitante aceitar no banner. O Pixel só é carregado depois do aceite.
 * Cliques em elementos com data-track viram eventos (ver ./track.ts).
 */

export default function Analytics({ gaId, pixelId }: { gaId: string; pixelId: string }) {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setShowBanner(c === null);
    const open = () => setShowBanner(true);
    window.addEventListener(CONSENT_EVENT, open);
    return () => window.removeEventListener(CONSENT_EVENT, open);
  }, []);

  // eventos de conversão (cliques com data-track)
  useEffect(() => {
    document.addEventListener("click", trackClick, { capture: true });
    return () => document.removeEventListener("click", trackClick, { capture: true });
  }, []);

  // Meta Pixel: só com ID configurado e depois do aceite. Carrega aqui, com a página já interativa.
  useEffect(() => {
    if (!pixelId || consent !== "granted") return;
    if (window.fbq) {
      // já tinha sido carregado nesta visita e o visitante voltou a aceitar
      window.fbq("consent", "grant");
      return;
    }
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function (...args: unknown[]) {
        n.callMethod ? n.callMethod(...args) : n.queue.push(args);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      b.head.appendChild(t);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    // lido de novo pela janela: o TypeScript não sabe que o trecho acima acabou de criar o fbq
    const fbq = (window as Window).fbq;
    fbq?.("init", pixelId);
    fbq?.("track", "PageView");
    // eventos que aconteceram antes de o pixel iniciar (ex.: ViewContent da página do curso)
    flushMeta();
  }, [pixelId, consent]);

  // page_view a cada navegação (App Router não recarrega a página)
  const first = useRef(true);
  useEffect(() => {
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
    if (first.current) first.current = false;
    else window.fbq?.("track", "PageView");
  }, [pathname]);

  const choose = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* navegação privada: vale só para esta visita */
    }
    window.gtag?.("consent", "update", { analytics_storage: value });
    if (value === "denied") window.fbq?.("consent", "revoke");
    setConsent(value);
    setShowBanner(false);
  };

  return (
    <>
      {gaId && (
        <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var c=null;try{c=localStorage.getItem('${CONSENT_KEY}')}catch(e){}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:c==='granted'?'granted':'denied'});
gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        </>
      )}

      {showBanner && (
        <div className="consent" role="dialog" aria-live="polite" aria-label="Preferências de cookies">
          <p>
            Usamos cookies {gaId && pixelId ? "do Google Analytics e da Meta" : pixelId ? "da Meta" : "do Google Analytics"} para
            entender como o site é usado e melhorar o conteúdo. Você decide.
          </p>
          <div className="consent__actions">
            <button type="button" className="consent__btn" onClick={() => choose("denied")}>
              Recusar
            </button>
            <button type="button" className="consent__btn consent__btn--primary" onClick={() => choose("granted")}>
              Aceitar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
