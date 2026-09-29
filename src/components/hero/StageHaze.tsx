/**
 * Fumaça (haze) do palco — só CSS: texturas leves em camadas que derivam
 * em sentidos opostos. A paralaxe com o mouse é aplicada por StageLights
 * através do atributo data-haze-depth.
 */
export default function StageHaze() {
  return (
    <div className="stage-haze" aria-hidden="true">
      <div className="stage-haze__glow" data-haze-glow />
      <div className="stage-haze__layer stage-haze__layer--back" data-haze-depth="0.6">
        <span />
      </div>
      <div className="stage-haze__layer stage-haze__layer--mid" data-haze-depth="1">
        <span />
      </div>
      <div className="stage-haze__layer stage-haze__layer--front" data-haze-depth="1.6">
        <span />
      </div>
    </div>
  );
}
