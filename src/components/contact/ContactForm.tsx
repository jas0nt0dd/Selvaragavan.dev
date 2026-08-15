import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/primitives";
import { profile } from "@/data/profile";
import styles from "./ContactForm.module.css";

interface FormState {
  name: string;
  email: string;
  interest: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const INTERESTS = [
  "GenAI / LLM prototype",
  "Workflow automation",
  "Computer vision",
  "Cybersecurity tooling",
  "Robotics / hardware",
  "Full-stack AI product",
  "MLOps environment",
  "QA automation",
  "Something else"
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", interest: INTERESTS[0], message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Let me know who's reaching out.";
    if (!form.email.trim()) next.email = "An email address is required.";
    else if (!EMAIL_PATTERN.test(form.email)) next.email = "That doesn't look like a valid email.";
    if (!form.message.trim()) next.message = "Add a short message so I know what you're building.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const subject = encodeURIComponent(`Portfolio inquiry — ${form.interest}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nInterest: ${form.interest}\n\n${form.message}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const update = (field: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.disclaimer}>
        This portfolio is frontend-only — submitting opens a pre-filled email in your mail client rather than
        sending through a server.
      </p>

      <div className={styles.field}>
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          type="text"
          value={form.name}
          onChange={update("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          autoComplete="name"
        />
        {errors.name && (
          <p id="contact-name-error" className={styles.error} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={update("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <p id="contact-email-error" className={styles.error} role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-interest">Project interest</label>
        <select id="contact-interest" value={form.interest} onChange={update("interest")}>
          {INTERESTS.map((interest) => (
            <option key={interest} value={interest}>
              {interest}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={update("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className={styles.error} role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <Button as="button" type="submit" icon="arrow">
        Send Transmission
      </Button>

      {sent && (
        <p className={styles.success} role="status">
          Your email client should now be open with the message pre-filled. Send it whenever you're ready.
        </p>
      )}
    </form>
  );
}
