"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion, type Variants } from "motion/react";

import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { MinusIcon } from "@/components/Icons/MinusIcon/MinusIcon";
import { PlusIcon } from "@/components/Icons/PlusIcon/PlusIcon";
import type { FaqItem } from "@/data/faqs/types";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./Faq.module.scss";

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

export type FaqProps = {
  id?: string;
  "aria-label"?: string;
  items: FaqItem[];
  titleBefore: string;
  titleHighlight: string;
  description: string;
  align?: "start" | "center";
  className?: string;
  detailsName?: string;
};

function FaqRow({
  item,
  isOpen,
  onToggle,
  panelId,
  triggerId,
  isLast,
  rootVariants,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
  triggerId: string;
  isLast: boolean;
  rootVariants?: Variants;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const [panelHeight, setPanelHeight] = useState(0);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    if (isOpen) {
      wasOpenRef.current = true;
      const id = requestAnimationFrame(() => {
        setPanelHeight(0);
        requestAnimationFrame(() => {
          setPanelHeight(innerRef.current?.scrollHeight ?? 0);
        });
      });
      return () => cancelAnimationFrame(id);
    }

    if (!wasOpenRef.current) {
      return;
    }

    const full = el.scrollHeight;
    const id = requestAnimationFrame(() => {
      setPanelHeight(full);
      requestAnimationFrame(() => setPanelHeight(0));
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !innerRef.current) return;
    const el = innerRef.current;
    const ro = new ResizeObserver(() => {
      setPanelHeight(el.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  const rootClass = [styles.details, isOpen ? styles.detailsOpen : ""]
    .filter(Boolean)
    .join(" ");

  const rowBody = (
    <>
      <button
        type="button"
        className={styles.summary}
        aria-expanded={isOpen}
        aria-controls={panelId}
        id={triggerId}
        onClick={onToggle}
      >
        <span className={styles.summaryLabel}>{item.question}</span>
        <span className={styles.summaryIcons} aria-hidden>
          <PlusIcon className={styles.iconClosed} size={20} />
          <MinusIcon className={styles.iconOpen} size={20} />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className={styles.answerWrap}
        style={{ height: panelHeight }}
      >
        <div ref={innerRef} className={styles.answerInner}>
          <div
            className={[styles.answer, isLast ? styles.answerLast : ""]
              .filter(Boolean)
              .join(" ")}
          >
            <p>{item.answer}</p>
          </div>
        </div>
      </div>
    </>
  );

  if (rootVariants) {
    return (
      <motion.div
        className={[rootClass, MOTION_COMPOSITE].join(" ")}
        variants={rootVariants}
      >
        {rowBody}
      </motion.div>
    );
  }

  return <div className={rootClass}>{rowBody}</div>;
}

export function Faq({
  id,
  "aria-label": ariaLabel = "Frequently asked questions",
  items,
  titleBefore,
  titleHighlight,
  description,
  align = "center",
  className,
  detailsName = "faq",
}: FaqProps) {
  const reduceMotion = usePrefersReducedMotion();

  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const onToggleRow = useCallback((itemId: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  if (items.length === 0) {
    return null;
  }

  const rootClass = [styles.section, className].filter(Boolean).join(" ");

  const wrapReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.09,
            delayChildren: 0.05,
          },
        },
      };

  const infoReveal = reduceMotion
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

  const listOrchestration = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.08,
          },
        },
      };

  const rowReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.42, ease: revealEase },
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
    <section id={id} className={rootClass} aria-label={ariaLabel}>
      <div className={`container ${styles.container}`}>
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(wrapReveal && inViewReveal
            ? { variants: wrapReveal, ...inViewReveal }
            : {})}
        >
          <motion.div
            className={`${styles.info} ${MOTION_COMPOSITE}`}
            {...(infoReveal ? { variants: infoReveal } : {})}
          >
            <HeadingLead
              titleBefore={titleBefore}
              titleHighlight={titleHighlight}
              description={description}
              align={align}
              className={styles.infoHeading}
              headingMotionVariants={headingClipReveal}
              descriptionMotionVariants={descriptionReveal}
            />
          </motion.div>
          <motion.div
            className={`${styles.listWrap} ${MOTION_COMPOSITE}`}
            {...(listOrchestration ? { variants: listOrchestration } : {})}
          >
            {items.map((item, index) => (
              <FaqRow
                key={item.id}
                item={item}
                isOpen={openIds.has(item.id)}
                onToggle={() => onToggleRow(item.id)}
                panelId={`${detailsName}-panel-${item.id}`}
                triggerId={`${detailsName}-trigger-${item.id}`}
                isLast={index === items.length - 1}
                rootVariants={rowReveal}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
