import Image from "next/image";
import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
} from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { LinkJSXConverter, RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import YouTubeEmbed from "./YouTubeEmbed";
import { localMediaPath } from "@/lib/mediaPath";
import { publicMediaFallback } from "@/content/posts/mediaFallback";
import { headingId, nodeText } from "@/lib/postToc";

type YouTubeFields = { url: string; caption?: string | null; blockType: "youtube" };
type TableFields = { rows?: string | null; caption?: string | null; blockType: "table" };
type CalloutFields = {
  kind?: "dica" | "atencao" | "info" | null;
  title?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  blockType: "callout";
};
type FaqFields = { items?: { id?: string; question?: string | null; answer?: string | null }[] | null; blockType: "faq" };
type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<YouTubeFields>
  | SerializedBlockNode<TableFields>
  | SerializedBlockNode<CalloutFields>
  | SerializedBlockNode<FaqFields>;

/** **negrito**, `código` e [links](url) nos textos dos blocos */
function inlineMd(text: string): React.ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean)
    .map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const external = /^https?:/.test(link[2]);
        return (
          <a key={i} href={link[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {link[1]}
          </a>
        );
      }
      if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
      return part;
    });
}

const CALLOUT_LABEL = { dica: "Dica", atencao: "Atenção", info: "Saiba mais" } as const;

type MediaDoc = {
  url?: string;
  alt?: string;
  caption?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  sizes?: { wide?: { url?: string; width?: number; height?: number } };
};

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields.doc;
  const value = doc?.value;
  const slug = value && typeof value === "object" && "slug" in value ? String((value as { slug?: string }).slug ?? "") : "";
  return doc?.relationTo === "posts" ? `/blog/${slug}` : `/${slug}`;
};

const converters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  upload: ({ node }) => {
    const media = (typeof node.value === "object" ? node.value : null) as MediaDoc | null;
    if (!media?.url) return null;
    if (media.mimeType?.startsWith("video/")) {
      return (
        <figure className="post-media">
          <video controls preload="metadata" src={localMediaPath(media.url)} />
          {media.caption && <figcaption>{media.caption}</figcaption>}
        </figure>
      );
    }
    // imagens que vieram do código: cópia de /public (o arquivo enviado pelo seed pode não existir no servidor)
    const fallback = publicMediaFallback(media.url);
    const src = fallback ?? localMediaPath(media.sizes?.wide?.url || media.url);
    const width = (fallback ? media.width : media.sizes?.wide?.width || media.width) || 1600;
    const height = (fallback ? media.height : media.sizes?.wide?.height || media.height) || 900;
    return (
      <figure className="post-media">
        <Image src={src} alt={media.alt || ""} width={width} height={height} sizes="(max-width: 800px) 100vw, 760px" />
        {media.caption && <figcaption>{media.caption}</figcaption>}
      </figure>
    );
  },
  // H2 com âncora (o índice do post aponta para cada um)
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag;
    const children = nodesToJSX({ nodes: node.children });
    const id = node.tag === "h2" ? headingId(nodeText(node as never)) : undefined;
    return <Tag id={id || undefined}>{children}</Tag>;
  },
  blocks: {
    youtube: ({ node }) => <YouTubeEmbed url={node.fields.url} caption={node.fields.caption ?? undefined} />,
    table: ({ node }) => {
      const lines = String(node.fields.rows ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => l.split("|").map((c) => c.trim()));
      if (!lines.length) return null;
      const [head, ...body] = lines;
      return (
        <figure className="post-table">
          <div className="post-table__scroll" tabIndex={0} role="region" aria-label={node.fields.caption || "Tabela"}>
            <table>
              <thead>
                <tr>
                  {head.map((c, i) => (
                    <th key={i} scope="col">
                      {inlineMd(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) =>
                      j === 0 ? (
                        <th key={j} scope="row">
                          {inlineMd(c)}
                        </th>
                      ) : (
                        <td key={j}>{inlineMd(c)}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {node.fields.caption && <figcaption>{node.fields.caption}</figcaption>}
        </figure>
      );
    },
    callout: ({ node }) => {
      const kind = node.fields.kind ?? "dica";
      return (
        <aside className={`post-callout post-callout--${kind}`}>
          <p className="post-callout__title">{node.fields.title || CALLOUT_LABEL[kind]}</p>
          <p>{inlineMd(String(node.fields.text ?? ""))}</p>
          {node.fields.buttonLabel && node.fields.buttonUrl && (
            <a className="post-callout__btn" href={node.fields.buttonUrl} {...(/^https?:/.test(node.fields.buttonUrl) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {node.fields.buttonLabel}
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
                <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </aside>
      );
    },
    faq: ({ node }) => (
      <div className="post-faq">
        {(node.fields.items ?? []).map((f, i) =>
          f.question && f.answer ? (
            <details key={f.id ?? i} className="post-faq__item">
              <summary>
                <span>{f.question}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </summary>
              <p>{inlineMd(f.answer)}</p>
            </details>
          ) : null,
        )}
      </div>
    ),
  },
});

/** Renderiza o conteúdo de um post escrito no editor do admin. */
export default function RichTextContent({ data }: { data: unknown }) {
  if (!data || typeof data !== "object") return null;
  return <RichText className="post-prose" converters={converters} data={data as SerializedEditorState} />;
}
