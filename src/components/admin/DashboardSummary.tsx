/* eslint-disable @next/next/no-img-element */
import config from "@payload-config";
import Link from "next/link";
import { getPayload, type Payload } from "payload";

/**
 * Resumo no topo da tela inicial do painel: atalhos, números e últimas ofertas.
 * É só leitura: não altera nada no banco. Se alguma contagem falhar, o card mostra "—".
 */

type Props = {
  payload?: Payload;
  user?: { name?: string | null } | null;
};

const PTZ_SOURCE = "ptz-control-web";

async function safe<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}

const num = (value: { totalDocs: number } | null) => (value ? value.totalDocs.toLocaleString("pt-BR") : "—");

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const icons = {
  offers: "M3 12.6V4a1 1 0 0 1 1-1h8.6a1 1 0 0 1 .7.3l7.4 7.4a1 1 0 0 1 0 1.4l-8.6 8.6a1 1 0 0 1-1.4 0L3.3 13.3a1 1 0 0 1-.3-.7ZM7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  courses: "M12 4 2 9l10 5 8-4v6h2V9L12 4Zm-6 9.2V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3Z",
  posts: "M6 3h9l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 1.5V9h4.5L14 4.5ZM8 12v1.6h8V12H8Zm0 3.4V17h8v-1.6H8Z",
  leads: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-7 1.6-7 4.5V20h14v-2.5c0-2.9-3.7-4.5-7-4.5Zm8-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm1 2.1c1.9.7 4 2 4 4.4V20h-4v-2.5c0-1.7-.7-3.2-2-4.3.7-.1 1.4-.1 2-.1Z",
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path d={d} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export default async function DashboardSummary({ payload: fromProps, user }: Props) {
  const payload = fromProps ?? (await getPayload({ config }));
  const admin = payload.config.routes.admin;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [offers, offersActive, offersHome, courses, posts, postsPublished, leads, leadsPtz, leadsWeek, recent] = await Promise.all([
    safe(payload.count({ collection: "offers" })),
    safe(payload.count({ collection: "offers", where: { active: { equals: true } } })),
    safe(payload.count({ collection: "offers", where: { home: { equals: true } } })),
    safe(payload.count({ collection: "courses" })),
    safe(payload.count({ collection: "posts" })),
    safe(payload.count({ collection: "posts", where: { _status: { equals: "published" } } })),
    safe(payload.count({ collection: "leads" })),
    safe(payload.count({ collection: "leads", where: { source: { equals: PTZ_SOURCE } } })),
    safe(payload.count({ collection: "leads", where: { createdAt: { greater_than: weekAgo } } })),
    safe(payload.find({ collection: "offers", sort: "-updatedAt", limit: 6, depth: 0 })),
  ]);

  const firstName = user?.name ? String(user.name).trim().split(/\s+/)[0] : "";

  const stats = [
    {
      key: "offers",
      label: "Ofertas",
      value: num(offers),
      detail: `${num(offersActive)} na página · ${num(offersHome)} na home`,
      href: `${admin}/collections/offers`,
      icon: icons.offers,
    },
    {
      key: "courses",
      label: "Formações",
      value: num(courses),
      detail: "Preços, textos e links de compra",
      href: `${admin}/collections/courses`,
      icon: icons.courses,
    },
    {
      key: "posts",
      label: "Posts do blog",
      value: num(posts),
      detail: `${num(postsPublished)} publicados`,
      href: `${admin}/collections/posts`,
      icon: icons.posts,
    },
    {
      key: "leads",
      label: "Cadastros",
      value: num(leads),
      detail: `${num(leadsPtz)} do PTZ Control Web · ${num(leadsWeek)} nos últimos 7 dias`,
      href: `${admin}/collections/leads`,
      icon: icons.leads,
    },
  ];

  const recentOffers = recent?.docs ?? [];

  return (
    <section className="ceo-dash" aria-label="Resumo do site">
      <div className="ceo-dash__head">
        <div>
          <p className="ceo-dash__eyebrow">Painel do Culto em Off</p>
          <h2 className="ceo-dash__title">{firstName ? `Olá, ${firstName}.` : "Olá."} O que vamos atualizar hoje?</h2>
        </div>
        <div className="ceo-dash__actions">
          <Link className="ceo-btn ceo-btn--primary" href={`${admin}/collections/offers/create`}>
            <span aria-hidden="true">+</span> Adicionar oferta
          </Link>
          <Link className="ceo-btn" href={`${admin}/collections/posts/create`}>
            <span aria-hidden="true">+</span> Novo post
          </Link>
          <Link className="ceo-btn ceo-btn--ghost" href="/" target="_blank" rel="noopener noreferrer" prefetch={false}>
            Ver site <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <ul className="ceo-dash__stats">
        {stats.map((stat) => (
          <li key={stat.key}>
            <Link className={`ceo-stat ceo-stat--${stat.key}`} href={stat.href}>
              <span className="ceo-stat__icon">
                <Icon d={stat.icon} />
              </span>
              <span className="ceo-stat__label">{stat.label}</span>
              <strong className="ceo-stat__value">{stat.value}</strong>
              <span className="ceo-stat__detail">{stat.detail}</span>
            </Link>
          </li>
        ))}
      </ul>

      {recentOffers.length > 0 && (
        <div className="ceo-dash__recent">
          <div className="ceo-dash__recent-head">
            <h3>Últimas ofertas editadas</h3>
            <Link href="/ofertas" target="_blank" rel="noopener noreferrer" prefetch={false}>
              Ver página de ofertas ↗
            </Link>
          </div>
          <ul className="ceo-dash__offers">
            {recentOffers.map((offer) => (
              <li key={String(offer.id)}>
                <Link className="ceo-mini" href={`${admin}/collections/offers/${offer.id}`}>
                  <span className="ceo-mini__img">
                    {offer.imageUrl ? <img src={offer.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <span>sem foto</span>}
                  </span>
                  <span className="ceo-mini__title">{offer.title}</span>
                  <span className="ceo-mini__price">{typeof offer.price === "number" ? money(offer.price) : "sem preço"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
