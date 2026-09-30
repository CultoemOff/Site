/**
 * Regras do cadastro para download (usadas no navegador e no servidor).
 * Não há verificação de que os dados são reais: só o formato de e-mail e telefone.
 */

export const LEAD_CONSENT_TEXT =
  "Autorizo o Culto em Off a guardar meu nome, celular e e-mail e a usá-los para me enviar ofertas, novidades e conteúdos por e-mail, WhatsApp ou SMS. Posso pedir o descadastro a qualquer momento.";

export type LeadInput = {
  name: string;
  countryIso: string;
  dial: string;
  phone: string;
  email: string;
  consent: boolean;
  source: string;
};

export type LeadErrors = Partial<Record<"name" | "phone" | "email" | "consent" | "form", string>>;

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(email.trim()) && email.trim().length <= 254;
}

/** Brasil: DDD + número (10 dígitos fixo, 11 celular começando com 9). Outros países: formato E.164. */
export function isValidPhone(countryIso: string, dial: string, phone: string) {
  const d = onlyDigits(phone);
  if (countryIso === "BR") {
    if (!/^[1-9]{2}/.test(d)) return false;
    if (d.length === 11) return d[2] === "9";
    return d.length === 10 && /[2-5]/.test(d[2]);
  }
  return d.length >= 4 && d.length + onlyDigits(dial).length <= 15;
}

/** Máscara do celular brasileiro: (11) 91234-5678 */
export function formatBrPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  const split = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

export function validateLead(input: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  const name = input.name.trim();
  if (name.length < 2 || name.length > 100) errors.name = "Informe seu nome.";
  if (!isValidPhone(input.countryIso, input.dial, input.phone))
    errors.phone =
      input.countryIso === "BR" ? "Informe o celular com DDD, ex.: (11) 91234-5678." : "Informe um telefone válido.";
  if (!isValidEmail(input.email)) errors.email = "Informe um e-mail válido.";
  if (!input.consent) errors.consent = "Para liberar o download, é preciso aceitar.";
  return errors;
}
