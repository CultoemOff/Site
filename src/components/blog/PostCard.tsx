import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/cms";
import { formatVideoDate } from "@/lib/youtube";

export default function PostCard({ post, index = 0 }: { post: PostSummary; index?: number }) {
  return (
    <li data-reveal style={{ "--i": index % 3 } as React.CSSProperties}>
      <Link href={`/blog/${post.slug}`} className="post-card" data-glow>
        <span className="post-card__cover">
          {post.cover ? (
            <Image src={post.cover.url} alt={post.cover.alt} fill sizes="(max-width: 700px) 100vw, 380px" />
          ) : (
            <span className="post-card__placeholder" aria-hidden="true" />
          )}
        </span>
        <span className="post-card__body">
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatVideoDate(post.publishedAt)}</time>}
          <span className="post-card__title">{post.title}</span>
          {post.excerpt && <span className="post-card__excerpt">{post.excerpt}</span>}
          {post.tags.length > 0 && (
            <span className="post-card__tags">
              {post.tags.slice(0, 3).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}
