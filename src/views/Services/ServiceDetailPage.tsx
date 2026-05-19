"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useSyncExternalStore } from "react";

import type { ServiceItem } from "@/data/services";

import { GameChanger } from "@/sections/GameChanger/GameChanger";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./ServiceDetailPage.module.scss";

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

function paragraphsFromBody(text: string) {
  return text
    .trim()
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

const META_LINE = "Pearl Dental Care · Patient-centered treatment";

export function ServiceDetailPage({ service }: { service: ServiceItem }) {
  const reduceMotion = usePrefersReducedMotion();
  const bodyParagraphs = paragraphsFromBody(service.text);

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

  const heroReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.78, y: 28, scale: 0.98 },
        visible: {
          opacity: [0.78, 1],
          y: [28, 0],
          scale: [0.98, 1],
          transition: {
            duration: 0.95,
            ease: revealEase,
            delay: 0.04,
          },
        },
      };

  const metaReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.52, ease: revealEase },
        },
      };

  const tagItemReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.42, ease: revealEase },
        },
      };

  const rootOrchestration = reduceMotion
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

  const headerOrchestration = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.09,
            delayChildren: 0.03,
          },
        },
      };

  const proseOrchestration = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.06,
          },
        },
      };

  const bodyOrchestration = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.11,
            delayChildren: 0.07,
          },
        },
      };

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.12, margin: "0px 0px -8% 0px" },
      };

  const innerClass = [`container ${styles.inner}`, MOTION_COMPOSITE].join(" ");

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <motion.div
          className={innerClass}
          {...(rootOrchestration && inViewReveal
            ? { variants: rootOrchestration, ...inViewReveal }
            : {})}
        >
          <motion.div
            className={styles.heroIcon}
            {...(heroReveal ? { variants: heroReveal } : {})}
          >
            <div className={styles.heroIconRing}>
              <Image
                src={service.image}
                alt=""
                width={118}
                height={118}
                sizes="59px"
                className={styles.heroIconImage}
                priority
              />
            </div>
          </motion.div>
          <motion.div
            className={styles.body}
            {...(bodyOrchestration ? { variants: bodyOrchestration } : {})}
          >
            <motion.header
              className={`${styles.postHeader} ${MOTION_COMPOSITE}`}
              {...(headerOrchestration ? { variants: headerOrchestration } : {})}
            >
              <motion.h1
                className={[styles.title, MOTION_COMPOSITE].join(" ")}
                {...(textClipReveal ? { variants: textClipReveal } : {})}
              >
                {service.title}
              </motion.h1>
              <motion.p
                className={[styles.meta, MOTION_COMPOSITE].join(" ")}
                {...(metaReveal ? { variants: metaReveal } : {})}
              >
                {META_LINE}
              </motion.p>
            </motion.header>
            {service.tags.length > 0 ? (
              <motion.ul
                className={[styles.tags, MOTION_COMPOSITE].join(" ")}
                {...(reduceMotion
                  ? {}
                  : {
                      variants: {
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.055,
                            delayChildren: 0.05,
                          },
                        },
                      },
                    })}
              >
                {service.tags.map((tag) => (
                  <motion.li
                    key={tag}
                    className={[styles.tag, MOTION_COMPOSITE].join(" ")}
                    {...(tagItemReveal ? { variants: tagItemReveal } : {})}
                  >
                    {tag}
                  </motion.li>
                ))}
              </motion.ul>
            ) : null}
            <motion.div
              className={[styles.prose, MOTION_COMPOSITE].join(" ")}
              {...(proseOrchestration ? { variants: proseOrchestration } : {})}
            >
              {bodyParagraphs.map((paragraph, idx) => (
                <motion.p
                  key={idx}
                  className={[styles.paragraph, MOTION_COMPOSITE].join(" ")}
                  {...(textClipReveal ? { variants: textClipReveal } : {})}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </article>
      <GameChanger />
    </main>
  );
}
