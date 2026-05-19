"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import { FacebookCircleIcon } from "@/components/Icons/FacebookCircleIcon/FacebookCircleIcon";
import { InstagramCircleIcon } from "@/components/Icons/InstagramCircleIcon/InstagramCircleIcon";
import { LinkedInCircleIcon } from "@/components/Icons/LinkedInCircleIcon/LinkedInCircleIcon";
import { TwitterCircleIcon } from "@/components/Icons/TwitterCircleIcon/TwitterCircleIcon";
import { YoutubeCircleIcon } from "@/components/Icons/YoutubeCircleIcon/YoutubeCircleIcon";
import { SITE_NAV_LINKS, siteNavLinkIsActive } from "@/data/siteNavLinks";

import styles from "./Footer.module.scss";

const ICON_SIZE = 32;

const FOOTER_SOCIAL_LINKS: {
  href: string;
  label: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
}[] = [
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    Icon: FacebookCircleIcon,
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    Icon: InstagramCircleIcon,
  },
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    Icon: YoutubeCircleIcon,
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    Icon: LinkedInCircleIcon,
  },
  {
    href: "https://twitter.com/",
    label: "Twitter",
    Icon: TwitterCircleIcon,
  },
];

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={`container ${styles.container}`}>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <Link href="/" className={styles.logo} aria-label="Pearl Dental Care — home">
              <Image
                src="/images/global/logo.png"
                alt="Pearl Dental Care"
                width={705}
                height={231}
                sizes="clamp(112px, 28vw, 160px)"
                className={styles.logoImage}
              />
            </Link>
            <nav className={styles.navigation} aria-label="Primary">
              <ul className={styles.navigationList}>
                {SITE_NAV_LINKS.map(({ href, label }) => {
                  const active = siteNavLinkIsActive(pathname, href);
                  return (
                    <li key={href} className={styles.navigationItem}>
                      <Link
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
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          <div className={styles.divider} />
          <div className={styles.bottom}>
            <div className={styles.copyright}>
              All rights reserved ® Pearl Dental Care ·{" "}
              <Link href="/terms" className={styles.legalLink}>
                Terms of Use
              </Link>{" "}
              ·{" "}
              <Link href="/privacy" className={styles.legalLink}>
                Privacy Policy
              </Link>
            </div>
            <ul className={styles.socialsList} aria-label="Social media">
              {FOOTER_SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <li key={label} className={styles.socialsItem}>
                  <a
                    href={href}
                    className={styles.socialsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon size={ICON_SIZE} className={styles.socialsIcon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
