/** Índice dos posts: âncora de cada título de seção (H2), igual no índice e no texto. */

type LexNode = { type?: string; tag?: string; text?: string; children?: LexNode[] };

export function nodeText(node: LexNode): string {
  if (typeof node.text === "string") return node.text;
  return (node.children ?? []).map(nodeText).join("");
}

export function headingId(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** títulos H2 do conteúdo do post, na ordem */
export function postHeadings(content: unknown): { id: string; text: string }[] {
  const root = (content as { root?: LexNode } | null)?.root;
  if (!root?.children) return [];
  return root.children
    .filter((n) => n.type === "heading" && n.tag === "h2")
    .map((n) => {
      const text = nodeText(n).trim();
      return { id: headingId(text), text };
    })
    .filter((h) => h.id);
}

type BlockFields = { blockType?: string; items?: { question?: string; answer?: string }[] };

/** perguntas dos blocos de perguntas frequentes (para os dados estruturados) */
export function postFaq(content: unknown): { question: string; answer: string }[] {
  const root = (content as { root?: { children?: { type?: string; fields?: BlockFields }[] } } | null)?.root;
  return (root?.children ?? [])
    .filter((n) => n.type === "block" && n.fields?.blockType === "faq")
    .flatMap((n) => n.fields?.items ?? [])
    .filter((i): i is { question: string; answer: string } => Boolean(i.question && i.answer));
}
