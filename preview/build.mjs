import { createRequire } from "module";
import path from "path";
const require = createRequire("/home/claude/.npm-global/lib/node_modules/tsx/");
const esbuild = require("esbuild");
const root = path.resolve(import.meta.dirname, "..");
const M = "/home/claude/.npm-global/lib/node_modules";
await esbuild.build({
  entryPoints: [path.join(root, "preview/entry.tsx")],
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
    "tailwindcss": path.join(root, "preview/shims/empty.css"),
    "@": path.join(root, "src"),
    "react": `${M}/react`,
    "react-dom": `${M}/react-dom`,
  },
  nodePaths: [M],
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});
console.log("ok");
