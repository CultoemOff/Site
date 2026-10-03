import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/cms";
import { readProductLink } from "@/lib/productLink";

/**
 * Confere de novo o preço das ofertas marcadas com "Tentar ler o preço pelo link" (opção por produto,
 * desligada por padrão). Não há agendamento: o cadastro de preços é manual. Para voltar a conferir
 * todos os dias, crie um vercel.json com crons apontando para este endereço.
 * Se a variável CRON_SECRET existir na Vercel, só a própria Vercel consegue chamar.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PER_RUN = 40;
const PARALLEL = 5;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "não autorizado" }, { status: 401 });
  }
  const payload = await getPayloadClient();
  if (!payload) return Response.json({ ok: false, error: "banco não configurado" }, { status: 503 });

  const res = await payload.find({
    collection: "offers",
    where: { and: [{ active: { not_equals: false } }, { readPrice: { equals: true } }] },
    sort: "priceCheckedAt",
    limit: PER_RUN,
    depth: 0,
  });
  const docs = res.docs as unknown as { id: string | number; href?: string; price?: number | null }[];

  let updated = 0;
  let unchanged = 0;
  let failed = 0;
  for (let i = 0; i < docs.length; i += PARALLEL) {
    await Promise.all(
      docs.slice(i, i + PARALLEL).map(async (doc) => {
        const info = doc.href ? await readProductLink(doc.href) : null;
        const now = new Date().toISOString();
        try {
          if (!info?.price) {
            failed++;
            // marca a tentativa para a oferta ir para o fim da fila, sem mexer no preço
            await payload.update({ collection: "offers", id: doc.id, data: { priceCheckedAt: now }, context: { skipLinkRead: true } });
            return;
          }
          if (info.price === doc.price) unchanged++;
          else updated++;
          await payload.update({
            collection: "offers",
            id: doc.id,
            data: { price: info.price, priceCheckedAt: now },
            context: { skipLinkRead: true },
          });
        } catch (err) {
          console.error("[ofertas] Erro ao gravar o preço:", err);
        }
      }),
    );
  }
  revalidatePath("/ofertas");
  return Response.json({ ok: true, checked: docs.length, updated, unchanged, failed });
}
