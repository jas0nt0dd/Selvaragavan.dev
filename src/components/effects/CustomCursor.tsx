import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion, useIsTouchDevice } from "@/hooks/useMotionHooks";
import styles from "./CustomCursor.module.css";

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const isTouch = useIsTouchDevice();
  const reducedMotion = usePrefersReducedMotion();

  const disabled = isTouch || reducedMotion;

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.body.classList.add("has-custom-cursor");
    setActive(true);

    const batImage = new Image();
    batImage.src = "/assets/apple-touch-icon.png";

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isMoving = false;
    let idleTimer: number | null = null;
    let lastAngle = 0;
    let moveFactor = 0;
    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    let frame = 0;

    const leader = { x: mouse.x, y: mouse.y, flap: 0 };
    const followers = Array.from({ length: 6 }, (_, index) => ({
      x: mouse.x,
      y: mouse.y,
      flap: Math.random() * 6,
      index,
      opacity: 0
    }));

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawImageBat(
      drawingContext: CanvasRenderingContext2D,
      x: number,
      y: number,
      scale: number,
      angle: number,
      flap: number,
      isLeader: boolean
    ) {
      if (!batImage.complete || !batImage.naturalWidth || !batImage.naturalHeight) return;

      drawingContext.save();
      drawingContext.translate(x, y);
      drawingContext.rotate(angle);
      drawingContext.scale(scale, scale * (0.8 + 0.2 * Math.cos(flap)));

      const imgW = batImage.naturalWidth;
      const imgH = batImage.naturalHeight;
      drawingContext.translate(-imgW / 2, -imgH / 2);

      if (isLeader) {
        drawingContext.shadowBlur = 18;
        drawingContext.shadowColor = "rgba(255, 80, 80, 0.42)";
      }

      drawingContext.drawImage(batImage, 0, 0, imgW, imgH);

      if (isLeader) {
        drawingContext.globalCompositeOperation = "screen";
        drawingContext.fillStyle = "rgba(255, 80, 80, 0.18)";
        drawingContext.beginPath();
        drawingContext.ellipse(imgW / 2, imgH / 2, imgW * 0.24, imgH * 0.14, 0, 0, Math.PI * 2);
        drawingContext.fill();
      }

      drawingContext.restore();
    }

    const formationOffset = (index: number) => {
      const row = Math.ceil(index / 2);
      const side = index % 2 === 0 ? 1 : -1;
      return { back: row * 38, side: side * row * 22 };
    };

    const onMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      isMoving = true;
      setActive(true);
      clearTimeout(idleTimer ?? undefined);
      idleTimer = window.setTimeout(() => {
        isMoving = false;
      }, 120);

      const el = document.elementFromPoint(event.clientX, event.clientY);
      const interactive = !!el?.closest("a, button, [role='button'], input, textarea, [data-cursor='interactive']");
      setHoveringInteractive(interactive);
    };

    const onLeave = () => {
      isMoving = false;
      setHoveringInteractive(false);
    };

    const onScroll = () => {
      scrollVel = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
    };

    const animate = () => {
      const targetFactor = isMoving ? 1 : 0;
      moveFactor += (targetFactor - moveFactor) * 0.12;

      const dx = mouse.x - leader.x;
      const dy = mouse.y - leader.y;
      const speed = Math.hypot(dx, dy);
      leader.x += dx * 0.22;
      leader.y += dy * 0.22;

      const angle = speed > 0.5 ? Math.atan2(dy, dx) : lastAngle;
      lastAngle = angle;
      const scrollBank = Math.max(-1, Math.min(1, scrollVel * 0.04));
      scrollVel *= 0.88;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let index = 1; index < followers.length; index += 1) {
        const bat = followers[index];
        const offset = formationOffset(index);
        const row = Math.ceil(index / 2);
        const currentBack = offset.back * moveFactor;
        const currentSide = offset.side * moveFactor;
        const targetX = leader.x - Math.cos(angle) * currentBack - Math.sin(angle) * currentSide;
        const targetY = leader.y - Math.sin(angle) * currentBack + Math.cos(angle) * currentSide + (scrollBank * row * 4 * moveFactor);
        const ease = 0.14 - index * 0.01;

        bat.x += (targetX - bat.x) * ease;
        bat.y += (targetY - bat.y) * ease;
        bat.flap += 0.18 + index * 0.01;
        bat.opacity = isMoving ? 0.2 + (index / followers.length) * 0.7 : 0;

        if (!isMoving) {
          bat.x = leader.x;
          bat.y = leader.y;
        }

        const followerScale = (isMoving ? 0.26 : 0.12) * (0.75 + 0.35 * moveFactor);
        if (isMoving) {
          ctx.save();
          ctx.globalAlpha = bat.opacity;
          drawImageBat(ctx, bat.x, bat.y, followerScale, angle, bat.flap, false);
          ctx.restore();
        }
      }

      leader.flap += 0.22;
      const leaderScale = isMoving ? 0.52 : 0.33;
      ctx.save();
      ctx.shadowBlur = isMoving ? 42 : 22;
      ctx.shadowColor = isMoving ? "rgba(255, 80, 80, 0.6)" : "rgba(255, 80, 80, 0.28)";
      drawImageBat(ctx, leader.x, leader.y, leaderScale, angle, leader.flap, true);
      ctx.restore();

      frame = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(frame);
      if (idleTimer) window.clearTimeout(idleTimer);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${styles.canvas} ${active ? styles.visible : ""} ${hoveringInteractive ? styles.hovering : ""}`}
    />
  );
}
