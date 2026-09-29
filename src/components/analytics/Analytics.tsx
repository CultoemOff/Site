"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./consent.css";

/**
 * Google Analytics 4 com Consent Mode v2 (LGPD):
 * nada é armazenado até o visitante aceitar no banner.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const KEY = "coe-consent";
export const CONSENT_EVENT = "coe:consent-open";

function readConsent(): "granted" | "denied" | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export default function Analytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setShowBanner(readConsent() === null);
    const open = () => setShowBanner(true);
    window.addEventListener(CONSENT_EVENT, open);
    return () => window.removeEventListener(CONSENT_EVENT, open);
  }, []);

  // page_view a cada navegação (App Router não recarrega a página)
  useEffect(() => {
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  const choose = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* navegação privada: vale só para esta visita */
    }
    window.gtag?.("consent", "update", { analytics_storage: value });
    setShowBanner(false);
  };

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var c=null;try{c=localStorage.getItem('${KEY}')}catch(e){}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:c==='granted'?'granted':'denied'});
gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />

      {showBanner && (
        <div className="consent" role="dialog" aria-live="polite" aria-label="Preferências de cookies">
          <p>
            Usamos cookies do Google Analytics para entender como o site é usado e melhorar o conteúdo. Você decide.
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
