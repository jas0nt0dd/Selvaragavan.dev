import React from "react";
import styles from "./CylinderCarousel.module.css";

export interface CarouselCard {
  id: string;
  title: string;
  subtitle?: string;
  color?: string;
}

export interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  cards: CarouselCard[];
  containerClassName?: string;
  cardClassName?: string;
  animationDuration?: number;
  cardWidth?: number;
}

export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      cards,
      className,
      containerClassName,
      cardClassName,
      animationDuration = 36,
      cardWidth = 280,
      ...props
    },
    ref
  ) => {
    const N = cards.length;
    const angle = 360 / N;
    const radius = Math.round(cardWidth / (2 * Math.tan(Math.PI / N)));

    return (
      <div
        ref={ref}
        className={styles.wrapper}
        style={{
          "--anim-dur": `${animationDuration}s`,
        } as React.CSSProperties}
        {...props}
      >
        <div className={styles.carousel}>
          {cards.map((card, i) => {
            const rotationAngle = i * angle;
            return (
              <div
                key={card.id}
                className={styles.card}
                style={
                  {
                    "--card-color": card.color || "#C4172B",
                    transform: `rotateY(${rotationAngle}deg) translateZ(${radius}px)`,
                  } as React.CSSProperties
                }
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  {card.subtitle && <p className={styles.cardSubtitle}>{card.subtitle}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CylinderCarousel.displayName = "CylinderCarousel";
