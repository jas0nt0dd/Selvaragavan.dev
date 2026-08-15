import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/icons/icons";
import type { Certification } from "@/types";
import styles from "./CertificationStack.module.css";

interface CertificationStackProps {
  certifications: Certification[];
}

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

function signedOffset(index: number, activeIndex: number, total: number) {
  const direct = index - activeIndex;
  const wrapped = direct > 0 ? direct - total : direct + total;

  return Math.abs(wrapped) < Math.abs(direct) ? wrapped : direct;
}

export function CertificationStack({ certifications }: CertificationStackProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = certifications.length;
  const activeCertification = certifications[activeIndex];

  useEffect(() => {
    setActiveIndex((index) => wrapIndex(index, total));
  }, [total]);

  const previous = useCallback(() => {
    setActiveIndex((index) => wrapIndex(index - 1, total));
  }, [total]);

  const next = useCallback(() => {
    setActiveIndex((index) => wrapIndex(index + 1, total));
  }, [total]);

  if (!total || !activeCertification) return null;

  return (
    <div
      className={styles.stack}
      role="region"
      aria-label="Certification card stack"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") previous();
        if (event.key === "ArrowRight") next();
      }}
    >
      <div className={styles.stage}>
        {certifications.map((certification, index) => {
          const offset = signedOffset(index, activeIndex, total);
          const distance = Math.abs(offset);
          const isActive = offset === 0;
          const isVisible = distance <= 2;
          const x = offset * 128;
          const y = distance * 16 + (isActive ? -22 : 0);

          return (
            <motion.article
              key={certification.id}
              className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
              style={{ zIndex: isVisible ? 100 - distance : 0 }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                x,
                y,
                rotate: offset * 12,
                scale: isActive ? 1.025 : 0.91 - distance * 0.035
              }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 250, damping: 27 }}
              drag={isActive && !reduceMotion ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_event, info) => {
                if (info.offset.x > 90 || info.velocity.x > 600) previous();
                if (info.offset.x < -90 || info.velocity.x < -600) next();
              }}
              onClick={() => setActiveIndex(index)}
              aria-hidden={!isVisible}
            >
              <CertificateCard certification={certification} active={isActive} />
            </motion.article>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button type="button" className={`${styles.arrowButton} ${styles.previousButton}`} onClick={previous} aria-label="Previous certificate">
          <Icon name="arrow" size={16} />
        </button>
        <div className={styles.dots} role="tablist" aria-label="Choose a certificate">
          {certifications.map((certification, index) => (
            <button
              key={certification.id}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show ${certification.title}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" className={styles.arrowButton} onClick={next} aria-label="Next certificate">
          <Icon name="arrow" size={16} />
        </button>
      </div>

      <p className={`${styles.counter} mono`}>
        {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} - SELECTED
      </p>
    </div>
  );
}

function CertificateCard({ certification, active }: { certification: Certification; active: boolean }) {
  return (
    <div className={styles.cardInner}>
      <div className={styles.imageFrame}>
        {certification.image ? (
          <img
            src={certification.image}
            alt={`${certification.title} certificate`}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <div className={styles.imageFallback}>
          <span className={`${styles.fallbackMark} mono`}>CERT</span>
          <span className={`${styles.fallbackIssuer} mono`}>{certification.issuer}</span>
        </div>
        <span className={`${styles.recordLabel} mono`}>{certification.verified ? "VERIFIED" : "ON FILE"}</span>
      </div>

      <div className={styles.cardBody}>
        <p className={`${styles.issuer} mono`}>{certification.issuer}</p>
        <h3>{certification.title}</h3>
        {certification.description ? <p className={styles.description}>{certification.description}</p> : null}
        {active && certification.url ? (
          <a href={certification.url} target="_blank" rel="noreferrer" className={styles.verifyLink}>
            View credential &#8599;
          </a>
        ) : null}
      </div>
    </div>
  );
}
