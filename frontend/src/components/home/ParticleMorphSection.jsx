import { useRef, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

import { GlowText } from "../common/GlowText";
import { ScrambleText } from "../common/ScrambleText";
import { useInViewport } from "../../hooks/useInViewport";

import "../../styles/particlemorph.css";

const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COUNT = isSmallScreen ? 900 : 2600;

// A small, warm-to-cool palette so the field reads as a living nebula
// rather than a flat mono-colour dot cloud — mirrors the reference:
// icy whites + gold sparks drifting through emerald/teal/violet dust.
const PALETTE = [
  new THREE.Color("#eafff4"), // hot white core sparks
  new THREE.Color("#ffd98a"), // warm gold accents
  new THREE.Color("#4be3a0"), // brand emerald
  new THREE.Color("#39c6ff"), // sky cyan
  new THREE.Color("#8a7bff"), // violet dust
];

// Deterministic PRNG so the field layout never reshuffles on re-render.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2024);

// ─────────────────────────────────────────────
//  Shape generators — every shape returns the same
//  particle count, so any two can be morphed
//  between directly by lerping matching indices.
//  Clustered around several "hot spots" (instead of
//  a uniform sphere) so the field reads as organic
//  clumps and streams, like dust caught in gravity
//  wells — matching the reference nebula.
// ─────────────────────────────────────────────
function clusterCenters(n, spread) {
  return Array.from({ length: n }, () => ({
    x: (rand() - 0.5) * spread,
    y: (rand() - 0.5) * spread,
    z: (rand() - 0.5) * spread * 0.6,
  }));
}

function makeCloud(n, radius) {
  const arr = new Float32Array(n * 3);
  const centers = clusterCenters(5, radius * 0.9);
  for (let i = 0; i < n; i++) {
    const c = centers[i % centers.length];
    const localR = radius * 0.42 * Math.cbrt(rand());
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    arr[i * 3] = c.x + localR * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = c.y + localR * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = c.z + localR * Math.cos(phi);
  }
  return arr;
}

function makeTorusKnot(n, radius, tube, p = 2, q = 3) {
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const x = (radius + tube * Math.cos(q * t)) * Math.cos(p * t);
    const y = (radius + tube * Math.cos(q * t)) * Math.sin(p * t);
    const z = tube * Math.sin(q * t);
    const jitter = 0.22;
    arr[i * 3] = x + (rand() - 0.5) * jitter;
    arr[i * 3 + 1] = y + (rand() - 0.5) * jitter;
    arr[i * 3 + 2] = z + (rand() - 0.5) * jitter;
  }
  return arr;
}

function makeBlob(n, radius) {
  const arr = new Float32Array(n * 3);
  const centers = clusterCenters(4, radius * 0.7);
  for (let i = 0; i < n; i++) {
    const c = centers[i % centers.length];
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const noise = Math.sin(theta * 3) * Math.cos(phi * 4) * 0.3 + Math.sin(theta * 7 + phi * 2) * 0.15;
    const r = radius * 0.55 * (1 + noise * 0.4);
    arr[i * 3] = c.x + r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = c.y + r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = c.z + r * Math.cos(phi);
  }
  return arr;
}

// Particles drift outward and gently downward — like they're being
// pulled toward the section beneath, ready to reassemble there.
function makeDisperse(n) {
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = 2.4 + rand() * 3.2;
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 1.4;
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function makeAttributeArrays(n) {
  const size = new Float32Array(n);
  const color = new Float32Array(n * 3);
  const seed = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    // Mostly fine dust, with occasional bigger "spark" particles.
    size[i] = rand() < 0.12 ? 1.6 + rand() * 1.6 : 0.35 + rand() * 0.7;
    const c = PALETTE[Math.floor(rand() * PALETTE.length)];
    color[i * 3] = c.r;
    color[i * 3 + 1] = c.g;
    color[i * 3 + 2] = c.b;
    seed[i] = rand() * Math.PI * 2;
  }
  return { size, color, seed };
}

const VERTEX_SHADER = `
  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  attribute vec3 positionStart;
  attribute vec3 positionEnd;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aSeed;
  varying float vAlpha;
  varying vec3 vColor;

  // Curl/swirl amount peaks mid-transition — particles never travel
  // in a straight line, they arc and spiral toward their destination.
  void main() {
    vec3 pos = mix(positionStart, positionEnd, uMorph);

    float swirl = sin(uMorph * 3.14159265);
    float ang = swirl * (1.3 + 0.6 * sin(aSeed));
    float ca = cos(ang);
    float sa = sin(ang);
    vec3 swirled = vec3(pos.x * ca - pos.z * sa, pos.y, pos.x * sa + pos.z * ca);
    pos = mix(pos, swirled, 0.55);
    pos += normalize(pos + 0.001) * swirl * 0.6;

    float phase = aSeed + dot(pos, vec3(12.9898, 78.233, 37.719)) * 0.02;
    float turbulence = 0.05 + swirl * 0.16;
    pos += turbulence * vec3(
      sin(uTime * 0.6 + phase),
      cos(uTime * 0.5 + phase * 1.3),
      sin(uTime * 0.4 + phase * 0.7)
    );

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = max(-mvPosition.z, 1.2);
    gl_PointSize = clamp(uSize * aSize * (220.0 / dist), 0.5, 34.0);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = clamp(1.0 - (-mvPosition.z) / 40.0, 0.15, 1.0);
    vColor = aColor;
  }
`;

const FRAGMENT_SHADER = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(0.5, 0.15, d) * 0.6;
    float alpha = (core + glow) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ─────────────────────────────────────────────
//  PARTICLE FIELD — morphs through 4 shapes across
//  3 scroll segments, then disperses for the reveal.
// ─────────────────────────────────────────────
function ParticleField({ progress }) {
  const shapes = useMemo(
    () => [makeCloud(COUNT, 3.2), makeTorusKnot(COUNT, 2.1, 0.75), makeBlob(COUNT, 2.5), makeDisperse(COUNT)],
    []
  );
  const attrs = useMemo(() => makeAttributeArrays(COUNT), []);

  const geomRef = useRef();
  const matRef = useRef();
  const segmentRef = useRef(-1);

  useEffect(() => {
    const geo = geomRef.current;
    geo.setAttribute("position", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geo.setAttribute("positionStart", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geo.setAttribute("positionEnd", new THREE.BufferAttribute(shapes[1].slice(), 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(attrs.size, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(attrs.color, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(attrs.seed, 1));
    segmentRef.current = 0;
  }, [shapes, attrs]);

  useFrame((state) => {
    const p = progress.get();
    const segments = 3;
    const segLen = 1 / segments;
    const segIndex = Math.min(segments - 1, Math.max(0, Math.floor(p / segLen)));
    const localT = Math.min(1, Math.max(0, (p - segIndex * segLen) / segLen));

    if (segIndex !== segmentRef.current && geomRef.current) {
      segmentRef.current = segIndex;
      geomRef.current.attributes.positionStart.array.set(shapes[segIndex]);
      geomRef.current.attributes.positionEnd.array.set(shapes[segIndex + 1]);
      geomRef.current.attributes.positionStart.needsUpdate = true;
      geomRef.current.attributes.positionEnd.needsUpdate = true;
    }

    if (matRef.current) {
      matRef.current.uniforms.uMorph.value = localT;
      matRef.current.uniforms.uTime.value = prefersReducedMotion ? 0 : state.clock.elapsedTime;
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
          uMorph: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: isSmallScreen ? 3.4 : 4.6 },
        }}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
      />
    </points>
  );
}

function CameraRig({ progress }) {
  useFrame(({ camera }) => {
    const p = progress.get();
    camera.position.z = 9 - p * 2.3;
    if (!prefersReducedMotion) {
      camera.position.x = Math.sin(p * Math.PI * 1.3) * 1.1;
      camera.position.y = Math.cos(p * Math.PI * 0.8) * 0.5;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─────────────────────────────────────────────
//  PUBLIC SECTION — tall sticky-scrubbed track.
//  Kept OUTSIDE of <StackSection> in Home.jsx: this
//  section pins itself internally via position:sticky,
//  and StackSection applies a CSS transform (scale) to
//  its own wrapper, which would break a sticky child.
// ─────────────────────────────────────────────
function ParticleMorphSection() {
  const sectionRef = useRef(null);
  const [canvasRef, inView] = useInViewport();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const introOpacity = useTransform(scrollYProgress, [0, 0.06, 0.24, 0.32], [0, 1, 1, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0.84, 0.95], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [0.84, 1], [0.88, 1]);
  const cardBlurPx = useTransform(scrollYProgress, [0.84, 0.95], [14, 0]);
  const cardFilter = useTransform(cardBlurPx, (v) => `blur(${v}px)`);

  return (
    <div ref={sectionRef} className="pm-track">
      <div className="pm-sticky">
        <div ref={canvasRef} className="pm-canvas-wrap">
          <Canvas
            dpr={isSmallScreen ? 1 : [1, 1.5]}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 0, 9], fov: 48 }}
            frameloop={inView ? "always" : "never"}
          >
            <ParticleField progress={scrollYProgress} />
            <CameraRig progress={scrollYProgress} />

            <EffectComposer disableNormalPass>
              <Bloom
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                intensity={isSmallScreen ? 0.55 : 1.05}
                mipmapBlur
              />
              <ChromaticAberration offset={[0.0006, 0.0012]} />
              <Vignette eskil={false} offset={0.18} darkness={0.75} />
            </EffectComposer>
          </Canvas>
        </div>

        <motion.div className="pm-intro" style={{ opacity: introOpacity }}>
          <span className="pm-eyebrow">
            <ScrambleText text="ORGANIC INTELLIGENCE" />
          </span>
          <h2>
            <GlowText text="Chaos," color="255, 255, 255" /> <br />
            <GlowText text="Made Clear" color="75, 227, 160" delay={0.15} />
          </h2>
          <p>
            Every scattered report, every scan, every signal — CivicClean AI
            continuously reshapes the noise of a city into a clear picture
            of what needs care next.
          </p>
        </motion.div>

        <motion.div
          className="pm-reveal-card"
          style={{
            x: "-50%",
            y: "-50%",
            opacity: cardOpacity,
            scale: cardScale,
            filter: cardFilter,
          }}
        >
          <span className="pm-reveal-eyebrow">SEE IT IN ACTION</span>
          <h3>From Signal to Solution</h3>
          <p>Here's what that clarity actually builds, section by section.</p>
        </motion.div>
      </div>
    </div>
  );
}

export default ParticleMorphSection;
  
