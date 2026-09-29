"use client";

/** Reabre o banner de cookies (rodapé). */
export default function ConsentLink() {
  return (
    <button type="button" className="footer__consent" onClick={() => window.dispatchEvent(new Event("coe:consent-open"))}>
      Preferências de cookies
    </button>
  );
}
