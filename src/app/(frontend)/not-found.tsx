import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import "@/components/ui/button.css";
import "@/components/blog/blog.css";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <header className="blog-hero" style={{ minHeight: "80svh", display: "grid", placeItems: "center" }}>
          <div className="blog-hero__inner">
            <p className="blog-hero__channel">
              <span aria-hidden="true" />
              Erro 404 · sem sinal
            </p>
            <h1 className="blog-hero__title">Essa página saiu do ar.</h1>
            <p className="blog-hero__text">O endereço pode ter mudado ou não existe mais.</p>
            <p style={{ marginTop: 28 }}>
              <Link href="/" className="btn btn--primary">
                Voltar para o início
              </Link>
            </p>
          </div>
        </header>
      </main>
    </>
  );
}
