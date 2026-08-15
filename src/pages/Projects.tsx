import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageHeader, Reveal, EmptyState } from "@/components/ui/primitives";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { projects } from "@/data/projects";
import type { ProjectCategory } from "@/types";
import styles from "./Projects.module.css";
import { useMemo, useState } from "react";

type FilterState = ProjectCategory | "all";

interface StickyCardProps {
  index: number;
  project: any;
  scrollProgress: any;
  range: [number, number];
  targetScale: number;
}

function StickyCard({ index, project, scrollProgress, range, targetScale }: StickyCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(scrollProgress, range, [1, targetScale]);
  const opacity = useTransform(scrollProgress, range, [1, 1, 0]);
  const y = useTransform(scrollProgress, range, [0, 0, -80]);

  return (
    <div ref={containerRef} className={styles.stickyContainer}>
      <motion.div
        style={{
          scale,
          opacity,
          y,
        }}
        className={styles.stickyCard}
      >
        <ProjectCard project={project} index={index} />
      </motion.div>
    </div>
  );
}

export function Projects() {
  const [active, setActive] = useState<FilterState>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

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
          <div 
            ref={containerRef} 
            className={styles.stackContainer}
            style={{
              paddingBottom: `calc(100vh * ${filtered.length - 1})`
            }}
          >
            <div className={styles.stack}>
              {filtered.map((project, i) => {
                const targetScale = 1;
                const rangeStart = i / filtered.length;
                const rangeEnd = (i + 1) / filtered.length;
                const range: [number, number] = [rangeStart, rangeEnd];

                return (
                  <StickyCard
                    key={project.id}
                    index={i}
                    project={project}
                    scrollProgress={scrollYProgress}
                    range={range}
                    targetScale={targetScale}
                  />
                );
              })}
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
