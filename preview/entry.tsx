import { createRoot } from "react-dom/client";
import "../src/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";

createRoot(document.getElementById("root")!).render(
  <>
    <Navbar />
    <main id="conteudo" tabIndex={-1}>
      <Hero />
      <div id="problemas" style={{ height: "40vh", background: "var(--night)" }} />
    </main>
  </>,
);
