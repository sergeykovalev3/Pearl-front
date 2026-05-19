"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";

import { BlogArticlesGrid } from "@/components/BlogArticlesGrid/BlogArticlesGrid";
import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { articles } from "@/data/articles";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./HomeNewsArticles.module.scss";

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

export function HomeNewsArticles() {
  const reduceMotion = usePrefersReducedMotion();

  const wrapOrchestration = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
          },
        },
      };

  const headOrchestration = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.085,
            delayChildren: 0.02,
          },
        },
      };

  const headingColumnReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {},
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

  const viewAllReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.48, ease: revealEase },
        },
      };

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.14, margin: "0px 0px -10% 0px" },
      };

  return (
    <section className={styles.section} aria-label="News and articles">
      <motion.div
        className={`container ${styles.container} ${MOTION_COMPOSITE}`}
        {...(wrapOrchestration && inViewReveal
          ? { variants: wrapOrchestration, ...inViewReveal }
          : {})}
      >
        <motion.div
          className={`${styles.head} ${MOTION_COMPOSITE}`}
          {...(headOrchestration ? { variants: headOrchestration } : {})}
        >
          <motion.div
            className={`${styles.headLead} ${MOTION_COMPOSITE}`}
            {...(headingColumnReveal ? { variants: headingColumnReveal } : {})}
          >
            <HeadingLead
              titleBefore=""
              titleHighlight="News & Articles"
              description="Skim dentist-reviewed articles about hygiene cues, restorative options, and trend checks—bite-sized wisdom you can use between routine appointments."
              align="start"
              className={styles.headLeadInfo}
              headingMotionVariants={headingClipReveal}
              descriptionMotionVariants={descriptionReveal}
            />
          </motion.div>
          <motion.div
            className={MOTION_COMPOSITE}
            {...(viewAllReveal ? { variants: viewAllReveal } : {})}
          >
            <ButtonBlue href="/blogs">View All</ButtonBlue>
          </motion.div>
        </motion.div>

        <BlogArticlesGrid
          articles={articles}
          cardHref={(article) => `/blogs/${article.id}`}
        />
      </motion.div>
    </section>
  );
}
