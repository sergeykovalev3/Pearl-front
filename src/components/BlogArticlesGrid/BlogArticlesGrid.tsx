"use client";

import type { CSSProperties, MouseEvent, TransitionEvent } from "react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { flushSync } from "react-dom";
import { motion, type Variants } from "motion/react";

import { BlogCard } from "@/components/BlogCard/BlogCard";
import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import type { Article } from "@/data/articles";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./BlogArticlesGrid.module.scss";

const INITIAL_VISIBLE = 8;
const LOAD_MORE_STEP = 8;
const REVEAL_ANIM_MS = 580;
const PANEL_MS = 580;

const heightEase = `cubic-bezier(0.22, 1, 0.36, 1)`;

function prefersReducedMotionLegacy() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

export type BlogArticlesGridProps = {
  articles: Article[];
  cardHref: (article: Article) => string;
  preventNavigation?: boolean;
  className?: string;
};

export function BlogArticlesGrid({
  articles,
  cardHref,
  preventNavigation = false,
  className,
}: BlogArticlesGridProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [revealFromIndex, setRevealFromIndex] = useState<number | null>(null);
  const expandFromHeightRef = useRef<number | null>(null);
  const prevVisibleForLayoutRef = useRef(visibleCount);
  const shellRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const [loadMoreSettledIds, setLoadMoreSettledIds] = useState(
    () => new Set<string>(),
  );

  const visibleArticles = articles.slice(0, visibleCount);

  const hasExpandable =
    articles.length > INITIAL_VISIBLE || visibleCount > INITIAL_VISIBLE;
  const canExpand = visibleCount < articles.length;

  useEffect(() => {
    if (revealFromIndex === null) return;
    const fromIdx = revealFromIndex;
    const n = visibleCount;
    const id = window.setTimeout(() => {
      setLoadMoreSettledIds((prev) => {
        const next = new Set(prev);
        for (let i = fromIdx; i < n; i += 1) {
          const row = articles[i];
          if (row) next.add(row.id);
        }
        return next;
      });
      setRevealFromIndex(null);
    }, REVEAL_ANIM_MS);
    return () => window.clearTimeout(id);
  }, [revealFromIndex, visibleCount, articles]);

  useLayoutEffect(() => {
    const prev = prevVisibleForLayoutRef.current;

    if (visibleCount <= prev) {
      prevVisibleForLayoutRef.current = visibleCount;
      expandFromHeightRef.current = null;
      return;
    }

    prevVisibleForLayoutRef.current = visibleCount;

    if (prefersReducedMotionLegacy()) {
      expandFromHeightRef.current = null;
      return;
    }

    const shell = shellRef.current;
    const start = expandFromHeightRef.current;
    expandFromHeightRef.current = null;
    const ul = gridRef.current;
    if (!shell || start == null || !ul) return;

    const nextHeight = ul.offsetHeight;
    if (Math.abs(nextHeight - start) < 1) return;

    shell.style.overflow = "hidden";
    shell.style.transition = `height ${PANEL_MS}ms ${heightEase}`;
    shell.style.height = `${start}px`;
    requestAnimationFrame(() => {
      shell.style.height = `${nextHeight}px`;
    });
  }, [visibleCount]);

  const handleShellTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "height") return;
    const shell = shellRef.current;
    if (!shell) return;
    requestAnimationFrame(() => {
      shell.style.removeProperty("height");
      shell.style.removeProperty("transition");
      shell.style.removeProperty("overflow");
    });
  };

  const clearLoadMoreSettledBeyondInitial = () => {
    setLoadMoreSettledIds((prev) => {
      const next = new Set(prev);
      for (let i = INITIAL_VISIBLE; i < articles.length; i += 1) {
        const row = articles[i];
        if (row) next.delete(row.id);
      }
      return next;
    });
  };

  const handleToggle = () => {
    if (canExpand) {
      if (!prefersReducedMotionLegacy()) {
        expandFromHeightRef.current = shellRef.current?.offsetHeight ?? null;
      } else {
        expandFromHeightRef.current = null;
      }
      setRevealFromIndex(visibleCount);
      setVisibleCount((prev) =>
        Math.min(prev + LOAD_MORE_STEP, articles.length),
      );
      return;
    }

    if (prefersReducedMotionLegacy()) {
      clearLoadMoreSettledBeyondInitial();
      setVisibleCount(INITIAL_VISIBLE);
      return;
    }

    const shell = shellRef.current;
    const ul = gridRef.current;
    if (!shell || !ul) {
      clearLoadMoreSettledBeyondInitial();
      setVisibleCount(INITIAL_VISIBLE);
      return;
    }

    const fullH = shell.offsetHeight;
    shell.style.transition = "none";
    shell.style.height = `${fullH}px`;
    shell.style.overflow = "hidden";

    flushSync(() => {
      clearLoadMoreSettledBeyondInitial();
      setVisibleCount(INITIAL_VISIBLE);
    });

    const smallH = ul.offsetHeight;
    shell.style.transition = `height ${PANEL_MS}ms ${heightEase}`;
    requestAnimationFrame(() => {
      shell.style.height = `${smallH}px`;
    });
  };

  const buttonLabel = canExpand ? "Check out more" : "Show less";

  const stackOrchestration: Variants | undefined = reduceMotion
    ? undefined
    : { hidden: {}, visible: {} };

  const gridListOrchestration: Variants | undefined = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.052,
            delayChildren: 0.08,
          },
        },
      };

  const gridCardReveal: Variants | undefined = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.46, ease: revealEase },
        },
      };

  const footerReveal: Variants | undefined = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.48, ease: revealEase },
        },
      };

  const renderArticleItem = (article: Article, index: number) => {
    const href = cardHref(article);
    const onClick = preventNavigation
      ? (event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
        }
      : undefined;

    const isEntering = revealFromIndex !== null && index >= revealFromIndex;
    const stagger = isEntering ? index - revealFromIndex : 0;
    const itemStyle =
      isEntering && stagger > 0
        ? ({
            "--enter-delay": `${Math.min(stagger, 14) * 0.045}s`,
          } as CSSProperties)
        : undefined;

    if (reduceMotion) {
      return (
        <li key={article.id} className={styles.gridItem}>
          <BlogCard article={article} href={href} onClick={onClick} />
        </li>
      );
    }

    if (loadMoreSettledIds.has(article.id)) {
      return (
        <li key={article.id} className={styles.gridItem}>
          <BlogCard article={article} href={href} onClick={onClick} />
        </li>
      );
    }

    if (isEntering) {
      return (
        <li
          key={article.id}
          className={`${styles.gridItem} ${styles.gridItemEntering}`}
          style={itemStyle}
        >
          <BlogCard article={article} href={href} onClick={onClick} />
        </li>
      );
    }

    return (
      <motion.li
        key={article.id}
        className={[styles.gridItem, MOTION_COMPOSITE].join(" ")}
        variants={gridCardReveal}
      >
        <BlogCard article={article} href={href} onClick={onClick} />
      </motion.li>
    );
  };

  return (
    <motion.div
      className={[styles.stack, className, MOTION_COMPOSITE].filter(Boolean).join(" ")}
      {...(stackOrchestration ? { variants: stackOrchestration } : {})}
    >
      <motion.div
        ref={shellRef}
        className={[styles.gridShell, MOTION_COMPOSITE].join(" ")}
        onTransitionEnd={handleShellTransitionEnd}
        {...(stackOrchestration ? { variants: stackOrchestration } : {})}
      >
        <motion.ul
          ref={gridRef}
          className={[styles.grid, MOTION_COMPOSITE].join(" ")}
          {...(gridListOrchestration ? { variants: gridListOrchestration } : {})}
        >
          {visibleArticles.map((article, index) =>
            renderArticleItem(article, index),
          )}
        </motion.ul>
      </motion.div>

      {hasExpandable ? (
        <motion.div
          className={[styles.footer, MOTION_COMPOSITE].join(" ")}
          {...(footerReveal ? { variants: footerReveal } : {})}
        >
          <ButtonBlue
            type="button"
            onClick={handleToggle}
            aria-expanded={visibleCount > INITIAL_VISIBLE}
          >
            {buttonLabel}
          </ButtonBlue>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
