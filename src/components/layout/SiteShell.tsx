import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BackgroundFX } from "@/components/effects/BackgroundFX";
import { BatSignalTransition } from "@/components/effects/BatSignalTransition";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { Preloader } from "@/components/effects/Preloader";
import { CinematicNav } from "@/components/layout/CinematicNav";
import { RouteLink } from "@/components/layout/RouteLink";
import { Icon } from "@/icons/icons";
import { profile } from "@/data/profile";
import { navigation, externalLinks } from "@/data/site";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import styles from "./SiteShell.module.css";

export function SiteShell() {
  const [booted, setBooted] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement | null>(null);

  useSwipeNavigation(mainRef);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <>
      {!booted && <Preloader onDone={() => setBooted(true)} />}
      <BackgroundFX />
      <CustomCursor />
      <BatSignalTransition />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <CinematicNav />
      <div ref={mainRef} id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function Footer() {
  const batLogo = "/assets/bat-black-silhouette-with-opened-wings.png";

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerBrand}>
          <img src={batLogo} alt="" className={styles.footerBat} width={18} height={18} />
          <span className="mono">{profile.name.toUpperCase()}</span>
        </div>

        <nav className={styles.footerNav} aria-label="Footer navigation">
          {navigation.map((item) => (
            <RouteLink key={item.path} to={item.path} className={styles.footerLink}>
              {item.label}
            </RouteLink>
          ))}
        </nav>

        <div className={styles.footerSocials}>
          <a href={externalLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
            <Icon name="github" size={17} />
          </a>
          <a href={externalLinks.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
            <Icon name="linkedin" size={17} />
          </a>
          <a href={externalLinks.email} aria-label="Send an email">
            <Icon name="mail" size={17} />
          </a>
        </div>
      </div>
      <div className={`container ${styles.footerMeta} mono`}>
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{profile.location}</span>
      </div>
    </footer>
  );
}
