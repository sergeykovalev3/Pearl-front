"use client";

import type { CSSProperties } from "react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion } from "motion/react";
import Image from "next/image";

import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { CarouselChevronIcon } from "@/components/Icons/CarouselChevronIcon/CarouselChevronIcon";
import { LinkedInIcon } from "@/components/Icons/LinkedInIcon/LinkedInIcon";
import {
  homeSpecialists,
  type HomeSpecialistCard,
} from "@/data/specialists";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./OurSpecialists.module.scss";

const CARD_MAX_WIDTH_PX = 305;
const CAROUSEL_GAP_CEIL_PX = 20;
const GAP_FOR_FOUR_COLUMNS_PX = 10;

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

function slidesPerViewForWidth(carouselWidthPx: number): 1 | 2 | 3 | 4 {
  const w = carouselWidthPx;
  if (w >= 4 * CARD_MAX_WIDTH_PX + 3 * GAP_FOR_FOUR_COLUMNS_PX) return 4;
  if (w >= 3 * CARD_MAX_WIDTH_PX + 2 * CAROUSEL_GAP_CEIL_PX) return 3;
  if (w >= 2 * CARD_MAX_WIDTH_PX + 1 * CAROUSEL_GAP_CEIL_PX) return 2;
  return 1;
}

function SpecialistSlide({ specialist }: { specialist: HomeSpecialistCard }) {
  const { name, position, link, image } = specialist;

  return (
    <article className={styles.slide}>
      <div className={styles.slideMedia}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 699px) min(94vw, 305px), (max-width: 1019px) 33vw, (max-width: 1299px) 26vw, 305px"
          className={styles.slidePhoto}
        />
        <a
          href={link}
          className={styles.linkedInLink}
          aria-label={`${name} on GitHub`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon alt="" className={styles.linkedInIcon} size={25} />
        </a>
        <div className={styles.plaque}>
          <span className={styles.plaqueName}>{name}</span>
          <span className={styles.plaquePosition}>{position}</span>
        </div>
      </div>
    </article>
  );
}

export function OurSpecialists() {
  const reduceMotion = usePrefersReducedMotion();
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const [slidesPerView, setSlidesPerView] = useState<1 | 2 | 3 | 4>(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [navReady, setNavReady] = useState(false);

  useLayoutEffect(() => {
    const el = carouselViewportRef.current;
    if (!el) return;

    const apply = (width: number) => {
      setSlidesPerView(slidesPerViewForWidth(width));
    };

    apply(el.getBoundingClientRect().width);

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w != null) apply(w);
    });
    ro.observe(el);
    setNavReady(true);
    return () => ro.disconnect();
  }, []);

  const slideCount = homeSpecialists.length;
  const maxPage = Math.max(0, slideCount - slidesPerView);

  useLayoutEffect(() => {
    setPageIndex((p) => Math.min(p, maxPage));
  }, [maxPage]);

  const pageIndexClamped = Math.min(pageIndex, maxPage);

  const goDir = useCallback(
    (dir: -1 | 1) => {
      setPageIndex((p) => {
        const cur = Math.min(p, maxPage);
        const next = cur + dir;
        if (next < 0 || next > maxPage) return p;
        return next;
      });
    },
    [maxPage],
  );

  const canPrev = pageIndexClamped > 0;
  const canNext = pageIndexClamped < maxPage;
  const showNav = maxPage > 0;

  const prevDisabled = !canPrev;
  const nextDisabled = !canNext;

  const wrapOrchestration = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
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

  const carouselShellReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.9, scale: 0.987 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.72, ease: revealEase },
        },
      };

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.16, margin: "0px 0px -12% 0px" },
      };

  return (
    <section className={styles.section} aria-label="Our specialists">
      <div className={`container ${styles.container}`}>
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(wrapOrchestration && inViewReveal
            ? { variants: wrapOrchestration, ...inViewReveal }
            : {})}
        >
          <motion.div
            className={`${styles.info} ${MOTION_COMPOSITE}`}
            {...(headingColumnReveal ? { variants: headingColumnReveal } : {})}
          >
            <HeadingLead
              titleBefore="Meet our"
              titleHighlight="specialists"
              description="Meet the collaborators behind complex and everyday care—each doctor pairs deep training with approachable explanations tuned to your questions."
              align="center"
              className={styles.infoHeading}
              headingMotionVariants={headingClipReveal}
              descriptionMotionVariants={descriptionReveal}
            />
          </motion.div>
          <motion.div
            className={`${styles.carouselBlock} ${MOTION_COMPOSITE}`}
            {...(carouselShellReveal ? { variants: carouselShellReveal } : {})}
          >
            <div className={styles.viewport}>
              <div
                ref={carouselViewportRef}
                className={styles.carouselViewport}
                style={
                  {
                    "--spv": slidesPerView,
                  } as CSSProperties
                }
              >
                <div
                  className={styles.carouselRow}
                  style={{
                    transform: `translateX(calc(-${pageIndexClamped} * ((100cqi + var(--specialists-gap)) / ${slidesPerView})))`,
                  }}
                >
                  {homeSpecialists.map((s, slideIndex) => {
                    const isActive =
                      slideIndex >= pageIndexClamped &&
                      slideIndex < pageIndexClamped + slidesPerView;
                    return (
                      <div
                        key={s.id}
                        className={[
                          styles.carouselCardCell,
                          isActive
                            ? styles.carouselCardCellActive
                            : styles.carouselCardCellInactive,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        data-carousel-state={isActive ? "active" : "inactive"}
                        aria-hidden={!isActive}
                      >
                        <SpecialistSlide specialist={s} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {showNav && navReady ? (
              <div className={styles.nav}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => goDir(-1)}
                  disabled={prevDisabled}
                  aria-label="Previous specialist"
                >
                  <CarouselChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => goDir(1)}
                  disabled={nextDisabled}
                  aria-label="Next specialist"
                >
                  <CarouselChevronIcon direction="right" />
                </button>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
