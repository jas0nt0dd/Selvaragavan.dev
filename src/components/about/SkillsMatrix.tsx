import { useState } from "react";
import { Reveal, SectionLabel, Tag } from "@/components/ui/primitives";
import { Icon } from "@/icons/icons";
import { skillGroups, languages, tools } from "@/data/skills";
import styles from "./SkillsMatrix.module.css";

export function SkillsMatrix() {
  return (
    <section className={styles.section} aria-labelledby="skills-heading">
      <div className="container">
        <Reveal>
          <SectionLabel index="//02" label="Capability Matrix" />
        </Reveal>
        <Reveal delay={1}>
          <h2 id="skills-heading" className={styles.heading}>
            Eight modules. One operator.
          </h2>
          <p className={styles.subhead}>
            Click a module to expand its full toolset. Interest-stage technologies are marked distinctly from
            hands-on tools.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {skillGroups.map((group, i) => (
            <Reveal key={group.id} delay={(Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5)}>
              <SkillModule group={group} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className={styles.footerRow}>
            <div>
              <p className={`${styles.footerLabel} mono`}>LANGUAGES</p>
              <div className={styles.chipRow}>
                {languages.map((l) => (
                  <Tag key={l}>{l}</Tag>
                ))}
              </div>
            </div>
            <div>
              <p className={`${styles.footerLabel} mono`}>TOOLS</p>
              <div className={styles.chipRow}>
                {tools.map((t) => (
                  <Tag key={t} muted>
                    {t}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SkillModule({ group }: { group: (typeof skillGroups)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleSkills = expanded ? group.skills : group.skills.slice(0, 4);
  const remaining = group.skills.length - visibleSkills.length;

  return (
    <div className={`${styles.module} ${expanded ? styles.moduleOpen : ""}`}>
      <button
        type="button"
        className={styles.moduleTrigger}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <span className={`${styles.moduleEyebrow} mono`}>{group.eyebrow}</span>
        <Icon name="chevronDown" size={16} className={styles.moduleChevron} />
      </button>
      <h3 className={styles.moduleLabel}>{group.label}</h3>
      <p className={styles.moduleDescription}>{group.description}</p>
      <ul className={styles.skillList}>
        {visibleSkills.map((skill) => (
          <li key={skill.name} className={styles.skillItem}>
            <span className={`${styles.skillDot} ${skill.interest ? styles.skillDotInterest : ""}`} />
            {skill.name}
            {skill.interest && <span className={styles.skillInterestLabel}>interest</span>}
          </li>
        ))}
      </ul>
      {remaining > 0 && !expanded && (
        <button type="button" className={styles.moreButton} onClick={() => setExpanded(true)}>
          +{remaining} more
        </button>
      )}
    </div>
  );
}
