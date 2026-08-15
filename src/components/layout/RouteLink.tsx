import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePrefersReducedMotion } from "@/hooks/useMotionHooks";
import { runViewTransition } from "@/lib/viewTransition";

interface RouteLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  activeClassName?: string;
  exact?: boolean;
}

/**
 * Drop-in replacement for react-router's <Link>/<NavLink> that animates the
 * route change through the native View Transitions API (see
 * lib/viewTransition.ts) instead of requiring an animation library. Falls
 * back to an ordinary client-side navigation when the API is unsupported or
 * the user prefers reduced motion.
 */
export const RouteLink = forwardRef<HTMLAnchorElement, RouteLinkProps>(function RouteLink(
  { to, className = "", activeClassName = "", exact = true, onClick, children, ...rest },
  ref
) {
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (location.pathname === to) return;
    runViewTransition(() => navigate(to), reducedMotion);
  };

  return (
    <a
      ref={ref}
      href={to}
      className={`${className} ${isActive ? activeClassName : ""}`.trim()}
      aria-current={isActive ? "page" : undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
});
