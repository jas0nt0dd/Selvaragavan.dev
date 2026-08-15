import { useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import styles from "./BackgroundFX.module.css";

/**
 * Fixed, non-interactive decorative layers shared by every route:
 *  - a huge bat-silhouette watermark (tries the user's uploaded asset first,
 *    falls back to the hand-built inline SVG bat)
 *  - a faint tactical grid
 *  - a slow-moving scanline pass
 *  - subtle film grain
 * All layers are pointer-events:none and hidden from screen readers.
 */
export function BackgroundFX() {
  const [watermarkFailed, setWatermarkFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.grid} />

      {!watermarkFailed ? (
        <img
          src="/assets/bat-black-silhouette-with-opened-wings.png"
          alt=""
          className={styles.watermarkImg}
          onError={() => setWatermarkFailed(true)}
        />
      ) : (
        <svg viewBox="0 0 200 100" className={styles.watermarkSvg} fill="currentColor">
          <path d="M100 32c-4 5-7 9-16 12-13-10-27-13-43-13 7 9 10 18 11 29-14 5-27 14-35 28 13-4 24-5 35-3-4 6-6 12-6 20 10-8 20-13 31-15 5 11 12 19 22 24-1-11 1-19 4-28 1-3 3-3 4 0 3 9 5 17 4 28 10-5 17-13 22-24 11 2 18 7 31 15 0-8-2-14-6-20 11-2 22-1 35 3-8-14-21-23-35-28 1-11 4-20 11-29-16 0-30 3-43 13-9-3-12-7-16-12z" />
        </svg>
      )}

      {!reducedMotion && <div className={styles.scan} />}
      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  );
}
