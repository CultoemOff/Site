import path from "path";
import { fileURLToPath } from "url";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { BlocksFeature, FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { pt } from "@payloadcms/translations/languages/pt";
import { buildConfig } from "payload";
import sharp from "sharp";
import { YouTubeBlock } from "./blocks/YouTube";
import { Courses } from "./collections/Courses";
import { Equipment } from "./collections/Equipment";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "",
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      graphics: {
        Logo: "/components/admin/Logo",
        Icon: "/components/admin/Icon",
      },
    },
    meta: {
      titleSuffix: " — Culto em Off",
      icons: [{ rel: "icon", url: "/images/logo-culto-em-off.png" }],
    },
  },
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: "pt",
  },
  collections: [Posts, Courses, Equipment, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      BlocksFeature({ blocks: [YouTubeBlock] }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: mongooseAdapter({ url: process.env.DATABASE_URI || "" }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
