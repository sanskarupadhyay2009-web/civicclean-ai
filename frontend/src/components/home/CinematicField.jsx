import { useRef, useMemo, useEffect } from "react";
import { useScroll, useVelocity } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────
//  CINEMATIC FIELD
//  A persistent, always-visible star field behind
//  the whole page: small, sharp, sparse specks —
//  varied dot/square/diamond shapes, gentle drift,
//  soft per-particle twinkle. No global bloom pass
//  (that was making everything into big soft blurs
//  and was the main perf cost) — each particle gets
//  its own tiny glow falloff in the fragment shader
//  instead, which is dramatically cheaper.
// ─────────────────────────────────────────────

const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COUNT = isSmallScreen ? 900 : 2000;
const RING_COUNT = 6;

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uSize;
  uniform float uKick;
  attribute float aRing;
  attribute float aRadius;
  attribute float aAngle0;
  attribute float aDepth;
  attribute float aTwinkleSpeed;
  attribute float aTwinklePhase;
  attribute float aShape;
  attribute float aSizeMul;
  varying float vAlpha;
  varying float vShape;

  void main() {
    // Very slow, barely-there ring rotation — this reads as gentle
    // drift rather than an obvious swirl, matching a calm starfield.
    float ringSpeed = 0.008 + aRing * 0.005;
    float dir = mod(aRing, 2.0) < 1.0 ? 1.0 : -1.0;
    float angle = aAngle0 + uTime * ringSpeed * dir;

    vec3 pos = vec3(
      cos(angle) * aRadius,
      sin(angle * 0.6) * aRadius * 0.35 + aDepth * 0.4,
      sin(angle) * aRadius - aDepth
    );

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Twinkle affects brightness only — NOT size — so particles never
    // balloon into big blobs, they just softly pulse in brightness.
    float twinkle = 0.5 + 0.5 * sin(uTime * aTwinkleSpeed + aTwinklePhase);

    gl_PointSize = uSize * aSizeMul * (140.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    float distFade = clamp(1.0 - (-mvPosition.z) / 42.0, 0.15, 1.0);
    vAlpha = (0.4 + 0.6 * twinkle) * distFade * (0.75 + uKick * 0.25);
    vShape = aShape;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vShape;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float alpha = 0.0;

    if (vShape < 0.5) {
      // soft round dot
      float d = length(uv);
      alpha = smoothstep(0.5, 0.05, d);
    } else if (vShape < 1.5) {
      // small square
      vec2 a = abs(uv);
      alpha = step(a.x, 0.32) * step(a.y, 0.32);
    } else {
      // diamond
      float d = abs(uv.x) + abs(uv.y);
      alpha = smoothstep(0.5, 0.15, d);
    }

    gl_FragColor = vec4(uColor, alpha * vAlpha);
  }
`;

function StarField({ progress, kickRef }) {
  const geomRef = useRef();
  const matRef = useRef();

  const attrs = useMemo(() => {
    const ring = new Float32Array(COUNT);
    const radius = new Float32Array(COUNT);
    const angle0 = new Float32Array(COUNT);
    const depth = new Float32Array(COUNT);
    const twinkleSpeed = new Float32Array(COUNT);
    const twinklePhase = new Float32Array(COUNT);
    const shape = new Float32Array(COUNT);
    const sizeMul = new Float32Array(COUNT);
    const positions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const r = i % RING_COUNT;
      ring[i] = r;
      // Wide radius spread with sparse gaps, rather than dense packed rings
      radius[i] = 4 + r * 2.8 + Math.random() * 2.6;
      angle0[i] = Math.random() * Math.PI * 2;
      depth[i] = Math.random() * 34;
      twinkleSpeed[i] = 0.4 + Math.random() * 1.8;
      twinklePhase[i] = Math.random() * Math.PI * 2;
      shape[i] = Math.floor(Math.random() * 3);
      // Most particles small, a few slightly larger "feature" stars —
      // matches the sparse-with-occasional-standout look of the reference
      sizeMul[i] = Math.random() < 0.08 ? 1.8 + Math.random() * 1.2 : 0.5 + Math.random() * 0.6;
    }

    return { ring, radius, angle0, depth, twinkleSpeed, twinklePhase, shape, sizeMul, positions };
  }, []);

  useEffect(() => {
    const geo = geomRef.current;
    geo.setAttribute("position", new THREE.BufferAttribute(attrs.positions, 3));
    geo.setAttribute("aRing", new THREE.BufferAttribute(attrs.ring, 1));
    geo.setAttribute("aRadius", new THREE.BufferAttribute(attrs.radius, 1));
    geo.setAttribute("aAngle0", new THREE.BufferAttribute(attrs.angle0, 1));
    geo.setAttribute("aDepth", new THREE.BufferAttribute(attrs.depth, 1));
    geo.setAttribute("aTwinkleSpeed", new THREE.BufferAttribute(attrs.twinkleSpeed, 1));
    geo.setAttribute("aTwinklePhase", new THREE.BufferAttribute(attrs.twinklePhase, 1));
    geo.setAttribute("aShape", new THREE.BufferAttribute(attrs.shape, 1));
    geo.setAttribute("aSizeMul", new THREE.BufferAttribute(attrs.sizeMul, 1));
  }, [attrs]);

  useFrame((state) => {
    const p = progress.get();
    const t = prefersReducedMotion ? 0 : state.clock.elapsedTime;

    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      matRef.current.uniforms.uKick.value = kickRef.current;

      const hue = 0.72 - p * 0.15; // violet/pink -> blue, matching the reference palette
      const color = new THREE.Color().setHSL(((hue % 1) + 1) % 1, 0.55, 0.72);
      matRef.current.uniforms.uColor.value.copy(color);
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geomRef} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uSize: { value: isSmallScreen ? 1.6 : 2.1 },
          uKick: { value: 0 },
          uColor: { value: new THREE.Color("#c9a6ff") },
        }}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
      />
    </points>
  );
}

function DriftCamera({ progress }) {
  useFrame(({ camera }) => {
    if (prefersReducedMotion) return;
    const p = progress.get();
    camera.position.x = Math.sin(p * Math.PI * 2) * 1.1;
    camera.position.y = -p * 1.2 + Math.cos(p * Math.PI * 1.4) * 0.4;
  });
  return null;
}

function CinematicField() {
  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);

  const kickRef = useRef(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      const target = Math.min(1, Math.abs(scrollVelocity.get()) * 0.6);
      kickRef.current += (target - kickRef.current) * 0.08;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollVelocity]);

  return (
    <div className="cinematic-field" aria-hidden="true">
      <Canvas
        dpr={isSmallScreen ? 1 : [1, 1.3]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 60 }}
      >
        <StarField progress={scrollYProgress} kickRef={kickRef} />
        <DriftCamera progress={scrollYProgress} />
      </Canvas>
      <div className="cinematic-field-vignette" />
    </div>
  );
}

export default CinematicField;
      
