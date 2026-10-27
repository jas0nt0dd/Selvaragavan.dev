import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import type { Service } from "@/types";
import styles from "./ServiceModelViewer.module.css";

const MODEL_PATHS: Record<Service["id"], string> = {
  "genai-prototypes": "/assets/3D/cyber_butterfly.glb",
  "workflow-automation": "/assets/3D/neural_brain.glb",
  "computer-vision": "/assets/3D/cv_eye_logo.glb",
  "security-tooling": "/assets/3D/crimson_hooded_figure.glb",
  "robotics-hardware": "/assets/3D/holo_robot_full.glb",
  "fullstack-ai": "/assets/3D/tech_cubes.glb",
  "mlops-environments": "/assets/3D/tech_cloud.glb",
  "research-prototypes": "/assets/3D/tech_bulb_brain.glb",
  "qa-automation": "/assets/3D/cyber_gear.glb"
};

const MODEL_SCALE_OVERRIDES: Partial<Record<Service["id"], number>> = {
  "genai-prototypes": 0.78,
  "computer-vision": 0.82,
  "security-tooling": 0.82,
  "workflow-automation": 1.18,
  "robotics-hardware": 1.18,
  "research-prototypes": 1.18
};

function ServiceModel({ path, serviceId }: { path: string; serviceId: Service["id"] }) {
  const model = useGLTF(path);
  const groupRef = useRef<Group>(null);
  const reducedMotion = usePrefersReducedMotion();
  const modelScale = useMemo(() => {
    const bounds = new Box3().setFromObject(model.scene);
    const size = bounds.getSize(new Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z);
    const normalizedScale = largestDimension > 0 ? 3.4 / largestDimension : 1;
    return normalizedScale * (MODEL_SCALE_OVERRIDES[serviceId] ?? 1);
  }, [model.scene, serviceId]);

  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <Center>
      <group ref={groupRef} scale={modelScale}>
        <primitive object={model.scene} />
      </group>
    </Center>
  );
}

function ServiceModelControls({ reducedMotion }: { reducedMotion: boolean }) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const returningHome = useRef(false);
  const homePosition = useRef(new Vector3(0, 0, 4));
  const homeTarget = useRef(new Vector3(0, 0, 0));
  const { camera } = useThree();

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || !returningHome.current) return;

    const ease = Math.min(1, delta * 3);
    camera.position.lerp(homePosition.current, ease);
    controls.target.lerp(homeTarget.current, ease);
    controls.update();

    if (camera.position.distanceTo(homePosition.current) < 0.01 && controls.target.length() < 0.01) {
      camera.position.copy(homePosition.current);
      controls.target.copy(homeTarget.current);
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

const modelPaths = Object.values(MODEL_PATHS);
modelPaths.forEach((path) => useGLTF.preload(path));

export function ServiceModelViewer({ service }: { service: Service }) {
  const reducedMotion = usePrefersReducedMotion();
  const path = MODEL_PATHS[service.id];

  return (
    <div className={styles.viewer} aria-label={`${service.title} 3D model`}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0, 4], fov: 38 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 4, 5]} intensity={3} color="#f0f3f8" />
        <pointLight position={[-3, -1, 2]} intensity={18} distance={8} color="#c4172b" />
        <Suspense fallback={null}>
          <ServiceModel path={path} serviceId={service.id} />
        </Suspense>
        <ServiceModelControls reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
