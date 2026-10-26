import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Vector3, type Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import styles from "./Hero.module.css";

const MODEL_PATH = "/assets/3D/bat_logo.glb";

function BatLogo() {
  const model = useGLTF(MODEL_PATH);
  const groupRef = useRef<Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={model.scene} />
      </group>
    </Center>
  );
}

function BatLogoControls({ reducedMotion }: { reducedMotion: boolean }) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const returningHome = useRef(false);
  const homePosition = useRef(new Vector3(0, 0, 4));
  const homeTarget = useRef(new Vector3(0, 0, 0));
  const { camera } = useThree();

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || !returningHome.current) return;

    controls.update();
    const ease = Math.min(1, delta * 3);
    camera.position.lerp(homePosition.current, ease);
    controls.target.lerp(homeTarget.current, ease);

    if (camera.position.distanceTo(homePosition.current) < 0.01 && controls.target.length() < 0.01) {
      camera.position.set(0, 0, 4);
      controls.target.set(0, 0, 0);
      returningHome.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableRotate={!reducedMotion}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.55}
      onStart={() => {
        returningHome.current = false;
      }}
      onEnd={() => {
        if (!reducedMotion) returningHome.current = true;
      }}
    />
  );
}

useGLTF.preload(MODEL_PATH);

export function BatLogoModel() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className={styles.modelContainer} aria-label="Interactive 3D bat logo">
      <Canvas
        className={styles.modelCanvas}
        camera={{ position: [0, 0, 4], fov: 38 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 4, 5]} intensity={3} color="#f0f3f8" />
        <pointLight position={[-3, -1, 2]} intensity={18} distance={8} color="#c4172b" />
        <Suspense fallback={null}>
          <BatLogo />
        </Suspense>
        <BatLogoControls reducedMotion={reducedMotion} />
      </Canvas>
      <span className={`${styles.modelHint} mono`} aria-hidden="true">
        DRAG TO INSPECT
      </span>
    </div>
  );
}
