import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { PageHeader, Reveal, EmptyState } from "@/components/ui/primitives";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { projects } from "@/data/projects";
import type { Project, ProjectCategory } from "@/types";
import styles from "./Projects.module.css";

type FilterState = ProjectCategory | "all";

export function Projects() {
  const [active, setActive] = useState<FilterState>("all");
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: projects.length };
    projects.forEach((p) => p.category.forEach((c) => (map[c] = (map[c] ?? 0) + 1)));
    return map;
  }, []);

  const filtered = active === "all" ? projects : projects.filter((p) => p.category.includes(active));

  return (
    <>
      <div className="container">
        <PageHeader
          index="04"
          eyebrow="Case Files"
          title="Projects"
          description="Seven systems, opened like classified files: problem, solution, stack and outcome for each."
        />
      </div>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <ProjectFilter active={active} onChange={setActive} counts={counts} />
          </Reveal>
        </div>

        {filtered.length > 0 ? (
          <div className={styles.cards}>
            <ProjectCarousel projects={filtered} />
          </div>
        ) : (
          <div className="container">
            <div className={styles.empty}>
              <EmptyState title="No case files in this category" description="Try another filter." />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function ProjectSlide({
  project,
  index,
  cardCount,
  scrollYProgress
}: {
  project: Project;
  index: number;
  cardCount: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segmentStart = index / cardCount;
  const segmentEnd = (index + 1) / cardCount;
  const revealProgress = useTransform(
    scrollYProgress,
    [
      segmentStart + (segmentEnd - segmentStart) * 0.04,
      segmentStart + (segmentEnd - segmentStart) * 0.14,
      segmentStart + (segmentEnd - segmentStart) * 0.68,
      segmentStart + (segmentEnd - segmentStart) * 0.8
    ],
    [0, 0, 1, 1]
  );

  return (
    <div className={styles.carouselSlide}>
      <ProjectCard project={project} index={index} revealProgress={revealProgress} />
    </div>
  );
}

function ProjectCarousel({ projects: carouselProjects }: { projects: Project[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"]
  });
  const progressStops = [0];
  const positionStops = ["0%"];
  const cardCount = carouselProjects.length;

  for (let index = 0; index < cardCount; index += 1) {
    const segmentStart = index / cardCount;
    const segmentEnd = (index + 1) / cardCount;
    const nextIndex = Math.min(index + 1, cardCount - 1);
    progressStops.push(
      segmentStart + (segmentEnd - segmentStart) * 0.9,
      segmentStart + (segmentEnd - segmentStart) * 0.99,
      segmentEnd
    );
    positionStops.push(
      `-${index * 100}%`,
      `-${nextIndex * 100}%`,
      `-${nextIndex * 100}%`
    );
  }

  const trackX = useTransform(scrollYProgress, progressStops, positionStops);

  return (
    <div
      ref={stageRef}
      className={styles.carouselStage}
      style={{ ["--card-count" as string]: carouselProjects.length }}
    >
      <div className={styles.carouselViewport}>
        <motion.div className={styles.carouselTrack} style={{ x: trackX }}>
          {carouselProjects.map((project, index) => (
            <ProjectSlide
              key={project.id}
              project={project}
              index={index}
              cardCount={cardCount}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
