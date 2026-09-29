import type { ImgHTMLAttributes } from "react";
// Shim de pré-visualização (fora do Next.js)
export default function Image(props: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; fill?: boolean }) {
  const { priority, fill, style, ...rest } = props;
  void priority;
  const s = fill ? { position: "absolute" as const, inset: 0, width: "100%", height: "100%", ...style } : style;
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...rest} style={s} onError={(e) => ((e.currentTarget.style.visibility = "hidden"))} />;
}
