import type { ReactNode } from "react";
import "./section.css";

type Props = {
  /** rótulo técnico, ex.: "CH 01 · Bastidores reais" */
  channel: string;
  id: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
};

/** Cabeçalho de seção com rótulo em estilo "canal de mesa". */
export default function SectionHeader({ channel, id, title, children, align = "left" }: Props) {
  return (
    <header className={`section-head section-head--${align}`}>
      <p className="section-head__channel" data-reveal>
        <span className="section-head__led" aria-hidden="true" />
        {channel}
      </p>
      <h2 id={id} className="section-head__title" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
        {title}
      </h2>
      {children && (
        <div className="section-head__intro" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
          {children}
        </div>
      )}
    </header>
  );
}
