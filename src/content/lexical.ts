/**
 * Conversor simples de conteúdo estruturado → formato do editor do Payload (Lexical).
 * Usado para migrar artigos antigos para o blog (seed) e como conteúdo padrão sem banco.
 * Suporta: títulos, parágrafos com **negrito**, `código` e [links](https://…), listas, citações,
 * imagens (com legenda), linha horizontal e os blocos do site: tabela, caixa de destaque e perguntas frequentes.
 */

export type ContentBlock =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { quote: string }
  | { hr: true }
  | { img: { sourceUrl: string; alt: string; caption?: string } }
  /** tabela: primeira linha é o cabeçalho */
  | { table: { rows: string[][]; caption?: string } }
  | { callout: { kind: "dica" | "atencao" | "info"; title?: string; text: string; button?: { label: string; url: string } } }
  | { youtube: { url: string; caption?: string } }
  | { faq: { question: string; answer: string }[] };

const base = { format: "" as const, indent: 0, version: 1, direction: "ltr" as const };

let uid = 0;
const nodeId = () => `seed${(++uid).toString(36)}${Date.now().toString(36)}`;

/** format do Lexical: 1 = negrito, 16 = código */
function textNode(text: string, format = 0) {
  return { type: "text", text, format, detail: 0, mode: "normal", style: "", version: 1 };
}

function inline(text: string): object[] {
  // divide em trechos normais, **negrito**, `código` e [link](url)
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
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
          children: [textNode(link[1])],
        };
      }
      if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) return textNode(part.slice(1, -1), 16);
      const bold = part.startsWith("**") && part.endsWith("**");
      return textNode(bold ? part.slice(2, -2) : part, bold ? 1 : 0);
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

/** ID no formato do Payload/Mongo (24 caracteres hexadecimais) para blocos e linhas de array */
function objectId() {
  let id = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  while (id.length < 24) id += Math.floor(Math.random() * 16).toString(16);
  return id;
}

/** bloco do editor (BlocksFeature): tabela, caixa de destaque, perguntas frequentes */
function block(blockType: string, fields: Record<string, unknown>) {
  return { type: "block", version: 2, format: "", fields: { id: objectId(), blockName: "", blockType, ...fields } };
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
        value: id ?? { url: b.img.sourceUrl, alt: b.img.alt, caption: b.img.caption, mimeType: "image/png" },
      };
    }
    if ("table" in b) return block("table", { rows: b.table.rows.map((r) => r.join(" | ")).join("\n"), caption: b.table.caption ?? "" });
    if ("callout" in b)
      return block("callout", {
        kind: b.callout.kind,
        title: b.callout.title ?? "",
        text: b.callout.text,
        buttonLabel: b.callout.button?.label ?? "",
        buttonUrl: b.callout.button?.url ?? "",
      });
    if ("youtube" in b) return block("youtube", { url: b.youtube.url, caption: b.youtube.caption ?? "" });
    if ("faq" in b) return block("faq", { items: b.faq.map((f) => ({ id: objectId(), question: f.question, answer: f.answer })) });
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
  /** título e descrição para o Google (opcionais) */
  seo?: { title?: string; description?: string };
};
