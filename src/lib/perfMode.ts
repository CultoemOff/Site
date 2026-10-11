/**
 * "Modo leve" para computadores e celulares mais fracos.
 * Quando ativo, a página põe a classe .fx-lite no <html> e os efeitos pesados ficam mais simples
 * (luzes do topo a 30 quadros, sem fumaça em movimento, sem desfoque de fundo, entradas sem blur).
 *
 * Liga de duas formas:
 *  1. antes de desenhar a página (script inline no layout), pelas pistas do aparelho: até 4 núcleos,
 *     até 4 GB de memória ou "economia de dados" ligada;
 *  2. medindo a página: se os primeiros segundos rodam abaixo de ~40 quadros por segundo.
 * A decisão fica guardada na sessão (sessionStorage) para as próximas páginas já abrirem leves.
 */
export const LITE_CLASS = "fx-lite";
export const LITE_KEY = "coe-lite";
export const LITE_EVENT = "coe:lite";

/** script inline (roda antes da página aparecer) */
export const LITE_INLINE_SCRIPT = `try{var n=navigator,c=n.connection,l=sessionStorage.getItem('${LITE_KEY}')==='1'||(n.hardwareConcurrency&&n.hardwareConcurrency<=4)||(n.deviceMemory&&n.deviceMemory<=4)||(c&&c.saveData);if(l)document.documentElement.classList.add('${LITE_CLASS}')}catch(e){}`;

export const isLite = () => typeof document !== "undefined" && document.documentElement.classList.contains(LITE_CLASS);

export function enableLite() {
  const root = document.documentElement;
  if (root.classList.contains(LITE_CLASS)) return;
  root.classList.add(LITE_CLASS);
  try {
    sessionStorage.setItem(LITE_KEY, "1");
  } catch {
    /* sem armazenamento: vale só nesta página */
  }
  window.dispatchEvent(new Event(LITE_EVENT));
}

/**
 * Mede a fluidez por até ~3 s (com a aba visível). Ignora o começo (carregamento) e usa a mediana
 * do tempo entre quadros: acima de 25 ms (menos de ~40 quadros por segundo) liga o modo leve.
 */
export function probeFrameRate(onDone?: () => void) {
  if (isLite() || typeof requestAnimationFrame === "undefined") return () => undefined;
  const deltas: number[] = [];
  let last = 0;
  let frames = 0;
  let raf = 0;
  let begin = 0;
  const finish = () => {
    const sorted = [...deltas].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    if (median > 25) enableLite();
    onDone?.();
  };
  const step = (now: number) => {
    if (document.visibilityState !== "visible") {
      last = 0;
      raf = requestAnimationFrame(step);
      return;
    }
    if (last) {
      frames++;
      if (frames > 10) {
        if (!begin) begin = now;
        deltas.push(now - last);
      }
    }
    last = now;
    // 60 amostras ou 3 s (num aparelho lento chegam menos quadros: decide com o que tiver)
    if (deltas.length < 60 && !(deltas.length >= 12 && now - begin > 3000)) {
      raf = requestAnimationFrame(step);
      return;
    }
    finish();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
