import { useRef, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import * as THREE from "three";

import { GlowText } from "../common/GlowText";

import "../../styles/particlemorph.css";

const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COUNT = isSmallScreen ? 1400 : 4200;

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
    const r = 2.5 + Math.random() * 4.5;
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

const VERTEX_SHADER = `
  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  attribute vec3 positionStart;
  attribute vec3 positionEnd;
  varying float vAlpha;

  void main() {
    vec3 pos = mix(positionStart, positionEnd, uMorph);

    float phase = dot(pos, vec3(12.9898, 78.233, 37.719));
    pos += 0.045 * vec3(
      sin(uTime * 0.6 + phase),
      cos(uTime * 0.5 + phase * 1.3),
      sin(uTime * 0.4 + phase * 0.7)
    );

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = clamp(1.0 - (-mvPosition.z) / 40.0, 0.15, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
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

  const geomRef = useRef();
  const matRef = useRef();
  const segmentRef = useRef(-1);

  useEffect(() => {
    const geo = geomRef.current;
    geo.setAttribute("position", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geo.setAttribute("positionStart", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geo.setAttribute("positionEnd", new THREE.BufferAttribute(shapes[1].slice(), 3));
    segmentRef.current = 0;
  }, [shapes]);

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

      // Fade the glow color from emerald toward warm white as the
      // particles approach the final dispersal / card reveal.
      const warm = new THREE.Color("#eaffe0");
      const cool = new THREE.Color("#4be3a0");
      matRef.current.uniforms.uColor.value.copy(cool).lerp(warm, Math.max(0, p - 0.7) / 0.3);
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
          uColor: { value: new THREE.Color("#6effc4") },
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
    camera.position.z = 9 - p * 3.4;
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
                luminanceThreshold={0.12}
                luminanceSmoothing={0.9}
                intensity={isSmallScreen ? 0.6 : 1.15}
                mipmapBlur
              />
              {!isSmallScreen && !prefersReducedMotion && (
                <DepthOfField focusDistance={0.015} focalLength={0.05} bokehScale={2.4} height={480} />
              )}
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
      
