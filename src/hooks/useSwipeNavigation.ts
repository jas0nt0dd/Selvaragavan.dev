import { useEffect, useRef, type RefObject } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { navigation } from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import { runViewTransition } from "@/lib/viewTransition";

const SWIPE_THRESHOLD = 60; // px
const SWIPE_RESTRAINT = 90; // max vertical drift allowed, px
const SWIPE_MAX_TIME = 600; // ms

/**
 * Enables swipe-to-navigate between the primary routes on touch devices:
 * swipe left -> next route, swipe right -> previous route. Mirrors the
 * ordering defined in data/site.ts so it always matches the visible nav.
 */
export function useSwipeNavigation(containerRef: RefObject<HTMLElement>) {
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const currentIndex = navigation.findIndex((item) => item.path === location.pathname);

    const onTouchStart = (event: TouchEvent) => {
      const t = event.changedTouches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!touchStart.current || currentIndex === -1) return;
      const t = event.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      const dt = Date.now() - touchStart.current.time;
      touchStart.current = null;

      if (dt > SWIPE_MAX_TIME || Math.abs(dy) > SWIPE_RESTRAINT || Math.abs(dx) < SWIPE_THRESHOLD) {
        return;
      }

      const nextIndex = dx < 0 ? currentIndex + 1 : currentIndex - 1;
      const target = navigation[nextIndex];
      if (!target) return;

      runViewTransition(() => navigate(target.path), reducedMotion);
    };

    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchend", onTouchEnd);
    };
  }, [containerRef, location.pathname, navigate, reducedMotion]);
}
