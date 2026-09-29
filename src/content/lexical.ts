/**
 * Conversor simples de conteúdo estruturado → formato do editor do Payload (Lexical).
 * Usado para migrar artigos antigos para o blog (seed) e como conteúdo padrão sem banco.
 * Suporta: títulos, parágrafos com **negrito** e [links](https://…), listas, citações,
 * imagens e linha horizontal.
 */

export type ContentBlock =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { quote: string }
  | { hr: true }
  | { img: { sourceUrl: string; alt: string } };

const base = { format: "", indent: 0, version: 1, direction: "ltr" as const };

let uid = 0;
const nodeId = () => `seed${(++uid).toString(36)}${Date.now().toString(36)}`;

function textNode(text: string, bold: boolean) {
  return { type: "text", text, format: bold ? 1 : 0, detail: 0, mode: "normal", style: "", version: 1 };
}

function inline(text: string): object[] {
  // divide em trechos normais, **negrito** e [link](url)
  return text
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean)
    .map((part) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return {
          ...base,
          type: "link",
          version: 3,
          id: nodeId(),
          fields: { linkType: "custom", url: link[2], newTab: /^https?:/.test(link[2]) },
          children: [textNode(link[1], false)],
        };
      }
      const bold = part.startsWith("**") && part.endsWith("**");
      return textNode(bold ? part.slice(2, -2) : part, bold);
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

/**
 * `images`: mapa URL de origem → ID da mídia no Payload (seed).
 * Sem o mapa, a imagem aponta direto para a URL de origem (modo sem banco).
 */
export function toLexical(blocks: ContentBlock[], images?: Map<string, string | number>) {
  const children = blocks.map((b) => {
    if ("img" in b) {
      const id = images?.get(b.img.sourceUrl);
      return {
        type: "upload",
        version: 3,
        format: "",
        id: nodeId(),
        fields: null,
        relationTo: "media",
        value: id ?? { url: b.img.sourceUrl, alt: b.img.alt, mimeType: "image/png" },
      };
    }
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
