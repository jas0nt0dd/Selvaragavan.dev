import { Reveal } from "@/components/ui/primitives";
import { Icon } from "@/icons/icons";
import type { Award } from "@/types";
import styles from "./AwardsWall.module.css";

export function AwardsWall({ awards, compact = false }: { awards: Award[]; compact?: boolean }) {
  return (
    <ul className={`${styles.wall} ${compact ? styles.compact : ""}`}>
      {awards.map((award, i) => (
        <Reveal as="li" key={award.id} delay={(Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5)} className={styles.card}>
          <Icon name="shield" size={18} className={styles.icon} />
          <div>
            <p className={styles.title}>{award.title}</p>
            <p className={`${styles.org} mono`}>{award.organization}</p>
            {!compact && award.description && <p className={styles.description}>{award.description}</p>}
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
