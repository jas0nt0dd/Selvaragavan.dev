import { Hero } from "@/components/hero/Hero";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal, SectionLabel, Button, Divider } from "@/components/ui/primitives";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import styles from "./Home.module.css";

export function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const serviceSample = services.slice(0, 4);

  return (
    <>
      <Hero />

      <section className={styles.section} aria-labelledby="featured-heading">
        <div className="container">
          <Reveal>
            <SectionLabel index="//01" label="Featured Case Files" />
          </Reveal>
          <Reveal delay={1}>
            <div className={styles.sectionHead}>
              <AsciiGlitchRipple as="h2" className={styles.sectionTitle}>
                Systems built and deployed, not just diagrammed.
              </AsciiGlitchRipple>
              <Button as="link" to="/projects" variant="outline" icon="arrow">
                All Case Files
              </Button>
            </div>
          </Reveal>

          <div className={styles.cardGrid}>
            {featured.map((project, i) => (
              <Reveal key={project.id} delay={(Math.min(i + 1, 5) as 1 | 2 | 3)}>
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="capability-heading">
        <div className="container">
          <Reveal>
            <SectionLabel index="//02" label="Capability Modules" />
          </Reveal>
          <Reveal delay={1}>
            <div className={styles.sectionHead}>
              <AsciiGlitchRipple as="h2" className={styles.sectionTitle}>
                What I can build with you.
              </AsciiGlitchRipple>
              <Button as="link" to="/services" variant="outline" icon="arrow">
                All Modules
              </Button>
            </div>
          </Reveal>

          <div className={styles.moduleGrid}>
            {serviceSample.map((service, i) => (
              <Reveal key={service.id} delay={(Math.min(i + 1, 5) as 1 | 2 | 3 | 4)}>
                <div className={styles.module}>
                  <span className={`${styles.moduleCode} mono`}>{service.code}</span>
                  <AsciiGlitchRipple as="h3" className={styles.moduleTitle}>{service.title}</AsciiGlitchRipple>
                  <AsciiGlitchRipple as="p" className={styles.moduleOutcome}>{service.outcome}</AsciiGlitchRipple>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta} aria-labelledby="cta-heading">
        <div className={`container ${styles.ctaInner}`}>
          <Reveal>
            <Divider label="TRANSMISSION" />
            <AsciiGlitchRipple as="h2" className={styles.ctaTitle}>
              Have a system worth building? Open a channel.
            </AsciiGlitchRipple>
            <div className={styles.ctaActions}>
              <Button as="link" to="/contact" icon="arrow">
                Contact
              </Button>
              <Button as="link" to="/credentials" variant="ghost" icon="chevronRight">
                View credentials
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
