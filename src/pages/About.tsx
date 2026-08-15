import { IdentitySection } from "@/components/about/IdentitySection";
import { SkillsMatrix } from "@/components/about/SkillsMatrix";
import { HangingIDCard } from "@/components/about/HangingIDCard";
import { AwardsWall } from "@/components/shared/AwardsWall";
import { Timeline } from "@/components/shared/Timeline";
import { PageHeader, Reveal, SectionLabel, Button } from "@/components/ui/primitives";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import { experience } from "@/data/experience";
import { awards } from "@/data/credentials";
import type { TimelineEntry } from "@/types";
import styles from "./About.module.css";

const experienceEntries: TimelineEntry[] = experience.map((e) => ({
  id: e.id,
  title: e.role,
  subtitle: e.company,
  period: e.period,
  status: e.status,
  description: e.summary,
  meta: e.responsibilities.slice(0, 3).join(" · ")
}));

export function About() {
  return (
    <>
      <div className="container">
        <PageHeader index="02" eyebrow="Dossier" title="About" description="Who I am, what I build, and how the disciplines connect." />
      </div>

      <IdentitySection />
      <SkillsMatrix />

      <section className={styles.section} aria-labelledby="awards-heading">
        <div className="container">
          <Reveal>
            <SectionLabel index="//03" label="Awards" />
          </Reveal>
          <Reveal delay={1}>
            <div className={styles.sectionHead}>
              <AsciiGlitchRipple as="h2" className={styles.heading}>
                Verified results, not self-reported ones.
              </AsciiGlitchRipple>
              <Button as="link" to="/credentials" variant="outline" icon="arrow">
                Full Evidence Wall
              </Button>
            </div>
          </Reveal>
          <AwardsWall awards={awards.slice(0, 4)} compact />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="experience-heading">
        <HangingIDCard />
        <div className="container">
          <Reveal>
            <SectionLabel index="//04" label="Experience" />
          </Reveal>
          <Reveal delay={1}>
            <AsciiGlitchRipple as="h2" className={styles.heading}>
              Where the work is happening now.
            </AsciiGlitchRipple>
            <AsciiGlitchRipple as="p" className={styles.note}>
              Both roles below are shown as currently active per the supplied source data — confirm the exact
              engagement type (full-time, part-time, or parallel) if that changes.
            </AsciiGlitchRipple>
          </Reveal>
          <div className={styles.timelineWrap}>
            <Timeline entries={experienceEntries} />
          </div>
        </div>
      </section>
    </>
  );
}
