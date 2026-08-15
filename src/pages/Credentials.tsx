import { PageHeader, Reveal, SectionLabel, Button } from "@/components/ui/primitives";
import { CylinderCarousel } from "@/components/ui/CylinderCarousel";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import { Icon } from "@/icons/icons";
import { awards, education, certifications } from "@/data/credentials";
import { profile } from "@/data/profile";
import { useAssetExists } from "@/hooks/useMotionHooks";
import styles from "./Credentials.module.css";

const readmeHighlights = [
  "AI Developer · ML Engineer · Robotic Engineer",
  "Mistral 7B, BERT, DistilBERT, LangGraph, YOLOv8",
  "IIT BHU Bug Bounty #1 and IIT Kanpur Top 20 finalist",
  "Agentic AI, RAG pipelines, computer vision, and robotic systems"
];

export function Credentials() {
  return (
    <>
      <div className="container">
        <PageHeader
          index="05"
          eyebrow="Verified Signal"
          title="Credentials"
          description="Education, awards and certifications — presented as evidence, not a resume pasted into a webpage."
        />
      </div>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <SectionLabel index="//01" label="Education" />
          </Reveal>
          <div className={styles.eduGrid}>
            {education.map((entry, i) => (
              <Reveal key={entry.id} delay={(Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5)}>
                <div className={styles.eduCard}>
                  <Icon name="shield" size={20} className={styles.eduIcon} />
                  <div>
                    <AsciiGlitchRipple as="h3" className={styles.eduDegree}>{entry.degree}</AsciiGlitchRipple>
                    <AsciiGlitchRipple as="p" className={styles.eduInstitution}>{entry.institution}</AsciiGlitchRipple>
                    <AsciiGlitchRipple as="p" className={`${styles.eduMeta} mono`}>
                      {entry.period}
                      {entry.detail ? ` · ${entry.detail}` : ""}
                    </AsciiGlitchRipple>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <SectionLabel index="//02" label="Awards & Achievements" />
          </Reveal>
          <CylinderCarousel 
            cards={awards.map(award => ({
              id: award.id,
              title: award.title,
              subtitle: award.organization,
              color: award.color || "#C4172B"
            }))}
            animationDuration={36}
            cardWidth={280}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <SectionLabel index="//03" label="GitHub Signal" />
          </Reveal>
          <Reveal delay={1}>
            <div className={styles.readmePreview}>
              <div className={styles.readmeHeader}>
                <div>
                  <p className={styles.readmeEyebrow}>GitHub Readme Signal</p>
                  <h3 className={styles.readmeTitle}>Selvaragavan M</h3>
                </div>
                <div className={styles.readmePillRow}>
                  <span className={styles.readmePill}>AI Systems</span>
                  <span className={styles.readmePill}>ML Ops</span>
                  <span className={styles.readmePill}>Robotics</span>
                </div>
              </div>

              <div className={styles.readmeGrid}>
                <div className={styles.readmePanel}>
                  <p className={styles.readmeLabel}>Identity</p>
                  <ul className={styles.readmeList}>
                    <li>AI Developer / ML Engineer / Robotic Engineer</li>
                    <li>Based in Coimbatore, Tamil Nadu</li>
                    <li>Current: Robential Kinetics Pvt. Ltd.</li>
                  </ul>
                </div>

                <div className={styles.readmePanel}>
                  <p className={styles.readmeLabel}>Signal Stack</p>
                  <ul className={styles.readmeList}>
                    <li>Mistral 7B, BERT, DistilBERT, LangGraph</li>
                    <li>YOLOv8, OpenCV, PyTorch, FastAPI</li>
                    <li>AWS, Docker, Linux, GitHub Actions</li>
                  </ul>
                </div>
              </div>

              <div className={styles.readmeSummary}>
                {readmeHighlights.map((item) => (
                  <AsciiGlitchRipple as="span" key={item} className={styles.readmeChip}>{item}</AsciiGlitchRipple>
                ))}
              </div>

              <div className={styles.readmeLinks}>
                <a href="https://github.com/jas0nt0dd" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/selva-ragavan-8997232a5/" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="mailto:selvaragavanart@gmail.com">Email</a>
                <a href="https://selvaragavan-dev.vercel.app/" target="_blank" rel="noreferrer">Portfolio</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <SectionLabel index="//04" label="Certifications" />
          </Reveal>
          <Reveal delay={1}>
            <AsciiGlitchRipple as="p" className={styles.certNote}>
              Certificate verification links weren't included in the supplied source material, so cards stay
              marked "unverified" until a real URL is added — no fabricated proof links.
            </AsciiGlitchRipple>
          </Reveal>
          <div className={styles.certGrid}>
            {certifications.map((cert, i) => (
              <Reveal key={cert.id} delay={(Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5)}>
                <div className={styles.certCard}>
                  <div className={styles.certHead}>
                    <Icon name="file" size={16} />
                    <span className={`${styles.certStatus} ${cert.verified ? styles.certVerified : ""} mono`}>
                      {cert.verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <AsciiGlitchRipple as="p" className={styles.certTitle}>{cert.title}</AsciiGlitchRipple>
                  <AsciiGlitchRipple as="p" className={`${styles.certIssuer} mono`}>{cert.issuer}</AsciiGlitchRipple>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.resumeSection}>
        <div className={`container ${styles.resumeInner}`}>
          <Reveal>
            <ResumeCallout />
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ResumeCallout() {
  const exists = useAssetExists(profile.resumeUrl);

  if (exists === false) {
    return (
      <p className={styles.resumeMissing}>
        Resume not on file yet — add <code>resume.pdf</code> to <code>public/assets/</code> to enable this download.
      </p>
    );
  }

  return (
    <div className={styles.resumeRow}>
      <p className={styles.resumeText}>Prefer a static document? The full credentials list is also available as a PDF.</p>
      <Button
        as="a"
        href={profile.resumeUrl}
        download="Selvaragavan M.pdf"
        icon="file"
        iconPosition="left"
      >
        Download Resume
      </Button>
    </div>
  );
}
