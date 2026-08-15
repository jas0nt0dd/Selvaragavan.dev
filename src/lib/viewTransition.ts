import { flushSync } from "react-dom";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

export function supportsViewTransitions(): boolean {
  return typeof document !== "undefined" && "startViewTransition" in document;
}

export function runViewTransition(update: () => void, reducedMotion: boolean) {
  const doc = document as ViewTransitionDocument;

  if (reducedMotion) {
    update();
    return;
  }

  // Fire the bat-signal beam overlay in lockstep with the route change.
  window.dispatchEvent(new CustomEvent("bat-signal:fire"));

  if (!doc.startViewTransition) {
    update();
    return;
  }
  doc.startViewTransition(() => flushSync(update));
}
