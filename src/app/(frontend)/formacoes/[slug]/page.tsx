import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import SalesPageView from "@/components/sales/SalesPageView";
import { isListed } from "@/config/courses";
import { getInstructor } from "@/config/instructors";
import { SALES_PAGES } from "@/config/salesPages";
import { getCourses, getSiteSettings } from "@/lib/cms";
import { resolvePrice } from "@/lib/pricing";
import { JsonLd, SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(SALES_PAGES).map((slug) => ({ slug }));
}

async function load(slug: string) {
  const page = SALES_PAGES[slug];
  if (!page) return null;
  const course = (await getCourses()).find((c) => c.id === slug);
  return course ? { page, course } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) return {};
  const seo = data.page.seo;
  return {
    title: seo?.title ?? `${data.course.title} — formação online`,
    description: seo?.description ?? data.page.subheadline,
    ...(seo?.keywords ? { keywords: seo.keywords } : {}),
    alternates: { canonical: `/formacoes/${slug}` },
    ...(data.page.ogImage ? { openGraph: { images: [{ url: data.page.ogImage, width: 1200, height: 630, alt: data.course.title }] } } : {}),
    // formação fora da lista: abre pelo link direto, mas não aparece no Google até ser liberada
    ...(isListed(data.course) ? {} : { robots: { index: false, follow: true } }),
  };
}

/** Página de venda de uma formação (conteúdo em src/config/salesPages.ts). */
export default async function CourseSalesPage({ params }: Props) {
  const { slug } = await params;
  const [data, settings] = await Promise.all([load(slug), getSiteSettings()]);
  if (!data) notFound();
  const { course, page } = data;
  const teacher = getInstructor(course.instructor);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.title,
          ...(page.seo?.kicker ? { alternateName: page.seo.kicker } : {}),
          description: page.seo?.description ?? page.subheadline,
          url: `${SITE_URL}/formacoes/${slug}`,
          inLanguage: "pt-BR",
          educationalLevel: "Iniciante",
          ...(page.ogImage ? { image: `${SITE_URL}${page.ogImage}` } : {}),
          teaches: course.topics,
          ...(page.seo?.keywords ? { keywords: page.seo.keywords.join(", ") } : {}),
          provider: { "@type": "Organization", name: "Culto em Off", url: SITE_URL },
          ...(teacher ? { instructor: { "@type": "Person", name: teacher.name } } : {}),
          ...(course.price > 0
            ? {
                offers: {
                  "@type": "Offer",
                  price: resolvePrice(course).price.toFixed(2),
                  priceCurrency: "BRL",
                  category: "Paid",
                  ...(page.promo?.endsAt ? { priceValidUntil: page.promo.endsAt.slice(0, 10) } : {}),
                  ...(course.href ? { url: course.href, availability: "https://schema.org/InStock" } : {}),
                },
              }
            : {}),
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            ...(course.format.hours > 0 ? { courseWorkload: `PT${course.format.hours}H` } : {}),
          },
        }}
      />
      {/* trilha (Início › Formações › curso): aparece no resultado do Google no lugar do endereço */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Formações", item: `${SITE_URL}/formacoes` },
            { "@type": "ListItem", position: 3, name: course.title, item: `${SITE_URL}/formacoes/${slug}` },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      {/* página de venda sem o menu do site: menos saídas antes da oferta (a marca aparece no topo, sem link) */}
      <main id="conteudo" tabIndex={-1} className="sp-main">
        <SalesPageView course={course} page={page} audience={settings.audience} instagram={settings.social.instagram} />
      </main>
      <Footer settings={settings} minimal />
      <ViewportFx />
    </>
  );
}
