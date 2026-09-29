/* eslint-disable @next/next/no-img-element */
/** Logo exibido na tela de login do admin. */
export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <img src="/images/logo-culto-em-off.png" alt="" width={64} height={64} />
      <span style={{ fontSize: 24, fontWeight: 700 }}>Culto em Off · Admin</span>
    </div>
  );
}
