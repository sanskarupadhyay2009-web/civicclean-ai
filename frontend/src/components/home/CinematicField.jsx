import { useRef, useMemo, useEffect } from "react";
import { useScroll } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────
//  CINEMATIC FIELD
//  A lightweight, persistent particle field that
//  sits behind the entire home page. It doesn't
//  attempt to turn every section into a 3D object —
//  the Features grid, Stats counters, Earth globe
//  and Community cards all stay exactly as built —
//  but its particle density, drift, and color mood
//  shift continuously with overall scroll progress,
//  so the page reads as one continuous environment
//  rather than a stack of disconnected sections.
// ─────────────────────────────────────────────

const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COUNT = isSmallScreen ? 700 : 1600;

// Mood stops, roughly aligned to where each section sits on the page.
// Colors drift smoothly between these rather than snapping.
const MOODS = [
  { at: 0.0, color: "#123718", label: "hero (forest)" },
  { at: 0.22, color: "#0d2b1c", label: "scan" },
  { at: 0.35, color: "#4be3a0", label: "particle morph" },
  { at: 0.5, color: "#00c853", label: "features" },
  { at: 0.65, color: "#1b5e20", label: "stats" },
  { at: 0.8, color: "#4fc3f7", label: "earth impact" },
  { at: 1.0, color: "#6d4c41", label: "community" },
];

function moodColorAt(t) {
  for (let i = 0; i < MOODS.length - 1; i++) {
    const a = MOODS[i];
    const b = MOODS[i + 1];
    if (t >= a.at && t <= b.at) {
      const localT = (t - a.at) / (b.at - a.at || 1);
      return new THREE.Color(a.color).lerp(new THREE.Color(b.color), localT);
    }
  }
  return new THREE.Color(MOODS[MOODS.length - 1].color);
}

function AmbientParticles({ progress }) {
  const data = useMemo(() => {
    return Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 22,
      y: (Math.random() - 0.5) * 14,
      z: -6 - Math.random() * 26,
      speed: 0.02 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const ref = useRef();
  const matRef = useRef();
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const p = progress.get();
    const t = prefersReducedMotion ? 0 : state.clock.elapsedTime;

    data.forEach((d, i) => {
      const y = d.y + Math.sin(t * d.speed * 6 + d.phase) * 0.6;
      const x = d.x + Math.cos(t * d.speed * 4 + d.phase) * 0.4;
      tmp.position.set(x, y, d.z);
      tmp.scale.setScalar(0.018 + Math.sin(t + d.phase) * 0.004);
      tmp.updateMatrix();
      ref.current.setMatrixAt(i, tmp.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;

    if (matRef.current) {
      matRef.current.color.copy(moodColorAt(p));
    }
  });

  return (
    <instancedMesh ref={ref} args={[null, null, COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial ref={matRef} transparent opacity={0.55} />
    </instancedMesh>
  );
}

function DriftCamera({ progress }) {
  useFrame(({ camera }) => {
    if (prefersReducedMotion) return;
    const p = progress.get();
    camera.position.x = Math.sin(p * Math.PI * 2) * 1.4;
    camera.position.y = -p * 2 + Math.cos(p * Math.PI * 1.4) * 0.6;
    camera.rotation.z = Math.sin(p * Math.PI) * 0.02;
  });
  return null;
}

function CinematicField() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="cinematic-field" aria-hidden="true">
      <Canvas
        dpr={isSmallScreen ? 1 : [1, 1.4]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 55 }}
      >
        <AmbientParticles progress={scrollYProgress} />
        <DriftCamera progress={scrollYProgress} />
      </Canvas>
      <div className="cinematic-field-vignette" />
    </div>
  );
}

export default CinematicField;
