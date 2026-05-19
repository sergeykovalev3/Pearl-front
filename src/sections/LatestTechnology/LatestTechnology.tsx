"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";

import Image from "next/image";

import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./LatestTechnology.module.scss";

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

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const textClipBleedRevealStart = "inset(-14px 100% -48px -4px)" as const;
const textClipBleedRevealEnd = "inset(-14px -4px -48px -4px)" as const;

const paragraphs = [
  "Dentists today already utilize software to capture insights in clinical decision-making. These practices will continue to develop to integrate AI algorithms that enable clinicians to find the best modalities for their patients.",
  "In the 21st century, digital radiographs and 3D imaging have become the standard of dental care. Using an intraoral scanner with digitized data for 3D dental impressions (vs. polyvinyl siloxane and rubber base impressions) for a dental crown is now commonplace.",
  "Artificial intelligence is laying the groundwork for the future of the dental industry. Dental robots can now perform functions such as filling cavities and cleaning or extracting teeth",
] as const;

export function LatestTechnology() {
  const reduceMotion = usePrefersReducedMotion();

  const textClipReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.76, clipPath: textClipBleedRevealStart },
        visible: {
          opacity: [0.76, 1],
          clipPath: [textClipBleedRevealStart, textClipBleedRevealEnd],
          transition: { duration: 0.82, ease: revealEase },
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
            delay: 0.16,
          },
        },
      };

  const sectionRevealVariants = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.22,
            delayChildren: 0.06,
          },
        },
      };

  const infoRevealVariants = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.14,
            delayChildren: 0.05,
          },
        },
      };

  const contentRevealVariants = reduceMotion
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

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.16, margin: "0px 0px -10% 0px" },
      };

  return (
    <section className={styles.section} aria-label="Latest Technology">
      <div className={`container ${styles.container}`}>
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(sectionRevealVariants && inViewReveal
            ? { variants: sectionRevealVariants, ...inViewReveal }
            : {})}
        >
          <HeadingLead
            as="h2"
            titleBefore="Latest Technology"
            description="Thanks to major technological advancements, dentistry allows treating the most complex cases with less time and more efficiency."
            titleHighlight="Technology"
            align="center"
            headingMotionVariants={textClipReveal}
            descriptionMotionVariants={textClipReveal}
          />
          <motion.div
            className={`${styles.info} ${MOTION_COMPOSITE}`}
            {...(infoRevealVariants ? { variants: infoRevealVariants } : {})}
          >
            <motion.div
              className={`${styles.image} ${MOTION_COMPOSITE}`}
              {...(imageReveal ? { variants: imageReveal } : {})}
            >
              <Image
                className={styles.imagePhoto}
                src="/images/about/latestTechnology/image.png"
                alt="Latest Technology"
                width={522}
                height={393}
                sizes="(max-width: 991px) min(100vw - 3rem, 522px), min(42vw + 120px, 522px)"
              />
            </motion.div>
            <motion.div
              className={`${styles.content} ${MOTION_COMPOSITE}`}
              {...(contentRevealVariants ? { variants: contentRevealVariants } : {})}
            >
              <motion.h3
                className={`${styles.contentTitle} ${MOTION_COMPOSITE}`}
                {...(textClipReveal ? { variants: textClipReveal } : {})}
              >
                The Future of Dentistry is Digital:
              </motion.h3>
              {paragraphs.map((paragraph) => (
                <motion.p
                  key={paragraph}
                  className={`${styles.contentDescription} ${MOTION_COMPOSITE}`}
                  {...(textClipReveal ? { variants: textClipReveal } : {})}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
