import { PageHeader, Reveal } from "@/components/ui/primitives";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactChannels } from "@/components/contact/ContactChannels";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <>
      <div className="container">
        <PageHeader
          index="06"
          eyebrow="Open a Channel"
          title="Contact"
          description="Building something in AI, security, or robotics? Send a signal — I read every message myself."
        />
      </div>

      <section className={styles.section}>
        <div className={`container ${styles.grid}`}>
          <Reveal delay={1}>
            <ContactForm />
          </Reveal>
          <Reveal delay={2}>
            <ContactChannels />
          </Reveal>
        </div>
      </section>
    </>
  );
}
