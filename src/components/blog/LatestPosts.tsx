import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import type { PostSummary } from "@/lib/cms";
import PostCard from "./PostCard";
import "./blog.css";

/** Últimos posts na homepage (aparece só quando há posts publicados). */
export default function LatestPosts({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="section section--paper latest-posts" aria-labelledby="blog-home-title">
      <div className="section__inner">
        <SectionHeader channel="CH 10 · Blog" id="blog-home-title" title="Artigos para quem serve na técnica." />
        <ul className="blog-grid blog-grid--home">
          {posts.slice(0, 3).map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} />
          ))}
        </ul>
        <div className="latest-posts__more">
          <ArrowButton href="/blog" variant="ghost">
            Ver todos os artigos
          </ArrowButton>
        </div>
      </div>
    </section>
  );
}
