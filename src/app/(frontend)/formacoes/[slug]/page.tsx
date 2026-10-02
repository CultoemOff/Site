import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import SalesPageView from "@/components/sales/SalesPageView";
import { getInstructor } from "@/config/instructors";
import { SALES_PAGES } from "@/config/salesPages";
import { getCourses, getSiteSettings } from "@/lib/cms";
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
  return {
    title: `${data.course.title} — formação online`,
    description: `${data.page.subheadline}`,
    alternates: { canonical: `/formacoes/${slug}` },
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
          description: page.subheadline,
          url: `${SITE_URL}/formacoes/${slug}`,
          provider: { "@type": "Organization", name: "Culto em Off", url: SITE_URL },
          ...(teacher ? { instructor: { "@type": "Person", name: teacher.name } } : {}),
          offers: {
            "@type": "Offer",
            price: course.price.toFixed(2),
            priceCurrency: "BRL",
            category: "Paid",
            ...(page.promo ? { priceValidUntil: page.promo.endsAt.slice(0, 10) } : {}),
            ...(course.href ? { url: course.href, availability: "https://schema.org/InStock" } : {}),
          },
          hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
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
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <SalesPageView course={course} page={page} audience={settings.audience} />
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
