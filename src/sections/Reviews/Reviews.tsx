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
import { StarIcon } from "@/components/Icons/StarIcon/StarIcon";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./Reviews.module.scss";

const pathToImages = "/images/home/reviews";

type Review = {
  id: string;
  name: string;
  review: string;
  avatar: string;
  stars: number;
};

const reviewsList: Review[] = [
  {
    id: "thomas-daniel",
    name: "Thomas Daniel",
    review:
      "Booking took two minutes online and the hygienist talked me through everything before touching a tool. First cleaning in ages where I actually relaxed.",
    avatar: `${pathToImages}/avatar1.png`,
    stars: 5,
  },
  {
    id: "marcus-webb",
    name: "Marcus Webb",
    review:
      "Needed a crown and expected a sales pitch—instead I got clear options and photos so I could decide calmly. Follow-up texts matched what they promised.",
    avatar: `${pathToImages}/avatar2.png`,
    stars: 5,
  },
  {
    id: "elena-vasquez",
    name: "Elena Vasquez",
    review:
      "They squeezed my daughter in after a chipped tooth and kept both of us oriented the whole visit. Rare mix of efficiency and kindness.",
    avatar: `${pathToImages}/avatar3.png`,
    stars: 5,
  },
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    review:
      "Whitening consult felt honest about limits before quoting anything. Six months later the shade still looks natural under office lighting.",
    avatar: `${pathToImages}/avatar4.png`,
    stars: 5,
  },
];

const CARD_MAX_WIDTH_PX = 395;
const CAROUSEL_GAP_CEIL_PX = 20;

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

function slidesPerViewForWidth(carouselWidthPx: number): 1 | 2 | 3 {
  const w = carouselWidthPx;
  if (w >= 3 * CARD_MAX_WIDTH_PX + 2 * CAROUSEL_GAP_CEIL_PX) return 3;
  if (w >= 2 * CARD_MAX_WIDTH_PX + 1 * CAROUSEL_GAP_CEIL_PX) return 2;
  return 1;
}

function ReviewSlide({ review }: { review: Review }) {
  const { name, review: text, avatar, stars } = review;
  const safeStars = Math.min(5, Math.max(0, Math.round(stars)));

  return (
    <article className={styles.slide}>
      <div className={styles.slideHeader}>
        <div className={styles.avatarWrap}>
          <Image
            src={avatar}
            alt=""
            fill
            sizes="72px"
            className={styles.avatar}
          />
        </div>
        <div className={styles.meta}>
          <span className={styles.name}>{name}</span>
          <div
            className={styles.stars}
            aria-label={`${safeStars} out of 5 stars`}
          >
            {Array.from({ length: safeStars }, (_, i) => (
              <StarIcon key={i} className={styles.starIcon} />
            ))}
          </div>
        </div>
      </div>
      <p className={styles.reviewText}>{text}</p>
    </article>
  );
}

export function Reviews() {
  const reduceMotion = usePrefersReducedMotion();
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const [slidesPerView, setSlidesPerView] = useState<1 | 2 | 3>(1);
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

  const maxPage = Math.max(0, reviewsList.length - slidesPerView);
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
    <section className={styles.section} aria-label="Client reviews">
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
              titleBefore="Our "
              titleHighlight="Happy Clients"
              description="Hear firsthand how patients describe comfort, clarity, and follow-through—honest praise and constructive notes keep every visit grounded in empathy."
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
                    "--reviews-slide-max":
                      slidesPerView === 1
                        ? "min(100%, 420px)"
                        : "100%",
                  } as CSSProperties
                }
              >
                <div
                  className={styles.carouselRow}
                  style={{
                    transform: `translateX(calc(-${pageIndexClamped} * ((100cqi + var(--reviews-gap)) / ${slidesPerView})))`,
                  }}
                >
                  {reviewsList.map((r, slideIndex) => {
                    const isActive =
                      slideIndex >= pageIndexClamped &&
                      slideIndex < pageIndexClamped + slidesPerView;
                    return (
                      <div
                        key={r.id}
                        className={[
                          styles.carouselCardCell,
                          isActive
                            ? styles.carouselCardCellActive
                            : styles.carouselCardCellInactive,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        data-carousel-state={isActive ? "active" : "inactive"}
                      >
                        <ReviewSlide review={r} />
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
                  aria-label="Previous review"
                >
                  <CarouselChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => goDir(1)}
                  disabled={nextDisabled}
                  aria-label="Next review"
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
