import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { RouteLink } from "@/components/layout/RouteLink";
import { Button, Reveal, SectionLabel, Tag } from "@/components/ui/primitives";
import { Icon } from "@/icons/icons";
import { projects, projectCategoryLabels } from "@/data/projects";
import styles from "./ProjectDetail.module.css";

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const index = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className={styles.page}>
      <div className="container">
        <Reveal>
          <RouteLink to="/projects" exact={false} className={styles.back}>
            <Icon name="arrow" size={16} className={styles.backIcon} />
            Back to case files
          </RouteLink>
        </Reveal>

        <Reveal delay={1}>
          <header className={styles.header}>
            <span className={`${styles.caseNumber} mono`}>CASE {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
            <h1 className={styles.title}>{project.title}</h1>
            <div className={styles.metaRow}>
              {project.category.map((cat) => (
                <Tag key={cat}>{projectCategoryLabels[cat]}</Tag>
              ))}
              <span className={`${styles.status} mono`}>{project.status}</span>
              {project.year && <span className={`${styles.year} mono`}>{project.year}</span>}
            </div>
          </header>
        </Reveal>

        <Reveal delay={2}>
          <div className={styles.mediaFrame}>
            {project.media.video && !videoFailed ? (
              <video
                className={styles.media}
                src={project.media.video}
                poster={!posterFailed ? project.media.poster : undefined}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                onError={() => setVideoFailed(true)}
              />
            ) : project.media.poster && !posterFailed ? (
              <img
                className={styles.media}
                src={project.media.poster}
                alt={`${project.title} preview`}
                onError={() => setPosterFailed(true)}
              />
            ) : (
              <div className={styles.mediaFallback}>
                <Icon name="terminal" size={32} />
                <span className="mono">NO PREVIEW MEDIA ON FILE</span>
              </div>
            )}
          </div>
        </Reveal>

        <div className={styles.body}>
          <div className={styles.main}>
            <Reveal>
              <SectionLabel index="//" label="Overview" />
              <p className={styles.fullDescription}>{project.fullDescription}</p>
            </Reveal>

            {(project.problem || project.solution || project.outcome) && (
              <Reveal delay={1}>
                <div className={styles.psoGrid}>
                  {project.problem && (
                    <div className={styles.psoBlock}>
                      <p className={`${styles.psoLabel} mono`}>Problem</p>
                      <p>{project.problem}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div className={styles.psoBlock}>
                      <p className={`${styles.psoLabel} mono`}>Solution</p>
                      <p>{project.solution}</p>
                    </div>
                  )}
                  {project.outcome && (
                    <div className={styles.psoBlock}>
                      <p className={`${styles.psoLabel} mono`}>Outcome</p>
                      <p>{project.outcome}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            )}

            <Reveal delay={2}>
              <p className={`${styles.sectionMini} mono`}>Technologies</p>
              <div className={styles.techRow}>
                {project.technologies.map((t) => (
                  <Tag key={t} muted>
                    {t}
                  </Tag>
                ))}
              </div>
            </Reveal>
          </div>

          <aside className={styles.sidebar}>
            <Reveal delay={2}>
              <div className={styles.sidebarPanel}>
                <p className={`${styles.sidebarLabel} mono`}>Impact</p>
                <p className={styles.sidebarImpact}>{project.impact}</p>

                {project.metrics && project.metrics.length > 0 && (
                  <dl className={styles.metricGrid}>
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <dt className="mono">{m.label}</dt>
                        <dd>{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className={styles.sidebarLinks}>
                  {project.links.repository && (
                    <Button as="a" href={project.links.repository} target="_blank" rel="noreferrer" variant="outline" icon="github" iconPosition="left">
                      Repository
                    </Button>
                  )}
                  {project.links.live && (
                    <Button as="a" href={project.links.live} target="_blank" rel="noreferrer" icon="external">
                      Live Demo
                    </Button>
                  )}
                  {!project.links.repository && !project.links.live && (
                    <p className={styles.noLinks}>No public links on file for this case.</p>
                  )}
                </div>
              </div>
            </Reveal>
          </aside>
        </div>

        <Reveal>
          <nav className={styles.pager} aria-label="Adjacent case files">
            <RouteLink to={`/projects/${prev.slug}`} exact={false} className={styles.pagerLink}>
              <span className="mono">← Previous</span>
              <span className={styles.pagerTitle}>{prev.title}</span>
            </RouteLink>
            <RouteLink to={`/projects/${next.slug}`} exact={false} className={`${styles.pagerLink} ${styles.pagerRight}`}>
              <span className="mono">Next →</span>
              <span className={styles.pagerTitle}>{next.title}</span>
            </RouteLink>
          </nav>
        </Reveal>
      </div>
    </article>
  );
}
