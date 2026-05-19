"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useSyncExternalStore } from "react";

import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { SITE_AUTHOR_GITHUB_HREF } from "@/data/siteNavLinks";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import { WelcomeVideoPlayLink } from "@/sections/WelcomeVideo/WelcomeVideoPlayLink";

import styles from "./WelcomeVideo.module.scss";

function subscribeReducedMotion(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", listener);
  return () => mq.removeEventListener("change", listener);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const textClipBleedRevealStart = "inset(-14px 100% -48px -4px)" as const;
const textClipBleedRevealEnd = "inset(-14px -4px -48px -4px)" as const;

export function WelcomeVideo() {
  const reduceMotion = usePrefersReducedMotion();

  const columnReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.11,
            delayChildren: 0.05,
          },
        },
      };

  const headingClipReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.76, clipPath: textClipBleedRevealStart },
        visible: {
          opacity: [0.76, 1],
          clipPath: [textClipBleedRevealStart, textClipBleedRevealEnd],
          transition: { duration: 0.82, ease: revealEase },
        },
      };

  const descriptionReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: revealEase },
        },
      };

  const videoReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 28, scale: 0.988 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, ease: revealEase },
        },
      };

  const buttonReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.52, ease: revealEase },
        },
      };

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2, margin: "0px 0px -12% 0px" },
      };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.wrapper}>
          <motion.div
            className={`${styles.info} ${MOTION_COMPOSITE}`}
            {...(columnReveal && inViewReveal
              ? { variants: columnReveal, ...inViewReveal }
              : {})}
          >
            <HeadingLead
              titleBefore="We’re"
              titleHighlight="Welcoming"
              titleAfter="new patients and can’t wait to meet you."
              description="Press play for a glimpse of our space, pacing, and culture—watch how appointments stay calm, orderly, and centered on exactly what worries you."
              align="center"
              className={styles.heading}
              headingMotionVariants={headingClipReveal}
              descriptionMotionVariants={descriptionReveal}
            />
            <motion.div
              className={`${styles.video} ${MOTION_COMPOSITE}`}
              {...(videoReveal ? { variants: videoReveal } : {})}
            >
              <Image
                src="/images/home/welcomeVideo/preview.jpg"
                alt="Welcome Video"
                fill
                className={styles.previewImage}
                sizes="(max-width: 768px) 100vw, 960px"
              />
              <WelcomeVideoPlayLink />
            </motion.div>
            <motion.div
              className={MOTION_COMPOSITE}
              {...(buttonReveal ? { variants: buttonReveal } : {})}
            >
              <ButtonBlue
                href={SITE_AUTHOR_GITHUB_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Playlist
              </ButtonBlue>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
