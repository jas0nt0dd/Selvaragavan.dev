import { projectCategoryLabels } from "@/data/projects";
import type { ProjectCategory } from "@/types";
import styles from "./ProjectFilter.module.css";

interface ProjectFilterProps {
  active: ProjectCategory | "all";
  onChange: (value: ProjectCategory | "all") => void;
  counts: Record<string, number>;
}

const CATEGORIES: (ProjectCategory | "all")[] = ["all", "ai", "security", "computer-vision", "robotics", "fullstack", "mlops"];

export function ProjectFilter({ active, onChange, counts }: ProjectFilterProps) {
  return (
    <div className={styles.filter} role="group" aria-label="Filter case files by category">
      {CATEGORIES.map((cat) => {
        const label = cat === "all" ? "All Files" : projectCategoryLabels[cat];
        const count = cat === "all" ? counts.all : counts[cat] ?? 0;
        if (cat !== "all" && count === 0) return null;
        return (
          <button
            key={cat}
            type="button"
            className={`${styles.chip} ${active === cat ? styles.chipActive : ""}`}
            aria-pressed={active === cat}
            onClick={() => onChange(cat)}
          >
            {label}
            <span className={`${styles.count} mono`}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
