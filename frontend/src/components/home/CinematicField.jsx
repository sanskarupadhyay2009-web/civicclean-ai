import { useRef, useMemo, useEffect } from "react";
import { useScroll, useVelocity } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ─────────────────────────────────────────────
//  CINEMATIC FIELD
//  A persistent, always-visible galaxy-style star
//  field behind the whole page: thousands of glowing
//  points arranged in rotating rings (so the motion
//  reads as an intentional pattern, not random jitter),
//  each twinkling on its own cycle. Scroll position
//  drives a slow hue sweep + camera drift, and scroll
//  VELOCITY (how fast you're scrolling right now) kicks
//  the whole field brighter/outward momentarily, so
//  scrolling visibly *does* something on top of the
//  constant ambient motion.
// ─────────────────────────────────────────────

const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COUNT = isSmallScreen ? 1600 : 3600;
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
  varying float vAlpha;

  void main() {
    // Each ring spins at its own speed/direction — this is what
    // makes the motion read as an intentional swirling pattern
    // instead of particles drifting independently.
    float ringSpeed = 0.05 + aRing * 0.035;
    float dir = mod(aRing, 2.0) < 1.0 ? 1.0 : -1.0;
    float angle = aAngle0 + uTime * ringSpeed * dir;

    float radius = aRadius * (1.0 + uKick * 0.18);
    vec3 pos = vec3(
      cos(angle) * radius,
      sin(angle * 0.6) * radius * 0.35 + aDepth * 0.4,
      sin(angle) * radius - aDepth
    );

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float twinkle = 0.55 + 0.45 * sin(uTime * aTwinkleSpeed + aTwinklePhase);

    gl_PointSize = (uSize + uKick * 1.6) * twinkle * (260.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    float distFade = clamp(1.0 - (-mvPosition.z) / 46.0, 0.1, 1.0);
    vAlpha = twinkle * distFade;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uKick;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    vec3 color = uColor + uKick * vec3(0.25, 0.3, 0.2);
    gl_FragColor = vec4(color, core * vAlpha);
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
    const positions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const r = i % RING_COUNT;
      ring[i] = r;
      radius[i] = 3.5 + r * 2.4 + Math.random() * 1.6;
      angle0[i] = Math.random() * Math.PI * 2;
      depth[i] = Math.random() * 30;
      twinkleSpeed[i] = 0.6 + Math.random() * 2.2;
      twinklePhase[i] = Math.random() * Math.PI * 2;
    }

    return { ring, radius, angle0, depth, twinkleSpeed, twinklePhase, positions };
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
  }, [attrs]);

  useFrame((state) => {
    const p = progress.get();
    const t = prefersReducedMotion ? 0 : state.clock.elapsedTime;

    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      matRef.current.uniforms.uKick.value = kickRef.current;

      // Bright, saturated hue sweep across the whole scroll — never
      // dips toward near-black the way the previous mood colors did.
      const hue = 0.34 - p * 0.22; // emerald -> teal -> sky as you scroll
      const color = new THREE.Color().setHSL(((hue % 1) + 1) % 1, 0.75, 0.58);
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
          uSize: { value: isSmallScreen ? 2.6 : 3.4 },
          uKick: { value: 0 },
          uColor: { value: new THREE.Color("#4be3a0") },
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
    camera.position.x = Math.sin(p * Math.PI * 2) * 1.4;
    camera.position.y = -p * 1.2 + Math.cos(p * Math.PI * 1.4) * 0.5;
    camera.rotation.z = Math.sin(p * Math.PI) * 0.02;
  });
  return null;
}

function CinematicField() {
  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);

  // Bridge scroll velocity into a ref the shader can read every frame,
  // smoothed so it eases in/out rather than snapping.
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
        dpr={isSmallScreen ? 1 : [1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 60 }}
      >
        <StarField progress={scrollYProgress} kickRef={kickRef} />
        <DriftCamera progress={scrollYProgress} />

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.85}
            intensity={isSmallScreen ? 0.7 : 1.3}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      <div className="cinematic-field-vignette" />
    </div>
  );
}

export default CinematicField;
        
  
