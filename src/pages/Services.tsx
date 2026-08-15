import { useEffect, useRef, useState } from "react";
import { PageHeader, Divider, Button } from "@/components/ui/primitives";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/data/services";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import styles from "./Services.module.css";

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
          <div className={styles.grid}>
            {services.map((service, i) => (
              <ShopfrontReveal key={service.id} index={i}>
                <ServiceCard service={service} />
              </ShopfrontReveal>
            ))}
          </div>

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

/**
 * Reveals a service module the way passing shopfronts light up as you walk
 * a street: each card unlocks in sequence as it crosses a trigger line, and
 * un-reveals (walks back into shadow) if you scroll back past it — no
 * one-shot "seen it once" state.
 */
function ShopfrontReveal({ children, index }: { children: React.ReactNode; index: number }) {
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
