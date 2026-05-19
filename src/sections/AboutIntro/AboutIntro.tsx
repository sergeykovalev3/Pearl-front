"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useSyncExternalStore, type ReactNode } from "react";

import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./AboutIntro.module.scss";

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

const TEXT_LINE_COUNT = 4;
const innerTextStagger = 0.11;
const textClipDuration = 0.82;

const staggerBeforeImageColumn =
  (TEXT_LINE_COUNT - 1) * innerTextStagger + textClipDuration + 0.08;

export function AboutIntro({ children }: { children?: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  const headingClipReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.76, clipPath: textClipBleedRevealStart },
        visible: {
          opacity: [0.76, 1],
          clipPath: [textClipBleedRevealStart, textClipBleedRevealEnd],
          transition: { duration: textClipDuration, ease: revealEase },
        },
      };

  const imageReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.78, x: 56, scale: 0.97 },
        visible: {
          opacity: [0.78, 1],
          x: [56, 0],
          scale: [0.97, 1],
          transition: {
            duration: 0.98,
            ease: revealEase,
            delay: 0.26,
          },
        },
      };

  const revealRootVariants = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.06,
          },
        },
      };

  const headingRowVariants = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {},
      };

  const textColumnRevealVariants = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: innerTextStagger,
            delayChildren: 0.05,
          },
        },
      };

  const contentRowRevealVariants = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerBeforeImageColumn,
            delayChildren: 0.06,
          },
        },
      };

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2, margin: "0px 0px -12% 0px" },
      };

  const missionParagraph1 =
    "At Northern Heights Dental, people come first. We help each of our patients to achieve optimal wellness and health by using a whole body approach to oral health. This means not just focusing on cavities, but focusing on; cranio-facial development, bite and joint balance, oral flora, proper muscle balance/function, and bio-compatibility of dental materials. Great care and planning ensure that everything we do helps promote overall health and well being.";

  const missionParagraph2 =
    "We work hard to stay up to date with the most advanced techniques and technologies to ensure that our patients receive the best care possible. Our office utilizes 3D CBCT radiographs to allow for guided surgical and endodontic protocols. This enables these procedures to performed digitally before they are performed surgically to ensure optimal results. 3D imaging also is utilized for the analysis of airway growth and development. We also use the best 3D optical scanner for all of our dental restoration and Invisalign impressions. Dr Williams is a strong advocate for using microsurgical techniques, this means less discomfort and faster healing times.";

  return (
    <section className={styles.section} aria-label="About">
      <div className={`container ${styles.container}`}>
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(revealRootVariants && inViewReveal
            ? { variants: revealRootVariants, ...inViewReveal }
            : {})}
        >
          <motion.div
            className={MOTION_COMPOSITE}
            {...(headingRowVariants ? { variants: headingRowVariants } : {})}
          >
            <HeadingLead
              as="h1"
              titleBefore=""
              titleHighlight="About Us"
              align="center"
              underlineLastWordOnly={false}
              headingMotionVariants={headingClipReveal}
            />
          </motion.div>

          <motion.div
            className={`${styles.content} ${MOTION_COMPOSITE}`}
            {...(contentRowRevealVariants ? { variants: contentRowRevealVariants } : {})}
          >
            <motion.div
              className={`${styles.info} ${MOTION_COMPOSITE}`}
              {...(textColumnRevealVariants ? { variants: textColumnRevealVariants } : {})}
            >
              <motion.h2
                className={`${styles.infoTitle} ${MOTION_COMPOSITE}`}
                {...(headingClipReveal ? { variants: headingClipReveal } : {})}
              >
                Our Mission
              </motion.h2>
              <motion.p
                className={`${styles.infoDescription} ${MOTION_COMPOSITE}`}
                {...(headingClipReveal ? { variants: headingClipReveal } : {})}
              >
                {missionParagraph1}
              </motion.p>
              <motion.h3
                className={`${styles.infoSubtitle} ${MOTION_COMPOSITE}`}
                {...(headingClipReveal ? { variants: headingClipReveal } : {})}
              >
                More than anything else we love creating happy, healthy smiles.
              </motion.h3>
              <motion.p
                className={`${styles.infoDescription} ${MOTION_COMPOSITE}`}
                {...(headingClipReveal ? { variants: headingClipReveal } : {})}
              >
                {missionParagraph2}
              </motion.p>
            </motion.div>
            <motion.div
              className={`${styles.image} ${MOTION_COMPOSITE}`}
              {...(imageReveal ? { variants: imageReveal } : {})}
            >
              <Image
                className={styles.imagePhoto}
                src="/images/about/aboutIntro/image.png"
                alt="About Us"
                width={453}
                height={603}
                sizes="(max-width: 991px) min(100vw - 3rem, 28rem), min(38vw, 453px)"
              />
            </motion.div>
          </motion.div>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
