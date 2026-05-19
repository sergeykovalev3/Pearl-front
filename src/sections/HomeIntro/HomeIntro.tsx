"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { PhoneIcon } from "@/components/Icons/PhoneIcon/PhoneIcon";
import { LinkedInIcon } from "@/components/Icons/LinkedInIcon/LinkedInIcon";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import {
  SITE_AUTHOR_GITHUB_HREF,
  SITE_CONTACT_BOOKING_HREF,
} from "@/data/siteNavLinks";

import styles from "./HomeIntro.module.scss";

const introEaseOpen: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MOTION_GATE_MS = 200;

const textClipBleedRevealStart = "inset(-14px 100% -48px -4px)" as const;
const textClipBleedRevealEnd = "inset(-14px -4px -48px -4px)" as const;

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

export function HomeIntro() {
  const reduceMotion = usePrefersReducedMotion();
  const [motionEntered, setMotionEntered] = useState(false);
  const [introTextBoot, setIntroTextBoot] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setIntroTextBoot(false);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") return;

    let released = false;
    const engage = () => {
      if (released) return;
      released = true;
      setMotionEntered(true);
    };

    const t = window.setTimeout(engage, MOTION_GATE_MS);
    let rafOuter = 0;
    let rafInner = 0;
    rafOuter = requestAnimationFrame(() => {
      rafInner = requestAnimationFrame(() => {
        const fonts = document.fonts?.ready;
        if (fonts) {
          void fonts.then(engage).catch(engage);
        } else {
          engage();
        }
      });
    });

    return () => {
      released = true;
      window.clearTimeout(t);
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
    };
  }, [reduceMotion]);

  const gatedMotion = motionEntered && !reduceMotion;

  const contentStagger = reduceMotion
    ? undefined
    : {
        idle: {},
        enter: {
          transition: {
            staggerChildren: 0.098,
            delayChildren: 0.2,
          },
        },
      };

  const blockEnter = reduceMotion
    ? undefined
    : {
        idle: { opacity: 1, y: 0 },
        enter: {
          opacity: [0.84, 1],
          y: [46, 0],
          transition: { duration: 0.94, ease: introEaseOpen },
        },
      };

  const textEnter = reduceMotion
    ? undefined
    : {
        idle: { opacity: 0.76, clipPath: textClipBleedRevealStart },
        enter: {
          opacity: [0.76, 1],
          clipPath: [textClipBleedRevealStart, textClipBleedRevealEnd],
          transition: { duration: 0.82, ease: introEaseOpen },
        },
      };

  const heroEnter = reduceMotion
    ? undefined
    : {
        idle: { opacity: 1, x: 0, scale: 1 },
        enter: {
          opacity: [0.78, 1],
          x: [56, 0],
          scale: [0.97, 1],
          transition: {
            duration: 0.98,
            ease: introEaseOpen,
            delay: 0.26,
          },
        },
      };

  return (
    <section className={styles.section} aria-label="Introduction">
      <div className={`container ${styles.container}`}>
        <div className={styles.layout}>
          <div className={styles.wrapper}>
            <motion.div
              className={`${styles.content} ${MOTION_COMPOSITE}`}
              {...(reduceMotion
                ? {}
                : {
                    variants: contentStagger,
                    initial: "idle",
                    animate: gatedMotion ? "enter" : "idle",
                  })}
            >
              <HeadingLead
                layout="fragment"
                as="h1"
                titleBefore="Get ready for your best ever"
                titleHighlight="Dental Experience!"
                description={
                  <>
                    Step into a practice where modern technique meets unrushed,
                    plain-language guidance—see your options clearly, relax in the chair,
                    and book a visit whenever you’re ready for your next milestone.
                  </>
                }
                headingClassName={
                  !reduceMotion && introTextBoot ? styles.introTextBootClip : undefined
                }
                descriptionClassName={[
                  styles.introLead,
                  !reduceMotion && introTextBoot ? styles.introTextBootClip : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                headingMotionVariants={reduceMotion ? undefined : textEnter}
                descriptionMotionVariants={reduceMotion ? undefined : textEnter}
              />
              <motion.div
                className={`${styles.actions} ${MOTION_COMPOSITE}`}
                {...(reduceMotion ? {} : { variants: blockEnter })}
              >
                <ButtonBlue href={SITE_CONTACT_BOOKING_HREF}>Book an appointment</ButtonBlue>
                <div className={styles.phone}>
                  <div className={styles.phoneIcon}>
                    <div className={styles.phoneIconInner}>
                      <PhoneIcon size={24} />
                    </div>
                  </div>
                  <div className={styles.phoneText}>
                    <span className={styles.phoneTextTitle}>
                      Dental 24H Emergency
                    </span>
                    <a href="tel:090078601" className={styles.phoneTextLink}>
                      0900-78601
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className={`${styles.quote} ${MOTION_COMPOSITE}`}
                {...(reduceMotion ? {} : { variants: blockEnter })}
              >
                <div className={styles.quoteInfo}>
                  <div className={styles.quoteInfoAvatar}>
                    <Image
                      src="/images/home/intro/avatar.png"
                      alt="Thomas daniel"
                      width={42}
                      height={42}
                    />
                  </div>
                  <div className={styles.quoteInfoInner}>
                    <span className={styles.quoteInfoName}>Thomas daniel</span>
                    <span className={styles.quoteInfoTitle}>Sr Dental</span>
                  </div>
                </div>
                <blockquote className={styles.quoteText}>
                  Top Quailty dental treatment done by field experts, Highly
                  Recommended for everyone
                </blockquote>
                <a
                  href={SITE_AUTHOR_GITHUB_HREF}
                  className={styles.quoteIconLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                >
                  <LinkedInIcon
                    alt=""
                    className={styles.quoteIconImg}
                    size={25}
                  />
                </a>
              </motion.div>
            </motion.div>
            <motion.div
              className={`${styles.image} ${MOTION_COMPOSITE}`}
              {...(reduceMotion
                ? {}
                : {
                    variants: heroEnter,
                    initial: "idle",
                    animate: gatedMotion ? "enter" : "idle",
                  })}
            >
              <Image
                src="/images/home/intro/doctor.png"
                alt="Dental treatment"
                width={650}
                height={650}
                className={styles.doctorImg}
                priority
              />
              <Image
                src="/images/home/intro/doctortBg.png"
                alt=""
                className={styles.doctorBg}
                fill
                sizes="(max-width: 959px) min(100vw, 420px), min(44vw, 650px)"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
