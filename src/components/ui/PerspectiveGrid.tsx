import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./PerspectiveGrid.module.css";

interface PerspectiveGridProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function PerspectiveGrid({ rows = 20, cols = 20, className = "" }: PerspectiveGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tiles = useMemo(() => Array.from({ length: rows * cols }, (_, index) => index), [rows, cols]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let tileCenters: Array<{ index: number; x: number; y: number }> = [];
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const updateTileCenters = () => {
      tileCenters = Array.from(root.querySelectorAll<HTMLElement>("[data-grid-cell]"), (tile, index) => {
        const bounds = tile.getBoundingClientRect();
        return {
          index,
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2
        };
      });
    };

    const setActiveTileAtPointer = () => {
      frame = 0;
      let nearestIndex: number | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const tile of tileCenters) {
        const dx = pointerX - tile.x;
        const dy = pointerY - tile.y;
        const distance = dx * dx + dy * dy;

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = tile.index;
        }
      }

      if (nearestIndex !== activeIndexRef.current) {
        activeIndexRef.current = nearestIndex;
        setActiveIndex(nearestIndex);
      }
    };

    const updateActiveTile = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(setActiveTileAtPointer);
    };

    const clearActiveTile = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      activeIndexRef.current = null;
      setActiveIndex(null);
    };

    updateTileCenters();
    window.addEventListener("pointermove", updateActiveTile, { passive: true });
    window.addEventListener("blur", clearActiveTile);
    window.addEventListener("resize", updateTileCenters, { passive: true });
    const resizeObserver = new ResizeObserver(updateTileCenters);
    resizeObserver.observe(root);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updateActiveTile);
      window.removeEventListener("blur", clearActiveTile);
      window.removeEventListener("resize", updateTileCenters);
      resizeObserver.disconnect();
    };
  }, [tiles]);

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`.trim()} aria-hidden="true">
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
        }}
      >
        {tiles.map((index) => (
          <div
            key={index}
            className={`${styles.tile} ${activeIndex === index ? styles.tileActive : ""}`}
            data-grid-cell
          >
            {activeIndex === index && (
              <img className={styles.bat} src="/assets/background/bat_stic.png" alt="" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
