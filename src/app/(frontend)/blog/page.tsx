import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getPosts, getSiteSettings } from "@/lib/cms";
import "@/components/blog/blog.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos sobre áudio, vídeo, iluminação, redes, transmissão e automação para voluntários de igreja.",
  alternates: { canonical: "/blog" },
};

type Props = { searchParams: Promise<{ pagina?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const { pagina } = await searchParams;
  const page = Math.max(1, Number(pagina) || 1);
  const [{ posts, totalPages }, settings] = await Promise.all([getPosts(page), getSiteSettings()]);

  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <header className="blog-hero">
          <div className="blog-hero__inner">
            <p className="blog-hero__channel">
              <span aria-hidden="true" />
              Blog Culto em Off
            </p>
            <h1 className="blog-hero__title">Conhecimento técnico para quem serve.</h1>
            <p className="blog-hero__text">
              Artigos sobre áudio, vídeo, iluminação, redes, transmissão e automação, com a linguagem de quem está nos
              bastidores do culto.
            </p>
          </div>
        </header>

        <section className="blog-list" aria-label="Posts">
          <div className="blog-list__inner">
            {posts.length > 0 ? (
              <ul className="blog-grid">
                {posts.map((p, i) => (
                  <PostCard key={p.slug} post={p} index={i} />
                ))}
              </ul>
            ) : (
              <div className="blog-empty">
                <p className="blog-empty__title">Os primeiros artigos estão a caminho.</p>
                <p>Enquanto isso, veja as formações ou os vídeos no canal.</p>
                <Link href="/#formacoes">Ver formações</Link>
              </div>
            )}

            {totalPages > 1 && (
              <nav className="blog-pager" aria-label="Paginação">
                {page > 1 && (
                  <Link href={page === 2 ? "/blog" : `/blog?pagina=${page - 1}`} rel="prev">
                    ← Mais recentes
                  </Link>
                )}
                <span>
                  Página {page} de {totalPages}
                </span>
                {page < totalPages && (
                  <Link href={`/blog?pagina=${page + 1}`} rel="next">
                    Mais antigos →
                  </Link>
                )}
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
