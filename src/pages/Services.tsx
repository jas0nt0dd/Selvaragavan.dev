import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader, Divider, Button } from "@/components/ui/primitives";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/data/services";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import { Icon } from "@/icons/icons";
import type { Service } from "@/types";
import styles from "./Services.module.css";

const VISIBLE_COUNT = 5;
const RADIUS_X = 360;
const RADIUS_Y = 150;
const AUTOPLAY_INTERVAL = 4200;

function getItemPosition(index: number, activeIndex: number, total: number, narrow = false) {
  const offset = index - activeIndex;
  const half = Math.floor(VISIBLE_COUNT / 2);
  let adjustedOffset = offset;

  if (offset > half) adjustedOffset = offset - total;
  if (offset < -half) adjustedOffset = offset + total;

  if (Math.abs(adjustedOffset) > (narrow ? 1 : half * 2)) return null;

  const angle = (adjustedOffset / VISIBLE_COUNT) * Math.PI;
  const x = Math.sin(angle) * (narrow ? 170 : RADIUS_X);
  const y = -Math.cos(angle) * (narrow ? 90 : RADIUS_Y);

  const distance = Math.abs(adjustedOffset);
  const maxDistance = half + 1;
  const scale = Math.max(0, 1 - (distance / maxDistance) * 0.28);
  const opacity = Math.max(0.24, 1 - (distance / maxDistance) * 0.68);
  const zIndex = VISIBLE_COUNT - distance;

  return { x, y, scale, opacity, zIndex };
}

export function Services() {
  return (
    <>
      <div className="container">
        <PageHeader
          index="03"
          eyebrow="Mission Modules"
          title="Services"
          description="Nine ways to work together, scoped from real systems I've already built — not a generic agency menu."
        />
      </div>

      <section className={styles.section}>
        <div className="container">
          <ShopfrontReveal index={0}>
            <CircularServiceCarousel items={services} />
          </ShopfrontReveal>

          <div className={styles.ctaRow}>
            <Divider label="ENGAGEMENT" />
            <p className={styles.ctaText}>
              Every module above starts as a scoped conversation, not a fixed package. Tell me what you're
              building and I'll tell you honestly whether it's a fit.
            </p>
            <Button as="link" to="/contact" icon="arrow">
              Start a conversation
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function CircularServiceCarousel({ items }: { items: Service[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const advance = useCallback(
    (amount: number) => {
      if (total === 0) return;
      setActiveIndex((index) => ((index + amount) % total + total) % total);
    },
    [total]
  );

  const next = useCallback(() => advance(1), [advance]);
  const prev = useCallback(() => advance(-1), [advance]);

  useEffect(() => {
    if (reducedMotion || isHovered || isFocused || total < 2) return;
    const interval = window.setInterval(next, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(interval);
  }, [isFocused, isHovered, next, reducedMotion, total]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    setIsNarrow(query.matches);
    const listener = (event: MediaQueryListEvent) => setIsNarrow(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  };

  if (total === 0) return null;

  const activeService = items[activeIndex];

  return (
    <div
      className={styles.carousel}
      tabIndex={0}
      role="region"
      aria-label="Services circular carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={onKeyDown}
    >
      <div className={styles.carouselTrack}>
        <AnimatePresence mode="popLayout">
          {items.map((service, i) => {
            const position = getItemPosition(i, activeIndex, total, isNarrow);
            if (!position) return null;

            const isActive = i === activeIndex;

            return (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{
                  x: reducedMotion ? 0 : position.x,
                  y: reducedMotion ? 0 : position.y,
                  scale: reducedMotion ? 1 : position.scale,
                  opacity: reducedMotion ? (isActive ? 1 : 0) : position.opacity,
                  zIndex: position.zIndex
                }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.65,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className={`${styles.carouselItem} ${isActive ? styles.carouselItemActive : ""}`}
                aria-hidden={!isActive}
                onClickCapture={(event) => {
                  if (!isActive) {
                    event.preventDefault();
                    event.stopPropagation();
                    goTo(i);
                  }
                }}
              >
                <div className={styles.carouselItemCenter}>
                  <ServiceCard service={service} compact={!isActive} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <motion.div
          key={activeService.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.36, ease: "easeOut" }}
          className={styles.carouselCounter}
          aria-hidden="true"
        >
          <span className={`${styles.carouselNumber} mono`}>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className={`${styles.carouselTotal} mono`}>of {String(total).padStart(2, "0")}</span>
        </motion.div>
      </div>

      <div className={styles.carouselControls}>
        <button
          type="button"
          className={`${styles.carouselControl} ${styles.carouselControlPrev}`}
          aria-label="Previous service"
          onClick={prev}
          data-cursor="interactive"
        >
          <Icon name="chevronRight" size={18} />
        </button>

        <div className={styles.carouselDots} role="tablist" aria-label="Choose a service">
          {items.map((service, i) => (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Show ${service.title}`}
              className={`${styles.carouselDot} ${i === activeIndex ? styles.carouselDotActive : ""}`}
              onClick={() => goTo(i)}
              data-cursor="interactive"
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.carouselControl}
          aria-label="Next service"
          onClick={next}
          data-cursor="interactive"
        >
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * Reveals a service module the way passing shopfronts light up as you walk
 * a street: each card unlocks in sequence as it crosses a trigger line, and
 * un-reveals (walks back into shadow) if you scroll back past it — no
 * one-shot "seen it once" state.
 */
function ShopfrontReveal({ children, index }: { children: ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<"dim" | "lit">("dim");
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setState("lit");
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting ? "lit" : "dim");
      },
      {
        threshold: 0,
        rootMargin: "-12% 0px -18% 0px"
      }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={`${styles.shopfront} ${state === "lit" ? styles.shopfrontLit : ""}`}
      style={{ ["--shop-delay" as string]: `${(index % 3) * 90}ms` }}
    >
      {children}
    </div>
  );
}
