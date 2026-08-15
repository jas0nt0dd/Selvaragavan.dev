import { useEffect, useRef, useState } from "react";
import styles from "./BatSignalTransition.module.css";

/**
 * Listens for the custom "bat-signal:fire" event dispatched by RouteLink /
 * useSwipeNavigation right before a view transition starts, and flashes a
 * crimson searchlight beam with your bat emblem burning in — the Arkham
 * Knight loading-screen beat. Purely decorative; sits above everything
 * during the ~650ms it takes the route transition to settle.
 */
export function BatSignalTransition() {
  const [cycle, setCycle] = useState(0);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const onFire = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      setVisible(false);
      setCycle((value) => value + 1);
      requestAnimationFrame(() => setVisible(true));

      timeoutRef.current = window.setTimeout(() => {
        setVisible(false);
      }, 1200);
    };

    window.addEventListener("bat-signal:fire", onFire);
    return () => {
      window.removeEventListener("bat-signal:fire", onFire);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <div key={cycle} className={styles.root} aria-hidden="true">
      <div className={styles.beam} />
      <div className={styles.glow} />
      <img
        src="/assets/apple-touch-icon.png"
        alt=""
        className={styles.emblem}
        width={180}
        height={180}
      />
    </div>
  );
}
