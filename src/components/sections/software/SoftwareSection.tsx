import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { SOFTWARE, SOFTWARE_STATUS_LABEL, type Software } from "@/config/software";
import "./software.css";

function Action({ href, label, primary = false }: { href: string; label: string; primary?: boolean }) {
  if (!href) {
    return (
      <span className="soft__soon" aria-disabled="true">
        {label} · em breve
      </span>
    );
  }
  return (
    <ArrowButton href={href} variant={primary ? "primary" : "ghost"} external>
      {label}
    </ArrowButton>
  );
}

function SoftwareCard({ sw, index }: { sw: Software; index: number }) {
  const inDev = sw.status === "em-desenvolvimento";
  return (
    <article className={`soft${inDev ? " soft--dev" : ""}`} aria-labelledby={`sw-${sw.id}`} data-reveal data-glow style={{ "--i": index } as React.CSSProperties}>
      <div className="soft__body">
        <div className="soft__meta">
          <span className="soft__area">{sw.area}</span>
          {sw.status && <span className={`soft__status soft__status--${sw.status}`}>{SOFTWARE_STATUS_LABEL[sw.status]}</span>}
        </div>
        <h3 id={`sw-${sw.id}`} className="soft__name">
          {sw.name}
        </h3>
        <p className="soft__tagline">{sw.tagline}</p>
        <p className="soft__text">{sw.description}</p>
        {!inDev && sw.pageUrl && (
          <div className="soft__actions">
            <ArrowButton href={sw.pageUrl}>Conheça e baixe</ArrowButton>
          </div>
        )}
        {!inDev && !sw.pageUrl && (
          <div className="soft__actions">
            <Action href={sw.learnMoreUrl} label="Conhecer" />
            <Action href={sw.downloadUrl} label="Download" primary />
          </div>
        )}
      </div>
    </article>
  );
}

/** Seção enxuta na home: só o essencial de cada software (os detalhes ficam na página de cada um). */
export default function SoftwareSection() {
  return (
    <section id="softwares" className="section section--abyss softwares" aria-labelledby="softwares-title">
      <div className="section__inner">
        <SectionHeader channel="CH 05 · Softwares Culto em Off" id="softwares-title" title="Ferramentas feitas para a operação da igreja.">
          <p>
            Além das formações, o Culto em Off desenvolve softwares, gratuitos e comerciais, para simplificar a operação
            técnica de quem serve.
          </p>
        </SectionHeader>
        <div className="softwares__grid">
          {SOFTWARE.map((sw, i) => (
            <SoftwareCard key={sw.id} sw={sw} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
