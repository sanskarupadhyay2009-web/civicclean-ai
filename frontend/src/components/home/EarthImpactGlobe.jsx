import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { useInViewport } from "../../hooks/useInViewport";

/**
 * EarthImpact 3D globe
 * ------------------------
 * A stylized (not photo-textured — no external assets used) globe:
 * a solid dark core, a wireframe shell, a soft additive "atmosphere"
 * rim, glowing hotspots for participating regions, animated dashed
 * arcs connecting them, and a thin ring of orbiting particles.
 * Users can drag to rotate; it also auto-rotates slowly when idle.
 */

const RADIUS = 2.4;

// Roughly-placed participation hotspots (lat, lng, participation 0-1)
const HOTSPOTS = [
  { name: "USA", lat: 39, lng: -98, level: 0.9 },
  { name: "Brazil", lat: -10, lng: -55, level: 0.65 },
  { name: "UK", lat: 54, lng: -2, level: 0.7 },
  { name: "Nigeria", lat: 9, lng: 8, level: 0.55 },
  { name: "India", lat: 21, lng: 78, level: 1 },
  { name: "China", lat: 35, lng: 103, level: 0.6 },
  { name: "Australia", lat: -25, lng: 133, level: 0.5 },
  { name: "Japan", lat: 36, lng: 138, level: 0.65 },
  { name: "S. Africa", lat: -29, lng: 24, level: 0.5 },
  { name: "Germany", lat: 51, lng: 10, level: 0.75 },
  { name: "Indonesia", lat: -2, lng: 118, level: 0.45 },
  { name: "Kenya", lat: 0, lng: 38, level: 0.4 },
];

// Which hotspot indices get connection arcs drawn between them —
// all routed through India (index 4) as the "hub" for a clean,
// readable network rather than a tangled full mesh.
const ARC_PAIRS = [
  [4, 0], [4, 1], [4, 2], [4, 3], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11],
];

function latLngToVec3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeCore() {
  return (
    <>
      {/* Solid dark core so the far side of the wireframe doesn't
          read as see-through emptiness */}
      <mesh>
        <sphereGeometry args={[RADIUS - 0.02, 48, 48]} />
        <meshStandardMaterial color="#0b1f10" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Wireframe shell — the "digital globe" grid look */}
      <mesh>
        <icosahedronGeometry args={[RADIUS, 4]} />
        <meshBasicMaterial color="#34e37a" wireframe transparent opacity={0.16} />
      </mesh>

      {/* Soft additive atmosphere glow, rendered from the inside out */}
      <mesh>
        <sphereGeometry args={[RADIUS + 0.22, 32, 32]} />
        <meshBasicMaterial
          color="#00c853"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function Hotspots() {
  const refs = useRef([]);

  const points = useMemo(
    () =>
      HOTSPOTS.map((h) => ({
        ...h,
        pos: latLngToVec3(h.lat, h.lng, RADIUS + 0.03),
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pulse = 0.75 + Math.sin(t * 1.6 + i * 1.3) * 0.25;
      mesh.material.emissiveIntensity = points[i].level * 1.4 * pulse;
      const s = 0.05 + points[i].level * 0.05;
      mesh.scale.setScalar(s);
    });
  });

  return (
    <group>
      {points.map((h, i) => (
        <mesh key={h.name} ref={(el) => (refs.current[i] = el)} position={h.pos}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color="#baffd6"
            emissive="#34e37a"
            emissiveIntensity={h.level}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function ConnectionArcs() {
  const points = useMemo(
    () => HOTSPOTS.map((h) => latLngToVec3(h.lat, h.lng, RADIUS + 0.03)),
    []
  );

  const arcs = useMemo(() => {
    return ARC_PAIRS.map(([a, b]) => {
      const start = points[a];
      const end = points[b];
      const mid = start.clone().add(end).multiplyScalar(0.5);
      // Lift the midpoint outward so the arc bulges above the surface
      mid.normalize().multiplyScalar(RADIUS + 0.03 + start.distanceTo(end) * 0.5);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const curvePoints = curve.getPoints(48);
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

      // computeLineDistances() only exists on THREE.Line objects, not on
      // a bare BufferGeometry — set the "lineDistance" attribute directly
      // instead, which is what LineDashedMaterial actually reads from.
      const distances = [0];
      for (let i = 1; i < curvePoints.length; i++) {
        distances.push(distances[i - 1] + curvePoints[i].distanceTo(curvePoints[i - 1]));
      }
      geometry.setAttribute("lineDistance", new THREE.Float32BufferAttribute(distances, 1));

      const lineLength = distances[distances.length - 1];
      return { geometry, lineLength };
    });
  }, [points]);

  const matRefs = useRef([]);

  useFrame((_, delta) => {
    matRefs.current.forEach((mat) => {
      if (!mat) return;
      mat.dashOffset -= delta * 0.6;
    });
  });

  return (
    <group>
      {arcs.map((arc, i) => (
        <line key={i} geometry={arc.geometry}>
          <lineDashedMaterial
            ref={(el) => (matRefs.current[i] = el)}
            color="#6effeb"
            dashSize={0.12}
            gapSize={0.08}
            transparent
            opacity={0.55}
          />
        </line>
      ))}
    </group>
  );
}

function OrbitParticles({ count = 90 }) {
  const ref = useRef();

  const data = useMemo(() => {
    return Array.from({ length: count }, () => ({
      radius: RADIUS + 0.6 + Math.random() * 1.2,
      angle: Math.random() * Math.PI * 2,
      speed: 0.05 + Math.random() * 0.08,
      incline: (Math.random() - 0.5) * 1.1,
    }));
  }, [count]);

  const tmp = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    data.forEach((d, i) => {
      d.angle += d.speed * delta;
      const x = Math.cos(d.angle) * d.radius;
      const z = Math.sin(d.angle) * d.radius;
      const y = Math.sin(d.angle * 0.7) * d.incline;
      tmp.position.set(x, y, z);
      tmp.scale.setScalar(0.02);
      tmp.updateMatrix();
      ref.current.setMatrixAt(i, tmp.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#9dffce" transparent opacity={0.7} />
    </instancedMesh>
  );
}

function SlowSpin({ children }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.045;
  });
  return <group ref={ref}>{children}</group>;
}

// The scene's furthest visible geometry (outer orbit particles) sits
// at roughly this radius from center. The camera needs to back off
// far enough that this fits within BOTH the vertical and horizontal
// field of view — the previous fixed distance only accounted for a
// vertical fit at one specific aspect ratio, so anything narrower
// (portrait phones, the mobile-stacked layout) clipped the sides.
const SCENE_RADIUS = 4.3;

function ResponsiveCameraFit() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!size.width || !size.height) return;

    const aspect = size.width / size.height;
    const vFov = (camera.fov * Math.PI) / 180;
    const vHalfTan = Math.tan(vFov / 2);
    const hHalfTan = vHalfTan * aspect;

    // Distance required so SCENE_RADIUS fits inside whichever axis is
    // tighter (vertical on narrow/portrait, horizontal on ultra-wide).
    const limitingHalfTan = Math.min(vHalfTan, hHalfTan);
    const requiredDistance = (SCENE_RADIUS / limitingHalfTan) * 1.08; // 8% breathing room

    camera.position.z = Math.max(requiredDistance, 6);
    camera.updateProjectionMatrix();
  }, [size, camera]);

  return null;
}

function EarthImpactGlobe() {
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
  const [wrapRef, inView] = useInViewport();

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={isSmallScreen ? 1 : [1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.6, 7], fov: 42 }}
        frameloop={inView ? "always" : "never"}
      >
        <ResponsiveCameraFit />

        <ambientLight intensity={0.6} />
        <pointLight position={[6, 4, 6]} intensity={1.1} color="#baffd6" />

        <SlowSpin>
          <GlobeCore />
          <Hotspots />
          <ConnectionArcs />
        </SlowSpin>

        <OrbitParticles count={isSmallScreen ? 40 : 90} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}

export default EarthImpactGlobe;
