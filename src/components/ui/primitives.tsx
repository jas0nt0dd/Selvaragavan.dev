import { forwardRef, type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { RouteLink } from "@/components/layout/RouteLink";
import { Icon } from "@/icons/icons";
import { AsciiGlitchRipple } from "@/components/effects/AsciiGlitchRipple";
import type { IconName } from "@/types";
import { useReveal } from "@/hooks/useMotionHooks";
import styles from "./primitives.module.css";

/* ---------------------------- Button ---------------------------- */

type ButtonVariant = "primary" | "ghost" | "outline";

interface BaseButtonProps {
  variant?: ButtonVariant;
  icon?: IconName;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

type ButtonAsButton = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; to?: undefined; href?: undefined };

type ButtonAsLink = BaseButtonProps & { as: "link"; to: string; href?: undefined };

type ButtonAsAnchor = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string; to?: undefined };

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export function Button(props: ButtonProps) {
  const { variant = "primary", icon, iconPosition = "right", children } = props;
  const classes = `${styles.button} ${styles[variant]}`;
  const content = (
    <>
      <span>{children}</span>
      {icon && iconPosition === "right" && <Icon name={icon} size={16} />}
      {icon && iconPosition === "left" && <Icon name={icon} size={16} />}
    </>
  );

  if (props.as === "link") {
    return (
      <RouteLink to={props.to} className={classes} exact={false}>
        {content}
      </RouteLink>
    );
  }
  if (props.as === "a") {
    const { as: _as, variant: _v, icon: _i, iconPosition: _ip, children: _c, ...rest } = props;
    return (
      <a className={classes} {...rest}>
        {content}
      </a>
    );
  }
  const { as: _as, variant: _v, icon: _i, iconPosition: _ip, children: _c, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}

/* ---------------------------- Tag ---------------------------- */

export function Tag({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <span className={`${styles.tag} ${muted ? styles.tagMuted : ""}`}>{children}</span>;
}

/* ------------------------- Section Label ------------------------- */

export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className={styles.sectionLabel}>
      <span className={styles.sectionIndex}>{index}</span>
      <span className={styles.sectionLine} aria-hidden="true" />
      <span className={styles.sectionText}>{label}</span>
    </div>
  );
}

/* ------------------------- Status Indicator ------------------------- */

export function StatusIndicator({ label = "SYSTEM ONLINE", tone = "active" }: { label?: string; tone?: "active" | "idle" }) {
  return (
    <div className={`${styles.status} ${tone === "idle" ? styles.statusIdle : ""}`}>
      <span className={styles.statusDot} />
      <span className="mono">{label}</span>
    </div>
  );
}

/* ---------------------------- Divider ---------------------------- */

export function Divider({ label }: { label?: string }) {
  return (
    <div className={styles.divider}>
      <span className={styles.dividerLine} />
      {label && <span className={`${styles.dividerLabel} mono`}>{label}</span>}
      <span className={styles.dividerLine} />
    </div>
  );
}

/* --------------------------- Page Header --------------------------- */

export function PageHeader({
  index,
  eyebrow,
  title,
  description
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className={styles.pageHeader}>
      <div className={`${styles.pageHeaderIndex} mono`}>{index}</div>
      <div className={styles.pageHeaderBody}>
        <p className={`${styles.pageHeaderEyebrow} mono`}>{eyebrow}</p>
        <h1 className={styles.pageHeaderTitle}>{title}</h1>
        {description && (
          <AsciiGlitchRipple as="p" className={styles.pageHeaderDescription}>
            {description}
          </AsciiGlitchRipple>
        )}
      </div>
    </header>
  );
}

/* ---------------------------- Reveal ---------------------------- */

interface RevealProps {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  as?: "div" | "li";
  className?: string;
}

export const Reveal = forwardRef<HTMLDivElement, RevealProps>(function Reveal(
  { children, delay = 0, as = "div", className = "" },
  _forwardedRef
) {
  const { ref, visible } = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      data-delay={delay || undefined}
    >
      {children}
    </Tag>
  );
});

/* --------------------------- Empty State --------------------------- */

export function EmptyState({ icon = "eye", title, description }: { icon?: IconName; title: string; description?: string }) {
  return (
    <div className={styles.emptyState}>
      <Icon name={icon} size={28} />
      <p className={styles.emptyStateTitle}>{title}</p>
      {description && <p className={styles.emptyStateDescription}>{description}</p>}
    </div>
  );
}
