import { useState } from "react";
import { Icon } from "@/icons/icons";
import { Tag } from "@/components/ui/primitives";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import type { Service } from "@/types";
import styles from "./ServiceCard.module.css";

export function ServiceCard({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`${styles.card} ${open ? styles.cardOpen : ""}`}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={`service-${service.id}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`${styles.code} mono`}>{service.code}</span>
        <AsciiGlitchRipple as="h3" className={styles.title}>{service.title}</AsciiGlitchRipple>
        <Icon name="chevronDown" size={18} className={styles.chevron} />
      </button>

      <AsciiGlitchRipple as="p" className={styles.problem}>{service.problem}</AsciiGlitchRipple>

      <div className={styles.tagRow}>
        {service.tags.map((tag) => (
          <Tag key={tag} muted>
            {tag}
          </Tag>
        ))}
      </div>

      <div id={`service-${service.id}`} className={styles.detail} hidden={!open}>
        <div className={styles.detailBlock}>
          <p className={`${styles.detailLabel} mono`}>What I deliver</p>
          <ul className={styles.deliveryList}>
            {service.delivery.map((item) => (
              <li key={item}>
                <Icon name="check" size={14} />
                <AsciiGlitchRipple as="span">{item}</AsciiGlitchRipple>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.detailBlock}>
          <p className={`${styles.detailLabel} mono`}>Best suited for</p>
          <AsciiGlitchRipple as="p" className={styles.detailText}>{service.suitedFor}</AsciiGlitchRipple>
        </div>
        <div className={styles.detailBlock}>
          <p className={`${styles.detailLabel} mono`}>Realistic outcome</p>
          <AsciiGlitchRipple as="p" className={styles.detailText}>{service.outcome}</AsciiGlitchRipple>
        </div>
      </div>
    </article>
  );
}
