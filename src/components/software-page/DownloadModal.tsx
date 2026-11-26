"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { setMetaUserData, track } from "@/components/analytics/track";
import "@/components/ui/button.css";
import { COUNTRIES } from "@/config/countries";
import { BR_STATES, DOWNLOAD_NOTICE_TEXT, validateDownloadLead, type DownloadLeadErrors, type DownloadLeadInput } from "@/lib/leads";

type Result = { ok: true } | { ok: false; errors: DownloadLeadErrors };

type Props = {
  /** identificador salvo no cadastro, ex.: "ptz-control-web" */
  source: string;
  productName: string;
  /** instalador liberado depois do cadastro */
  downloadUrl: string;
  /** endereço do painel para colar no OBS */
  panelUrl: string;
  /** vídeo tutorial (vazio = botão "em breve") */
  tutorialUrl?: string;
  /** server action que salva o cadastro */
  action: (input: DownloadLeadInput) => Promise<Result>;
  /** texto do botão que abre o popup */
  label?: string;
  /** onde o botão está (Analytics) */
  location: string;
  variant?: "primary" | "ghost";
  /** imagem da coluna lateral do popup (no computador) */
  sideImage?: { src: string; alt: string; width: number; height: number };
  /** sistema do instalador: muda o arquivo, o botão e o passo a passo */
  platform?: "windows" | "mac";
  /** passo a passo próprio de outro software (recebe o endereço do painel já com o botão Copiar); sem ele, o do PTZ Control Web */
  /**
   * passo a passo próprio de outro software (sem ele, o do PTZ Control Web). São trechos prontos (não funções),
   * porque a página é montada no servidor: instalação, passo extra (opcional) e o texto antes do endereço do painel.
   */
  steps?: { install: ReactNode; extra?: ReactNode; panel: ReactNode };
  /** linha de requisitos do macOS no popup (padrão: a do PTZ Control Web; vazio = não mostra) */
  macRequirements?: string;
};

const FILE = { windows: "PTZ-Control-Web-Setup.exe", mac: "PTZ-Control-Web-macOS.pkg" } as const;
const OS_NAME = { windows: "Windows", mac: "macOS" } as const;

/** ícones genéricos (sem logotipo de marca): monitor para Windows, notebook para macOS */
function OsIcon({ platform }: { platform: "windows" | "mac" }) {
  return platform === "mac" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 6h14v9H5zM3 18h18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 5h16v11H4zM9 20h6M12 16v4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const storageKey = (source: string) => `coe-download:${source}`;

/**
 * Botão "Baixe aqui" que abre um popup com o cadastro (nome, e-mail e igreja opcional).
 * Depois do cadastro, o mesmo popup libera o download e mostra os passos de instalação.
 * Quem já se cadastrou neste navegador vai direto para o download.
 */
export default function DownloadModal({ source, productName, downloadUrl, panelUrl, tutorialUrl = "", action, label, location, variant = "primary", sideImage, platform = "windows", steps, macRequirements = "macOS 13.5 ou mais novo · Mac com Apple Silicon (M1, M2, M3, M4…) ou Intel" }: Props) {
  const os = OS_NAME[platform];
  const buttonLabel = label ?? `Baixar para ${os}`;
  const uid = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<DownloadLeadErrors>({});
  // Brasil e São Paulo já vêm escolhidos (primeiros das listas)
  const [form, setForm] = useState({ name: "", email: "", church: "", country: "BR", state: "SP" });

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey(source)) === "1") setUnlocked(true);
    } catch {
      /* navegação privada */
    }
    // cadastro feito em outro botão da página (ex.: Windows) libera também este (ex.: macOS)
    const onUnlock = (e: Event) => (e as CustomEvent<string>).detail === source && setUnlocked(true);
    window.addEventListener("coe-download-unlocked", onUnlock);
    return () => window.removeEventListener("coe-download-unlocked", onUnlock);
  }, [source]);

  // o clique no botão já vira evento pelo data-track ("click_download_button")
  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  const set = <K extends keyof typeof form>(key: K, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const input: DownloadLeadInput = { ...form, source };
    const local = validateDownloadLead(input);
    if (Object.keys(local).length) {
      setErrors(local);
      const first = (["name", "email", "church", "country", "state"] as const).find((k) => local[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setSending(true);
    setErrors({});
    try {
      const res = await action(input);
      if (res.ok) {
        try {
          localStorage.setItem(storageKey(source), "1");
        } catch {
          /* ok */
        }
        setMetaUserData({ email: form.email, name: form.name });
        track("generate_lead", { label: `${productName} (${os})`, location });
        setUnlocked(true);
        window.dispatchEvent(new CustomEvent("coe-download-unlocked", { detail: source }));
      } else {
        setErrors(res.errors);
      }
    } catch {
      setErrors({ form: "Não foi possível concluir agora. Tente de novo em instantes." });
    } finally {
      setSending(false);
    }
  };

  const copyPanel = async () => {
    try {
      await navigator.clipboard.writeText(panelUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* o endereço continua visível para copiar à mão */
    }
  };

  const err = (k: keyof DownloadLeadErrors) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="gate__error">
        {errors[k]}
      </p>
    ) : null;
  const describe = (k: keyof DownloadLeadErrors) => (errors[k] ? `${uid}-${k}-err` : undefined);

  return (
    <>
      <button type="button" className={`btn btn--${variant} dl-open`} onClick={open} data-track="click_download_button" data-track-label={`${productName} (${os})`} data-track-location={location}>
        <OsIcon platform={platform} />
        <span>{buttonLabel}</span>
      </button>

      <dialog ref={dialog} className="dl-modal" aria-labelledby={`${uid}-title`} onClick={(e) => e.target === e.currentTarget && close()}>
        <div className={`dl-modal__box${sideImage ? " dl-modal__box--side" : ""}`}>
          {sideImage && (
            <div className="dl-modal__side" aria-hidden="true">
              <Image src={sideImage.src} alt="" width={sideImage.width} height={sideImage.height} sizes="400px" />
            </div>
          )}
          <div className="dl-modal__content">
          <button type="button" className="dl-modal__close" onClick={close} aria-label="Fechar">
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {!unlocked ? (
            <form className="gate dl-form" onSubmit={onSubmit} noValidate>
              <p className="dl-modal__kicker">Download gratuito</p>
              <h2 id={`${uid}-title`} className="gate__title">
                Cadastre-se para baixar o {productName} para {os}
              </h2>
              <p className="gate__text">Leva 10 segundos. O download é liberado na hora.</p>

              <div className="gate__field">
                <label htmlFor={`${uid}-name`}>Nome</label>
                <input id={`${uid}-name`} type="text" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={describe("name")} maxLength={100} required />
                {err("name")}
              </div>

              <div className="gate__field">
                <label htmlFor={`${uid}-email`}>E-mail</label>
                <input id={`${uid}-email`} type="email" autoComplete="email" inputMode="email" value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={describe("email")} maxLength={254} required />
                {err("email")}
              </div>

              <div className="gate__field">
                <label htmlFor={`${uid}-church`}>
                  Igreja <span className="dl-optional">(opcional)</span>
                </label>
                <input id={`${uid}-church`} type="text" autoComplete="organization" value={form.church} onChange={(e) => set("church", e.target.value)} aria-invalid={!!errors.church} aria-describedby={describe("church")} maxLength={120} />
                {err("church")}
              </div>

              <div className="dl-row">
                <div className="gate__field">
                  <label htmlFor={`${uid}-country`}>País</label>
                  <select
                    id={`${uid}-country`}
                    autoComplete="country"
                    value={form.country}
                    onChange={(e) => {
                      const c = e.target.value;
                      setForm((f) => ({ ...f, country: c, state: c === "BR" ? f.state || "SP" : "" }));
                    }}
                    aria-invalid={!!errors.country}
                    aria-describedby={describe("country")}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.iso} value={c.iso}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  {err("country")}
                </div>
                {form.country === "BR" && (
                  <div className="gate__field">
                    <label htmlFor={`${uid}-state`}>UF</label>
                    <select id={`${uid}-state`} autoComplete="address-level1" value={form.state} onChange={(e) => set("state", e.target.value)} aria-invalid={!!errors.state} aria-describedby={describe("state")}>
                      {BR_STATES.map((s) => (
                        <option key={s.uf} value={s.uf}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {err("state")}
                  </div>
                )}
              </div>

              {errors.form && (
                <p className="gate__error" role="alert">
                  {errors.form}
                </p>
              )}

              <button type="submit" className="btn btn--primary gate__submit dl-submit" disabled={sending}>
                <span>{sending ? "Liberando..." : "Liberar download"}</span>
              </button>
              <p className="gate__fine">
                {DOWNLOAD_NOTICE_TEXT} Veja a{" "}
                <Link href="/privacidade" target="_blank" rel="noopener" prefetch={false}>
                  Política de privacidade
                </Link>
                .
              </p>
            </form>
          ) : (
            <div className="gate gate--done dl-done" role="status">
              <span className="gate__check" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="m6 12.5 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2 id={`${uid}-title`} className="gate__title">
                Download liberado para {os}!
              </h2>
              <a className="btn btn--primary dl-get" href={downloadUrl} data-track="download_software" data-track-label={`${productName} (${os})`} data-track-location={location}>
                <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                  <path d="M10 3v10m0 0-4-4m4 4 4-4M4 16h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Baixar para {os}</span>
              </a>
              {platform === "mac" && macRequirements && <p className="dl-req">{macRequirements}</p>}

              {steps ? (
                <ol className="dl-steps">
                  <li>{steps.install}</li>
                  {steps.extra && <li>{steps.extra}</li>}
                  <li>
                    {steps.panel}
                    <span className="dl-url">
                      <code>{panelUrl}</code>
                      <button type="button" onClick={copyPanel} className="dl-copy">
                        {copied ? "Copiado!" : "Copiar"}
                      </button>
                    </span>
                  </li>
                </ol>
              ) : (
              <ol className="dl-steps">
                {platform === "mac" ? (
                  <>
                    <li>
                      <b>Dê dois cliques no arquivo baixado</b> (<code>{FILE.mac}</code>). Na primeira vez, o macOS avisa que não conseguiu verificar o arquivo: clique em <b>Concluído</b> (não em Mover para o Lixo).
                    </li>
                    <li>
                      Abra <b>Ajustes do Sistema › Privacidade e Segurança</b>, role até o fim e clique em <b>Abrir Mesmo Assim</b> ao lado do nome do instalador. Confirme com a sua senha ou o Touch ID.
                    </li>
                    <li>
                      <b>Siga as telas do instalador</b> (ele pede a senha de administrador do Mac). O app fica na pasta Aplicativos, abre o painel no navegador e passa a iniciar junto com o Mac.
                    </li>
                  </>
                ) : (
                  <li>
                    <b>Abra o arquivo baixado</b> (<code>{FILE.windows}</code>) e instale o programa. Se o Windows mostrar o SmartScreen, clique em <b>Mais informações</b> › <b>Executar assim mesmo</b>. A pasta de plugins do OBS sugerida serve para a maioria das instalações.
                  </li>
                )}
                <li>
                  <b>No OBS Studio 33 ou mais novo</b>, abra <b>Painéis › Painéis personalizáveis com URL…</b>, dê o nome <code>PTZ Control Web</code> e cole este endereço:
                  <span className="dl-url">
                    <code>{panelUrl}</code>
                    <button type="button" onClick={copyPanel} className="dl-copy">
                      {copied ? "Copiado!" : "Copiar"}
                    </button>
                  </span>
                </li>
                <li>
                  {platform === "mac" ? (
                    <>
                      <b>Reinicie o OBS uma vez</b> para carregar as teclas de atalho do PTZ Control Web. Pronto: o painel aparece dentro do OBS.
                    </>
                  ) : (
                    <>
                      <b>Pronto:</b> o programa inicia com o Windows e o painel aparece dentro do OBS.
                    </>
                  )}
                </li>
              </ol>
              )}
              {platform === "mac" && (
                <p className="dl-note">
                  <b>Por que aparece o aviso?</b> O macOS mostra esse aviso para instaladores sem a assinatura paga da Apple (Developer ID). Não significa que o arquivo tenha problema: ele é publicado pelo Culto em Off no GitHub, e o aviso aparece só na primeira instalação.
                </p>
              )}

              {tutorialUrl ? (
                <a className="btn btn--ghost dl-tutorial" href={tutorialUrl} target="_blank" rel="noopener noreferrer" data-track="select_content" data-track-label={`Tutorial ${productName}`} data-track-location={location}>
                  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path d="M7 5.5v9l7-4.5z" fill="currentColor" />
                  </svg>
                  <span>Assistir ao vídeo tutorial</span>
                </a>
              ) : (
                <span className="btn btn--ghost dl-tutorial is-soon" aria-disabled="true">
                  Vídeo tutorial em breve
                </span>
              )}
            </div>
          )}
          </div>
        </div>
      </dialog>
    </>
  );
}
