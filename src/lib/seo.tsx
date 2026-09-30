import type { Course } from "@/config/courses";
import { LOGO_SRC, SITE_DESCRIPTION, SITE_NAME, type SiteSettingsData } from "@/config/site";

/** URL pública do site (defina NEXT_PUBLIC_SITE_URL no ambiente de produção). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const OG_IMAGE = "/og-image.jpg";

export const absoluteUrl = (path = "/") => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

/** Só aceita IDs do GA4 no formato G-XXXX (evita injeção no script). */
export const safeGaId = (id: string) => (/^G-[A-Z0-9]{4,20}$/i.test(id.trim()) ? id.trim() : "");
export const safePixelId = (id: string) => (/^\d{6,20}$/.test(id.trim()) ? id.trim() : "");

export function organizationJsonLd(settings: SiteSettingsData) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_SRC),
    description: SITE_DESCRIPTION,
    sameAs: [settings.social.youtube, settings.social.instagram, settings.social.tiktok].filter(Boolean),
    founder: { "@type": "Person", name: "Jonas Silva" },
  };
}

export function coursesJsonLd(courses: Course[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: c.title,
        description: c.summary,
        provider: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL },
        inLanguage: "pt-BR",
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseWorkload: c.format.hours ? `PT${c.format.hours}H` : undefined,
        },
        offers: {
          "@type": "Offer",
          price: c.price.toFixed(2),
          priceCurrency: "BRL",
          category: "Paid",
          availability:
            c.status === "disponivel" || c.status === "inscricoes-abertas"
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
          ...(c.href ? { url: c.href } : {}),
        },
      },
    })),
  };
}

/** Renderiza JSON-LD com segurança (escapa "<"). */
/** Perguntas frequentes (FAQPage). */
export function faqJsonLd(items: SiteSettingsData["faq"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
