/**
 * Conversor simples de conteúdo estruturado → formato do editor do Payload (Lexical).
 * Usado para migrar artigos antigos para o blog (seed) e como conteúdo padrão sem banco.
 * Suporta: títulos, parágrafos com **negrito**, listas e linha horizontal.
 */

export type ContentBlock =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { quote: string }
  | { hr: true };

const base = { format: "", indent: 0, version: 1, direction: "ltr" as const };

function inline(text: string) {
  // divide em trechos normais e **negrito**
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      const bold = part.startsWith("**") && part.endsWith("**");
      return {
        type: "text",
        text: bold ? part.slice(2, -2) : part,
        format: bold ? 1 : 0,
        detail: 0,
        mode: "normal",
        style: "",
        version: 1,
      };
    });
}

function list(items: string[], ordered: boolean) {
  return {
    ...base,
    type: "list",
    listType: ordered ? "number" : "bullet",
    tag: ordered ? "ol" : "ul",
    start: 1,
    children: items.map((item, i) => ({ ...base, type: "listitem", value: i + 1, children: inline(item) })),
  };
}

export function toLexical(blocks: ContentBlock[]) {
  const children = blocks.map((b) => {
    if ("h2" in b) return { ...base, type: "heading", tag: "h2", children: inline(b.h2) };
    if ("h3" in b) return { ...base, type: "heading", tag: "h3", children: inline(b.h3) };
    if ("ul" in b) return list(b.ul, false);
    if ("ol" in b) return list(b.ol, true);
    if ("quote" in b) return { ...base, type: "quote", children: inline(b.quote) };
    if ("hr" in b) return { type: "horizontalrule", version: 1 };
    return { ...base, type: "paragraph", textFormat: 0, textStyle: "", children: inline(b.p) };
  });
  return { root: { ...base, type: "root", children } };
}

export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
  /** capa: arquivo local em /public e, se não existir, URL de origem para baixar no seed */
  cover?: { localPath: string; sourceUrl?: string; alt: string };
  blocks: ContentBlock[];
};
