import type { ImgHTMLAttributes } from "react";
// Shim de pré-visualização (fora do Next.js)
export default function Image(props: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) {
  const { priority, ...rest } = props;
  void priority;
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...rest} />;
}
