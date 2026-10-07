/**
 * Escolha do visitante sobre cookies de medição e de anúncios (LGPD).
 * Fica guardada no navegador dele. Sem escolha ou com recusa, o pixel da Meta não é carregado.
 */
export const CONSENT_KEY = "coe-consent";

/** evento que reabre o aviso de cookies (link "Preferências de cookies" do rodapé) */
export const CONSENT_EVENT = "coe:consent-open";

export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}
