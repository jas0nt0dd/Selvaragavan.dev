import { cloneElement, useRef, useState, type ButtonHTMLAttributes, type ReactElement } from "react";
import { motion } from "framer-motion";
import styles from "./CreepyButton.module.css";

interface CreepyButtonBaseProps {
  children: React.ReactNode;
  className?: string;
  coverClassName?: string;
}

type CreepyButtonProps = CreepyButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    asChild?: false;
  };

type CreepyButtonAsChildProps = CreepyButtonBaseProps & {
  asChild: true;
  children: ReactElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
};

export function CreepyButton(props: CreepyButtonProps | CreepyButtonAsChildProps) {
  const eyesRef = useRef<HTMLSpanElement>(null);
  const [eyeCoords, setEyeCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const updateEyes = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    const pointer = "touches" in event ? event.touches[0] : event;
    if (!pointer || !eyesRef.current) return;

    const eyesRect = eyesRef.current.getBoundingClientRect();
    const dx = pointer.clientX - (eyesRect.left + eyesRect.width / 2);
    const dy = pointer.clientY - (eyesRect.top + eyesRect.height / 2);
    const angle = Math.atan2(-dy, dx) + Math.PI / 2;
    const distance = Math.hypot(dx, dy);
    const visionRangeX = 180;
    const visionRangeY = 75;

    setEyeCoords({
      x: (Math.sin(angle) * Math.min(distance, visionRangeX)) / visionRangeX,
      y: (Math.cos(angle) * Math.min(distance, visionRangeY)) / visionRangeY
    });
  };

  const resetEyes = () => {
    setEyeCoords({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const pupilStyle = {
    transform: `translate(calc(-50% + ${eyeCoords.x * 50}%), calc(-50% + ${eyeCoords.y * 50}%))`
  };

  const layers = (children: React.ReactNode) => (
    <>
      <span ref={eyesRef} className={styles.eyes} aria-hidden="true">
        <span className={styles.eye}>
          <span className={styles.pupil} style={pupilStyle} />
        </span>
        <span className={styles.eye}>
          <span className={styles.pupil} style={pupilStyle} />
        </span>
      </span>
      <motion.span
        className={`${styles.cover} ${props.coverClassName ?? ""}`.trim()}
        animate={{ rotate: isHovered ? -12 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.8 }}
      >
        {children}
      </motion.span>
      <span className={styles.placeholder} aria-hidden="true">
        {children}
      </span>
    </>
  );

  if ("asChild" in props && props.asChild) {
    const { children, className } = props;
    const childProps = children.props;

    return cloneElement(
      children,
      {
        className: `${childProps.className ?? ""} ${styles.creepyButton} ${className ?? ""}`.trim(),
        onMouseMove: (event: React.MouseEvent<HTMLAnchorElement>) => {
          childProps.onMouseMove?.(event);
          updateEyes(event);
          setIsHovered(true);
        },
        onTouchMove: (event: React.TouchEvent<HTMLAnchorElement>) => {
          childProps.onTouchMove?.(event);
          updateEyes(event);
        },
        onMouseLeave: (event: React.MouseEvent<HTMLAnchorElement>) => {
          childProps.onMouseLeave?.(event);
          resetEyes();
        },
        onFocus: (event: React.FocusEvent<HTMLAnchorElement>) => {
          childProps.onFocus?.(event);
          setIsHovered(true);
        },
        onBlur: (event: React.FocusEvent<HTMLAnchorElement>) => {
          childProps.onBlur?.(event);
          setIsHovered(false);
        }
      },
      layers(children.props.children)
    );
  }

  const { children, className, ...buttonProps } = props;
  return (
    <button
      {...buttonProps}
      className={`${styles.creepyButton} ${className ?? ""}`.trim()}
      onMouseMove={(event) => {
        buttonProps.onMouseMove?.(event);
        updateEyes(event);
        setIsHovered(true);
      }}
      onTouchMove={(event) => {
        buttonProps.onTouchMove?.(event);
        updateEyes(event);
      }}
      onMouseLeave={(event) => {
        buttonProps.onMouseLeave?.(event);
        resetEyes();
      }}
      onFocus={(event) => {
        buttonProps.onFocus?.(event);
        setIsHovered(true);
      }}
      onBlur={(event) => {
        buttonProps.onBlur?.(event);
        setIsHovered(false);
      }}
    >
      {layers(children)}
    </button>
  );
}
