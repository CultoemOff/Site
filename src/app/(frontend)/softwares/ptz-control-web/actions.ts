"use server";

import { COUNTRIES } from "@/config/countries";
import { getPayloadClient } from "@/lib/cms";
import { LEAD_CONSENT_TEXT, onlyDigits, validateLead, type LeadErrors, type LeadInput } from "@/lib/leads";

export type LeadResult = { ok: true } | { ok: false; errors: LeadErrors };

/** Recebe o cadastro, valida o formato e salva em admin → Contatos → Cadastros. */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const country = COUNTRIES.find((c) => c.iso === input.countryIso);
  if (!country) return { ok: false, errors: { phone: "Escolha o país." } };
  const data: LeadInput = { ...input, dial: country.dial, source: String(input.source || "").slice(0, 60) };

  const errors = validateLead(data);
  if (Object.keys(errors).length) return { ok: false, errors };

  const phone = onlyDigits(data.phone);
  const payload = await getPayloadClient();
  if (!payload) {
    // sem banco configurado (ex.: desenvolvimento): libera o download mesmo assim
    console.warn("[leads] Banco não configurado; cadastro não foi salvo.");
    return { ok: true };
  }
  try {
    await payload.create({
      collection: "leads",
      overrideAccess: true,
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        country: country.iso,
        dial: country.dial,
        phone,
        phoneFull: `+${country.dial}${phone}`,
        source: data.source,
        consent: { accepted: true, text: LEAD_CONSENT_TEXT, at: new Date().toISOString() },
      },
    });
    return { ok: true };
  } catch (err) {
    console.error("[leads] Erro ao salvar cadastro:", err);
    return { ok: false, errors: { form: "Não foi possível concluir agora. Tente de novo em instantes." } };
  }
}
