"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { BlogArticlesGrid } from "@/components/BlogArticlesGrid/BlogArticlesGrid";
import blogGridStyles from "@/components/BlogArticlesGrid/BlogArticlesGrid.module.scss";
import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { SearchIcon } from "@/components/Icons/SearchIcon/SearchIcon";
import { blogPosts } from "@/data/blog/posts";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./BlogsIntro.module.scss";

const SEARCH_DEBOUNCE_MS = 420;
const SEARCH_MIN_LOADING_MS = 260;
const SEARCH_MAX_LENGTH = 64;

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

function filterPostsByTitle(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return blogPosts;
  return blogPosts.filter((a) => a.title.toLowerCase().includes(q));
}

export function BlogsIntro() {
  const reduceMotion = usePrefersReducedMotion();
  const resultsId = useId();
  const prevDebouncedRef = useRef<string | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const [filteredArticles, setFilteredArticles] = useState(blogPosts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const next = filterPostsByTitle(debouncedQuery);
    const minLoadingMs = reduceMotion ? 0 : SEARCH_MIN_LOADING_MS;
    const prev = prevDebouncedRef.current;
    prevDebouncedRef.current = debouncedQuery;

    if (prev === undefined) {
      setFilteredArticles(next);
      return;
    }

    if (prev === debouncedQuery) {
      return;
    }

    setIsLoading(true);
    let cancelled = false;
    const started = performance.now();

    const id = window.setTimeout(
      () => {
        if (cancelled) return;
        setFilteredArticles(next);
        setIsLoading(false);
      },
      Math.max(0, minLoadingMs - (performance.now() - started)),
    );

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [debouncedQuery, reduceMotion]);

  const contentMotion = reduceMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.32, ease: revealEase },
      };

  const showEmpty =
    !isLoading &&
    debouncedQuery.trim().length > 0 &&
    filteredArticles.length === 0;

  const skeletonCount = 8;

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

  const headingBlockReveal = reduceMotion
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

  const searchReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: revealEase },
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
    <section className={styles.section} aria-label="Blog">
      <div className={`container ${styles.container}`}>
        <div className={styles.pageWrap}>
          <motion.div
            className={[styles.introWrap, MOTION_COMPOSITE].join(" ")}
            {...(wrapReveal && inViewReveal
              ? { variants: wrapReveal, ...inViewReveal }
              : {})}
          >
            <motion.div
              className={[styles.introContent, MOTION_COMPOSITE].join(" ")}
              {...(headingBlockReveal ? { variants: headingBlockReveal } : {})}
            >
              <HeadingLead
                as="h1"
                titleBefore=""
                titleHighlight="Blogs"
                description="Clinical insights, oral health tips, and updates from Pearl."
                align="center"
                headingMotionVariants={headingClipReveal}
                descriptionMotionVariants={headingClipReveal}
              />
            </motion.div>
            <motion.div
              className={[styles.searchSlot, MOTION_COMPOSITE].join(" ")}
              {...(searchReveal ? { variants: searchReveal } : {})}
            >
              <div className={styles.searchField}>
                <SearchIcon className={styles.searchIcon} size={24} />
                <input
                  type="search"
                  placeholder="Search by article title"
                  className={styles.searchInput}
                  aria-label="Search articles by title"
                  aria-controls={resultsId}
                  maxLength={SEARCH_MAX_LENGTH}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </motion.div>
          </motion.div>
          <div
            id={resultsId}
            className={styles.resultsRegion}
            role="region"
            aria-label="Article search results"
            aria-live="polite"
            aria-busy={isLoading}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  className={[styles.articlesGrid, MOTION_COMPOSITE].join(" ")}
                  {...(contentMotion ?? {
                    initial: { opacity: 1 },
                    animate: { opacity: 1 },
                    exit: { opacity: 1 },
                  })}
                >
                  <ul
                    className={blogGridStyles.grid}
                    aria-hidden
                  >
                    {Array.from({ length: skeletonCount }, (_, i) => (
                      <li
                        key={`sk-${i}`}
                        className={blogGridStyles.gridItem}
                      >
                        <div className={styles.skeletonCard}>
                          <div className={styles.skeletonImage} />
                          <div className={styles.skeletonLine} />
                          <div
                            className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : showEmpty ? (
                <motion.div
                  key="empty"
                  className={`${styles.articlesGrid} ${styles.emptyState} ${MOTION_COMPOSITE}`}
                  {...(contentMotion ?? {
                    initial: { opacity: 1 },
                    animate: { opacity: 1 },
                    exit: { opacity: 1 },
                  })}
                >
                  <p className={styles.emptyText}>
                    No articles match{" "}
                    <span className={styles.emptyQuery}>
                      “{debouncedQuery.trim()}”
                    </span>
                    . Try a different title or clear the search field.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`grid-${debouncedQuery}`}
                  className={[styles.articlesGrid, MOTION_COMPOSITE].join(" ")}
                  {...(contentMotion ?? {
                    initial: { opacity: 1 },
                    animate: { opacity: 1 },
                    exit: { opacity: 1 },
                  })}
                >
                  <BlogArticlesGrid
                    articles={filteredArticles}
                    cardHref={(article) => `/blogs/${article.id}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
