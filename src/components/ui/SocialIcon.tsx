/** Ícones simples das redes sociais (traço, herdam a cor do texto). */
export default function SocialIcon({ name }: { name: "youtube" | "instagram" | "tiktok" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      {name === "youtube" && (
        <g {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" />
        </g>
      )}
      {name === "instagram" && (
        <g {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </g>
      )}
      {name === "tiktok" && (
        <g {...common}>
          <path d="M14 3.5v11.2a3.8 3.8 0 11-3.8-3.8" />
          <path d="M14 3.5c.4 2.6 2.2 4.4 5 4.6" />
        </g>
      )}
    </svg>
  );
}
