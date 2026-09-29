import StageBackdrop from "./StageBackdrop";
import StageHaze from "./StageHaze";
import StageLights from "./StageLights";

/**
 * Cena do palco: desenho estático + iluminação animada + fumaça.
 * O container mantém proporção 16:9 e cobre a área do hero (como object-fit: cover),
 * então todas as camadas compartilham o mesmo sistema de coordenadas (cqw).
 */
export default function StageScene() {
  return (
    <div className="stage" data-stage aria-hidden="true">
      <StageBackdrop />
      <StageLights />
      <StageHaze />
    </div>
  );
}
