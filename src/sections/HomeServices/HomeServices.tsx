"use client";

import { motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { CarouselChevronIcon } from "@/components/Icons/CarouselChevronIcon/CarouselChevronIcon";
import { ServiceCard } from "@/components/ServiceCard/ServiceCard";
import {
  getServicesByIds,
  homeFeaturedServiceIds,
  services,
} from "@/data/services";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./HomeServices.module.scss";
import { mqMaxTablet, mqMinTwoUpGrid } from "@/styles/breakpoints";

const featuredServices = getServicesByIds(homeFeaturedServiceIds);
const carouselServices = services;

const CAROUSEL_MQ = mqMaxTablet;
const TWO_UP_MQ = mqMinTwoUpGrid;

type CarouselSnapshot = { carousel: boolean; twoUp: boolean };

const SERVER_CAROUSEL_SNAPSHOT: CarouselSnapshot = {
  carousel: false,
  twoUp: false,
};

let clientCarouselSnapshot: CarouselSnapshot = SERVER_CAROUSEL_SNAPSHOT;

function subscribeCarouselMode(cb: () => void) {
  const a = window.matchMedia(CAROUSEL_MQ);
  const b = window.matchMedia(TWO_UP_MQ);
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
}

function getCarouselSnapshot(): CarouselSnapshot {
  const carousel = window.matchMedia(CAROUSEL_MQ).matches;
  const twoUp = window.matchMedia(TWO_UP_MQ).matches;
  if (
    clientCarouselSnapshot.carousel === carousel &&
    clientCarouselSnapshot.twoUp === twoUp
  ) {
    return clientCarouselSnapshot;
  }
  clientCarouselSnapshot = { carousel, twoUp };
  return clientCarouselSnapshot;
}

function getServerCarouselSnapshot() {
  return SERVER_CAROUSEL_SNAPSHOT;
}

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

export function HomeServices() {
  const reduceMotion = usePrefersReducedMotion();
  const { carousel: carouselMode, twoUp } = useSyncExternalStore(
    subscribeCarouselMode,
    getCarouselSnapshot,
    getServerCarouselSnapshot,
  );

  const slidesPerView = carouselMode ? (twoUp ? 2 : 1) : 3;
  const maxPage = carouselMode
    ? Math.max(0, carouselServices.length - slidesPerView)
    : Math.max(0, featuredServices.length - slidesPerView);

  const [pageIndexRaw, setPageIndexRaw] = useState(0);
  const pageIndex = Math.min(pageIndexRaw, maxPage);
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setNavReady(true);
    });
  }, []);

  const goDir = useCallback(
    (dir: -1 | 1) => {
      if (!carouselMode) return;
      setPageIndexRaw((p) => {
        const next = p + dir;
        if (next < 0 || next > maxPage) return p;
        return next;
      });
    },
    [carouselMode, maxPage],
  );

  const canPrev = carouselMode && pageIndex > 0;
  const canNext = carouselMode && pageIndex < maxPage;
  const showCarousel = navReady && carouselMode;

  const revealViewport = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.74, ease: revealEase },
        },
      };

  const revealCarouselViewport = reduceMotion
    ? undefined
    : {
        hidden: { scale: 0.986 },
        visible: {
          scale: 1,
          transition: { duration: 0.74, ease: revealEase },
        },
      };

  const revealGridList = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.07,
          },
        },
      };

  const revealGridItem = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 24 },
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
        viewport: { once: true, amount: 0.18, margin: "0px 0px -12% 0px" },
      };

  return (
    <section className={styles.section} aria-label="Home Services">
      <div className="container">
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(revealViewport && inViewReveal
            ? { variants: revealViewport, ...inViewReveal }
            : {})}
        >
          <div
            className={[styles.viewport, !navReady && styles.viewportPending]
              .filter(Boolean)
              .join(" ")}
          >
            {showCarousel ? (
              <motion.div
                className={`${styles.carouselViewport} ${MOTION_COMPOSITE}`}
                style={{ "--spv": slidesPerView } as React.CSSProperties}
                {...(revealCarouselViewport ? { variants: revealCarouselViewport } : {})}
              >
                <div
                  className={styles.carouselRow}
                  style={{
                    transform: `translateX(calc(-${pageIndex} * ((100cqi + var(--services-gap)) / ${slidesPerView})))`,
                  }}
                >
                  {carouselServices.map((service, slideIndex) => {
                    const isActive =
                      slideIndex >= pageIndex &&
                      slideIndex < pageIndex + slidesPerView;
                    return (
                      <div
                        key={service.id}
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
                        <ServiceCard service={service} />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.ul
                className={`${styles.track} ${MOTION_COMPOSITE}`}
                {...(revealGridList ? { variants: revealGridList } : {})}
              >
                {featuredServices.map((service) => (
                  <motion.li
                    key={service.id}
                    className={`${styles.item} ${MOTION_COMPOSITE}`}
                    {...(revealGridItem ? { variants: revealGridItem } : {})}
                  >
                    <ServiceCard service={service} />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
          <div
            className={[styles.nav, !navReady && styles.navPending]
              .filter(Boolean)
              .join(" ")}
          >
            {navReady ? (
              <>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => goDir(-1)}
                  disabled={!canPrev}
                  aria-label="Previous service"
                >
                  <CarouselChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => goDir(1)}
                  disabled={!canNext}
                  aria-label="Next service"
                >
                  <CarouselChevronIcon direction="right" />
                </button>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
