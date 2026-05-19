"use client";

import type { FocusEvent } from "react";
import type { Variants } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { CarouselChevronIcon } from "@/components/Icons/CarouselChevronIcon/CarouselChevronIcon";
import { authSlides } from "@/data/authSlides";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

import styles from "./AuthVisualColumn.module.scss";

const AUTOPLAY_INTERVAL_MS = 6500;

type AuthVisualColumnProps = {
  variants?: Variants;
  imageReveal?: Variants;
  quoteOrchestration?: Variants;
  headingClipReveal?: Variants;
  leadClipReveal?: Variants;
};

export function AuthVisualColumn({
  variants: columnVariants,
  imageReveal,
  quoteOrchestration,
  headingClipReveal,
  leadClipReveal,
}: AuthVisualColumnProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [pauseAutoplay, setPauseAutoplay] = useState(false);
  const slideCount = authSlides.length;

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.closest("input, textarea, select, [contenteditable=true]") ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  useEffect(() => {
    if (reduceMotion || pauseAutoplay || slideCount <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, pauseAutoplay, slideCount]);

  const handleBlurCapture = useCallback((e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget;
    if (next instanceof Node && e.currentTarget.contains(next)) return;
    setPauseAutoplay(false);
  }, []);

  const slide = authSlides[index];

  return (
    <motion.div
      data-auth-visual=""
      className={[styles.visual, MOTION_COMPOSITE].filter(Boolean).join(" ")}
      {...(columnVariants ? { variants: columnVariants } : {})}
      onMouseEnter={() => setPauseAutoplay(true)}
      onMouseLeave={() => setPauseAutoplay(false)}
      onFocusCapture={() => setPauseAutoplay(true)}
      onBlurCapture={handleBlurCapture}
    >
      <motion.div
        className={styles.visualImageWrap}
        {...(imageReveal ? { variants: imageReveal } : {})}
      >
        {authSlides.map((s, i) => (
          <div
            key={s.src}
            className={[
              styles.visualSlide,
              i === index ? styles.visualSlideActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Image
              src={s.src}
              alt=""
              fill
              priority={i === 0}
              sizes="(max-width: 991px) 100vw, 50vw"
              className={styles.visualPhoto}
            />
          </div>
        ))}
        <div className={styles.visualScrim} aria-hidden />
      </motion.div>
      <motion.div
        className={styles.visualFooter}
        {...(quoteOrchestration ? { variants: quoteOrchestration } : {})}
      >
        <blockquote className={styles.quote}>
          <motion.p
            className={[styles.quoteText, MOTION_COMPOSITE].join(" ")}
            {...(headingClipReveal ? { variants: headingClipReveal } : {})}
          >
            {slide.quote}
          </motion.p>
          <motion.p
            className={[styles.quoteAuthor, MOTION_COMPOSITE].join(" ")}
            {...(leadClipReveal ? { variants: leadClipReveal } : {})}
          >
            <span className={styles.quoteAuthorPrefix} aria-hidden>
              ~{" "}
            </span>
            {slide.author}
          </motion.p>
          <motion.div
            className={styles.quoteMetaRow}
            {...(leadClipReveal ? { variants: leadClipReveal } : {})}
          >
            <span className={styles.quotePosition}>{slide.position}</span>
            <div className={styles.visualNav}>
              <button
                type="button"
                className={styles.arrowBtn}
                aria-label="Previous slide"
                onClick={goPrev}
              >
                <CarouselChevronIcon direction="left" size={22} />
              </button>
              <button
                type="button"
                className={styles.arrowBtn}
                aria-label="Next slide"
                onClick={goNext}
              >
                <CarouselChevronIcon direction="right" size={22} />
              </button>
            </div>
          </motion.div>
        </blockquote>
      </motion.div>
    </motion.div>
  );
}
