import { useState } from "react";
import { Reveal, SectionLabel, StatusIndicator } from "@/components/ui/primitives";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import { profile } from "@/data/profile";
import styles from "./IdentitySection.module.css";

export function IdentitySection() {
  const [portraitFailed, setPortraitFailed] = useState(false);
  const portraitSrc = "/assets/hero-portrait.jpg";

  return (
    <section className={styles.section} aria-labelledby="identity-heading">
      <div className="container">
        <Reveal>
          <SectionLabel index="//01" label="Identity" />
        </Reveal>

        <div className={styles.grid}>
          <Reveal delay={1}>
            <div className={styles.frame}>
              {!portraitFailed ? (
                <img
                  src={portraitSrc}
                  alt={profile.name}
                  className={styles.portrait}
                  loading="eager"
                  decoding="async"
                  onLoad={() => setPortraitFailed(false)}
                  onError={() => setPortraitFailed(true)}
                />
              ) : (
                <div className={styles.monogram} aria-hidden="true">
                  <span>SM</span>
                </div>
              )}
              <div className={styles.frameCorner} data-corner="tl" />
              <div className={styles.frameCorner} data-corner="tr" />
              <div className={styles.frameCorner} data-corner="bl" />
              <div className={styles.frameCorner} data-corner="br" />
              <div className={styles.frameStatus}>
                <StatusIndicator label="OPERATOR VERIFIED" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className={styles.copy}>
              <AsciiGlitchRipple as="h2" className={styles.heading}>
                {profile.name}
              </AsciiGlitchRipple>
              <AsciiGlitchRipple as="p" className={`${styles.roles} mono`}>{profile.roles.join(" · ")}</AsciiGlitchRipple>
              <AsciiGlitchRipple as="p" className={styles.about}>{profile.about}</AsciiGlitchRipple>
              <AsciiGlitchRipple as="p" className={styles.motto}>"{profile.motto}"</AsciiGlitchRipple>
              <dl className={styles.factGrid}>
                <div>
                  <dt className="mono">Degree</dt>
                  <AsciiGlitchRipple as="dd">{profile.degree}</AsciiGlitchRipple>
                </div>
                <div>
                  <dt className="mono">Institution</dt>
                  <AsciiGlitchRipple as="dd">{profile.institution}</AsciiGlitchRipple>
                </div>
                <div>
                  <dt className="mono">Period</dt>
                  <AsciiGlitchRipple as="dd">{profile.educationPeriod}</AsciiGlitchRipple>
                </div>
                <div>
                  <dt className="mono">CGPA</dt>
                  <AsciiGlitchRipple as="dd">{profile.cgpa}</AsciiGlitchRipple>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
