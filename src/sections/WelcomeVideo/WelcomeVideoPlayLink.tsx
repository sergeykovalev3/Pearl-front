"use client";

import { SITE_AUTHOR_GITHUB_HREF } from "@/data/siteNavLinks";
import { IconPlay } from "@/components/Icons/IconPlay/IconPlay";
import styles from "./WelcomeVideo.module.scss";

export function WelcomeVideoPlayLink() {
  return (
    <a
      href={SITE_AUTHOR_GITHUB_HREF}
      className={styles.videoLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub profile"
    >
      <span className={styles.videoOverlay} aria-hidden />
      <IconPlay className={styles.playIcon} />
    </a>
  );
}
