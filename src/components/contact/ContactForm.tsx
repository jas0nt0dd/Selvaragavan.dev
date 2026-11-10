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

type SubmissionStatus = "idle" | "sending" | "sent" | "error";

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

const INITIAL_FORM: FormState = { name: "", email: "", interest: INTERESTS[0], message: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [submissionError, setSubmissionError] = useState("");

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Let me know who's reaching out.";
    if (!form.email.trim()) next.email = "An email address is required.";
    else if (!EMAIL_PATTERN.test(form.email)) next.email = "That doesn't look like a valid email.";
    if (!form.message.trim()) next.message = "Add a short message so I know what you're building.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setSubmissionError("");
    if (!validate()) return;

    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();
    if (!endpoint) {
      setSubmissionError("Message delivery isn't configured yet. Please email me directly at");
      setStatus("error");
      return;
    }

    let parsedEndpoint: URL;
    try {
      parsedEndpoint = new URL(endpoint);
    } catch {
      setSubmissionError("The contact form endpoint is invalid. Please email me directly at");
      setStatus("error");
      return;
    }

    if (
      parsedEndpoint.protocol !== "https:" ||
      parsedEndpoint.hostname !== "formspree.io" ||
      !/^\/f\/[a-zA-Z0-9]+$/.test(parsedEndpoint.pathname)
    ) {
      setSubmissionError("The contact form endpoint is invalid. Please email me directly at");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setSubmissionError("");
    try {
      const response = await fetch(parsedEndpoint.toString(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          interest: form.interest,
          message: form.message.trim(),
          _subject: `Portfolio inquiry — ${form.interest}`
        })
      });

      if (!response.ok) {
        throw new Error(`Formspree returned HTTP ${response.status}`);
      }

      setForm(INITIAL_FORM);
      setErrors({});
      setStatus("sent");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setSubmissionError("Your message couldn't be sent. Please try again or email me directly at");
      setStatus("error");
    }
  };

  const update = (field: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setStatus("idle");
    setSubmissionError("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {!import.meta.env.VITE_FORMSPREE_ENDPOINT && (
        <p className={styles.disclaimer}>
          Online message delivery is not configured yet. You can still{" "}
          <a href={`mailto:${profile.email}`}>email me directly</a>.
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          disabled={status === "sending"}
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
          name="email"
          type="email"
          disabled={status === "sending"}
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
        <select
          id="contact-interest"
          name="interest"
          value={form.interest}
          onChange={update("interest")}
          disabled={status === "sending"}
        >
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
          name="message"
          rows={5}
          disabled={status === "sending"}
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

      <Button as="button" type="submit" icon="arrow" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Transmission"}
      </Button>

      {status === "sent" && (
        <p className={styles.success} role="status">
          Message sent successfully. Thanks for getting in touch.
        </p>
      )}
      {status === "error" && (
        <p className={styles.error} role="alert">
          {submissionError} <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      )}
    </form>
  );
}
