import { useEffect, useState } from "react";
import { RouteLink } from "@/components/layout/RouteLink";
import { Button, StatusIndicator, Tag } from "@/components/ui/primitives";
import { Icon } from "@/icons/icons";
import { profile } from "@/data/profile";
import { OBJECTWAYS_START_DATE } from "@/data/experience";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import { FlipText } from "@/components/effects/FlipText";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>
            <StatusIndicator label="SYSTEM ONLINE" />
            <span className={`${styles.eyebrowDivider} mono`}>//</span>
            <span className="mono">{profile.location.toUpperCase()}</span>
          </div>

          <h1 className={styles.headline}>
            <TypewriterName />
            <span className={styles.headlineSub}>{profile.headline}</span>
          </h1>

          <div className={styles.roleSequence} aria-live="polite">
            <span className={`${styles.roleLabel} mono`}>CURRENT ROLE</span>
            <FlipText duration={2.8} delay={0.2}>
              {profile.roles[0]}
            </FlipText>
          </div>

          <AsciiGlitchRipple as="p" className={styles.subhead}>{profile.subhead}</AsciiGlitchRipple>

          <div className={styles.markers}>
            {profile.capabilityMarkers.map((marker) => (
              <span key={marker} className={styles.marker}>
                <MarkerIcon marker={marker} />
                <AsciiGlitchRipple as="span">{marker}</AsciiGlitchRipple>
              </span>
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

        <aside className={styles.panel} aria-label="System status readout">
          <div className={styles.panelHead}>
            <span className="mono">STATUS READOUT</span>
            <Icon name="cpu" size={16} />
          </div>
          <div className={styles.videoContainer}>
            <video
              className={styles.statusVideo}
              src="/assets/metal-human/metal-human.mp4"
              poster="/assets/metal-human/metal-human.jpg"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className={styles.panelFoot}>
            <RoleTicker />
            <EmploymentStatusLine />
          </div>
        </aside>
      </div>

      <RouteLink to="/about" className={styles.scrollCue} aria-label="Scroll to learn more">
        <span className="mono">DESCEND</span>
        <span className={styles.scrollLine} />
        <Icon name="chevronDown" size={16} />
      </RouteLink>
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
      <span>{typed}</span>
      <span className="visually-hidden">{full}</span>
    </span>
  );
}

function EmploymentStatusLine() {
  const now = new Date();
  const started = now >= OBJECTWAYS_START_DATE;
  return (
    <AsciiGlitchRipple as="p" className={`${styles.employment} mono`}>
      {started ? "GEN AI ENGINEER — OBJECTWAYS · ACTIVE" : "GEN AI ENGINEER — OBJECTWAYS · INCOMING"}
    </AsciiGlitchRipple>
  );
}

function RoleTicker() {
  return (
    <div className={styles.roleTicker}>
      {profile.roles.map((role) => (
        <Tag key={role}>{role}</Tag>
      ))}
    </div>
  );
}
