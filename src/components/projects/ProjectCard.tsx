import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { MotionValue } from "framer-motion";
import { RouteLink } from "@/components/layout/RouteLink";
import { Icon } from "@/icons/icons";
import { Tag } from "@/components/ui/primitives";
import { projectCategoryLabels } from "@/data/projects";
import { useIsTouchDevice, usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import type { Project } from "@/types";
import { ProjectDissolveMedia } from "./ProjectDissolveMedia";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  index?: number;
  revealProgress?: MotionValue<number>;
}

export function ProjectCard({ project, index = 0, revealProgress }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const [posterFailed, setPosterFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [declassified, setDeclassified] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (reducedMotion) {
      setDeclassified(true);
      return;
    }
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDeclassified(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const canAutoplayPreview = !reducedMotion && !isTouch && Boolean(project.media.video) && !videoFailed;

  const handleEnter = () => {
    if (canAutoplayPreview && videoRef.current) {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => setVideoFailed(true));
    }
  };

  const handleLeave = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setPlaying(false);
  };

  const togglePlay = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => setVideoFailed(true));
    }
  };

  return (
    <RouteLink
      ref={cardRef}
      to={`/projects/${project.slug}`}
      className={`${styles.card} ${declassified ? styles.cardDeclassified : ""}`}
      style={{
        ["--stagger" as string]: `${(index % 6) * 90}ms`,
        ["--stack-shift" as string]: `${(index % 6) * 10}px`,
        ["--stack-tilt" as string]: `${index % 2 === 0 ? "-1.2deg" : "1.2deg"}`
      }}
      exact={false}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor="interactive"
    >
      <div className={styles.folderTab}>
        <span className={`${styles.tabIndex} mono`}>CASE {String(index + 1).padStart(2, "0")}</span>
        <span className={`${styles.tabStatus} mono`}>{declassified ? "DECLASSIFIED" : "SEALED"}</span>
      </div>

      <div className={styles.mediaFrame}>
        {project.media.video && !videoFailed ? (
          <video
            ref={videoRef}
            className={styles.media}
            src={project.media.video}
            poster={!posterFailed ? project.media.poster : undefined}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
          />
        ) : project.media.poster && !posterFailed ? (
          <img
            className={styles.media}
            src={project.media.poster}
            alt=""
            loading="lazy"
            onError={() => setPosterFailed(true)}
          />
        ) : (
          <div className={styles.mediaFallback}>
            <Icon name="terminal" size={26} />
            <span className="mono">NO PREVIEW ON FILE</span>
          </div>
        )}

        {project.media.poster && !posterFailed && revealProgress && !reducedMotion ? (
          <ProjectDissolveMedia src={project.media.poster} alt="" progress={revealProgress} />
        ) : null}

        <div className={styles.redactionBars} aria-hidden="true">
          <span /><span /><span /><span />
        </div>

        {canAutoplayPreview ? (
          <button
            type="button"
            className={styles.playToggle}
            onClick={togglePlay}
            aria-label={playing ? "Pause preview" : "Play preview"}
          >
            <Icon name={playing ? "pause" : "play"} size={14} />
          </button>
        ) : null}

        {project.featured && <span className={`${styles.featuredBadge} mono`}>FEATURED</span>}
        <div className={styles.scan} />
        <div className={styles.emblemWatermark}>
          <svg viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 14c-1.6 2.4-2.5 4-5.4 5.2-4-3.4-9-4.6-14.2-4.6 2.4 3 3.4 6 3.6 9.6-4.6 1.8-8.8 4.8-11.6 9.4 4.4-1.4 8-1.8 11.8-1.2-1.4 2.2-2 4-2 6.6 3.4-2.8 6.6-4.4 10.4-5 1.6 3.6 4 6.2 7.4 8-.4-3.6.2-6.4 1.4-9.4.4-1 .8-1 1.2 0 1.2 3 1.8 5.8 1.4 9.4 3.4-1.8 5.8-4.4 7.4-8 3.8.6 7 2.2 10.4 5 0-2.6-.6-4.4-2-6.6 3.8-.6 7.4-.2 11.8 1.2-2.8-4.6-7-7.6-11.6-9.4.2-3.6 1.2-6.6 3.6-9.6-5.2 0-10.2 1.2-14.2 4.6-2.9-1.2-3.8-2.8-5.4-5.2z" />
          </svg>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.categoryRow}>
          {project.category.slice(0, 2).map((cat) => (
            <Tag key={cat} muted>
              {projectCategoryLabels[cat]}
            </Tag>
          ))}
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.shortDescription}</p>
        <div className={styles.footer}>
          <span className="mono">{project.status}</span>
          <Icon name="arrow" size={16} className={styles.footerArrow} />
        </div>
      </div>
    </RouteLink>
  );
}
