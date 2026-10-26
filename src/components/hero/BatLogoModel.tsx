import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";
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
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={!reducedMotion}
          autoRotate={false}
          rotateSpeed={0.55}
        />
      </Canvas>
      <span className={`${styles.modelHint} mono`} aria-hidden="true">
        DRAG TO INSPECT
      </span>
    </div>
  );
}
