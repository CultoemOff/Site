import { createRequire } from "module";
import path from "path";
const require = createRequire("/home/claude/.npm-global/lib/node_modules/tsx/");
const esbuild = require("esbuild");
const root = path.resolve(import.meta.dirname, "..");
const M = "/home/claude/.npm-global/lib/node_modules";
await esbuild.build({
  entryPoints: [path.join(root, "preview/entry.tsx"), path.join(root, "preview/entry-ptz.tsx"), path.join(root, "preview/entry-redes.tsx"), path.join(root, "preview/entry-ofertas.tsx"), path.join(root, "preview/entry-formacoes.tsx"), path.join(root, "preview/entry-privacidade.tsx")],
  bundle: true,
  outdir: path.join(root, "preview/dist"),
  format: "iife",
  minify: true,
  jsx: "automatic",
  loader: { ".webp": "file", ".png": "file" },
  external: ["/textures/*", "/images/*"],
  alias: {
    "next/image": path.join(root, "preview/shims/next-image.tsx"),
    "next/link": path.join(root, "preview/shims/next-link.tsx"),
    "next/script": path.join(root, "preview/shims/next-script.tsx"),
    "next/navigation": path.join(root, "preview/shims/next-navigation.ts"),
    "tailwindcss": path.join(root, "preview/shims/empty.css"),
    "@": path.join(root, "src"),
    "react": `${M}/react`,
    "react-dom": `${M}/react-dom`,
  },
  nodePaths: [M],
  define: { "process.env.NODE_ENV": '"production"', "process.env.NEXT_PUBLIC_GA_ID": '""', "process.env.NEXT_PUBLIC_META_PIXEL_ID": '""', "process.env.NEXT_PUBLIC_SITE_URL": '""' },
  logLevel: "warning",
  plugins: [
    {
      name: "preview-youtube",
      setup(b) {
        b.onResolve({ filter: /sections\/youtube\/YouTube$/ }, () => ({ path: path.join(root, "preview/shims/youtube.tsx") }));
      },
    },
  ],
});
console.log("ok");
