"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";

import Image from "next/image";

import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { aboutSpecialists } from "@/data/specialists";
import { SITE_CONTACT_BOOKING_HREF } from "@/data/siteNavLinks";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./AboutSpecialists.module.scss";

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

const specialistCardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
    x: 36,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.78,
      ease: revealEase,
    },
  },
};

function specialistPhotoReveal() {
  return {
    hidden: { opacity: 0, scale: 1.065 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.68,
        ease: revealEase,
        delay: 0.08,
      },
    },
  };
}

export function AboutSpecialists() {
  const reduceMotion = usePrefersReducedMotion();

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

  const dividerRevealVariants = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, scaleX: 0 },
        visible: {
          opacity: 1,
          scaleX: 1,
          transition: { duration: 0.62, ease: revealEase },
        },
      };

  const sectionRevealRoot = reduceMotion
    ? undefined
    : ({
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.22,
            delayChildren: 0.05,
          },
        },
      } as const);

  const headingRowVariants = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {},
      };

  const specialistsListReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.04,
          },
        },
      };

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.14, margin: "0px 0px -8% 0px" },
      };

  const photoReveal = specialistPhotoReveal();

  return (
    <section className={styles.section} aria-label="About Specialists">
      <div className={`container ${styles.container}`}>
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(sectionRevealRoot && inViewReveal
            ? { variants: sectionRevealRoot, ...inViewReveal }
            : {})}
        >
          <motion.div
            className={MOTION_COMPOSITE}
            {...(headingRowVariants ? { variants: headingRowVariants } : {})}
          >
            <HeadingLead
              as="h2"
              titleBefore="Meet our"
              titleHighlight="specialists"
              align="center"
              description="Look past polished portraits for specialties, philosophies, and how multi-doctor collaboration keeps every treatment plan cohesive and understandable."
              underlineLastWordOnly={false}
              headingMotionVariants={headingClipReveal}
              descriptionMotionVariants={headingClipReveal}
            />
          </motion.div>

          <motion.ul
            className={`${styles.specialists} ${MOTION_COMPOSITE}`}
            {...(specialistsListReveal ? { variants: specialistsListReveal } : {})}
          >
            {aboutSpecialists.flatMap((specialist, index) => {
              const card = (
                <motion.li
                  key={specialist.id}
                  className={`${styles.specialist} ${MOTION_COMPOSITE}`}
                  {...(!reduceMotion ? { variants: specialistCardVariants } : {})}
                >
                  <motion.div
                    className={`${styles.specialistImage} ${MOTION_COMPOSITE}`}
                    {...(!reduceMotion ? { variants: photoReveal } : {})}
                  >
                    <Image
                      className={styles.specialistPhoto}
                      src={specialist.image}
                      alt={specialist.name}
                      width={305}
                      height={350}
                      sizes="(max-width: 991px) min(100vw - 3rem, 305px), min(32vw + 120px, 305px)"
                    />
                  </motion.div>
                  <div className={styles.specialistContent}>
                    <div className={styles.specialistInfo}>
                      <h3 className={styles.specialistInfoName}>
                        {specialist.name}
                      </h3>
                      <span className={styles.specialistInfoPosition}>
                        {specialist.position}
                      </span>
                    </div>
                    <p className={styles.specialistDescription}>
                      {specialist.description}
                    </p>
                    <ButtonBlue
                      className={styles.specialistButton}
                      href={SITE_CONTACT_BOOKING_HREF}
                    >
                      Book an appointment
                    </ButtonBlue>
                  </div>
                </motion.li>
              );

              if (index >= aboutSpecialists.length - 1) {
                return [card];
              }

              const divider = (
                <motion.li
                  key={`${specialist.id}-divider`}
                  className={`${styles.specialistDividerItem} ${MOTION_COMPOSITE}`}
                  {...(!reduceMotion ? { variants: dividerRevealVariants } : {})}
                  aria-hidden
                >
                  <hr className={styles.specialistDivider} />
                </motion.li>
              );

              return [card, divider];
            })}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
