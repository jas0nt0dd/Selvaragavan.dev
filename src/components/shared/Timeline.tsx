import { Reveal } from "@/components/ui/primitives";
import type { TimelineEntry } from "@/types";
import styles from "./Timeline.module.css";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className={styles.timeline}>
      {entries.map((entry, i) => (
        <Reveal as="li" key={entry.id} delay={(Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5)} className={styles.item}>
          <div className={styles.marker}>
            <span className={`${styles.dot} ${entry.status ? styles[entry.status] : ""}`} />
            {i < entries.length - 1 && <span className={styles.connector} />}
          </div>
          <div className={styles.content}>
            <div className={styles.itemHead}>
              <h3 className={styles.itemTitle}>{entry.title}</h3>
              {entry.status && <span className={`${styles.statusBadge} ${styles[entry.status]} mono`}>{entry.status}</span>}
            </div>
            <p className={styles.itemSubtitle}>{entry.subtitle}</p>
            <p className={`${styles.itemPeriod} mono`}>{entry.period}</p>
            {entry.description && <p className={styles.itemDescription}>{entry.description}</p>}
            {entry.meta && <p className={`${styles.itemMeta} mono`}>{entry.meta}</p>}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
