import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import styles from "./Preloader.module.css";

const BOOT_LINES = [
  "INITIALIZING SYSTEM",
  "LOADING CASE FILES",
  "CALIBRATING SIGNAL",
  "READY"
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const reducedMotion = usePrefersReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const batLogo = "/assets/bat-black-silhouette-with-opened-wings.png";

  useEffect(() => {
    if (reducedMotion) {
      onDone();
      return;
    }

    const stepMs = 320;
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setLineIndex(i), i * stepMs));
    });

    timers.push(
      setTimeout(() => setLeaving(true), BOOT_LINES.length * stepMs + 260)
    );
    timers.push(
      setTimeout(onDone, BOOT_LINES.length * stepMs + 260 + 520)
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className={`${styles.root} ${leaving ? styles.leaving : ""}`} role="status" aria-live="polite">
      <div className={styles.emblem}>
        <img src={batLogo} alt="" className={styles.emblemImg} width={56} height={56} />
      </div>
      <p className={`${styles.line} mono`}>{BOOT_LINES[lineIndex]}</p>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${((lineIndex + 1) / BOOT_LINES.length) * 100}%` }} />
      </div>
    </div>
  );
}
