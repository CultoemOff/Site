"use client";

import Link from "next/link";
import { useDocumentInfo } from "@payloadcms/ui";

/**
 * Botão "Adicionar novo produto" no topo da tela de uma oferta.
 * Só aparece depois que a oferta foi salva (quando ela já tem um id),
 * para cadastrar vários produtos em sequência sem voltar à lista.
 */
export default function AddOfferButton() {
  const { id } = useDocumentInfo();
  if (!id) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <Link
        href="/admin/collections/offers/create"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          minHeight: 40,
          padding: "0 18px",
          borderRadius: 4,
          background: "#1d4ed8",
          color: "#fff",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
          +
        </span>
        Adicionar novo produto
      </Link>
      <span style={{ fontSize: 13, opacity: 0.7 }}>Salve antes de sair desta tela, se tiver mudado algo.</span>
    </div>
  );
}
