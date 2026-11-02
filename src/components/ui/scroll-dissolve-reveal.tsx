import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import * as THREE from "three";
import styles from "./scroll-dissolve-reveal.module.css";

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
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  varying vec2 vUv;

  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    float a = hash(cell);
    float b = hash(cell + vec2(1.0, 0.0));
    float c = hash(cell + vec2(0.0, 1.0));
    float d = hash(cell + vec2(1.0, 1.0));
    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(point);
      point *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  float sobel(sampler2D textureSampler, vec2 uv, vec2 texelSize) {
    float topLeft = getLuminance(texture2D(textureSampler, uv + texelSize * vec2(-1.0, -1.0)).rgb);
    float top = getLuminance(texture2D(textureSampler, uv + texelSize * vec2(0.0, -1.0)).rgb);
    float topRight = getLuminance(texture2D(textureSampler, uv + texelSize * vec2(1.0, -1.0)).rgb);
    float left = getLuminance(texture2D(textureSampler, uv + texelSize * vec2(-1.0, 0.0)).rgb);
    float right = getLuminance(texture2D(textureSampler, uv + texelSize * vec2(1.0, 0.0)).rgb);
    float bottomLeft = getLuminance(texture2D(textureSampler, uv + texelSize * vec2(-1.0, 1.0)).rgb);
    float bottom = getLuminance(texture2D(textureSampler, uv + texelSize * vec2(0.0, 1.0)).rgb);
    float bottomRight = getLuminance(texture2D(textureSampler, uv + texelSize * vec2(1.0, 1.0)).rgb);
    float horizontal = -topLeft - 2.0 * left - bottomLeft + topRight + 2.0 * right + bottomRight;
    float vertical = -topLeft - 2.0 * top - topRight + bottomLeft + 2.0 * bottom + bottomRight;
    return sqrt(horizontal * horizontal + vertical * vertical);
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    vec4 textureColor = texture2D(uTexture, uv);
    vec2 centeredUv = vUv - uCenter;
    centeredUv.x *= uResolution.x / uResolution.y;
    float distanceFromCenter = length(centeredUv);
    float aspect = uResolution.x / uResolution.y;
    float maxDistance = length(vec2(aspect * 0.5, 0.5));
    float pixelNoise = fbm(floor(vUv * uResolution / 6.0) * 6.0 / uResolution * 100.0) * 0.15;
    float angularNoise = fbm(vec2(atan(centeredUv.y, centeredUv.x) * 5.0, 0.0)) * 0.15;
    float normalizedDistance = (distanceFromCenter + pixelNoise + angularNoise) / maxDistance;
    float threshold = uDissolve * 1.5;
    float mask = smoothstep(threshold - 0.03, threshold, normalizedDistance);
    float edge = clamp(pow(sobel(uTexture, uv, 1.0 / uResolution), 0.7) * 2.0, 0.0, 1.0);
    float edgeZone = 1.0 - smoothstep(0.0, 0.12, abs(normalizedDistance - threshold));
    vec3 glow = vec3(1.0) * edge * edgeZone * (1.0 - uDissolve);
    gl_FragColor = vec4(textureColor.rgb + glow, textureColor.a * mask);
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
  const imageSize = texture.image as { width: number; height: number };
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: { value: new THREE.Vector2(imageSize.width, imageSize.height) },
      uDissolve: { value: 0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 }
    }),
    [imageSize.height, imageSize.width, size, texture]
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uDissolve.value = THREE.MathUtils.clamp(progress.get(), 0, 1);
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
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

export interface ScrollDissolveRevealProps {
  progress: MotionValue<number>;
  imageFront?: string;
}

export function ScrollDissolveReveal({
  progress,
  imageFront = "/assets/swipe/bat.png"
}: ScrollDissolveRevealProps) {
  const [progressValue, setProgressValue] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    setProgressValue(THREE.MathUtils.clamp(value, 0, 1));
  });

  return (
    <div className={styles.overlay} aria-hidden="true">
      <img
        className={styles.coverImage}
        src={imageFront}
        alt=""
        style={{ opacity: 1 - progressValue }}
      />
      <Canvas
        className={styles.canvas}
        style={{ opacity: progressValue >= 0.98 ? 0 : 1 }}
        dpr={[1, 1.25]}
        frameloop="always"
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
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
          <DissolvePlane image={imageFront} progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
