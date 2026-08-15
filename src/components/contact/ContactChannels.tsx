import { Icon } from "@/icons/icons";
import { StatusIndicator } from "@/components/ui/primitives";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import { profile } from "@/data/profile";
import { externalLinks } from "@/data/site";
import type { IconName } from "@/types";
import styles from "./ContactChannels.module.css";

const CHANNELS: { label: string; value: string; href: string; icon: IconName }[] = [
  { label: "Email", value: profile.email, href: externalLinks.email, icon: "mail" },
  { label: "GitHub", value: "@" + profile.alias, href: externalLinks.github, icon: "github" },
  { label: "LinkedIn", value: "Selvaragavan M", href: externalLinks.linkedin, icon: "linkedin" }
];

export function ContactChannels() {
  return (
    <div className={styles.panel}>
      <StatusIndicator label="OPEN TO NEW SIGNALS" />
      <AsciiGlitchRipple as="p" className={styles.intro}>
        Best reached by email for project inquiries. I read everything that comes through — expect a reply
        within a few days.
      </AsciiGlitchRipple>
      <ul className={styles.list}>
        {CHANNELS.map((channel) => (
          <li key={channel.label}>
            <a
              href={channel.href}
              target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={channel.href.startsWith("mailto:") ? undefined : "noreferrer"}
              className={styles.channel}
            >
              <Icon name={channel.icon} size={18} />
              <span>
                <AsciiGlitchRipple as="span" className={styles.channelLabel}>{channel.label}</AsciiGlitchRipple>
                <AsciiGlitchRipple as="span" className={`${styles.channelValue} mono`}>{channel.value}</AsciiGlitchRipple>
              </span>
              <Icon name="external" size={14} className={styles.externalIcon} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
