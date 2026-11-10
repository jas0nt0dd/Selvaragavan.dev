import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Icon } from "@/icons/icons";
import { BackgroundFX } from "@/components/effects/BackgroundFX";
import { BatSignalTransition } from "@/components/effects/BatSignalTransition";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { Preloader } from "@/components/effects/Preloader";
import { CinematicNav } from "@/components/layout/CinematicNav";
import { RouteLink } from "@/components/layout/RouteLink";
import { profile } from "@/data/profile";
import { navigation, externalLinks } from "@/data/site";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { SocialFlipButton } from "@/components/ui/SocialFlipButton";
import styles from "./SiteShell.module.css";

export function SiteShell() {
  const [booted, setBooted] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement | null>(null);

  useSwipeNavigation(mainRef);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  useEffect(() => {
    setFooterOpen(false);
    const updateFooterVisibility = () => {
      const { scrollHeight } = document.documentElement;
      const reachedBottom = window.scrollY + window.innerHeight >= scrollHeight - 2;
      setFooterOpen(reachedBottom);
    };

    updateFooterVisibility();
    window.addEventListener("scroll", updateFooterVisibility, { passive: true });
    window.addEventListener("resize", updateFooterVisibility);
    return () => {
      window.removeEventListener("scroll", updateFooterVisibility);
      window.removeEventListener("resize", updateFooterVisibility);
    };
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
      <WhoAmIButton />
      <div ref={mainRef} id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet />
      </div>
      <Footer isOpen={footerOpen} />
    </>
  );
}

function WhoAmIButton() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.currentTime = 0;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  return (
    <div className={styles.identityAudio}>
      <audio
        ref={audioRef}
        src="/assets/audio/who-am-i.mp3"
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        className={styles.identityAudioButton}
        onClick={toggleAudio}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause identity transmission" : "Play identity transmission"}
      >
        <Icon name={isPlaying ? "pause" : "play"} size={14} />
        <span className="mono">{isPlaying ? "TRANSMISSION ACTIVE" : "WHO AM I?"}</span>
      </button>
    </div>
  );
}

function Footer({ isOpen }: { isOpen: boolean }) {
  const batLogo = "/assets/bat-black-silhouette-with-opened-wings.png";

  return (
    <footer
      className={`${styles.footer} ${isOpen ? styles.footerOpen : ""}`}
      aria-hidden={!isOpen}
    >
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

        <SocialFlipButton
          className={styles.footerSocials}
          items={[
            { letter: "G", icon: "github", label: "GitHub", href: externalLinks.github, external: true },
            { letter: "L", icon: "linkedin", label: "LinkedIn", href: externalLinks.linkedin, external: true },
            { letter: "M", icon: "mail", label: "Email", href: externalLinks.email }
          ]}
        />
      </div>
      <div className={`container ${styles.footerMeta} mono`}>
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{profile.location}</span>
      </div>
    </footer>
  );
}
