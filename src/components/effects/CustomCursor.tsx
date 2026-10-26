import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion, useIsTouchDevice } from "@/hooks/useMotionHooks";
import styles from "./CustomCursor.module.css";

const BAT_CURSOR_SRC = "/assets/bat-black-silhouette-with-opened-wings.png";
const BAT_HOTSPOT_X = 0.5;
const BAT_HOTSPOT_Y = 0.73;
const BAT_LEADER_WIDTH_MOVING = 54;
const BAT_LEADER_WIDTH_IDLE = 42;
const BAT_FOLLOWER_WIDTH_MOVING = 24;
const BAT_FOLLOWER_WIDTH_IDLE = 14;
const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "input",
  "textarea",
  "select",
  "summary",
  "label",
  "[tabindex]:not([tabindex='-1'])",
  "[data-cursor='interactive']"
].join(", ");

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
    const context = ctx;

    document.body.classList.add("has-custom-cursor");

    const batImage = new Image();
    batImage.src = BAT_CURSOR_SRC;

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
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      const hotspotX = isLeader ? imgW * BAT_HOTSPOT_X : imgW / 2;
      const hotspotY = isLeader ? imgH * BAT_HOTSPOT_Y : imgH / 2;
      drawingContext.translate(-hotspotX, -hotspotY);

      if (isLeader) {
        drawingContext.shadowBlur = 28;
        drawingContext.shadowColor = "rgba(255, 59, 78, 0.78)";
      }

      drawingContext.drawImage(batImage, 0, 0, imgW, imgH);

      if (isLeader) {
        drawingContext.globalCompositeOperation = "screen";
        drawingContext.fillStyle = "rgba(255, 59, 78, 0.34)";
        drawingContext.beginPath();
        drawingContext.ellipse(imgW / 2, imgH / 2, imgW * 0.24, imgH * 0.14, 0, 0, Math.PI * 2);
        drawingContext.fill();
      }

      drawingContext.restore();
    }

    function scaleForWidth(width: number) {
      if (!batImage.naturalWidth) return width / 512;
      return width / batImage.naturalWidth;
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
      const interactive = !!el?.closest(INTERACTIVE_SELECTOR);
      setHoveringInteractive((current) => (current === interactive ? current : interactive));
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
      leader.x = mouse.x;
      leader.y = mouse.y;

      const angle = speed > 0.5 ? Math.atan2(dy, dx) : lastAngle;
      lastAngle = angle;
      const scrollBank = Math.max(-1, Math.min(1, scrollVel * 0.04));
      scrollVel *= 0.88;

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

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

        const followerWidth = (isMoving ? BAT_FOLLOWER_WIDTH_MOVING : BAT_FOLLOWER_WIDTH_IDLE) * (0.75 + 0.35 * moveFactor);
        const followerScale = scaleForWidth(followerWidth);
        if (isMoving) {
          context.save();
          context.globalAlpha = bat.opacity;
          drawImageBat(context, bat.x, bat.y, followerScale, angle, bat.flap, false);
          context.restore();
        }
      }

      leader.flap += 0.22;
      const leaderScale = scaleForWidth(isMoving ? BAT_LEADER_WIDTH_MOVING : BAT_LEADER_WIDTH_IDLE);
      context.save();
      context.shadowBlur = isMoving ? 58 : 34;
      context.shadowColor = isMoving ? "rgba(255, 59, 78, 0.88)" : "rgba(255, 59, 78, 0.48)";
      drawImageBat(context, leader.x, leader.y, leaderScale, angle, leader.flap, true);
      context.restore();

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
