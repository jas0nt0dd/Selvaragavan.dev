import { useEffect, useRef, useState } from "react";
import { RouteLink } from "@/components/layout/RouteLink";
import { Button, StatusIndicator, Tag } from "@/components/ui/primitives";
import { Icon } from "@/icons/icons";
import { profile } from "@/data/profile";
import { OBJECTWAYS_START_DATE } from "@/data/experience";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import { BatLogoModel } from "./BatLogoModel";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <WhoAmIButton />
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
            <RoleCycler />
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
            <BatLogoModel />
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

function WhoAmIButton() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.currentTime = 0;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  return (
    <div className={styles.identityAudio}>
      <audio
        ref={audioRef}
        src="/assets/audio/who-am-i.mp3"
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        className={styles.identityAudioButton}
        onClick={toggleAudio}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause identity transmission" : "Play identity transmission"}
      >
        <Icon name={isPlaying ? "pause" : "play"} size={14} />
        <span className="mono">{isPlaying ? "TRANSMISSION ACTIVE" : "WHO AM I?"}</span>
      </button>
    </div>
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
