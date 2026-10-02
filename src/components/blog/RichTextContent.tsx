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

type YouTubeFields = { url: string; caption?: string | null; blockType: "youtube" };
type NodeTypes = DefaultNodeTypes | SerializedBlockNode<YouTubeFields>;

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
    const src = localMediaPath(media.sizes?.wide?.url || media.url);
    const width = media.sizes?.wide?.width || media.width || 1600;
    const height = media.sizes?.wide?.height || media.height || 900;
    return (
      <figure className="post-media">
        <Image src={src} alt={media.alt || ""} width={width} height={height} sizes="(max-width: 800px) 100vw, 760px" />
        {media.caption && <figcaption>{media.caption}</figcaption>}
      </figure>
    );
  },
  blocks: {
    youtube: ({ node }) => <YouTubeEmbed url={node.fields.url} caption={node.fields.caption ?? undefined} />,
  },
});

/** Renderiza o conteúdo de um post escrito no editor do admin. */
export default function RichTextContent({ data }: { data: unknown }) {
  if (!data || typeof data !== "object") return null;
  return <RichText className="post-prose" converters={converters} data={data as SerializedEditorState} />;
}
