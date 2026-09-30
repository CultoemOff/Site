import type { SeedPost } from "../lexical";

const SPRESENTER = "https://spresenter.com/pt";
const RV_DOCS = "https://learn.renewedvision.com/propresenter/working-with-files";
// TODO: conferir o link da playlist (o ID parece incompleto).
const PLAYLIST = "https://www.youtube.com/playlist?list=PLTPhW6QIQ0aA";

/*
 * Imagens sugeridas (adicionar no admin quando houver as capturas):
 * 1. Página de download do SPresenter com o botão de download destacado.
 * 2. ProPresenter com várias músicas selecionadas na biblioteca.
 * 3. Janela de exportação do ProPresenter com o formato usado no vídeo destacado.
 * 4. Janela de importação do SPresenter, destacando onde selecionar os arquivos.
 */
export const proPresenterParaSPresenter: SeedPost = {
  slug: "como-transferir-musicas-do-propresenter-para-o-spresenter",
  title: "Como transferir músicas do ProPresenter para o SPresenter",
  excerpt:
    "Migrando do ProPresenter para o SPresenter? Veja como exportar as músicas e importá-las sem cadastrar todas as letras de novo.",
  publishedAt: "2026-09-29T15:00:00.000Z",
  tags: ["SPresenter", "Projeção", "Tutorial"],
  cover: {
    localPath: "/blog/propresenter-para-spresenter.png",
    alt: "Como transferir músicas do ProPresenter para o SPresenter",
  },
  blocks: [
    {
      p: "Se você está migrando do ProPresenter para o SPresenter, não precisa cadastrar novamente todas as letras dos louvores manualmente.",
    },
    {
      p: "Neste tutorial, vamos exportar as músicas do ProPresenter e importá-las para o SPresenter, facilitando a migração da biblioteca de louvores.",
    },
    {
      p: "**Você vai precisar:** ProPresenter instalado com acesso à biblioteca de músicas e SPresenter instalado no computador.",
    },

    { h2: "1. Baixe e instale o SPresenter" },
    { p: `Caso ainda não tenha o programa instalado, acesse o site oficial: [Baixar o SPresenter](${SPRESENTER})` },
    {
      quote:
        "Quem acompanha o Culto em Off também pode utilizar o cupom `CULTOEMOFF5`, que oferece **5% de desconto no plano Pro**.",
    },

    { h2: "2. Selecione as músicas no ProPresenter" },
    { p: "Abra o ProPresenter e acesse a biblioteca onde estão armazenados seus louvores." },
    {
      p: "Selecione as apresentações/músicas que deseja transferir. Se você possui uma biblioteca grande, pode selecionar vários itens para evitar repetir o processo música por música.",
    },
    {
      p: `O ProPresenter permite exportar apresentações individualmente ou em grupo ([documentação da Renewed Vision](${RV_DOCS})).`,
    },

    { h2: "3. Exporte as músicas" },
    { p: "Com as músicas selecionadas, acesse as opções de exportação do ProPresenter. O caminho fica em: **File → Export**." },
    {
      p: `O ProPresenter oferece diferentes formatos de exportação. A própria documentação diferencia, por exemplo, a exportação de apresentação, bundle, texto e playlist ([documentação da Renewed Vision](${RV_DOCS})).`,
    },
    { p: "Salve os arquivos em uma pasta fácil de localizar, como `Documentos › Export ProPresenter`." },
    { h3: "Atenção aos arquivos de mídia" },
    {
      p: `A exportação de uma apresentação não necessariamente transporta todos os arquivos de mídia associados. O ProPresenter diferencia uma apresentação normal de um Presentation Bundle, que pode reunir arquivos da biblioteca e mídias em um pacote ([documentação da Renewed Vision](${RV_DOCS})).`,
    },
    {
      p: "Para uma migração de letras de músicas, portanto, não presuma que fundos, vídeos e demais elementos visuais serão transferidos junto com a letra.",
    },

    { h2: "4. Importe as músicas no SPresenter" },
    { p: "Agora abra o SPresenter." },
    { p: "Utilize a ferramenta de importação para selecionar os arquivos que acabamos de exportar do ProPresenter." },
    { p: "Escolha a pasta onde os arquivos foram salvos, selecione as músicas desejadas e execute a importação." },

    { h2: "5. Confira as músicas importadas" },
    {
      p: "Depois da importação, abra algumas músicas no SPresenter antes de excluir ou abandonar sua biblioteca antiga. Confira principalmente:",
    },
    {
      ul: [
        "título da música;",
        "letra;",
        "divisão dos versos e slides;",
        "ordem das partes;",
        "caracteres especiais e acentuação.",
      ],
    },
    {
      p: "Também vale verificar se a organização que você utilizava no ProPresenter corresponde à forma como deseja trabalhar no SPresenter.",
    },
    {
      p: "**Não apague sua biblioteca original do ProPresenter até ter certeza de que tudo o que precisa foi migrado corretamente.**",
    },

    { h2: "Pronto!" },
    {
      p: "Com isso, você evita reconstruir manualmente toda a sua biblioteca de louvores ao migrar do ProPresenter para o SPresenter.",
    },
    {
      p: "Depois da migração, você pode começar a organizar as músicas e preparar o ambiente do SPresenter de acordo com a rotina da sua igreja.",
    },

    { h2: "Baixe o SPresenter" },
    { p: `[Acessar o site oficial do SPresenter](${SPRESENTER})` },
    { p: "Cupom Culto em Off: `CULTOEMOFF5` · Desconto: **5% no plano Pro**" },

    { h2: "Mais tutoriais" },
    {
      p: `Tenho uma playlist dedicada ao SPresenter no canal Culto em Off: [Assistir à playlist de tutoriais do SPresenter](${PLAYLIST})`,
    },
  ],
};
