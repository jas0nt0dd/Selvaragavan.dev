import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { PageHeader, Reveal, EmptyState } from "@/components/ui/primitives";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { projects } from "@/data/projects";
import type { Project, ProjectCategory } from "@/types";
import styles from "./Projects.module.css";

type FilterState = ProjectCategory | "all";

interface StickyCardProps {
  index: number;
  isLast: boolean;
  project: Project;
}

function StickyCard({ index, isLast, project }: StickyCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.28, 0.78, 1], [0.96, 1, 1, isLast ? 1 : 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.82, 1], [0, 1, 1, isLast ? 1 : 0.16]);
  const y = useTransform(scrollYProgress, [0, 0.26, 0.82, 1], [72, 0, 0, isLast ? 0 : -70]);

  const motionStyle: { scale?: MotionValue<number>; opacity?: MotionValue<number>; y?: MotionValue<number> } = prefersReducedMotion
    ? {}
    : { scale, opacity, y };

  return (
    <div ref={containerRef} className={styles.stickyContainer}>
      <motion.div
        style={motionStyle}
        className={styles.stickyCard}
      >
        <ProjectCard project={project} index={index} />
      </motion.div>
    </div>
  );
}

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
          <div className={styles.stackContainer}>
            <div className={styles.stack}>
              {filtered.map((project, i) => (
                <StickyCard
                  key={project.id}
                  index={i}
                  isLast={i === filtered.length - 1}
                  project={project}
                />
              ))}
            </div>
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
