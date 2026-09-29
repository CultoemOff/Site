import { revalidatePath } from "next/cache";

/**
 * Atualiza as páginas do site depois que algo é salvo no admin.
 * Fora do Next (ex.: `npm run seed`) o revalidatePath não existe: ignoramos.
 */
export function revalidate(...paths: string[]) {
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      /* executado fora do servidor Next */
    }
  }
}

/** "Redes para Igrejas: parte 1!" → "redes-para-igrejas-parte-1" */
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
