import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import styles from "./ProjectDissolveMedia.module.css";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uProgress;
  uniform float uHandoff;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x),
      local.y
    );
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(point);
      point *= 2.02;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 coverRatio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );

    vec2 imageUv = vec2(
      vUv.x * coverRatio.x + (1.0 - coverRatio.x) * 0.5,
      vUv.y * coverRatio.y + (1.0 - coverRatio.y) * 0.5
    );

    vec4 textureColor = texture2D(uTexture, imageUv);
    vec2 centeredUv = vUv - 0.5;
    centeredUv.x *= uResolution.x / uResolution.y;

    float maxDistance = length(vec2((uResolution.x / uResolution.y) * 0.5, 0.5));
    float radialField = 1.0 - (length(centeredUv) / maxDistance);
    float grain = fbm(vUv * 9.0 + vec2(uTime * 0.03, -uTime * 0.02));
    float field = radialField + (grain - 0.5) * 0.28;

    float threshold = 1.16 - uProgress * 1.4;
    float reveal = smoothstep(threshold - 0.075, threshold + 0.075, field);
    float edge = 1.0 - smoothstep(0.0, 0.11, abs(field - threshold));
    vec3 dissolveEdge = vec3(1.0, 0.12, 0.18) * edge * (1.0 - reveal * 0.45);

    vec3 voidColor = vec3(0.008, 0.012, 0.018);
    vec3 finalColor = mix(voidColor, textureColor.rgb, reveal) + dissolveEdge;

    // The media beneath always remains visible, even while a texture is still warming up.
    gl_FragColor = vec4(finalColor, 0.52 * (1.0 - uHandoff));
  }
`;

interface DissolvePlaneProps {
  image: string;
  progress: MotionValue<number>;
}

function DissolvePlane({ image, progress }: DissolvePlaneProps) {
  const texture = useTexture(image);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const textureImage = texture.image as { width: number; height: number };

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: { value: new THREE.Vector2(textureImage.width, textureImage.height) },
      uProgress: { value: 0 },
      uHandoff: { value: 0 },
      uTime: { value: 0 }
    }),
    [size.height, size.width, texture, textureImage.height, textureImage.width]
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    const cardProgress = progress.get();
    // Finish while the case file is still entering so the preview is ready when its copy settles.
    const dissolveProgress = THREE.MathUtils.clamp((cardProgress - 0.03) / 0.23, 0, 1);

    materialRef.current.uniforms.uProgress.value = dissolveProgress;
    materialRef.current.uniforms.uHandoff.value = THREE.MathUtils.smoothstep(dissolveProgress, 0.78, 1);
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

interface ProjectDissolveMediaProps {
  src: string;
  alt: string;
  progress: MotionValue<number>;
}

export function ProjectDissolveMedia({ src, alt, progress }: ProjectDissolveMediaProps) {
  return (
    <div className={styles.frame}>
      <Canvas
        className={styles.canvas}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        fallback={<img className={styles.fallbackImage} src={src} alt={alt} loading="lazy" />}
      >
        <OrthographicCamera
          makeDefault
          manual
          left={-1}
          right={1}
          top={1}
          bottom={-1}
          near={0.1}
          far={10}
          position={[0, 0, 1]}
        />
        <Suspense fallback={null}>
          <DissolvePlane image={src} progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ProjectDissolveMedia;
