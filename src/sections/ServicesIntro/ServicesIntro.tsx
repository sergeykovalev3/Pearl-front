"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";

import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { ServiceCard } from "@/components/ServiceCard/ServiceCard";
import { services } from "@/data/services";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./ServicesIntro.module.scss";

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

export function ServicesIntro() {
  const reduceMotion = usePrefersReducedMotion();

  const wrapReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.11,
            delayChildren: 0.06,
          },
        },
      };

  const headingBlockReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.035,
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

  const gridListReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.07,
            delayChildren: 0.1,
          },
        },
      };

  const gridItemReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 22 },
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
    <section className={styles.section} aria-label="Services Intro">
      <div className={`container ${styles.container}`}>
        <div className={styles.layout}>
          <motion.div
            className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
            {...(wrapReveal && inViewReveal
              ? { variants: wrapReveal, ...inViewReveal }
              : {})}
          >
            <motion.div
              className={`${styles.content} ${MOTION_COMPOSITE}`}
              {...(headingBlockReveal ? { variants: headingBlockReveal } : {})}
            >
              <HeadingLead
                as="h1"
                titleBefore=""
                titleHighlight="Services"
                description="Each service includes candidacy cues, typical timelines, and maintenance expectations—choose care knowing how it fits your broader oral health map."
                align="center"
                headingMotionVariants={headingClipReveal}
                descriptionMotionVariants={headingClipReveal}
              />
            </motion.div>
            <motion.ul
              className={`${styles.grid} ${MOTION_COMPOSITE}`}
              {...(gridListReveal ? { variants: gridListReveal } : {})}
            >
              {services.map((service) => (
                <motion.li
                  key={service.id}
                  className={`${styles.item} ${MOTION_COMPOSITE}`}
                  {...(gridItemReveal ? { variants: gridItemReveal } : {})}
                >
                  <ServiceCard service={service} />
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
