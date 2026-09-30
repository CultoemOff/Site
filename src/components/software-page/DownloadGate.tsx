"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { track } from "@/components/analytics/track";
import { COUNTRIES } from "@/config/countries";
import { LEAD_CONSENT_TEXT, formatBrPhone, validateLead, type LeadErrors, type LeadInput } from "@/lib/leads";

type Result = { ok: true } | { ok: false; errors: LeadErrors };

type Props = {
  /** identificador salvo no cadastro, ex.: "ptz-control-web" */
  source: string;
  productName: string;
  downloadUrl: string;
  /** server action que salva o cadastro */
  action: (input: LeadInput) => Promise<Result>;
};

const storageKey = (source: string) => `coe-download:${source}`;

/** Cadastro rápido (nome, celular, e-mail + consentimento) que libera o link de download. */
export default function DownloadGate({ source, productName, downloadUrl, action }: Props) {
  const uid = useId();
  const [unlocked, setUnlocked] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [form, setForm] = useState({ name: "", countryIso: "BR", phone: "", email: "", consent: false });

  // quem já se cadastrou neste navegador não precisa repetir
  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey(source)) === "1") setUnlocked(true);
    } catch {
      /* navegação privada */
    }
  }, [source]);

  const country = COUNTRIES.find((c) => c.iso === form.countryIso) ?? COUNTRIES[0];
  const isBR = country.iso === "BR";

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof LeadErrors]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const input: LeadInput = { ...form, dial: country.dial, source };
    const local = validateLead(input);
    if (Object.keys(local).length) {
      setErrors(local);
      const first = (["name", "phone", "email", "consent"] as const).find((k) => local[k]);
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
        track("generate_lead", { label: productName });
        setUnlocked(true);
      } else {
        setErrors(res.errors);
      }
    } catch {
      setErrors({ form: "Não foi possível concluir agora. Tente de novo em instantes." });
    } finally {
      setSending(false);
    }
  };

  if (unlocked) {
    return (
      <div className="gate gate--done" role="status">
        <span className="gate__check" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m6 12.5 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="gate__title">Download liberado.</p>
        <p className="gate__text">Obrigado por se cadastrar! Clique abaixo para baixar o {productName}.</p>
        {downloadUrl ? (
          <a
            className="btn btn--primary gate__download"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="download_software"
            data-track-label={productName}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M10 3v10m0 0-4-4m4 4 4-4M4 16h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Baixar o {productName}</span>
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        ) : (
          <p className="gate__text">O link de download será publicado em breve.</p>
        )}
      </div>
    );
  }

  const err = (k: keyof LeadErrors) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="gate__error">
        {errors[k]}
      </p>
    ) : null;
  const describe = (k: keyof LeadErrors) => (errors[k] ? `${uid}-${k}-err` : undefined);

  return (
    <form className="gate" onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-title`}>
      <p id={`${uid}-title`} className="gate__title">
        Cadastre-se para baixar
      </p>
      <p className="gate__text">É gratuito. Preencha os dados abaixo e o link de download aparece na hora.</p>

      <div className="gate__field">
        <label htmlFor={`${uid}-name`}>Nome</label>
        <input
          id={`${uid}-name`}
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={describe("name")}
          maxLength={100}
          required
        />
        {err("name")}
      </div>

      <div className="gate__field">
        <label htmlFor={`${uid}-phone`}>Celular</label>
        <div className="gate__phone">
          <select
            aria-label="País (código de discagem)"
            value={form.countryIso}
            onChange={(e) => {
              set("countryIso", e.target.value);
              set("phone", "");
            }}
            autoComplete="tel-country-code"
          >
            {COUNTRIES.map((c) => (
              <option key={c.iso} value={c.iso}>
                {c.flag} {c.name} (+{c.dial})
              </option>
            ))}
          </select>
          <span className="gate__dial" aria-hidden="true">
            +{country.dial}
          </span>
          <input
            id={`${uid}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={isBR ? "(11) 91234-5678" : "Número"}
            value={form.phone}
            onChange={(e) => set("phone", isBR ? formatBrPhone(e.target.value) : e.target.value.replace(/[^\d\s()-]/g, "").slice(0, 20))}
            aria-invalid={!!errors.phone}
            aria-describedby={describe("phone")}
            required
          />
        </div>
        {err("phone")}
      </div>

      <div className="gate__field">
        <label htmlFor={`${uid}-email`}>E-mail</label>
        <input
          id={`${uid}-email`}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={describe("email")}
          maxLength={254}
          required
        />
        {err("email")}
      </div>

      <div className="gate__consent">
        <input
          id={`${uid}-consent`}
          type="checkbox"
          checked={form.consent}
          onChange={(e) => set("consent", e.target.checked)}
          aria-invalid={!!errors.consent}
          aria-describedby={describe("consent")}
          required
        />
        <label htmlFor={`${uid}-consent`}>{LEAD_CONSENT_TEXT}</label>
      </div>
      {err("consent")}

      {errors.form && (
        <p className="gate__error" role="alert">
          {errors.form}
        </p>
      )}

      <button type="submit" className="btn btn--primary gate__submit" disabled={sending}>
        <span>{sending ? "Enviando..." : "Liberar download"}</span>
      </button>
      <p className="gate__fine">
        O cadastro é necessário para liberar o download. Seus dados ficam com o Culto em Off e não são vendidos a
        terceiros.
      </p>
    </form>
  );
}
