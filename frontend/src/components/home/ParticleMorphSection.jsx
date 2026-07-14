import { useRef, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import { GlowText } from "../common/GlowText";

import "../../styles/particlemorph.css";

const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COUNT = isSmallScreen ? 900 : 2600;

// ─────────────────────────────────────────────
//  Shape generators — every shape returns the same
//  particle count, so any two can be morphed
//  between directly by lerping matching indices.
// ─────────────────────────────────────────────
function makeCloud(n, radius) {
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
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
    const jitter = 0.18;
    arr[i * 3] = x + (Math.random() - 0.5) * jitter;
    arr[i * 3 + 1] = y + (Math.random() - 0.5) * jitter;
    arr[i * 3 + 2] = z + (Math.random() - 0.5) * jitter;
  }
  return arr;
}

function makeBlob(n, radius) {
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const noise =
      Math.sin(theta * 3) * Math.cos(phi * 4) * 0.3 + Math.sin(theta * 7 + phi * 2) * 0.15;
    const r = radius * (1 + noise * 0.4);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function makeDisperse(n) {
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.2 + Math.random() * 2.6;
    // Bias the shell toward the lower-front quadrant where the
    // reveal card sits, so the final state reads as "flowing
    // toward" the next section instead of a plain symmetric sphere.
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 0.85;
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6 - 0.6;
    arr[i * 3 + 2] = r * Math.cos(phi) * 0.6 + 0.8;
  }
  return arr;
}

// Per-particle identity attributes — constant across every shape,
// this is what breaks the "uniform dot grid" look: without these,
// every particle at a given moment shares the same size and color,
// and particles that happen to sit near each other in space end up
// with near-identical turbulence phase (since the old shader derived
// phase from position alone), which reads as a regular grid instead
// of organic scatter.
function makeIdentity(n) {
  const size = new Float32Array(n);
  const colorMix = new Float32Array(n);
  const seed = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    // Weighted toward small, with occasional bigger sparkly ones
    size[i] = Math.pow(Math.random(), 2.2) * 1.9 + 0.35;
    colorMix[i] = Math.random();
    seed[i] = Math.random() * Math.PI * 2;
  }
  return { size, colorMix, seed };
}

const VERTEX_SHADER = `
  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  uniform float uAttract;
  uniform vec3 uAttractPoint;

  attribute vec3 positionStart;
  attribute vec3 positionEnd;
  attribute float aSize;
  attribute float aSeed;
  attribute float aColorMix;

  varying float vAlpha;
  varying float vSeed;
  varying float vColorMix;

  // cheap 3-axis pseudo-curl: three offset sine/cosine fields at
  // different frequencies per particle (via aSeed), layered so the
  // drift reads as swirling curved motion rather than simple jitter.
  vec3 curl(vec3 p, float seed, float t) {
    float a = t * 0.55 + seed;
    float b = t * 0.4 + seed * 1.7;
    float c = t * 0.35 + seed * 2.3;
    return vec3(
      sin(a + p.y * 0.6) + 0.5 * sin(2.0 * a + p.z * 0.4),
      cos(b + p.z * 0.6) + 0.5 * cos(2.0 * b + p.x * 0.4),
      sin(c + p.x * 0.6) + 0.5 * sin(2.0 * c + p.y * 0.4)
    );
  }

  void main() {
    vec3 pos = mix(positionStart, positionEnd, uMorph);

    // Turbulence envelope: near-zero at rest (uMorph 0 or 1), peaks
    // mid-flight — this is the "detach, swirl, then settle" feel.
    float envelope = sin(uMorph * 3.14159265);
    pos += curl(pos, aSeed, uTime) * (0.09 + envelope * 0.22);

    // Gentle pull toward the reveal card in the final stretch.
    pos = mix(pos, uAttractPoint, uAttract * 0.35);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = max(-mvPosition.z, 1.2);
    gl_PointSize = clamp(uSize * aSize * (220.0 / dist), 0.5, 34.0);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = clamp(1.0 - (-mvPosition.z) / 40.0, 0.15, 1.0);
    vSeed = aSeed;
    vColorMix = aColorMix;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uTime;

  varying float vAlpha;
  varying float vSeed;
  varying float vColorMix;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(0.5, 0.15, d) * 0.55;

    // Twinkle: gentle per-particle flicker, decorrelated from
    // position via vSeed so nearby particles don't pulse in sync.
    float twinkle = 0.75 + 0.25 * sin(uTime * 1.6 + vSeed * 4.0);

    vec3 mixed = mix(uColorA, uColorB, smoothstep(0.0, 0.5, vColorMix));
    mixed = mix(mixed, uColorC, smoothstep(0.5, 1.0, vColorMix));

    float alpha = (core + glow) * vAlpha * twinkle;
    gl_FragColor = vec4(mixed, alpha);
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

  const identity = useMemo(() => makeIdentity(COUNT), []);

  const geomRef = useRef();
  const matRef = useRef();
  const segmentRef = useRef(-1);

  useEffect(() => {
    const geo = geomRef.current;
    geo.setAttribute("position", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geo.setAttribute("positionStart", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geo.setAttribute("positionEnd", new THREE.BufferAttribute(shapes[1].slice(), 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(identity.size, 1));
    geo.setAttribute("aColorMix", new THREE.BufferAttribute(identity.colorMix, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(identity.seed, 1));
    segmentRef.current = 0;
  }, [shapes, identity]);

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

      // Pull toward the reveal card only in the final stretch of
      // scroll, so particles visibly stream toward where the card
      // is about to appear instead of just settling in place.
      matRef.current.uniforms.uAttract.value = THREE.MathUtils.smoothstep(p, 0.82, 0.98);
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
          uSize: { value: isSmallScreen ? 3 : 4 },
          uAttract: { value: 0 },
          uAttractPoint: { value: new THREE.Vector3(0, -0.6, 1.4) },
          uColorA: { value: new THREE.Color("#eaffe0") },
          uColorB: { value: new THREE.Color("#4be3a0") },
          uColorC: { value: new THREE.Color("#ffd88a") },
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
        <div className="pm-canvas-wrap">
          <Canvas
            dpr={isSmallScreen ? 1 : [1, 1.5]}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 0, 9], fov: 48 }}
          >
            <ParticleField progress={scrollYProgress} />
            <CameraRig progress={scrollYProgress} />

            <EffectComposer disableNormalPass>
              <Bloom
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                intensity={isSmallScreen ? 0.55 : 0.9}
                mipmapBlur
              />
            </EffectComposer>
          </Canvas>
        </div>

        <motion.div className="pm-intro" style={{ opacity: introOpacity }}>
          <span className="pm-eyebrow">ORGANIC INTELLIGENCE</span>
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
          style={{ opacity: cardOpacity, scale: cardScale, filter: cardFilter }}
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
      
