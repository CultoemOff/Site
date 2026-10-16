/** Datas do painel: sempre "AAAA-MM-DD" no fuso de São Paulo. */

export const TZ = "America/Sao_Paulo";

export function todaySP(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}

export function diffDays(a: string, b: string): number {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export function dayRange(from: string, to: string): string[] {
  const out: string[] = [];
  if (!from || !to || from > to) return out;
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

const WEEK = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
export const WEEKDAYS = WEEK;

/** "14/10" */
export const shortDay = (day: string) => (day ? `${day.slice(8, 10)}/${day.slice(5, 7)}` : "");
/** "ter 14/10" */
export function labelDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return `${WEEK[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${shortDay(day)}`;
}
/** "14/10/2026" */
export const fullDay = (day: string) => (day ? `${day.slice(8, 10)}/${day.slice(5, 7)}/${day.slice(0, 4)}` : "");

export type PeriodPreset = "hoje" | "ontem" | "3d" | "7d" | "14d" | "30d" | "lancamento" | "custom";

export const PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "ontem", label: "Ontem" },
  { id: "3d", label: "3 dias" },
  { id: "7d", label: "7 dias" },
  { id: "14d", label: "14 dias" },
  { id: "30d", label: "30 dias" },
  { id: "lancamento", label: "Desde o lançamento" },
  { id: "custom", label: "Personalizado" },
];

/** período de um atalho; "últimos N dias" inclui hoje */
export function presetRange(p: PeriodPreset, today: string, launch: string): { from: string; to: string } | null {
  switch (p) {
    case "hoje":
      return { from: today, to: today };
    case "ontem":
      return { from: addDays(today, -1), to: addDays(today, -1) };
    case "3d":
      return { from: addDays(today, -2), to: today };
    case "7d":
      return { from: addDays(today, -6), to: today };
    case "14d":
      return { from: addDays(today, -13), to: today };
    case "30d":
      return { from: addDays(today, -29), to: today };
    case "lancamento":
      return { from: launch || addDays(today, -29), to: today };
    default:
      return null;
  }
}

/** período anterior de mesmo tamanho, logo antes */
export function previousRange(from: string, to: string): { from: string; to: string } {
  const len = diffDays(from, to) + 1;
  return { from: addDays(from, -len), to: addDays(from, -1) };
}
