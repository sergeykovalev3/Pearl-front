"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import Image from "next/image";

import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./GameChanger.module.scss";

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

export function GameChanger() {
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

  const infoReveal = reduceMotion
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

  const buttonReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.52, ease: revealEase },
        },
      };

  const imageReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, x: 44, scale: 0.985 },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: { duration: 0.76, ease: revealEase },
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
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(wrapReveal && inViewReveal
            ? { variants: wrapReveal, ...inViewReveal }
            : {})}
        >
          <motion.div
            className={`${styles.info} ${MOTION_COMPOSITE}`}
            {...(infoReveal ? { variants: infoReveal } : {})}
          >
            <motion.h2
              className={`${styles.title} ${MOTION_COMPOSITE}`}
              variants={headingClipReveal}
            >
              {"Dental Website that's gonna shake the game rules up."}
            </motion.h2>
            <motion.p
              className={`${styles.description} ${MOTION_COMPOSITE}`}
              variants={descriptionReveal}
            >
              This narrative pairs purposeful copy with luminous layout—everything loads
              fast, reads cleanly, and nudges you from curiosity toward the team quietly
              driving your healthier smile journey.
            </motion.p>
            <motion.div
              className={`${styles.buttonWrap} ${MOTION_COMPOSITE}`}
              {...(buttonReveal ? { variants: buttonReveal } : {})}
            >
              <ButtonBlue href="/about">Learn More</ButtonBlue>
            </motion.div>
          </motion.div>
          <motion.div
            className={`${styles.image} ${MOTION_COMPOSITE}`}
            {...(imageReveal ? { variants: imageReveal } : {})}
          >
            <Image
              src="/images/home/gameChanger/image.png"
              alt="Game Changer"
              width={305}
              height={292}
              className={styles.imageImg}
              sizes="(max-width: 767px) min(100vw, 480px), (max-width: 991px) 38vw, 305px"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
