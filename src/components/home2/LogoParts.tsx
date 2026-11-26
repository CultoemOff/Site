/**
 * Elementos do logo novo (PSD 2026) redesenhados em SVG: a cruz e as barras sonoras.
 * Medidas e cores tiradas das camadas "Cruz" e "Camada 35" do PSD horizontal.
 * As barras podem "tocar" como um equalizador (só CSS, transform; param com "reduzir movimento").
 */

/** barras do logo: x, largura, y, altura e cor (coordenadas do PSD; a cruz passa no vão do meio) */
export const LOGO_BARS = [
  [1, 75, 444, 208, "#355e86"],
  [103, 75, 278, 308, "#4880b7"],
  [205, 75, 349, 237, "#5ca3ec"],
  [307, 75, 107, 430, "#6db9fd"],
  [409, 75, 242, 246, "#83c7fd"],
  [511, 75, 25, 655, "#a3d9fd"],
  [614, 74, 259, 254, "#84c8fd"],
  [716, 74, 134, 441, "#6cb8fc"],
  [1022, 75, 107, 440, "#5ca3ec"],
  [1124, 75, 168, 254, "#4880b8"],
  [1226, 75, 2, 654, "#355e86"],
  [1329, 74, 194, 309, "#4880b7"],
  [1431, 74, 144, 431, "#5ca2ec"],
  [1533, 74, 95, 403, "#84c8fd"],
  [1632, 75, 33, 441, "#5ca2ec"],
] as const;

/** cruz do logo (proporções do PSD: 846 × 1364, braços de 190) */
export function LogoCross({ className, title }: { className?: string; title?: string }) {
  const id = "lc-grad";
  return (
    <svg className={className} viewBox="0 0 846 1364" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} focusable="false">
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f9fd8" />
          <stop offset="0.45" stopColor="#3f78b0" />
          <stop offset="1" stopColor="#1f4675" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M327 0h190v294h329v190H517v880H327V484H0V294h327z" />
    </svg>
  );
}

/** marca: cruz + barras, na mesma composição do logo */
export function LogoMark({ className, live = false }: { className?: string; live?: boolean }) {
  // no PSD: barras em (428, 1814); cruz em (911, 1238)
  return (
    <svg className={`lm${live ? " lm--live" : ""}${className ? ` ${className}` : ""}`} viewBox="428 1238 1708 1364" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="lm-cross" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f9fd8" />
          <stop offset="0.45" stopColor="#3f78b0" />
          <stop offset="1" stopColor="#1f4675" />
        </linearGradient>
      </defs>
      <g transform="translate(428 1814)">
        {LOGO_BARS.map(([x, w, y, h, c], i) => (
          <rect key={i} className="lm__bar" x={x} y={y} width={w} height={h} fill={c} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </g>
      <path transform="translate(911 1238)" fill="url(#lm-cross)" d="M327 0h190v294h329v190H517v880H327V484H0V294h327z" />
    </svg>
  );
}

/**
 * Faixa de barras sonoras (equalizador) com as cores do logo.
 * Alturas fixas (sem aleatório, para o servidor e o navegador desenharem igual).
 */
export function EqBand({ count = 48, className }: { count?: number; className?: string }) {
  const colors = ["#355e86", "#4880b7", "#5ca3ec", "#6db9fd", "#83c7fd", "#a3d9fd"];
  return (
    <span className={`eqb${className ? ` ${className}` : ""}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const h = 22 + ((i * 37 + (i % 5) * 19 + (i % 3) * 11) % 78);
        const c = colors[(i * 7 + (i % 4)) % colors.length];
        return <i key={i} style={{ height: `${h}%`, background: c, "--i": i % 9 } as React.CSSProperties} />;
      })}
    </span>
  );
}
