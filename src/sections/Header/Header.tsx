"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { MenuIcon } from "@/components/Icons/MenuIcon/MenuIcon";

import {
  SITE_CONTACT_BOOKING_HREF,
  SITE_NAV_LINKS,
  siteNavLinkIsActive,
} from "@/data/siteNavLinks";
import { acquireDocumentScrollLock } from "@/lib/documentScrollLock";
import { pearlAvatarLetter } from "@/lib/pearlAvatarLetter";
import {
  pearlFetchSessionUser,
  PEARL_AUTH_CHANGE_EVENT,
  readPearlSessionHint,
  writePearlSessionHint,
  type PearlSessionUser,
} from "@/lib/pearlSession";

import styles from "./Header.module.scss";

const SITE_HEADER_LIGHT_BLUE_BG_PATHS = ["/"] as const;

const SITE_HEADER_LIGHT_BLUE_BG_PREFIXES = [
  "/blogs",
  "/register",
  "/login",
  "/profile",
  "/about",
] as const;

/** Light blue header for nested routes only: /services/[slug], not /services index */
const SITE_HEADER_LIGHT_BLUE_PARENT_PREFIXES = ["/services"] as const;

function siteHeaderUsesLightBlueBackground(pathname: string): boolean {
  if (
    (SITE_HEADER_LIGHT_BLUE_BG_PATHS as readonly string[]).includes(pathname)
  ) {
    return true;
  }

  const hasNestedUnderParentBg = (
    SITE_HEADER_LIGHT_BLUE_PARENT_PREFIXES as readonly string[]
  ).some((prefix) => {
    if (!pathname.startsWith(`${prefix}/`)) return false;
    return pathname.length > `${prefix}/`.length;
  });
  if (hasNestedUnderParentBg) return true;

  return SITE_HEADER_LIGHT_BLUE_BG_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

type HeaderSession =
  | { status: "pending" }
  | { status: "ready"; user: PearlSessionUser | null };

function HeaderShell({ pathname }: { pathname: string }) {
  const lightBlueHeaderBg = siteHeaderUsesLightBlueBackground(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<HeaderSession>({
    status: "pending",
  });
  const menuPanelId = useId();
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const hint = readPearlSessionHint();
    if (hint) {
      setSession({ status: "ready", user: hint });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      const user = await pearlFetchSessionUser();
      if (!cancelled) {
        writePearlSessionHint(user);
        setSession({ status: "ready", user });
      }
    };
    void sync();
    const onAuthChange = () => {
      void sync();
    };
    window.addEventListener(PEARL_AUTH_CHANGE_EVENT, onAuthChange);
    return () => {
      cancelled = true;
      window.removeEventListener(PEARL_AUTH_CHANGE_EVENT, onAuthChange);
    };
  }, []);

  const wrapperBgClass = lightBlueHeaderBg
    ? styles.wrapperBgLightBlue
    : styles.wrapperBgWhite;

  useLayoutEffect(() => {
    const root = headerRef.current;
    if (!root) return;

    const syncHeaderOffset = () => {
      const rect = root.getBoundingClientRect();
      const cs = getComputedStyle(root);
      const marginBottom =
        parseFloat(cs.marginBlockEnd || cs.marginBottom || "0") || 0;
      const bottom = Math.max(0, Math.ceil(rect.bottom + marginBottom));
      document.body.style.setProperty("--site-header-offset", `${bottom}px`);
    };

    syncHeaderOffset();

    const resizeObserver = new ResizeObserver(syncHeaderOffset);
    resizeObserver.observe(root);
    window.addEventListener("resize", syncHeaderOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeaderOffset);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    return acquireDocumentScrollLock();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 960px)");
    const onChange = () => setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMenuOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <header ref={headerRef} className={styles.header} data-site-header="">
      <div className="container">
        <div className={`${styles.wrapper} ${wrapperBgClass}`}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="Pearl Dental Care — home"
          >
            <Image
              src="/images/global/logo.png"
              alt="Pearl Dental Care"
              width={705}
              height={231}
              className={styles.logoImage}
              priority
              sizes="(max-width: 640px) 180px, 240px"
            />
          </Link>
          <nav className={styles.navigation} aria-label="Primary">
            {SITE_NAV_LINKS.map(({ href, label }) => {
              const active = siteNavLinkIsActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    styles.navigationLink,
                    active ? styles.navigationLinkActive : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className={styles.actions}>
            {session.status === "pending" ? (
              <div
                className={styles.authPending}
                aria-busy="true"
                aria-label="Account"
              />
            ) : session.user ? (
              <div className={styles.sessionCluster}>
                <Link
                  href="/profile"
                  className={styles.avatarLink}
                  aria-label={`Profile for ${session.user.fullName}`}
                >
                  <div className={styles.avatar} aria-hidden>
                    <span className={styles.avatarLetter}>
                      {pearlAvatarLetter(
                        session.user.fullName,
                        session.user.email,
                      )}
                    </span>
                  </div>
                </Link>
                <ButtonBlue href={SITE_CONTACT_BOOKING_HREF}>Book Now</ButtonBlue>
              </div>
            ) : (
              <>
                <Link href="/login" className={styles.actionsLink}>
                  Login
                </Link>
                <ButtonBlue href="/register">Register</ButtonBlue>
              </>
            )}
          </div>
          <button
            type="button"
            className={styles.menuToggle}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuPanelId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon size={20} />
          </button>
        </div>
      </div>

      <div
        className={styles.mobileRoot}
        data-open={menuOpen ? "true" : "false"}
        inert={menuOpen ? undefined : true}
      >
        <button
          type="button"
          className={styles.mobileBackdrop}
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
        <div
          id={menuPanelId}
          className={styles.mobilePanel}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className={styles.mobilePanelHeader}>
            <button
              type="button"
              className={styles.mobileClose}
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                className={styles.mobileCloseIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <nav className={styles.mobileNav} aria-label="Primary">
            {SITE_NAV_LINKS.map(({ href, label }) => {
              const active = siteNavLinkIsActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    styles.mobileNavLink,
                    active ? styles.mobileNavLinkActive : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className={styles.mobileActions}>
            {session.status === "pending" ? (
              <div
                className={styles.mobileAuthPending}
                aria-busy="true"
                aria-label="Account"
              />
            ) : session.user ? (
              <div className={styles.mobileSession}>
                <Link
                  href="/profile"
                  className={styles.mobileSessionProfileLink}
                  aria-label={`Profile for ${session.user.fullName}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className={styles.avatar} aria-hidden>
                    <span className={styles.avatarLetter}>
                      {pearlAvatarLetter(
                        session.user.fullName,
                        session.user.email,
                      )}
                    </span>
                  </div>
                  <span className={styles.mobileSessionName}>
                    {session.user.fullName}
                  </span>
                </Link>
                <ButtonBlue
                  href={SITE_CONTACT_BOOKING_HREF}
                  className={styles.mobileBook}
                  onClick={() => setMenuOpen(false)}
                >
                  Book Now
                </ButtonBlue>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={styles.mobileActionsLink}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <ButtonBlue href="/register" className={styles.mobileRegister}>
                  Register
                </ButtonBlue>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Header() {
  const pathname = usePathname();
  return <HeaderShell pathname={pathname} />;
}
