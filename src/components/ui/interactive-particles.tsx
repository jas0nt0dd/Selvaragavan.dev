import { useEffect, useRef, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import styles from "./InteractiveParticles.module.css";

interface InteractiveParticlesProps {
  text: string;
  sourceRef: RefObject<HTMLElement>;
  color?: string;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  alpha: number;
}

export function InteractiveParticles({
  text,
  sourceRef,
  color = "#f2c94c",
  className = ""
}: InteractiveParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !source || !context) return;

    let particles: Particle[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let pointerX = -Infinity;
    let pointerY = -Infinity;
    let pointerTargetX = -Infinity;
    let pointerTargetY = -Infinity;
    let pointerActive = false;
    let pointerStrength = 0;

    const createParticles = () => {
      const bounds = source.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const sampler = document.createElement("canvas");
      sampler.width = Math.ceil(width);
      sampler.height = Math.ceil(height);
      const samplerContext = sampler.getContext("2d", { willReadFrequently: true });
      if (!samplerContext) return;

      const computed = window.getComputedStyle(source);
      samplerContext.font = computed.font;
      samplerContext.textAlign = computed.textAlign as CanvasTextAlign;
      samplerContext.textBaseline = "middle";
      samplerContext.fillStyle = "#fff";
      const textX = computed.textAlign === "center" ? width / 2 : computed.textAlign === "right" ? width : 0;
      samplerContext.fillText(text, textX, height / 2, width);

      const pixels = samplerContext.getImageData(0, 0, sampler.width, sampler.height).data;
      const step = Math.max(3, Math.sqrt((width * height) / 6500));
      const nextParticles: Particle[] = [];

      for (let y = 0; y < sampler.height; y += step) {
        for (let x = 0; x < sampler.width; x += step) {
          const alpha = pixels[(Math.floor(y) * sampler.width + Math.floor(x)) * 4 + 3];
          if (alpha < 110) continue;

          nextParticles.push({
            x: x + (Math.random() - 0.5) * 5,
            y: y + (Math.random() - 0.5) * 5,
            targetX: x,
            targetY: y,
            velocityX: 0,
            velocityY: 0,
            radius: 0.75 + Math.random() * 0.7,
            alpha: 0.55 + Math.random() * 0.45
          });
        }
      }

      particles = nextParticles;
      draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;

      if (!reduceMotion) {
        if (pointerActive) {
          if (!Number.isFinite(pointerX) || !Number.isFinite(pointerY)) {
            pointerX = pointerTargetX;
            pointerY = pointerTargetY;
          } else {
            pointerX += (pointerTargetX - pointerX) * 0.14;
            pointerY += (pointerTargetY - pointerY) * 0.14;
          }
          pointerStrength += (1 - pointerStrength) * 0.08;
        } else {
          pointerStrength *= 0.94;
        }
      }

      for (const particle of particles) {
        if (!reduceMotion) {
          const dx = particle.x - pointerX;
          const dy = particle.y - pointerY;
          const distance = Math.hypot(dx, dy);
          const radius = 88;

          if (pointerStrength > 0.01 && distance > 0 && distance < radius) {
            const falloff = 1 - distance / radius;
            const force = falloff * falloff * pointerStrength * 0.8;
            particle.velocityX += ((dx / distance) - (dy / distance) * 0.12) * force;
            particle.velocityY += ((dy / distance) + (dx / distance) * 0.12) * force;
          }

          particle.velocityX += (particle.targetX - particle.x) * 0.045;
          particle.velocityY += (particle.targetY - particle.y) * 0.045;
          particle.velocityX *= 0.91;
          particle.velocityY *= 0.91;
          particle.x += particle.velocityX;
          particle.y += particle.velocityY;
        }

        context.globalAlpha = particle.alpha;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      if (!reduceMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    const movePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerTargetX = event.clientX - bounds.left;
      pointerTargetY = event.clientY - bounds.top;
      pointerActive = true;
    };
    const clearPointer = () => {
      pointerActive = false;
    };

    const resizeObserver = new ResizeObserver(createParticles);
    resizeObserver.observe(source);
    canvas.addEventListener("pointermove", movePointer, { passive: true });
    canvas.addEventListener("pointerleave", clearPointer);
    void document.fonts.ready.then(createParticles);
    createParticles();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", movePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
    };
  }, [color, reduceMotion, sourceRef, text]);

  return (
    <span className={`${styles.particleLayer} ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </span>
  );
}
