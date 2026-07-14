import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ForestScene
 * ------------------
 * A real 3D forest rendered with Three.js (via @react-three/fiber),
 * replacing the old flat icon-grid trees. Trees, grass, ground and
 * lighting all read the SAME scrollYProgress motion value that
 * already drives the rest of the hero (sky, sun, birds), so the
 * forest grows in and shifts from grey/dead to lush green in sync
 * with everything else.
 *
 * This is genuinely 3D — real depth, instanced geometry, dynamic
 * lighting/fog, per-frame wind sway — but it's procedural (cones +
 * cylinders + planes), not a modeled/textured asset, so it reads as
 * a clean stylized forest rather than a photoreal render.
 *
 * Performance: everything is drawn with InstancedMesh (3 draw calls
 * for all trees, 1 for all grass), no shadow maps, capped device
 * pixel ratio, and reused THREE.Color objects (no per-frame
 * allocation) to keep this smooth on mid-range laptops and phones.
 */

function seeded(n) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const TREE_COUNT = 42;
const GRASS_COUNT = 520;

function Ground({ progress }) {
  const ref = useRef();
  const dirt = useMemo(() => new THREE.Color("#3a352c"), []);
  const grass = useMemo(() => new THREE.Color("#0f3820"), []);

  useFrame(() => {
    const p = progress.get();
    const t = THREE.MathUtils.clamp(p / 0.5, 0, 1);
    ref.current.material.color.copy(dirt).lerp(grass, t);
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]}>
      <planeGeometry args={[90, 70]} />
      <meshStandardMaterial roughness={1} />
    </mesh>
  );
}

function Trees({ progress }) {
  const trunkRef = useRef();
  const foliageRef = useRef();
  const foliageTopRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const barkColor = useMemo(() => new THREE.Color("#4a3f33"), []);
  const foliageGray = useMemo(() => new THREE.Color("#5b5f57"), []);
  const foliageGreen = useMemo(() => new THREE.Color("#1b5e20"), []);
  const foliageBright = useMemo(() => new THREE.Color("#00c853"), []);
  const mixA = useRef(new THREE.Color()).current;
  const mixB = useRef(new THREE.Color()).current;

  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i < TREE_COUNT; i++) {
      const angle = seeded(i * 7 + 1) * Math.PI * 2;
      const radius = 7 + seeded(i * 13 + 2) * 22;
      const x = Math.cos(angle) * radius;
      // keep a clearing toward the camera/center so hero text stays readable
      const z = -6 - Math.abs(Math.sin(angle)) * radius * 0.7 - seeded(i * 3) * 8;
      const scale = 0.7 + seeded(i * 17 + 3) * 1.3;
      const sway = seeded(i * 23 + 4) * Math.PI * 2;
      arr.push({ x, z, scale, sway });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = progress.get();
    const growScale = THREE.MathUtils.clamp((p - 0.15) / 0.35, 0, 1);
    const colorT = THREE.MathUtils.clamp((p - 0.1) / 0.5, 0, 1);

    data.forEach((d, i) => {
      const wind = Math.sin(t * 0.6 + d.sway) * 0.05;
      const s = d.scale * growScale;

      dummy.position.set(d.x, s * 1.1, d.z);
      dummy.rotation.set(0, 0, wind * 0.3);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      trunkRef.current.setMatrixAt(i, dummy.matrix);

      dummy.position.set(d.x, s * 2.5, d.z);
      dummy.rotation.set(0, 0, wind);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      foliageRef.current.setMatrixAt(i, dummy.matrix);

      dummy.position.set(d.x, s * 3.5, d.z);
      dummy.rotation.set(0, 0, wind * 1.5);
      dummy.scale.set(s * 0.72, s * 0.8, s * 0.72);
      dummy.updateMatrix();
      foliageTopRef.current.setMatrixAt(i, dummy.matrix);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceMatrix.needsUpdate = true;
    foliageTopRef.current.instanceMatrix.needsUpdate = true;

    mixA.copy(foliageGray).lerp(foliageGreen, colorT);
    mixB.copy(mixA).lerp(foliageBright, 0.3);
    foliageRef.current.material.color.copy(mixA);
    foliageTopRef.current.material.color.copy(mixB);
    trunkRef.current.material.color.copy(barkColor);
  });

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[null, null, TREE_COUNT]}>
        <cylinderGeometry args={[0.12, 0.18, 2.2, 6]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh ref={foliageRef} args={[null, null, TREE_COUNT]}>
        <coneGeometry args={[1.1, 2.3, 7]} />
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={foliageTopRef} args={[null, null, TREE_COUNT]}>
        <coneGeometry args={[0.9, 1.8, 7]} />
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
    </group>
  );
}

function Grass({ progress }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const gray = useMemo(() => new THREE.Color("#6b6f63"), []);
  const green = useMemo(() => new THREE.Color("#00c853"), []);
  const mix = useRef(new THREE.Color()).current;

  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i < GRASS_COUNT; i++) {
      const x = (seeded(i * 3 + 1) - 0.5) * 50;
      const z = -3 - seeded(i * 7 + 2) * 26;
      const rot = seeded(i * 11 + 3) * Math.PI;
      const h = 0.35 + seeded(i * 13 + 4) * 0.5;
      const sway = seeded(i * 5) * Math.PI * 2;
      arr.push({ x, z, rot, h, sway });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = progress.get();
    const growScale = THREE.MathUtils.clamp((p - 0.05) / 0.3, 0, 1);

    data.forEach((d, i) => {
      const wind = Math.sin(t * 1.4 + d.sway) * 0.25;
      const h = d.h * growScale;
      dummy.position.set(d.x, h / 2, d.z);
      dummy.rotation.set(0, d.rot, wind);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });

    ref.current.instanceMatrix.needsUpdate = true;
    mix.copy(gray).lerp(green, growScale);
    ref.current.material.color.copy(mix);
  });

  return (
    <instancedMesh ref={ref} args={[null, null, GRASS_COUNT]}>
      <planeGeometry args={[0.06, 1]} />
      <meshStandardMaterial side={THREE.DoubleSide} roughness={1} />
    </instancedMesh>
  );
}

function SceneLighting({ progress }) {
  const dirRef = useRef();
  const ambRef = useRef();
  const grayLight = useMemo(() => new THREE.Color("#8a8d86"), []);
  const warmLight = useMemo(() => new THREE.Color("#fff4be"), []);
  const mix = useRef(new THREE.Color()).current;

  useFrame(() => {
    const p = progress.get();
    const sunT = THREE.MathUtils.clamp((p - 0.5) / 0.4, 0, 1);
    dirRef.current.intensity = 0.4 + sunT * 1.5;
    ambRef.current.intensity = 0.5 + sunT * 0.3;
    mix.copy(grayLight).lerp(warmLight, sunT);
    dirRef.current.color.copy(mix);
  });

  return (
    <>
      <ambientLight ref={ambRef} intensity={0.5} color="#cfd8d3" />
      <directionalLight ref={dirRef} position={[8, 12, 6]} intensity={0.4} />
    </>
  );
}

function FogRig({ progress }) {
  const { scene } = useThree();
  const grayFog = useMemo(() => new THREE.Color("#3a3d38"), []);
  const greenFog = useMemo(() => new THREE.Color("#0b1f16"), []);
  const mix = useRef(new THREE.Color()).current;

  useEffect(() => {
    scene.fog = new THREE.Fog("#3a3d38", 14, 58);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame(() => {
    const p = progress.get();
    if (scene.fog) {
      mix.copy(grayFog).lerp(greenFog, THREE.MathUtils.clamp(p / 0.6, 0, 1));
      scene.fog.color.copy(mix);
    }
  });

  return null;
}

function ForestScene({ progress }) {
  return (
    <div className="ce-hero-forest-canvas">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 3.4, 15], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <FogRig progress={progress} />
        <SceneLighting progress={progress} />
        <Ground progress={progress} />
        <Grass progress={progress} />
        <Trees progress={progress} />
      </Canvas>
    </div>
  );
}

export default ForestScene;
    
