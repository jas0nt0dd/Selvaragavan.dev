import { PageHeader, Reveal, Divider, Button } from "@/components/ui/primitives";
import { ServiceCard } from "@/components/services/ServiceCard";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import { services } from "@/data/services";
import styles from "./Services.module.css";

export function Services() {
  return (
    <>
      <div className="container">
        <PageHeader
          index="03"
          eyebrow="Mission Modules"
          title="Services"
          description="Nine ways to work together, scoped from real systems I've already built — not a generic agency menu."
        />
      </div>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            {services.map((service, i) => (
              <Reveal key={service.id} delay={(Math.min((i % 5) + 1, 5) as 1 | 2 | 3 | 4 | 5)}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <Divider label="ENGAGEMENT" />
            <div className={styles.ctaRow}>
              <AsciiGlitchRipple as="p" className={styles.ctaText}>
                Every module above starts as a scoped conversation, not a fixed package. Tell me what you're
                building and I'll tell you honestly whether it's a fit.
              </AsciiGlitchRipple>
              <Button as="link" to="/contact" icon="arrow">
                Start a conversation
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
