import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { navigation } from "@/data/site";
import { profile } from "@/data/profile";
import { useBodyScrollLock } from "@/hooks/useMotionHooks";
import { RouteLink } from "./RouteLink";
import styles from "./CinematicNav.module.css";

export function CinematicNav() {
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useBodyScrollLock(open, "nav-open");

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key === "Tab" && overlayRef.current) {
        const focusables = overlayRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const ringDeg = Math.round(scrollProgress * 360);
  const activeIndex = navigation.findIndex((item) => item.path === location.pathname);
  const radius = 168;
  const count = navigation.length;
  const batLogo = "/assets/bat-black-silhouette-with-opened-wings.png";

  return (
    <>
      <div className={styles.bar}>
        <RouteLink to="/" className={styles.brand} aria-label={`${profile.name} — Home`}>
          <span className={styles.brandGlyph}>
            <img src={batLogo} alt="" width={18} height={18} />
          </span>
          <span className={`${styles.brandText} mono`}>SELVARAGAVAN.M</span>
        </RouteLink>

        <button
          ref={triggerRef}
          type="button"
          className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
          style={{ "--ring-deg": `${ringDeg}deg` } as CSSProperties}
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls="cinematic-nav-overlay"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.triggerRing} />
          <span className={styles.triggerCore}>
            <span className={styles.triggerBar} />
            <span className={styles.triggerBar} />
            <span className={styles.triggerBar} />
          </span>
        </button>
      </div>

      <div
        id="cinematic-nav-overlay"
        ref={overlayRef}
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
      >
        <div className={styles.overlayGrid} aria-hidden="true" />
        <div className={styles.overlayScan} aria-hidden="true" />

        <div className={styles.radialField}>
          <div className={styles.radialCenter}>
            <img src={batLogo} alt="" className={styles.radialBat} width={30} height={30} />
            <span className={`${styles.radialLabel} mono`}>
              {hovered !== null ? navigation[hovered].label : "SELECT"}
            </span>
          </div>

          {navigation.map((item, i) => {
            const angle = (i / count) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isActive = i === activeIndex;
            return (
              <RouteLink
                key={item.path}
                ref={i === 0 ? firstLinkRef : undefined}
                to={item.path}
                className={`${styles.node} ${isActive ? styles.nodeActive : ""}`}
                tabIndex={open ? 0 : -1}
                style={
                  {
                    "--node-x": `${x}px`,
                    "--node-y": `${y}px`,
                    "--node-delay": `${i * 55}ms`
                  } as CSSProperties
                }
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
              >
                <span className={`${styles.nodeIndex} mono`}>{item.index}</span>
                <span className={styles.nodeLabel}>{item.label}</span>
                <span className={styles.nodeOrbit} />
              </RouteLink>
            );
          })}

          <svg className={styles.connectorSvg} viewBox="-200 -200 400 400" aria-hidden="true">
            <circle cx="0" cy="0" r={radius} className={styles.orbitRing} />
          </svg>
        </div>

        <div className={styles.overlayFooter}>
          <span className="mono">{profile.location}</span>
          <span className="mono">{profile.email}</span>
        </div>
      </div>
    </>
  );
}
