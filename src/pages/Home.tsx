import type { CSSProperties } from "react";
import { Hero } from "@/components/hero/Hero";
import { RouteLink } from "@/components/layout/RouteLink";
import { Reveal, SectionLabel, Button, Divider } from "@/components/ui/primitives";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import { projectCategoryLabels, projects } from "@/data/projects";
import { services } from "@/data/services";
import type { Project } from "@/types";
import styles from "./Home.module.css";

export function Home() {
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

          <Reveal delay={2}>
            <HomeProjectFlow projects={projects} />
          </Reveal>
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

function HomeProjectFlow({ projects: carouselProjects }: { projects: Project[] }) {
  const count = carouselProjects.length;
  const animationDuration = count * 4.8;

  return (
    <div
      className={styles.projectFlow}
      style={
        {
          "--project-flow-duration": `${animationDuration}s`
        } as CSSProperties
      }
    >
      {carouselProjects.map((project, index) => {
        const primaryCategory = project.category[0];

        return (
          <RouteLink
            key={project.id}
            to={`/projects/${project.slug}`}
            exact={false}
            className={styles.projectFlowCard}
            style={
              {
                "--project-flow-delay": `${-(index * (animationDuration / count))}s`
              } as CSSProperties
            }
            data-cursor="interactive"
          >
            <div className={styles.projectFlowMedia}>
              {project.media.poster ? (
                <img src={project.media.poster} alt="" loading="lazy" />
              ) : (
                <div className={styles.projectFlowFallback}>
                  <span className="mono">NO PREVIEW</span>
                </div>
              )}
              <span className={`${styles.projectFlowIndex} mono`}>CASE {String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className={styles.projectFlowBody}>
              <span className={`${styles.projectFlowMeta} mono`}>
                {primaryCategory ? projectCategoryLabels[primaryCategory] : project.status}
              </span>
              <h3>{project.title}</h3>
              <p>{project.shortDescription}</p>
            </div>
          </RouteLink>
        );
      })}
    </div>
  );
}
