// Cria o arquivo .env do projeto para rodar no seu computador.
// Uso: node scripts/configurar-env.mjs   (chamado pelo arquivo instalar-e-testar.cmd)
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";

const ENV = ".env";
const rl = createInterface({ input: process.stdin, output: process.stdout });

function normalizar(uri) {
  let u = uri.trim().replace(/^["']|["']$/g, "");
  if (!/^mongodb(\+srv)?:\/\//.test(u)) throw new Error("O texto precisa comecar com mongodb+srv:// ou mongodb://");
  if (/<db_password>|<password>|<db_username>/.test(u))
    throw new Error("O texto ainda tem <db_password> ou <db_username>. Troque pelo usuario e pela senha de verdade.");
  // garante o nome do banco: ...mongodb.net/cultoemoff?appName=...
  const m = u.match(/^(mongodb(?:\+srv)?:\/\/[^/]+)(?:\/([^?]*))?(\?.*)?$/);
  if (!m) throw new Error("Nao consegui entender esse endereco.");
  const [, base, db, query = ""] = m;
  return `${base}/${db || "cultoemoff"}${query}`;
}

try {
  if (existsSync(ENV) && /^DATABASE_URI=mongodb/m.test(readFileSync(ENV, "utf8"))) {
    const r = (await rl.question("Ja existe um arquivo .env configurado. Quer refazer? (s/N) ")).trim().toLowerCase();
    if (r !== "s") {
      console.log("Mantendo o .env atual.");
      rl.close();
      process.exit(0);
    }
  }

  console.log("");
  console.log("Cole aqui o endereco de conexao do MongoDB Atlas (com usuario e senha) e aperte Enter.");
  console.log("Dica: clique com o botao direito do mouse nesta janela para colar.");
  console.log("");
  let uri = "";
  for (;;) {
    const resposta = await rl.question("> ");
    try {
      uri = normalizar(resposta);
      break;
    } catch (e) {
      console.log(`\n[!] ${e.message}\nTente de novo.\n`);
    }
  }

  const conteudo = `# Arquivo criado por scripts/configurar-env.mjs. NAO envie este arquivo para ninguem nem para o GitHub.

# Endereco do site neste computador
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Banco de dados (MongoDB Atlas)
DATABASE_URI=${uri}

# Chave secreta do Payload (gerada automaticamente)
PAYLOAD_SECRET=${randomBytes(32).toString("hex")}

# Imagens enviadas pelo admin: sem esta variavel ficam na pasta /media (so neste computador)
BLOB_READ_WRITE_TOKEN=

# Google Analytics 4 e Meta Pixel (opcionais)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
`;
  writeFileSync(ENV, conteudo, "utf8");
  console.log("\nPronto: arquivo .env criado.");
  rl.close();
} catch (e) {
  console.error("\n[ERRO]", e.message);
  rl.close();
  process.exit(1);
}
