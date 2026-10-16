"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { fullDay, labelDay } from "@/lib/campanhas/dates";
import { brl } from "@/lib/campanhas/format";
import type { CampaignSettings } from "@/lib/campanhas/types";

/* ---------------- moldura (janela/gaveta) ---------------- */

export function Overlay({ title, kicker, onClose, children, footer, side }: { title: string; kicker: string; onClose: () => void; children: ReactNode; footer?: ReactNode; side?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    ref.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className={`cmp-overlay${side ? " cmp-overlay--side" : ""}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cmp-dialog" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <header className="cmp-dialog__head">
          <div>
            <p className="cmp-kicker">{kicker}</p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="cmp-x" aria-label="Fechar" onClick={onClose}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </button>
        </header>
        <div className="cmp-dialog__body">{children}</div>
        {footer && <footer className="cmp-dialog__foot">{footer}</footer>}
      </div>
    </div>
  );
}

/* ---------------- importação ---------------- */

type Preview = {
  ok: boolean;
  kind?: "meta" | "hotmart";
  rows?: number;
  created?: number;
  updated?: number;
  ignored?: number;
  errors?: string[];
  warnings?: string[];
  period?: { from: string; to: string };
  spend?: number;
  approved?: number;
  tests?: number;
  statuses?: { status: string; count: number }[];
  adsets?: { adset: string; campaign: string }[];
  missingCampaign?: string[];
  knownCampaigns?: string[];
  ads?: string[];
};

type Item = { id: string; name: string; text: string; state: "reading" | "ready" | "error" | "saving" | "done"; preview?: Preview; map: Record<string, string>; message?: string };

const SUGGESTED = ["Nova campanha de Vendas", "Vendas | Teste criativos | Redes"];

async function post(path: string, data: unknown): Promise<Preview> {
  const res = await fetch(`/api/campaign-imports/${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    return (await res.json()) as Preview;
  } catch {
    return { ok: false, errors: [`Erro ${res.status} no servidor.`] };
  }
}

export function ImportDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [drag, setDrag] = useState(false);
  const [saving, setSaving] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);
  const update = (id: string, patch: Partial<Item>) => setItems((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const add = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      const id = `${file.name}-${file.size}-${file.lastModified}`;
      if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
        setItems((l) => [...l, { id, name: file.name, text: "", state: "error", map: {}, message: "Envie o arquivo .csv (a Hotmart e o Meta exportam em CSV)." }]);
        continue;
      }
      if (file.size > 8_000_000) {
        setItems((l) => [...l, { id, name: file.name, text: "", state: "error", map: {}, message: "Arquivo maior que 8 MB." }]);
        continue;
      }
      setItems((l) => [...l.filter((x) => x.id !== id), { id, name: file.name, text: "", state: "reading", map: {} }]);
      const text = await file.text();
      const p = await post("preview", { text, fileName: file.name });
      const map: Record<string, string> = {};
      for (const a of p.adsets ?? []) map[a.adset] = a.campaign;
      update(id, { text, preview: p, map, state: p.ok ? "ready" : "error", message: p.errors?.join(" ") });
    }
  };

  const ready = items.filter((x) => x.state === "ready");
  const missing = (x: Item) => (x.preview?.missingCampaign ?? []).filter((a) => !x.map[a]?.trim());
  const canSave = ready.length > 0 && ready.every((x) => missing(x).length === 0) && !saving;
  const done = items.length > 0 && items.every((x) => x.state === "done" || x.state === "error") && items.some((x) => x.state === "done");

  const save = async () => {
    setSaving(true);
    // Meta primeiro (a Hotmart não depende dele, mas assim o histórico fica em ordem)
    const order = [...ready].sort((a, b) => (a.preview?.kind === "meta" ? -1 : 1) - (b.preview?.kind === "meta" ? -1 : 1));
    for (const x of order) {
      update(x.id, { state: "saving" });
      const campaignMap = Object.entries(x.map)
        .filter(([, c]) => c.trim())
        .map(([adset, campaign]) => ({ adset, campaign: campaign.trim() }));
      const r = await post("commit", { text: x.text, fileName: x.name, campaignMap });
      update(x.id, r.ok ? { state: "done", preview: r, text: "" } : { state: "error", message: r.errors?.join(" ") ?? "Falhou." });
    }
    setSaving(false);
  };

  const campaigns = [...new Set([...SUGGESTED, ...items.flatMap((x) => x.preview?.knownCampaigns ?? [])])];

  return (
    <Overlay
      title="Importar CSVs"
      kicker="Meta Ads · Hotmart"
      onClose={done ? onDone : onClose}
      footer={
        done ? (
          <button type="button" className="cmp-btn cmp-btn--primary" onClick={onDone}>
            Concluir e atualizar o painel
          </button>
        ) : (
          <>
            <span className="cmp-muted">Reenviar o mesmo arquivo atualiza as linhas, sem duplicar.</span>
            <button type="button" className="cmp-btn cmp-btn--primary" disabled={!canSave} onClick={save}>
              {saving ? "Gravando…" : ready.length > 1 ? `Importar ${ready.length} arquivos` : "Importar"}
            </button>
          </>
        )
      }
    >
      <div
        className={`cmp-drop${drag ? " is-drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) void add(e.dataTransfer.files);
        }}
        onClick={() => input.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
      >
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 30V8m0 0-8 8m8-8 8 8M8 30v6a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-6" />
        </svg>
        <strong>Arraste os dois CSVs aqui</strong>
        <span>ou clique para escolher · o painel reconhece sozinho qual é qual</span>
        <input
          ref={input}
          type="file"
          accept=".csv,text/csv"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) void add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      <ul className="cmp-howto">
        <li>
          <b>Meta</b> · Gerenciador de Anúncios → nível <b>Anúncios</b> → Detalhamento <b>Por tempo → Dia</b> → período Máximo → Exportar CSV.
        </li>
        <li>
          <b>Hotmart</b> · Vendas → Histórico de vendas → Exportar → <b>CSV</b>.
        </li>
      </ul>

      {items.map((x) => {
        const p = x.preview;
        return (
          <article key={x.id} className={`cmp-file cmp-file--${x.state}`}>
            <header>
              <span className={`cmp-file__kind cmp-file__kind--${p?.kind ?? "x"}`}>{p?.kind === "meta" ? "Meta" : p?.kind === "hotmart" ? "Hotmart" : "CSV"}</span>
              <strong title={x.name}>{x.name}</strong>
              <span className="cmp-file__state">
                {x.state === "reading" && "lendo…"}
                {x.state === "ready" && "pronto para importar"}
                {x.state === "saving" && "gravando…"}
                {x.state === "done" && "✓ importado"}
                {x.state === "error" && "não dá para importar"}
              </span>
            </header>
            {x.message && x.state === "error" && <p className="cmp-file__error">{x.message}</p>}
            {p?.ok && (
              <>
                <dl className="cmp-file__nums">
                  <div>
                    <dt>Novas</dt>
                    <dd>{p.created}</dd>
                  </div>
                  <div>
                    <dt>Atualizadas</dt>
                    <dd>{p.updated}</dd>
                  </div>
                  <div>
                    <dt>Ignoradas</dt>
                    <dd>{p.ignored}</dd>
                  </div>
                  <div>
                    <dt>Período</dt>
                    <dd>
                      {fullDay(p.period?.from ?? "").slice(0, 5)}–{fullDay(p.period?.to ?? "").slice(0, 5)}
                    </dd>
                  </div>
                  {p.kind === "meta" && (
                    <div>
                      <dt>Investido</dt>
                      <dd>{brl(p.spend ?? 0)}</dd>
                    </div>
                  )}
                  {p.kind === "hotmart" && (
                    <div>
                      <dt>Aprovadas</dt>
                      <dd>
                        {p.approved}
                        {p.tests ? <small> +{p.tests} teste</small> : null}
                      </dd>
                    </div>
                  )}
                </dl>
                {p.kind === "hotmart" && p.statuses && (
                  <p className="cmp-file__status">
                    {p.statuses.map((s) => (
                      <span key={s.status}>
                        {s.status}: <b>{s.count}</b>
                      </span>
                    ))}
                  </p>
                )}
                {p.warnings?.map((w) => (
                  <p key={w} className="cmp-file__warn">
                    {w}
                  </p>
                ))}
                {p.kind === "meta" && (p.adsets?.length ?? 0) > 0 && (p.missingCampaign?.length || x.state === "ready") ? (
                  <div className="cmp-map">
                    <p className="cmp-map__title">Conjunto → campanha</p>
                    {p.adsets!.map((a) => (
                      <label key={a.adset} className="cmp-map__row">
                        <span>{a.adset}</span>
                        <input
                          list={`cmp-camps-${x.id}`}
                          value={x.map[a.adset] ?? ""}
                          placeholder="Nome da campanha"
                          disabled={x.state !== "ready"}
                          onChange={(e) => update(x.id, { map: { ...x.map, [a.adset]: e.target.value } })}
                        />
                      </label>
                    ))}
                    <datalist id={`cmp-camps-${x.id}`}>
                      {campaigns.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    {missing(x).length > 0 && <p className="cmp-file__warn">Falta a campanha de {missing(x).length} conjunto(s).</p>}
                  </div>
                ) : null}
              </>
            )}
          </article>
        );
      })}
    </Overlay>
  );
}

/* ---------------- premissas ---------------- */

type Field = { key: keyof CampaignSettings; label: string; unit?: string; step?: string; hint?: string };

const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "Dinheiro",
    fields: [
      { key: "netPerSale", label: "Líquido por venda", unit: "R$", step: "0.01" },
      { key: "cpaMax", label: "CPA máximo sem prejuízo", unit: "R$", step: "0.01" },
      { key: "cpaTarget", label: "CPA alvo para escalar", unit: "R$", step: "0.01" },
      { key: "pauseSpend", label: "Gasto sem venda para pausar", unit: "R$", step: "1" },
      { key: "waitSpend", label: "Gasto mínimo para opinar (3 dias)", unit: "R$", step: "1", hint: "Abaixo disso o sinal é AGUARDAR" },
    ],
  },
  {
    title: "Escala",
    fields: [
      { key: "minSales3d", label: "Vendas mínimas em 3 dias", step: "1" },
      { key: "scaleMin", label: "Aumento de verba (mín.)", unit: "%", step: "1" },
      { key: "scaleMax", label: "Aumento de verba (máx.)", unit: "%", step: "1" },
    ],
  },
  {
    title: "Criativos",
    fields: [
      { key: "ctrMin", label: "CTR (link) mínimo", unit: "%", step: "0.1" },
      { key: "ctrMinImpressions", label: "…a partir de quantas impressões", step: "100" },
      { key: "hookMin", label: "Taxa de gancho mínima", unit: "%", step: "1" },
      { key: "freqAlert", label: "Frequência de alerta (7 dias)", step: "0.1" },
    ],
  },
];

export function SettingsPanel({ settings, onClose, onSaved }: { settings: CampaignSettings; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const f: Record<string, string> = {};
    for (const g of GROUPS) for (const k of g.fields) f[k.key] = String(settings[k.key]);
    f.launchDate = settings.launchDate;
    f.testEmails = settings.testEmails.join("\n");
    f.youtubeCoupons = settings.youtubeCoupons.join(", ");
    f.adOrigins = settings.adOrigins.join(", ");
    return f;
  });
  const [map, setMap] = useState(settings.campaignMap);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setState("saving");
    const res = await fetch("/api/campaign-imports/settings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, campaignMap: map }),
    });
    if (res.ok) onSaved();
    else setState("error");
  };

  return (
    <Overlay
      side
      title="Premissas e regras"
      kicker="Ajustes do painel"
      onClose={onClose}
      footer={
        <>
          {state === "error" && <span className="cmp-file__error">Não salvou. Tente de novo.</span>}
          <button type="button" className="cmp-btn cmp-btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="cmp-btn cmp-btn--primary" onClick={save} disabled={state === "saving"}>
            {state === "saving" ? "Salvando…" : "Salvar"}
          </button>
        </>
      }
    >
      {GROUPS.map((g) => (
        <fieldset key={g.title} className="cmp-form">
          <legend>{g.title}</legend>
          {g.fields.map((f) => (
            <label key={f.key} className="cmp-field">
              <span>
                {f.label}
                {f.hint && <small>{f.hint}</small>}
              </span>
              <span className="cmp-field__input">
                {f.unit === "R$" && <i>R$</i>}
                <input type="number" inputMode="decimal" step={f.step} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
                {f.unit === "%" && <i>%</i>}
              </span>
            </label>
          ))}
        </fieldset>
      ))}
      <fieldset className="cmp-form">
        <legend>Datas e listas</legend>
        <label className="cmp-field">
          <span>
            Data do lançamento<small>Usada no atalho “Desde o lançamento”</small>
          </span>
          <span className="cmp-field__input">
            <input type="date" value={form.launchDate} onChange={(e) => set("launchDate", e.target.value)} />
          </span>
        </label>
        <label className="cmp-field cmp-field--block">
          <span>
            Compras de teste (e-mails)<small>Uma por linha: ficam fora de todos os totais</small>
          </span>
          <textarea rows={3} value={form.testEmails} onChange={(e) => set("testEmails", e.target.value)} />
        </label>
        <label className="cmp-field cmp-field--block">
          <span>
            Cupons do YouTube<small>Marcados como “influência YouTube”, mesmo vindo de anúncio</small>
          </span>
          <input type="text" value={form.youtubeCoupons} onChange={(e) => set("youtubeCoupons", e.target.value)} />
        </label>
        <label className="cmp-field cmp-field--block">
          <span>
            Origens que contam como anúncio Meta<small>Primeiro campo do sck (ex.: fb, ig, an, msg)</small>
          </span>
          <input type="text" value={form.adOrigins} onChange={(e) => set("adOrigins", e.target.value)} />
        </label>
      </fieldset>
      <fieldset className="cmp-form">
        <legend>Conjunto → campanha</legend>
        <p className="cmp-muted">Usado quando o CSV do Meta vem sem a coluna “Nome da campanha”.</p>
        {map.map((m, i) => (
          <div key={i} className="cmp-map__row cmp-map__row--edit">
            <input value={m.adset} placeholder="Conjunto" onChange={(e) => setMap((l) => l.map((x, j) => (j === i ? { ...x, adset: e.target.value } : x)))} />
            <input value={m.campaign} placeholder="Campanha" onChange={(e) => setMap((l) => l.map((x, j) => (j === i ? { ...x, campaign: e.target.value } : x)))} />
            <button type="button" className="cmp-x cmp-x--sm" aria-label="Remover" onClick={() => setMap((l) => l.filter((_, j) => j !== i))}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
        ))}
        <button type="button" className="cmp-btn cmp-btn--ghost cmp-btn--sm" onClick={() => setMap((l) => [...l, { adset: "", campaign: "" }])}>
          + Adicionar
        </button>
      </fieldset>
    </Overlay>
  );
}

/* ---------------- anotação do dia ---------------- */

export function NoteDialog({ day, initial, onClose, onSaved }: { day: string; initial: string; onClose: () => void; onSaved: (day: string, text: string) => void }) {
  const [text, setText] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const save = async (value: string) => {
    setState("saving");
    try {
      const res = await fetch("/api/campaign-imports/note", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, text: value }),
      });
      if (!res.ok) throw new Error();
      onSaved(day, value.trim());
    } catch {
      setState("error");
    }
  };
  return (
    <Overlay
      title={`Anotação · ${labelDay(day)}`}
      kicker="Diário da campanha"
      onClose={onClose}
      footer={
        <>
          {state === "error" && <span className="cmp-file__error">Não salvou. Tente de novo.</span>}
          {initial && (
            <button type="button" className="cmp-btn cmp-btn--ghost cmp-btn--danger" onClick={() => save("")} disabled={state === "saving"}>
              Apagar
            </button>
          )}
          <button type="button" className="cmp-btn cmp-btn--primary" onClick={() => save(text)} disabled={state === "saving" || text.trim() === initial.trim()}>
            {state === "saving" ? "Salvando…" : "Salvar"}
          </button>
        </>
      }
    >
      <label className="cmp-note-field">
        <span className="cmp-muted">O que aconteceu neste dia? Ex.: troquei o criativo, subi a verba 20%, live no YouTube, mudei a página.</span>
        <textarea
          rows={6}
          maxLength={2000}
          value={text}
          autoFocus
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) void save(text);
          }}
          placeholder="Escreva aqui…"
        />
        <small className="cmp-muted">{text.length}/2000 · Ctrl+Enter salva</small>
      </label>
    </Overlay>
  );
}
