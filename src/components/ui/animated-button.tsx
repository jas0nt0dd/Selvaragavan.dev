import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import styles from "./AnimatedButton.module.css";

type AnimatedButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> &
  MotionProps & {
    children?: ReactNode;
    className?: string;
    as?: "button" | "span";
  };

export default function AnimatedButton({
  children = "Browse Components",
  className = "",
  as = "button",
  whileHover,
  whileTap,
  transition,
  ...rest
}: AnimatedButtonProps) {
  const reduceMotion = useReducedMotion();
  const Component = as === "span" ? motion.span : motion.button;
  const interactionMotion = reduceMotion
    ? {}
    : {
        whileHover: whileHover ?? { scale: 1.01 },
        whileTap: whileTap ?? { scale: 0.97 },
        transition: transition ?? { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.5 }
      };

  return (
    <Component
      {...rest}
      {...interactionMotion}
      className={`${styles.animatedButton} ${className}`.trim()}
      type={as === "button" ? rest.type ?? "button" : undefined}
    >
      <motion.span
        className={styles.label}
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          "--mask-x": "100%"
        } as CSSProperties}
        animate={reduceMotion ? undefined : { "--mask-x": "-100%" }}
        transition={reduceMotion ? undefined : { repeat: Infinity, duration: 1, ease: "linear", repeatDelay: 1 }}
      >
        {children}
      </motion.span>
      <motion.span
        className={styles.borderShine}
        aria-hidden="true"
        initial={{ backgroundPosition: "100% 0", opacity: 0 }}
        animate={reduceMotion ? undefined : { backgroundPosition: ["100% 0", "0% 0"], opacity: [0, 1, 0] }}
        transition={reduceMotion ? undefined : { duration: 1, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
      />
    </Component>
  );
}
