import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { IconName } from "@/types";
import { Icon } from "@/icons/icons";
import styles from "./SocialFlipButton.module.css";

export interface SocialFlipItem {
  letter: string;
  icon: IconName;
  label: string;
  href: string;
  external?: boolean;
}

interface SocialFlipButtonProps {
  items: SocialFlipItem[];
  className?: string;
}

function SocialFlipNode({
  item,
  index,
  isHovered,
  tooltipIndex,
  setTooltipIndex
}: {
  item: SocialFlipItem;
  index: number;
  isHovered: boolean;
  tooltipIndex: number | null;
  setTooltipIndex: (index: number | null) => void;
}) {
  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      className={styles.item}
      aria-label={item.label}
      onMouseEnter={() => setTooltipIndex(index)}
      onMouseLeave={() => setTooltipIndex(null)}
      onFocus={() => setTooltipIndex(index)}
      onBlur={() => setTooltipIndex(null)}
    >
      <AnimatePresence>
        {isHovered && tooltipIndex === index ? (
          <motion.span
            className={styles.tooltip}
            initial={{ opacity: 0, y: 8, scale: 0.85, x: "-50%" }}
            animate={{ opacity: 1, y: -42, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 8, scale: 0.85, x: "-50%" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {item.label}
            <span className={styles.tooltipArrow} />
          </motion.span>
        ) : null}
      </AnimatePresence>

      <motion.span
        className={styles.flip}
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{
          duration: 0.72,
          type: "spring",
          stiffness: 120,
          damping: 15,
          delay: index * 0.08
        }}
      >
        <span className={`${styles.face} ${styles.front}`}>{item.letter}</span>
        <span className={`${styles.face} ${styles.back}`}>
          <Icon name={item.icon} size={17} />
        </span>
      </motion.span>
    </a>
  );
}

export function SocialFlipButton({ items, className }: SocialFlipButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  return (
    <div
      className={`${styles.root}${className ? ` ${className}` : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTooltipIndex(null);
      }}
      onFocus={() => setIsHovered(true)}
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setIsHovered(false);
          setTooltipIndex(null);
        }
      }}
    >
      <div className={styles.group}>
        <motion.span
          className={`${styles.borderLine} ${styles.borderTop}`}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className={`${styles.borderLine} ${styles.borderBottom}`}
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        {items.map((item, index) => (
          <SocialFlipNode
            key={`${item.label}-${item.letter}`}
            item={item}
            index={index}
            isHovered={isHovered}
            tooltipIndex={tooltipIndex}
            setTooltipIndex={setTooltipIndex}
          />
        ))}
      </div>
    </div>
  );
}
