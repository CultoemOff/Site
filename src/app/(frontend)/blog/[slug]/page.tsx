import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichTextContent from "@/components/blog/RichTextContent";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ArrowButton from "@/components/ui/ArrowButton";
import { LOGO_SRC, SITE_NAME } from "@/config/site";
import { getPost, getSiteSettings } from "@/lib/cms";
import { JsonLd, OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { formatVideoDate } from "@/lib/youtube";
import "@/components/blog/blog.css";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post não encontrado", robots: { index: false } };
  const title = post.seo.title || post.title;
  const description = post.seo.description || post.excerpt || undefined;
  const image = post.seo.image || OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      tags: post.tags,
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSiteSettings()]);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo.description || post.excerpt,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || undefined,
    image: absoluteUrl(post.seo.image || post.cover?.url || OG_IMAGE),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: { "@type": "Person", name: post.authorName || "Jonas Silva" },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_SRC) } },
    keywords: post.tags.join(", ") || undefined,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <article className="post">
          <header className="post__header">
            <div className="post__header-inner">
              <Link href="/blog" className="post__back">
                ← Blog
              </Link>
              {post.tags.length > 0 && (
                <ul className="post__tags" aria-label="Tags">
                  {post.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              <h1 className="post__title">{post.title}</h1>
              {post.excerpt && <p className="post__excerpt">{post.excerpt}</p>}
              <p className="post__meta">
                {post.authorName && <span>{post.authorName}</span>}
                {post.publishedAt && <time dateTime={post.publishedAt}>{formatVideoDate(post.publishedAt)}</time>}
              </p>
            </div>
          </header>

          {post.cover && (
            <div className="post__cover">
              <Image src={post.cover.url} alt={post.cover.alt} fill priority sizes="(max-width: 1000px) 100vw, 960px" />
            </div>
          )}

          <div className="post__body">
            <RichTextContent data={post.content} />

            <aside className="post__cta" aria-label="Formações Culto em Off">
              <p className="post__cta-title">Quer ir além?</p>
              <p>Conheça as formações do Culto em Off, pensadas para voluntários de igreja.</p>
              <ArrowButton href="/#formacoes">Ver formações</ArrowButton>
            </aside>
          </div>
        </article>
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
