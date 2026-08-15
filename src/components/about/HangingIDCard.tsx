import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import { profile } from "@/data/profile";
import styles from "./HangingIDCard.module.css";

/**
 * A physically-swinging ID badge on a rope, pinned to a nail above the
 * Experience section. Stays hidden until scrolled into view, then drops in
 * and hangs with lightweight pendulum physics. Draggable with the cursor/
 * touch; releases with momentum and settles back to rest.
 */
export function HangingIDCard() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // Physics state (angle in degrees, angular velocity/acceleration)
  const angle = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const rafId = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const idleSeed = useRef(Math.random() * 1000);

  // Reveal once scrolled into view
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Pendulum physics loop
  useEffect(() => {
    if (reducedMotion || !visible) return;
    const STIFFNESS = 0.006;
    const DAMPING = 0.975;
    const IDLE_AMPLITUDE = 1.1;

    let lastT = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(32, t - lastT);
      lastT = t;

      if (!dragging.current) {
        const idleTarget =
          Math.sin((t / 1800) + idleSeed.current) * IDLE_AMPLITUDE;
        const restoring = -(angle.current - idleTarget) * STIFFNESS * dt;
        velocity.current += restoring;
        velocity.current *= DAMPING;
        angle.current += velocity.current * dt * 0.06;
      }

      if (cardRef.current) {
        cardRef.current.style.transform = `rotate(${angle.current}deg)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [visible, reducedMotion]);

  // Drag handlers (pointer events cover mouse + touch)
  useEffect(() => {
    if (reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      dragStartX.current = e.clientX;
      dragStartAngle.current = angle.current;
      velocity.current = 0;
      card.setPointerCapture(e.pointerId);
      card.classList.add(styles.grabbing);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragStartX.current;
      angle.current = Math.max(-42, Math.min(42, dragStartAngle.current + dx * 0.35));
    };

    const release = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      card.classList.remove(styles.grabbing);
      velocity.current = (angle.current - dragStartAngle.current) * 0.02;
      try {
        card.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };

    card.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);

    return () => {
      card.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true">
      <div className={`${styles.rig} ${visible ? styles.rigVisible : ""}`}>
        <div className={styles.nail} />
        <div className={styles.pivot}>
          <div ref={cardRef} className={styles.swing}>
            <svg className={styles.rope} viewBox="0 0 4 90" preserveAspectRatio="none">
              <path d="M2 0 Q -3 45 2 90" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>

            <div className={styles.clip} />

            <div className={styles.card}>
              <div className={styles.cardStripe} />
              <div className={styles.cardHead}>
                <span className={`${styles.cardLabel} mono`}>OPERATOR ID</span>
                <svg viewBox="0 0 64 64" fill="currentColor" className={styles.cardEmblem}>
                  <path d="M32 14c-1.6 2.4-2.5 4-5.4 5.2-4-3.4-9-4.6-14.2-4.6 2.4 3 3.4 6 3.6 9.6-4.6 1.8-8.8 4.8-11.6 9.4 4.4-1.4 8-1.8 11.8-1.2-1.4 2.2-2 4-2 6.6 3.4-2.8 6.6-4.4 10.4-5 1.6 3.6 4 6.2 7.4 8-.4-3.6.2-6.4 1.4-9.4.4-1 .8-1 1.2 0 1.2 3 1.8 5.8 1.4 9.4 3.4-1.8 5.8-4.4 7.4-8 3.8.6 7 2.2 10.4 5 0-2.6-.6-4.4-2-6.6 3.8-.6 7.4-.2 11.8 1.2-2.8-4.6-7-7.6-11.6-9.4.2-3.6 1.2-6.6 3.6-9.6-5.2 0-10.2 1.2-14.2 4.6-2.9-1.2-3.8-2.8-5.4-5.2z" />
                </svg>
              </div>

              <div className={styles.photoSlot}>
                {!photoFailed ? (
                  <img
                    src="/assets/id-photo.jpg"
                    alt=""
                    className={styles.photo}
                    draggable={false}
                    onError={() => setPhotoFailed(true)}
                  />
                ) : (
                  <div className={styles.photoFallback}>SM</div>
                )}
              </div>

              <p className={styles.cardName}>{profile.name}</p>
              <p className={`${styles.cardRole} mono`}>GEN AI ENGINEER</p>
              <div className={styles.cardFooter}>
                <span className="mono">ID // 0x2026</span>
                <span className={styles.cardDot} />
              </div>
              <div className={styles.holePunch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
