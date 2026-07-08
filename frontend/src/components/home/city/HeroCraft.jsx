/**
 * HeroCraft
 * ------------------
 * A small glowing craft that continuously drifts across the hero city
 * image, matching the ship in the reference art. Pure CSS animation —
 * always running, no scroll needed, so the scene feels alive even when
 * the page is completely static.
 */

function HeroCraft() {
  return (
    <div className="hero-craft-layer" aria-hidden="true">
      <div className="hero-craft">
        <span className="craft-body"></span>
        <span className="craft-trail"></span>
      </div>
    </div>
  );
}

export default HeroCraft;
