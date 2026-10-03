import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import type { FaqItem } from "@/config/site";
import "./faq.css";

/** CH 09 · Perguntas frequentes (editáveis no admin → Configurações do site). */
export default function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <section id="duvidas" className="section section--paper faq" aria-labelledby="duvidas-title">
      <div className="section__inner faq__layout">
        <div className="faq__intro">
          <SectionHeader channel="CH 09 · Dúvidas" id="duvidas-title" title="Perguntas frequentes.">
            <p>O que costumam perguntar antes de começar uma formação.</p>
          </SectionHeader>
          <div data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            <ArrowButton href="/#formacoes" variant="ghost">
              Ver as formações
            </ArrowButton>
          </div>
        </div>

        <div className="faq__list">
          {items.map((f, i) => (
            <details key={f.question} className="faq__item" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <summary>
                <span>{f.question}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
