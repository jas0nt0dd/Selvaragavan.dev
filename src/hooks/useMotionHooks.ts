import { useEffect, useRef, useState } from "react";

/** True when the user has requested reduced motion at the OS/browser level. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}

/**
 * Attaches an IntersectionObserver to the returned ref and reports whether
 * the element has entered the viewport. Used by <Reveal> for scroll-in
 * animation across every page. Reveals once and stays visible.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, threshold]);

  return { ref, visible };
}

/** Locks body scroll while `locked` is true (used by the nav overlay and project modal). */
export function useBodyScrollLock(locked: boolean, className = "modal-open") {
  useEffect(() => {
    if (!locked) return;
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, [locked, className]);
}

/** True once the component has mounted on the client (avoids SSR/first-paint flashes). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Lightweight existence check for a static asset (resume PDF, poster image).
 * Lets the UI hide a link/element gracefully instead of shipping a dead link.
 */
export function useAssetExists(path?: string) {
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!path) {
      setExists(false);
      return;
    }
    let cancelled = false;
    fetch(path, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setExists(res.ok);
      })
      .catch(() => {
        if (!cancelled) setExists(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return exists;
}

/** Coarse-pointer / touch detection, used to disable the custom cursor and hover-only affordances. */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    setIsTouch(query.matches);
    const listener = (event: MediaQueryListEvent) => setIsTouch(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);
  return isTouch;
}
