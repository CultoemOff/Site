/** Formatação pt-BR do painel de campanhas e máscara de dados pessoais. */

const brlFmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const intFmt = new Intl.NumberFormat("pt-BR");

export const brl = (n: number | null | undefined) => (n === null || n === undefined || !Number.isFinite(n) ? "—" : brlFmt.format(n));
/** R$ sem centavos quando grande (eixos e cartões compactos) */
export const brlShort = (n: number) => (Math.abs(n) >= 1000 ? `R$ ${(n / 1000).toFixed(1).replace(".", ",")} mil` : brl(n));
export const int = (n: number | null | undefined) => (n === null || n === undefined || !Number.isFinite(n) ? "—" : intFmt.format(Math.round(n)));
/** fração → "12,3%" */
export const pct = (n: number | null | undefined, digits = 1) =>
  n === null || n === undefined || !Number.isFinite(n) ? "—" : `${(n * 100).toFixed(digits).replace(".", ",")}%`;
export const dec = (n: number | null | undefined, digits = 2) =>
  n === null || n === undefined || !Number.isFinite(n) ? "—" : n.toFixed(digits).replace(".", ",");
export const roas = (n: number | null | undefined) => (n === null || n === undefined || !Number.isFinite(n) ? "—" : `${dec(n, 2)}×`);

/** "Jonas Silva" → "Jo*** Si***" */
export function maskName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  const pick = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : [parts[0]];
  return pick.map((p) => `${p.slice(0, 2)}***`).join(" ");
}

/** "jonas@gmail.com" → "jo***@gmail.com" */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return email ? `${email.slice(0, 2)}***` : "—";
  return `${user.slice(0, 2)}***@${domain}`;
}
