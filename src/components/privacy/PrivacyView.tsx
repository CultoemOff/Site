import ConsentLink from "@/components/analytics/ConsentLink";
import { PRIVACY_CONTACT_EMAIL, PRIVACY_UPDATED } from "@/config/privacy";
import { SITE_NAME } from "@/config/site";
import "@/components/blog/blog.css";
import "./privacy.css";

const updated = new Date(`${PRIVACY_UPDATED}T12:00:00-03:00`).toLocaleDateString("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

type Props = {
  /** endereço do Instagram (canal de contato enquanto não houver e-mail configurado) */
  instagram?: string;
  /** há Google Analytics ou pixel configurado? (mostra o atalho para mudar a escolha dos cookies) */
  hasConsent: boolean;
};

/**
 * Texto da Política de privacidade. Descreve o que o site coleta de fato:
 * cadastros, medição (Google Analytics), anúncios (pixel da Meta), origem da visita e compra pela Hotmart.
 */
export default function PrivacyView({ instagram, hasConsent }: Props) {
  // como falar com a gente sobre dados pessoais (entra no meio das frases)
  const contact = PRIVACY_CONTACT_EMAIL ? (
    <>
      escreva para <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`}>{PRIVACY_CONTACT_EMAIL}</a>
    </>
  ) : instagram ? (
    <>
      envie uma mensagem para o nosso Instagram,{" "}
      <a href={instagram} target="_blank" rel="noopener noreferrer">
        @cultoemoff
      </a>
    </>
  ) : (
    <>fale com a gente pelos nossos canais oficiais</>
  );

  return (
    <article className="post">
      <header className="post__header">
        <div className="post__header-inner">
          <h1 className="post__title">Política de privacidade</h1>
          <p className="post__excerpt">
            O que o site do {SITE_NAME} coleta, para que usa, com quem compartilha e como você pode pedir a exclusão dos seus dados.
          </p>
          <p className="post__meta">
            <span>Última atualização: {updated}</span>
          </p>
        </div>
      </header>

      <div className="post__body">
        <div className="post-prose privacy">
          <h2>1. Quem é o responsável</h2>
          <p>
            Este site é mantido pelo {SITE_NAME}, escola técnica para voluntários de igreja. Para qualquer assunto sobre os seus dados
            pessoais, {contact}.
          </p>

          <h2>2. Quais dados coletamos e para quê</h2>

          <h3>Cadastro para baixar softwares ou entrar em lista de espera</h3>
          <p>
            Quando você preenche um cadastro no site, guardamos o <strong>nome</strong>, o <strong>celular</strong> (com o país) e o{" "}
            <strong>e-mail</strong> que você informou, a página em que o cadastro foi feito e a data em que você deu a autorização.
            Usamos esses dados para liberar o download e, como está escrito na autorização que você marca, para enviar ofertas, novidades
            e conteúdos por e-mail, WhatsApp ou SMS. Você pode pedir o descadastro a qualquer momento.
          </p>

          <h3>Medição de acesso (Google Analytics)</h3>
          <p>
            Usamos o Google Analytics para saber quantas pessoas visitam o site, de onde vêm, quais páginas abrem e em quais botões clicam.
            Os cookies do Google Analytics só são gravados <strong>depois que você clica em “Aceitar”</strong> no aviso de cookies. Antes
            disso, ou se você recusar, o site envia ao Google apenas registros sem cookies, que não identificam o seu navegador.
          </p>

          <h3>Anúncios (pixel da Meta)</h3>
          <p>
            Usamos o pixel da Meta (Facebook e Instagram) para medir o resultado dos nossos anúncios e mostrá-los a pessoas com interesse
            parecido. O pixel só é carregado <strong>depois que você clica em “Aceitar”</strong> no aviso de cookies. Com ele, a Meta
            recebe as páginas que você visitou neste site, a abertura da página de uma formação, o clique no botão de compra e a conclusão
            de um cadastro. A Meta pode associar essas informações à sua conta do Facebook ou do Instagram.
          </p>

          <h3>Origem da visita</h3>
          <p>
            Quando você chega por um anúncio ou por um link de divulgação, o endereço traz códigos que indicam a campanha (por exemplo,{" "}
            <code>utm_source</code>). Guardamos esses códigos no seu navegador só durante a visita e os repassamos ao link de compra, para
            saber qual divulgação gerou a venda. Se você aceitou os cookies, o identificador do clique no anúncio da Meta também é
            repassado.
          </p>

          <h3>Compra das formações (Hotmart)</h3>
          <p>
            O pagamento e o cadastro da compra são feitos na Hotmart, que tem a sua própria política de privacidade. Não recebemos nem
            guardamos os dados do seu cartão. A Hotmart nos informa os dados do comprador necessários para liberar o acesso e dar suporte.
            Na página de pagamento, a compra é informada à Meta por meio do nosso pixel e da API de Conversões, para medir o resultado dos
            anúncios.
          </p>

          <h3>Vídeos, parceiros e ofertas</h3>
          <p>
            Os vídeos do site são do YouTube: as miniaturas vêm dos servidores do Google e o vídeo só é carregado quando você clica para
            assistir. Os links de parceiros e da página de ofertas levam a sites de terceiros (lojas e plataformas), cada um com a sua
            política. Alguns desses links são de afiliado: se você comprar por eles, podemos receber uma comissão, sem custo extra para
            você.
          </p>

          <h2>3. Cookies e o que fica guardado no seu navegador</h2>
          <ul>
            <li>
              <strong>Sua escolha sobre os cookies</strong> (aceitar ou recusar), para não perguntar de novo a cada visita.
            </li>
            <li>
              <strong>Cookies do Google Analytics e da Meta</strong>, somente se você aceitar.
            </li>
            <li>
              <strong>Marcações de funcionamento</strong>: que você já fez o cadastro de um download, que um aviso já foi mostrado nesta
              visita e os códigos de campanha descritos acima.
            </li>
          </ul>
          {hasConsent && (
            <p className="privacy__consent">
              Para mudar a sua escolha agora: <ConsentLink />
            </p>
          )}

          <h2>4. Com quem compartilhamos</h2>
          <p>Não vendemos os seus dados. Eles passam pelas empresas que prestam serviço para o site funcionar:</p>
          <ul>
            <li>
              <strong>Google</strong> (Google Analytics e YouTube);
            </li>
            <li>
              <strong>Meta</strong> (pixel do Facebook e do Instagram);
            </li>
            <li>
              <strong>Hotmart</strong> (pagamento e entrega das formações);
            </li>
            <li>
              <strong>Vercel</strong> (hospedagem do site) e <strong>MongoDB Atlas</strong> (banco de dados onde ficam os cadastros).
            </li>
          </ul>
          <p>Essas empresas podem processar dados em servidores fora do Brasil.</p>

          <h2>5. Por quanto tempo guardamos</h2>
          <p>
            Os cadastros ficam guardados até você pedir o descadastro ou a exclusão. Os dados de medição e de anúncios ficam com o Google e
            a Meta pelo prazo definido nessas ferramentas.
          </p>

          <h2>6. Seus direitos</h2>
          <p>
            Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir a confirmação de que temos dados seus, o acesso a eles, a correção,
            a exclusão e a retirada da sua autorização. Para isso, {contact}. Você também pode mudar a sua escolha sobre os cookies
            a qualquer momento, pelo link “Preferências de cookies” no rodapé do site.
          </p>

          <h2>7. Mudanças nesta política</h2>
          <p>
            Quando o site passar a coletar ou usar dados de outra forma, esta página será atualizada, com a nova data no topo.
          </p>
        </div>
      </div>
    </article>
  );
}
