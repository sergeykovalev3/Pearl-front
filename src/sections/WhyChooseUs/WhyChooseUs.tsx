"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useSyncExternalStore } from "react";

import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { ShieldIcon } from "@/components/Icons/Shield/Shield";
import { SITE_CONTACT_BOOKING_HREF } from "@/data/siteNavLinks";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./WhyChooseUs.module.scss";

const whyChooseUsList = [
  { title: "Top quality dental team" },
  { title: "State of the art dental services" },
  { title: "Discount on all dental treatment" },
  { title: "Enrollment is quick and easy" },
];

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

export function WhyChooseUs() {
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

  const imageReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, x: -44, scale: 0.985 },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: { duration: 0.76, ease: revealEase },
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

  const listStagger = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.065,
            delayChildren: 0.02,
          },
        },
      };

  const listItemReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, x: -14 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.42, ease: revealEase },
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
            className={`${styles.image} ${MOTION_COMPOSITE}`}
            {...(imageReveal ? { variants: imageReveal } : {})}
          >
            <Image
              src="/images/home/whyChooseUs/image.png"
              alt="Why Choose Us"
              width={414}
              height={444}
            />
          </motion.div>
          <motion.div
            className={`${styles.info} ${MOTION_COMPOSITE}`}
            {...(infoReveal ? { variants: infoReveal } : {})}
          >
            <HeadingLead
              titleBefore="Why choose"
              titleHighlight="Smile"
              titleAfter="for all your dental treatments?"
              description="We pair advanced diagnostics, meticulous technique, and honest communication—so every recommendation stays proportional to your smile goals."
              headingMotionVariants={headingClipReveal}
              descriptionMotionVariants={descriptionReveal}
            />
            <motion.ul
              className={`${styles.list} ${MOTION_COMPOSITE}`}
              {...(listStagger ? { variants: listStagger } : {})}
            >
              {whyChooseUsList.map((item) => (
                <motion.li
                  key={item.title}
                  className={`${styles.item} ${MOTION_COMPOSITE}`}
                  {...(listItemReveal ? { variants: listItemReveal } : {})}
                >
                  <ShieldIcon fill="#25b4f8" size={24} />
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className={MOTION_COMPOSITE}
              {...(buttonReveal ? { variants: buttonReveal } : {})}
            >
              <ButtonBlue href={SITE_CONTACT_BOOKING_HREF}>
                Book an appointment
              </ButtonBlue>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
