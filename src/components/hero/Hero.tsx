import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/primitives";
import { Icon } from "@/icons/icons";
import { profile } from "@/data/profile";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import AnimatedButton from "@/components/ui/animated-button";
import { InteractiveParticles } from "@/components/ui/interactive-particles";
import { BatLogoModel } from "./BatLogoModel";
import styles from "./Hero.module.css";

export function Hero({ landing = false }: { landing?: boolean }) {
  return (
    <section className={`${styles.hero} ${landing ? styles.landing : ""}`} aria-label="Introduction">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h1 className={styles.headline}>
            <TypewriterName />
            <span className={styles.headlineSub}>{profile.headline}</span>
          </h1>

          <div className={styles.roleSequence} aria-live="polite">
            <span className={`${styles.roleLabel} mono`}>CURRENT ROLE</span>
            <RoleCycler />
          </div>

          <AsciiGlitchRipple as="p" className={styles.subhead}>{profile.subhead}</AsciiGlitchRipple>

          <div className={styles.markers}>
            {profile.capabilityMarkers.map((marker) => (
              <AnimatedButton key={marker} as="span" className={styles.marker}>
                <MarkerIcon marker={marker} />
                <AsciiGlitchRipple as="span">{marker}</AsciiGlitchRipple>
              </AnimatedButton>
            ))}
          </div>

          <div className={styles.ctas}>
            <Button as="link" to="/projects" icon="arrow">
              Explore Case Files
            </Button>
            <Button as="link" to="/contact" variant="outline">
              Open a Channel
            </Button>
          </div>

        </div>

        <aside className={styles.modelStage} aria-label="Interactive 3D bat logo">
          <BatLogoModel />
        </aside>
      </div>

    </section>
  );
}

function MarkerIcon({ marker }: { marker: string }) {
  const map: Record<string, "cpu" | "shield" | "robot" | "terminal"> = {
    AI: "cpu",
    SECURITY: "shield",
    ROBOTICS: "robot",
    SYSTEMS: "terminal"
  };
  return <Icon name={map[marker] ?? "cpu"} size={14} />;
}

function TypewriterName() {
  const reducedMotion = usePrefersReducedMotion();
  const full = profile.name;
  const [typed, setTyped] = useState(reducedMotion ? full : "");
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      setTyped(full);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [reducedMotion, full]);

  return (
    <span className={styles.headlineName}>
      <span className={styles.headlineNameMeasure} aria-hidden="true">{full}</span>
      <span ref={textRef} className={styles.headlineNameText} aria-hidden="true">{typed}</span>
      <span className="visually-hidden">{full}</span>
      <InteractiveParticles text={full} sourceRef={textRef} color="#f2c94c" />
    </span>
  );
}

function RoleCycler() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % profile.roles.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const role = profile.roles[activeIndex];

  return (
    <span className={styles.roleStream}>
      <span key={role} className={styles.roleItem}>{role}</span>
    </span>
  );
}
