/* eslint-disable @next/next/no-img-element */
/** Logo exibido na tela de login do admin. */
export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <img src="/images/brand/logo-culto-em-off-horizontal-480.webp" alt="" width={168} height={72} />
      <span style={{ fontSize: 24, fontWeight: 700 }}>Culto em Off · Admin</span>
    </div>
  );
}
